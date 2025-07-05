import React, { useState, useEffect } from 'react';
import { Star, ThumbsUp, Shield, User, Edit, Trash2, MessageCircle, Calendar } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import LoadingSpinner, { LoadingSkeleton } from './LoadingSpinner';

const API_BASE = `${import.meta.env.VITE_API_URL}/api`;

const ReviewSection = ({ productId }) => {
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    rating: 5,
    comment: '',
    user_name: '',
    user_email: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [editingReview, setEditingReview] = useState(null);

  const { user, token } = useAuth();
  const { language } = useLanguage();

  useEffect(() => {
    fetchReviews();
    fetchStats();
  }, [productId]);

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        user_name: user.name || '',
        user_email: user.email || ''
      }));
    }
  }, [user]);

  const getHeaders = () => ({
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  });

  const fetchReviews = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE}/reviews/product/${productId}`, {
        headers: getHeaders()
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setReviews(data.data.reviews || []);
        } else {
          setError(data.message || 'Failed to fetch reviews');
        }
      } else {
        throw new Error('Failed to fetch reviews');
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
      setError('Failed to load reviews');
      // Set fallback demo reviews
      setReviews([
        {
          id: 1,
          rating: 5,
          comment: 'منتج ممتاز وفعال جداً',
          user_name: 'أحمد محمد',
          created_at: '2024-06-25T10:30:00Z',
          verified_purchase: true
        },
        {
          id: 2,
          rating: 4,
          comment: 'جودة جيدة وسعر مناسب',
          user_name: 'فاطمة علي',
          created_at: '2024-06-20T15:45:00Z',
          verified_purchase: false
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch(`${API_BASE}/reviews/product/${productId}/stats`, {
        headers: getHeaders()
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setStats(data.data || {});
        }
      }
    } catch (error) {
      console.error('Error fetching review stats:', error);
      // Set fallback stats
      setStats({
        average_rating: 4.5,
        total_reviews: reviews.length,
        rating_distribution: {
          5: 3,
          4: 2,
          3: 1,
          2: 0,
          1: 0
        }
      });
    }
  };

  const submitReview = async (e) => {
    e.preventDefault();

    if (!user) {
      setError('يجب تسجيل الدخول لإضافة تقييم');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const url = editingReview
        ? `${API_BASE}/reviews/${editingReview.id}`
        : `${API_BASE}/reviews`;

      const method = editingReview ? 'PUT' : 'POST';

      const reviewData = {
        product_id: productId,
        rating: formData.rating,
        comment: formData.comment.trim()
      };

      const response = await fetch(url, {
        method,
        headers: getHeaders(),
        body: JSON.stringify(reviewData)
      });

      const data = await response.json();

      if (data.success) {
        // Refresh reviews
        await fetchReviews();
        await fetchStats();

        // Reset form
        setFormData({
          rating: 5,
          comment: '',
          user_name: user.name || '',
          user_email: user.email || ''
        });
        setShowForm(false);
        setEditingReview(null);
      } else {
        setError(data.message || 'فشل في إرسال التقييم');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      setError('حدث خطأ أثناء إرسال التقييم');
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteReview = async (reviewId) => {
    if (!confirm('هل أنت متأكد من حذف هذا التقييم؟')) return;

    try {
      const response = await fetch(`${API_BASE}/reviews/${reviewId}`, {
        method: 'DELETE',
        headers: getHeaders()
      });

      const data = await response.json();

      if (data.success) {
        await fetchReviews();
        await fetchStats();
      } else {
        setError(data.message || 'فشل في حذف التقييم');
      }
    } catch (error) {
      console.error('Error deleting review:', error);
      setError('حدث خطأ أثناء حذف التقييم');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ar', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  const renderStars = (rating, size = 'sm') => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${size === 'sm' ? 'w-4 h-4' : 'w-5 h-5'} ${
              star <= rating
                ? 'text-yellow-400 fill-current'
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  const renderRatingDistribution = () => {
    if (!stats.rating_distribution) return null;

    const total = stats.total_reviews || 1;

    return (
      <div className="space-y-2 mb-6">
        <h4 className="font-semibold text-gray-900 mb-3">توزيع التقييمات</h4>
        {[5, 4, 3, 2, 1].map((rating) => {
          const count = stats.rating_distribution[rating] || 0;
          const percentage = (count / total) * 100;

          return (
            <div key={rating} className="flex items-center gap-3">
              <span className="text-sm text-gray-600 w-8">{rating}</span>
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <span className="text-sm text-gray-600 w-8">{count}</span>
            </div>
          );
        })}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <MessageCircle className="w-6 h-6" />
          تقييمات العملاء
        </h3>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <LoadingSkeleton key={i} lines={3} className="p-4 border rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <MessageCircle className="w-6 h-6" />
          تقييمات العملاء
        </h3>

        {stats.average_rating && (
          <div className="flex items-center gap-2">
            {renderStars(Math.round(stats.average_rating), 'md')}
            <span className="text-lg font-bold text-gray-900">
              {stats.average_rating.toFixed(1)}
            </span>
            <span className="text-sm text-gray-500">
              ({stats.total_reviews} تقييم)
            </span>
          </div>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Rating Distribution */}
      {stats.rating_distribution && renderRatingDistribution()}

      {/* Add Review Button */}
      {user && !showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="mb-6 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
        >
          <Edit className="w-4 h-4" />
          إضافة تقييم
        </button>
      )}

      {/* Review Form */}
      {showForm && (
        <form onSubmit={submitReview} className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
          <h4 className="font-semibold mb-4">
            {editingReview ? 'تعديل التقييم' : 'إضافة تقييم جديد'}
          </h4>

          {/* Rating */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              التقييم
            </label>
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, rating: star }))}
                  className="p-1 hover:scale-110 transition-transform"
                >
                  <Star
                    className={`w-6 h-6 ${
                      star <= formData.rating
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300 hover:text-yellow-300'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Comment */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              التعليق
            </label>
            <textarea
              value={formData.comment}
              onChange={(e) => setFormData(prev => ({ ...prev, comment: e.target.value }))}
              rows={4}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="اكتب تعليقك عن المنتج..."
              required
            />
          </div>

          {/* Form Actions */}
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
            >
              {isSubmitting && <LoadingSpinner size="sm" color="white" />}
              {editingReview ? 'تحديث' : 'إرسال'}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setEditingReview(null);
                setFormData({
                  rating: 5,
                  comment: '',
                  user_name: user?.name || '',
                  user_email: user?.email || ''
                });
              }}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              إلغاء
            </button>
          </div>
        </form>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <MessageCircle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>لا توجد تقييمات بعد</p>
            <p className="text-sm">كن أول من يقيم هذا المنتج</p>
          </div>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h5 className="font-semibold text-gray-900">
                        {review.user_name || 'مستخدم مجهول'}
                      </h5>
                      {review.verified_purchase && (
                        <div className="flex items-center gap-1 text-green-600 text-xs">
                          <Shield className="w-3 h-3" />
                          <span>شراء مؤكد</span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {renderStars(review.rating)}
                      <span className="text-sm text-gray-500">
                        {formatDate(review.created_at)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Review Actions */}
                {user && (user.id === review.user_id || user.role === 'admin') && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditingReview(review);
                        setFormData({
                          rating: review.rating,
                          comment: review.comment,
                          user_name: user.name || '',
                          user_email: user.email || ''
                        });
                        setShowForm(true);
                      }}
                      className="text-blue-600 hover:text-blue-800 p-1"
                      title="تعديل"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteReview(review.id)}
                      className="text-red-600 hover:text-red-800 p-1"
                      title="حذف"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              <p className="text-gray-700 leading-relaxed">{review.comment}</p>

              {/* Review Actions (Like, etc.) */}
              <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-100">
                <button className="flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors">
                  <ThumbsUp className="w-4 h-4" />
                  <span className="text-sm">مفيد ({review.helpful_count || 0})</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Login prompt for non-users */}
      {!user && (
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg text-center">
          <p className="text-blue-800 mb-3">سجل دخولك لإضافة تقييم</p>
          <a
            href="/login"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors inline-block"
          >
            تسجيل الدخول
          </a>
        </div>
      )}
    </div>
  );
};

export default ReviewSection;
