// src/components/admin/AdminReviews.tsx
import React, { useState } from 'react';
import { 
  Star, 
  Eye, 
  Check, 
  X, 
  Trash2,
  MessageSquare,
  ThumbsUp,
  AlertTriangle,
  Calendar,
  User
} from 'lucide-react';
import { Button } from '../common/Button';
import { useReviews, useReviewStats } from '../../hooks/useReviews';
import type { Review } from '../../types/review.types.ts';
import { LoadingSpinner } from '../common/LoadingSpinner';

interface AdminReviewsProps {
  currentUser: { name: string; email: string };
}

const StarDisplay: React.FC<{ rating: number; label?: string }> = ({ rating, label }) => (
  <div className="flex items-center space-x-1">
    {label && <span className="text-sm text-gray-600 mr-2">{label}:</span>}
    {[1, 2, 3, 4, 5].map((star) => (
      <Star
        key={star}
        size={16}
        className={star <= rating ? 'text-amber-400 fill-current' : 'text-gray-300'}
      />
    ))}
    <span className="text-sm text-gray-600 ml-1">{rating}/5</span>
  </div>
);

export const AdminReviews: React.FC<AdminReviewsProps> = ({ currentUser }) => {
  const { reviews, loading, moderateReview, deleteReview } = useReviews();
  const { stats, loading: statsLoading } = useReviewStats();
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'published'>('all');
  const [isProcessing, setIsProcessing] = useState<string | null>(null);

  const filteredReviews = reviews.filter(review => {
    switch (filterStatus) {
      case 'pending':
        return !review.isApproved;
      case 'approved':
        return review.isApproved && !review.isPublished;
      case 'published':
        return review.isPublished;
      default:
        return true;
    }
  });

  const handleModerateReview = async (
    reviewId: string, 
    isApproved: boolean, 
    isPublished: boolean
  ) => {
    setIsProcessing(reviewId);
    try {
      await moderateReview(reviewId, isApproved, isPublished, currentUser.name);
      setSelectedReview(null);
    } catch (error) {
      console.error('Error moderating review:', error);
    } finally {
      setIsProcessing(null);
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (window.confirm('Are you sure you want to delete this review? This action cannot be undone.')) {
      setIsProcessing(reviewId);
      try {
        await deleteReview(reviewId);
        setSelectedReview(null);
      } catch (error) {
        console.error('Error deleting review:', error);
      } finally {
        setIsProcessing(null);
      }
    }
  };

  const getStatusBadge = (review: Review) => {
    if (!review.isApproved) {
      return <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs font-medium rounded-full">Pending</span>;
    }
    if (review.isApproved && !review.isPublished) {
      return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">Approved</span>;
    }
    if (review.isPublished) {
      return <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">Published</span>;
    }
    return <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs font-medium rounded-full">Unknown</span>;
  };

  if (loading && statsLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Review Management</h1>
        <p className="text-gray-600">Moderate customer reviews and feedback</p>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-blue-800">Total Reviews</h3>
                <p className="text-3xl font-bold text-blue-600">{stats.totalReviews}</p>
              </div>
              <MessageSquare className="text-blue-400" size={32} />
            </div>
          </div>

          <div className="bg-amber-50 p-6 rounded-lg border border-amber-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-amber-800">Average Rating</h3>
                <p className="text-3xl font-bold text-amber-600">{stats.averageRating}</p>
              </div>
              <Star className="text-amber-400 fill-current" size={32} />
            </div>
          </div>

          <div className="bg-green-50 p-6 rounded-lg border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-green-800">Recommend %</h3>
                <p className="text-3xl font-bold text-green-600">{stats.recommendationPercentage}%</p>
              </div>
              <ThumbsUp className="text-green-400" size={32} />
            </div>
          </div>

          <div className="bg-orange-50 p-6 rounded-lg border border-orange-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-orange-800">Pending</h3>
                <p className="text-3xl font-bold text-orange-600">{stats.pendingModeration}</p>
              </div>
              <AlertTriangle className="text-orange-400" size={32} />
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center space-x-4">
          <span className="font-semibold text-gray-800">Filter by status:</span>
          {(['all', 'pending', 'approved', 'published'] as const).map(status => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                filterStatus === status
                  ? 'bg-yellow-800 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Reviews Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Customer</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Order</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Rating</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Date</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredReviews.map(review => (
                <tr key={review.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium text-gray-900">{review.customerName}</div>
                      <div className="text-sm text-gray-600">{review.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-mono text-sm">{review.orderNumber}</span>
                  </td>
                  <td className="px-6 py-4">
                    <StarDisplay rating={review.overallRating} />
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(review)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {review.createdAt.toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setSelectedReview(review)}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="View details"
                      >
                        <Eye size={16} />
                      </button>
                      {!review.isApproved && (
                        <>
                          <button
                            onClick={() => handleModerateReview(review.id, true, true)}
                            disabled={isProcessing === review.id}
                            className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Approve & Publish"
                          >
                            <Check size={16} />
                          </button>
                          <button
                            onClick={() => handleModerateReview(review.id, false, false)}
                            disabled={isProcessing === review.id}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Reject"
                          >
                            <X size={16} />
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => handleDeleteReview(review.id)}
                        disabled={isProcessing === review.id}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Review Details Modal */}
      {selectedReview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Review Details</h2>
              <button 
                onClick={() => setSelectedReview(null)} 
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Customer Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                    <User className="mr-2" size={20} />
                    Customer Information
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    <p><span className="font-medium">Name:</span> {selectedReview.customerName}</p>
                    <p><span className="font-medium">Email:</span> {selectedReview.email}</p>
                    <p><span className="font-medium">Order:</span> {selectedReview.orderNumber}</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                    <Calendar className="mr-2" size={20} />
                    Review Details
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    <p><span className="font-medium">Submitted:</span> {selectedReview.createdAt.toLocaleDateString()}</p>
                    <p><span className="font-medium">Status:</span> {getStatusBadge(selectedReview)}</p>
                    <p><span className="font-medium">Recommends:</span> {selectedReview.wouldRecommend ? 'Yes' : 'No'}</p>
                  </div>
                </div>
              </div>

              {/* Ratings */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Ratings</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <StarDisplay rating={selectedReview.overallRating} label="Overall" />
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <StarDisplay rating={selectedReview.tasteRating} label="Taste" />
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <StarDisplay rating={selectedReview.packagingRating} label="Packaging" />
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <StarDisplay rating={selectedReview.deliveryRating} label="Delivery" />
                  </div>
                </div>
              </div>

              {/* Review Text */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Review</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-700 leading-relaxed">{selectedReview.reviewText}</p>
                </div>
              </div>

              {/* Photos */}
              {selectedReview.photoUrls.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Photos</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {selectedReview.photoUrls.map((url: string, index: number) => (
                      <img
                        key={index}
                        src={url}
                        alt={`Review photo ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg border border-gray-200"
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Moderation Actions */}
              {!selectedReview.isApproved && (
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Moderation Actions</h3>
                  <div className="flex space-x-4">
                    <Button
                      onClick={() => handleModerateReview(selectedReview.id, true, true)}
                      disabled={isProcessing === selectedReview.id}
                      className="flex items-center"
                    >
                      <Check size={16} className="mr-2" />
                      Approve & Publish
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleModerateReview(selectedReview.id, true, false)}
                      disabled={isProcessing === selectedReview.id}
                      className="flex items-center"
                    >
                      <Check size={16} className="mr-2" />
                      Approve Only
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() => handleModerateReview(selectedReview.id, false, false)}
                      disabled={isProcessing === selectedReview.id}
                      className="flex items-center"
                    >
                      <X size={16} className="mr-2" />
                      Reject
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {filteredReviews.length === 0 && (
        <div className="text-center py-12">
          <MessageSquare className="mx-auto text-gray-300 mb-4" size={64} />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No reviews found</h3>
          <p className="text-gray-500">
            {filterStatus === 'all' 
              ? 'Reviews will appear here as customers submit them.'
              : `No ${filterStatus} reviews at the moment.`}
          </p>
        </div>
      )}
    </div>
  );
};