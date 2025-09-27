// src/firebase/reviews.ts
import { 
  collection,
  getDocs, 
  updateDoc, 
  doc, 
  query, 
  orderBy, 
  limit,
  writeBatch,
  Timestamp
} from 'firebase/firestore';
import { 
  ref, 
  uploadBytes, 
  getDownloadURL
} from 'firebase/storage';
import { db, storage } from './config';
import type { Review, ReviewFormData, ReviewFilters } from '../types/review.types';

// Utility functions
const convertTimestampToDate = (timestamp: any): Date => {
  if (timestamp?.toDate) {
    return timestamp.toDate();
  }
  return new Date(timestamp);
};

const convertDateToTimestamp = (date: Date): Timestamp => {
  return Timestamp.fromDate(date);
};

export class ReviewsService {
  private static collection = 'reviews';
  private static storageFolder = 'review-photos';

  // Upload photos to Firebase Storage
  static async uploadReviewPhotos(photos: File[], reviewId: string): Promise<string[]> {
    const uploadPromises = photos.map(async (photo, index) => {
      const fileName = `${reviewId}_${index}_${Date.now()}.${photo.name.split('.').pop()}`;
      const storageRef = ref(storage, `${this.storageFolder}/${fileName}`);
      
      try {
        const snapshot = await uploadBytes(storageRef, photo);
        const downloadURL = await getDownloadURL(snapshot.ref);
        return downloadURL;
      } catch (error) {
        console.error(`Error uploading photo ${index}:`, error);
        throw error;
      }
    });

    return Promise.all(uploadPromises);
  }

  // Submit a new review
  static async submitReview(reviewData: ReviewFormData): Promise<string> {
    try {
      const batch = writeBatch(db);
      
      // First, create the review document
      const reviewRef = doc(collection(db, this.collection));
      const reviewId = reviewRef.id;

      // Upload photos if any
      let photoUrls: string[] = [];
      if (reviewData.photos.length > 0) {
        photoUrls = await this.uploadReviewPhotos(reviewData.photos, reviewId);
      }

      // Create review document
      const review: Omit<Review, 'id'> = {
        customerName: reviewData.customerName,
        email: reviewData.email,
        orderNumber: reviewData.orderNumber,
        overallRating: reviewData.overallRating,
        tasteRating: reviewData.tasteRating,
        packagingRating: reviewData.packagingRating,
        deliveryRating: reviewData.deliveryRating,
        reviewText: reviewData.reviewText,
        photoUrls,
        wouldRecommend: reviewData.wouldRecommend,
        isApproved: false, // Requires moderation
        isPublished: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        helpfulVotes: 0,
        reportCount: 0
      };

      batch.set(reviewRef, {
        ...review,
        createdAt: convertDateToTimestamp(review.createdAt),
        updatedAt: convertDateToTimestamp(review.updatedAt)
      });

      await batch.commit();
      console.log('Review submitted with ID:', reviewId);
      return reviewId;
    } catch (error) {
      console.error('Error submitting review:', error);
      throw error;
    }
  }

  // Get reviews with filtering
  static async getReviews(options?: {
    filters?: ReviewFilters;
    limit?: number;
  }): Promise<{ reviews: Review[] }> {
    try {
      let q = query(
        collection(db, this.collection),
        orderBy('createdAt', 'desc')
      );

      if (options?.limit) {
        q = query(q, limit(options.limit));
      }

      const querySnapshot = await getDocs(q);
      const reviews: Review[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        reviews.push({
          id: doc.id,
          customerName: data.customerName,
          email: data.email,
          orderNumber: data.orderNumber,
          overallRating: data.overallRating,
          tasteRating: data.tasteRating || 0,
          packagingRating: data.packagingRating || 0,
          deliveryRating: data.deliveryRating || 0,
          reviewText: data.reviewText,
          photoUrls: data.photoUrls || [],
          wouldRecommend: data.wouldRecommend || false,
          isApproved: data.isApproved || false,
          isPublished: data.isPublished || false,
          createdAt: convertTimestampToDate(data.createdAt),
          updatedAt: convertTimestampToDate(data.updatedAt),
          moderatedAt: data.moderatedAt ? convertTimestampToDate(data.moderatedAt) : undefined,
          moderatedBy: data.moderatedBy,
          helpfulVotes: data.helpfulVotes || 0,
          reportCount: data.reportCount || 0
        });
      });

      return { reviews };
    } catch (error) {
      console.error('Error getting reviews:', error);
      throw error;
    }
  }

  // Get published reviews for public display
  static async getPublishedReviews(limit: number = 10): Promise<Review[]> {
    const { reviews } = await this.getReviews({ limit });
    return reviews.filter(r => r.isPublished && r.isApproved);
  }

  // Moderate a review (approve/reject)
  static async moderateReview(
    reviewId: string, 
    isApproved: boolean, 
    isPublished: boolean,
    moderatedBy: string
  ): Promise<void> {
    try {
      const reviewRef = doc(db, this.collection, reviewId);
      await updateDoc(reviewRef, {
        isApproved,
        isPublished,
        moderatedAt: convertDateToTimestamp(new Date()),
        moderatedBy,
        updatedAt: convertDateToTimestamp(new Date())
      });
      console.log('Review moderated successfully');
    } catch (error) {
      console.error('Error moderating review:', error);
      throw error;
    }
  }

  // Delete a review (admin only)
  static async deleteReview(reviewId: string): Promise<void> {
    try {
      const reviewRef = doc(db, this.collection, reviewId);
      await updateDoc(reviewRef, {
        isActive: false,
        deletedAt: convertDateToTimestamp(new Date())
      });
      console.log('Review deleted successfully');
    } catch (error) {
      console.error('Error deleting review:', error);
      throw error;
    }
  }

  // Get review statistics
  static async getReviewStats(): Promise<any> {
    try {
      const { reviews } = await this.getReviews();
      const publishedReviews = reviews.filter(r => r.isPublished && r.isApproved);

      const totalReviews = publishedReviews.length;
      const averageRating = totalReviews > 0 
        ? publishedReviews.reduce((sum, review) => sum + review.overallRating, 0) / totalReviews 
        : 0;

      const ratingDistribution = publishedReviews.reduce((dist, review) => {
        dist[review.overallRating] = (dist[review.overallRating] || 0) + 1;
        return dist;
      }, {} as Record<number, number>);

      const recommendationPercentage = totalReviews > 0
        ? (publishedReviews.filter(r => r.wouldRecommend).length / totalReviews) * 100
        : 0;

      const pendingReviews = reviews.filter(r => !r.isApproved);

      return {
        totalReviews,
        averageRating: Math.round(averageRating * 10) / 10,
        ratingDistribution,
        recommendationPercentage: Math.round(recommendationPercentage),
        pendingModeration: pendingReviews.length
      };
    } catch (error) {
      console.error('Error getting review stats:', error);
      throw error;
    }
  }
}