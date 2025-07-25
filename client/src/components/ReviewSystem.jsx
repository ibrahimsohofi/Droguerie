import React, { useState, useEffect } from 'react';
import { Star, ThumbsUp, ThumbsDown, Flag, User, Calendar, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import LoadingSpinner from './LoadingSpinner';

const ReviewSystem = ({ productId, productName }) => {
  const [reviews, setReviews] = useState([]);
  const [userReview, setUserReview] = useState(null);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [reviewTitle, setReviewTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [sortBy, setSortBy] = useState('newest');
  const [filterBy, setFilterBy] = useState('all');
  const [helpfulVotes, setHelpfulVotes] = useState({});

  const { user } = useAuth();
  const { t, language } = useLanguage();

  useEffect(() => {
    fetchReviews();
    if (user) {
      fetchUserReview();
    }
  }, [productId, user, sortBy]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/reviews/product/${productId}?sort=${sortBy}&filter=${filterBy}`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        setReviews(data.reviews || []);
        setHelpfulVotes(data.helpfulVotes || {});
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserReview = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/reviews/user/${productId}`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        setUserReview(data.review);
      }
    } catch (error) {
      console.error('Error fetching user review:', error);
    }
  };

  const submitReview = async () => {
    if (!user) {
      alert('Please login to leave a review');
      return;
    }

    try {
      setSubmitting(true);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          product_id: productId,
          rating,
          title: reviewTitle,
          comment: reviewText
        })
      });

      if (response.ok) {
        const data = await response.json();
        setUserReview(data.review);
        setShowReviewForm(false);
        setReviewText('');
        setReviewTitle('');
        setRating(5);
        fetchReviews(); // Refresh reviews
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Error submitting review');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Error submitting review');
    } finally {
      setSubmitting(false);
    }
  };

  const markHelpful = async (reviewId, isHelpful) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/reviews/${reviewId}/helpful`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({ helpful: isHelpful })
        }
      );

      if (response.ok) {
        fetchReviews(); // Refresh to get updated counts
      }
    } catch (error) {
      console.error('Error marking review helpful:', error);
    }
  };

  const reportReview = async (reviewId) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/reviews/${reviewId}/report`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (response.ok) {
        alert('Review reported. Thank you for helping maintain quality.');
      }
    } catch (error) {
      console.error('Error reporting review:', error);
    }
  };

  const renderStars = (rating, size = 'small') => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          className={`${size === 'large' ? 'h-6 w-6' : 'h-4 w-4'} ${
            i <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
          }`}
        />
      );
    }
    return <div className="flex space-x-1">{stars}</div>;
  };

  const getAverageRating = () => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  const getRatingDistribution = () => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach(review => {
      distribution[review.rating]++;
    });
    return distribution;
  };

  const filteredReviews = reviews.filter(review => {
    if (filterBy === 'all') return true;
    if (filterBy === 'verified') return review.verified_purchase;
    return review.rating === parseInt(filterBy);
  });

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <LoadingSpinner />
      </div>
    );
  }

  const averageRating = getAverageRating();
  const distribution = getRatingDistribution();

  return (
    <div className="space-y-6">
      {/* Review Summary */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Overall Rating */}
          <div className="text-center">
            <div className="text-4xl font-bold text-gray-900 mb-2">
              {averageRating}
            </div>
            {renderStars(Math.round(averageRating), 'large')}
            <p className="text-gray-600 mt-2">
              Based on {reviews.length} review{reviews.length !== 1 ? 's' : ''}
            </p>
          </div>

          {/* Rating Distribution */}
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map(rating => {
              const count = distribution[rating];
              const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;

              return (
                <div key={rating} className="flex items-center space-x-2">
                  <span className="text-sm w-8">{rating}</span>
                  <Star className="h-4 w-4 text-yellow-400" />
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-yellow-400 h-2 rounded-full"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-600 w-8">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Write Review Section */}
      {user && !userReview && (
        <div className="bg-white rounded-lg shadow-sm border p-6">
          {!showReviewForm ? (
            <button
              onClick={() => setShowReviewForm(true)}
              className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Write a Review
            </button>
          ) : (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Write Your Review</h3>

              {/* Rating Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rating
                </label>
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      onClick={() => setRating(star)}
                      className="focus:outline-none"
                    >
                      <Star
                        className={`h-8 w-8 ${
                          star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Review Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Review Title
                </label>
                <input
                  type="text"
                  value={reviewTitle}
                  onChange={(e) => setReviewTitle(e.target.value)}
                  placeholder="Summarize your experience..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Review Text */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Review
                </label>
                <textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Share your thoughts about this product..."
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex space-x-3">
                <button
                  onClick={submitReview}
                  disabled={submitting || !reviewText.trim()}
                  className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Submitting...' : 'Submit Review'}
                </button>
                <button
                  onClick={() => {
                    setShowReviewForm(false);
                    setReviewText('');
                    setReviewTitle('');
                    setRating(5);
                  }}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* User's Existing Review */}
      {userReview && (
        <div className="bg-blue-50 rounded-lg border border-blue-200 p-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-blue-900">Your Review</h3>
            <CheckCircle className="h-5 w-5 text-blue-600" />
          </div>
          <div className="flex items-center space-x-2 mb-2">
            {renderStars(userReview.rating)}
            <span className="text-sm text-gray-600">
              {new Date(userReview.created_at).toLocaleDateString()}
            </span>
          </div>
          {userReview.title && (
            <h4 className="font-medium text-gray-900 mb-2">{userReview.title}</h4>
          )}
          <p className="text-gray-700">{userReview.comment}</p>
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {/* Sort and Filter */}
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex space-x-4">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="highest">Highest Rated</option>
              <option value="lowest">Lowest Rated</option>
              <option value="helpful">Most Helpful</option>
            </select>

            <select
              value={filterBy}
              onChange={(e) => setFilterBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
            >
              <option value="all">All Reviews</option>
              <option value="verified">Verified Purchases</option>
              <option value="5">5 Stars</option>
              <option value="4">4 Stars</option>
              <option value="3">3 Stars</option>
              <option value="2">2 Stars</option>
              <option value="1">1 Star</option>
            </select>
          </div>
        </div>

        {/* Reviews */}
        {filteredReviews.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            {filterBy === 'all' ? 'No reviews yet' : 'No reviews match your filter'}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredReviews.map((review) => (
              <div key={review.id} className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 bg-gray-300 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-gray-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">
                        {review.user_name || 'Anonymous'}
                        {review.verified_purchase && (
                          <CheckCircle className="inline h-4 w-4 text-green-500 ml-1" />
                        )}
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(review.created_at).toLocaleDateString()}</span>
                        {review.verified_purchase && (
                          <span className="text-green-600">Verified Purchase</span>
                        )}
                      </div>
                    </div>
                  </div>
                  {renderStars(review.rating)}
                </div>

                {review.title && (
                  <h4 className="font-medium text-gray-900 mb-2">{review.title}</h4>
                )}

                <p className="text-gray-700 mb-4">{review.comment}</p>

                {/* Review Actions */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => markHelpful(review.id, true)}
                      className="flex items-center space-x-1 text-sm text-gray-600 hover:text-green-600"
                    >
                      <ThumbsUp className="h-4 w-4" />
                      <span>Helpful ({review.helpful_count || 0})</span>
                    </button>

                    <button
                      onClick={() => markHelpful(review.id, false)}
                      className="flex items-center space-x-1 text-sm text-gray-600 hover:text-red-600"
                    >
                      <ThumbsDown className="h-4 w-4" />
                      <span>Not Helpful ({review.not_helpful_count || 0})</span>
                    </button>
                  </div>

                  <button
                    onClick={() => reportReview(review.id)}
                    className="flex items-center space-x-1 text-sm text-gray-600 hover:text-red-600"
                  >
                    <Flag className="h-4 w-4" />
                    <span>Report</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewSystem;
