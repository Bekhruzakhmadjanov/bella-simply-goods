// src/types/review.types.ts
export interface Review {
  id: string;
  customerName: string;
  email: string;
  orderNumber: string;
  overallRating: number;
  tasteRating: number;
  packagingRating: number;
  deliveryRating: number;
  reviewText: string;
  photoUrls: string[];
  wouldRecommend: boolean;
  isApproved: boolean;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
  moderatedAt?: Date;
  moderatedBy?: string;
  helpfulVotes: number;
  reportCount: number;
}

export interface ReviewFormData {
  customerName: string;
  email: string;
  orderNumber: string;
  overallRating: number;
  tasteRating: number;
  packagingRating: number;
  deliveryRating: number;
  reviewText: string;
  photos: File[];
  wouldRecommend: boolean;
}

export interface ReviewFilters {
  rating?: number;
  isApproved?: boolean;
  isPublished?: boolean;
  orderNumber?: string;
  startDate?: Date;
  endDate?: Date;
}

export interface ReviewStats {
  totalReviews: number;
  averageRating: number;
  ratingDistribution: Record<number, number>;
  recommendationPercentage: number;
  pendingModeration: number;
}