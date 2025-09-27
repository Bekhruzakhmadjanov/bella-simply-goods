// src/hooks/useReviews.ts
import { useState, useEffect, useCallback } from 'react';
import { ReviewsService } from '../firebase/reviews';
import type { Review, ReviewFormData, ReviewFilters } from '../types/review.types.ts';

export const useReviews = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadReviews = useCallback(async (filters?: ReviewFilters) => {
    try {
      setLoading(true);
      setError(null);
      const { reviews: fetchedReviews } = await ReviewsService.getReviews({ filters });
      setReviews(fetchedReviews);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load reviews');
      console.error('Error loading reviews:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const submitReview = useCallback(async (reviewData: ReviewFormData): Promise<string> => {
    try {
      const reviewId = await ReviewsService.submitReview(reviewData);
      await loadReviews(); // Reload reviews
      return reviewId;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit review');
      throw err;
    }
  }, [loadReviews]);

  const moderateReview = useCallback(async (
    reviewId: string, 
    isApproved: boolean, 
    isPublished: boolean,
    moderatedBy: string
  ) => {
    try {
      await ReviewsService.moderateReview(reviewId, isApproved, isPublished, moderatedBy);
      await loadReviews(); // Reload reviews
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to moderate review');
      throw err;
    }
  }, [loadReviews]);

  const deleteReview = useCallback(async (reviewId: string) => {
    try {
      await ReviewsService.deleteReview(reviewId);
      await loadReviews(); // Reload reviews
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete review');
      throw err;
    }
  }, [loadReviews]);

  useEffect(() => {
    loadReviews();
  }, [loadReviews]);

  return {
    reviews,
    loading,
    error,
    loadReviews,
    submitReview,
    moderateReview,
    deleteReview
  };
};

export const usePublishedReviews = (limit: number = 10) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadPublishedReviews = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedReviews = await ReviewsService.getPublishedReviews(limit);
      setReviews(fetchedReviews);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load reviews');
      console.error('Error loading published reviews:', err);
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    loadPublishedReviews();
  }, [loadPublishedReviews]);

  return {
    reviews,
    loading,
    error,
    refresh: loadPublishedReviews
  };
};

export const useReviewStats = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const reviewStats = await ReviewsService.getReviewStats();
      setStats(reviewStats);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load review statistics');
      console.error('Error loading review stats:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  return {
    stats,
    loading,
    error,
    refresh: loadStats
  };
};