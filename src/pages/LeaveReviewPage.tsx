// src/pages/LeaveReviewPage.tsx - Updated with backend integration
import React, { useState } from 'react';
import { Star, Upload, X, Send, CheckCircle } from 'lucide-react';
import type { Route } from '../types/common.types';
import type { ReviewFormData } from '../types/review.types';
import { useReviews } from '../hooks/useReviews';
import { Breadcrumb } from '../components/layout/Breadcrumb';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

interface LeaveReviewPageProps {
  onNavigate: (route: Route | 'admin') => void;
}

interface ReviewData {
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

const StarRating: React.FC<{
  rating: number;
  onRatingChange: (rating: number) => void;
  label: string;
  required?: boolean;
}> = ({ rating, onRatingChange, label, required = false }) => {
  const [hoverRating, setHoverRating] = useState(0);

  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-gray-800">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            className="focus:outline-none"
            onMouseEnter={() => setHoverRating(star)}
            onMouseLeave={() => setHoverRating(0)}
            onClick={() => onRatingChange(star)}
          >
            <Star
              size={24}
              className={`transition-colors ${
                star <= (hoverRating || rating)
                  ? 'text-amber-400 fill-current'
                  : 'text-gray-300'
              }`}
            />
          </button>
        ))}
        <span className="ml-3 text-sm text-gray-600">
          {rating > 0 ? `${rating}/5` : 'Not rated'}
        </span>
      </div>
    </div>
  );
};

export const LeaveReviewPage: React.FC<LeaveReviewPageProps> = ({ onNavigate }) => {
  const { submitReview } = useReviews();
  const [reviewData, setReviewData] = useState<ReviewData>({
    customerName: '',
    email: '',
    orderNumber: '',
    overallRating: 0,
    tasteRating: 0,
    packagingRating: 0,
    deliveryRating: 0,
    reviewText: '',
    photos: [],
    wouldRecommend: false
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const finalValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    
    setReviewData(prev => ({ ...prev, [name]: finalValue }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newFiles = Array.from(files).slice(0, 3 - reviewData.photos.length); // Max 3 photos
      setReviewData(prev => ({
        ...prev,
        photos: [...prev.photos, ...newFiles]
      }));
    }
  };

  const removePhoto = (index: number) => {
    setReviewData(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index)
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!reviewData.customerName.trim()) {
      newErrors.customerName = 'Name is required';
    }
    if (!reviewData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(reviewData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!reviewData.orderNumber.trim()) {
      newErrors.orderNumber = 'Order number is required';
    }
    if (reviewData.overallRating === 0) {
      newErrors.overallRating = 'Overall rating is required';
    }
    if (!reviewData.reviewText.trim()) {
      newErrors.reviewText = 'Please share your thoughts about the product';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Submit review using the backend service
      const reviewFormData: ReviewFormData = {
        customerName: reviewData.customerName,
        email: reviewData.email,
        orderNumber: reviewData.orderNumber,
        overallRating: reviewData.overallRating,
        tasteRating: reviewData.tasteRating,
        packagingRating: reviewData.packagingRating,
        deliveryRating: reviewData.deliveryRating,
        reviewText: reviewData.reviewText,
        photos: reviewData.photos,
        wouldRecommend: reviewData.wouldRecommend
      };

      const reviewId = await submitReview(reviewFormData);
      console.log('Review submitted successfully with ID:', reviewId);
      setIsSubmitted(true);
      
    } catch (error) {
      console.error('Error submitting review:', error);
      setErrors({ submit: 'Failed to submit review. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Breadcrumb 
          items={[{ label: 'Leave Review', isActive: true }]}
          onNavigate={onNavigate}
        />
        
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="text-green-600" size={32} />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Thank You!</h1>
            <p className="text-lg text-gray-600 mb-6">
              Your review has been submitted successfully. We appreciate your feedback!
            </p>
            <div className="space-y-4">
              <Button onClick={() => onNavigate('home')} className="px-8">
                Return to Home
              </Button>
              <p className="text-sm text-gray-500">
                Your review will be published after moderation.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Breadcrumb 
        items={[{ label: 'Leave Review', isActive: true }]}
        onNavigate={onNavigate}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Leave a Review</h1>
            <p className="text-gray-600">
              We'd love to hear about your Dubai chocolate experience! Your feedback helps us improve.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Customer Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Your Name"
                name="customerName"
                required
                value={reviewData.customerName}
                onChange={handleInputChange}
                error={errors.customerName}
              />
              <Input
                label="Email Address"
                type="email"
                name="email"
                required
                value={reviewData.email}
                onChange={handleInputChange}
                error={errors.email}
              />
            </div>

            <Input
              label="Order Number"
              name="orderNumber"
              required
              value={reviewData.orderNumber}
              onChange={handleInputChange}
              error={errors.orderNumber}
              placeholder="e.g., BG-2025-001234"
            />

            {/* Overall Rating */}
            <div>
              <StarRating
                rating={reviewData.overallRating}
                onRatingChange={(rating) => setReviewData(prev => ({ ...prev, overallRating: rating }))}
                label="Overall Rating"
                required
              />
              {errors.overallRating && (
                <p className="text-red-600 text-sm mt-1">{errors.overallRating}</p>
              )}
            </div>

            {/* Detailed Ratings */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Rate Different Aspects</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StarRating
                  rating={reviewData.tasteRating}
                  onRatingChange={(rating) => setReviewData(prev => ({ ...prev, tasteRating: rating }))}
                  label="Taste & Quality"
                />
                <StarRating
                  rating={reviewData.packagingRating}
                  onRatingChange={(rating) => setReviewData(prev => ({ ...prev, packagingRating: rating }))}
                  label="Packaging"
                />
                <StarRating
                  rating={reviewData.deliveryRating}
                  onRatingChange={(rating) => setReviewData(prev => ({ ...prev, deliveryRating: rating }))}
                  label="Delivery Experience"
                />
              </div>
            </div>

            {/* Review Text */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Your Review <span className="text-red-500">*</span>
              </label>
              <textarea
                name="reviewText"
                value={reviewData.reviewText}
                onChange={handleInputChange}
                rows={5}
                className="w-full border-2 border-yellow-700 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:ring-4 focus:ring-yellow-300 focus:border-amber-800"
                placeholder="Tell us about your experience with our Dubai chocolate..."
                required
              />
              {errors.reviewText && (
                <p className="text-red-600 text-sm mt-1">{errors.reviewText}</p>
              )}
            </div>

            {/* Photo Upload - DISABLED FOR NOW */}
            {/* 
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Add Photos (Optional)
              </label>
              <p className="text-sm text-gray-600 mb-4">
                Share photos of your chocolate experience! Maximum 3 photos.
              </p>
              
              {reviewData.photos.length < 3 && (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="mx-auto text-gray-400 mb-4" size={48} />
                  <label className="cursor-pointer">
                    <span className="text-yellow-800 font-semibold hover:text-yellow-900">
                      Choose photos
                    </span>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                  </label>
                  <p className="text-sm text-gray-500 mt-2">PNG, JPG up to 5MB each</p>
                </div>
              )}

              {reviewData.photos.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                  {reviewData.photos.map((photo, index) => (
                    <div key={index} className="relative">
                      <img
                        src={URL.createObjectURL(photo)}
                        alt={`Upload ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg border border-gray-200"
                      />
                      <button
                        type="button"
                        onClick={() => removePhoto(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            */}

            {/* Recommendation */}
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="wouldRecommend"
                name="wouldRecommend"
                checked={reviewData.wouldRecommend}
                onChange={handleInputChange}
                className="w-4 h-4 text-yellow-600 border-gray-300 rounded focus:ring-yellow-500"
              />
              <label htmlFor="wouldRecommend" className="text-sm font-medium text-gray-900">
                I would recommend Bella Simply Goods to others
              </label>
            </div>

            {/* Submit Error */}
            {errors.submit && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
                {errors.submit}
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onNavigate('home')}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center"
              >
                {isSubmitting ? (
                  <>
                    <LoadingSpinner size="small" className="mr-2" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send size={16} className="mr-2" />
                    Submit Review
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};