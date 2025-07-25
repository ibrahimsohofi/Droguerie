import React, { useState, useEffect } from 'react';
import { Facebook, Twitter, Instagram, Youtube, Linkedin, Share2, Heart, MessageCircle, ExternalLink, Camera, Copy, Check } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

// Social Share Component
export const SocialShare = ({
  url = window.location.href,
  title = "Check out this amazing product!",
  description = "Discover quality healthcare products at Droguerie Jamal",
  image = "",
  compact = false
}) => {
  const [copied, setCopied] = useState(false);

  const shareData = {
    url: encodeURIComponent(url),
    title: encodeURIComponent(title),
    description: encodeURIComponent(description),
    image: encodeURIComponent(image)
  };

  const socialPlatforms = [
    {
      name: 'Facebook',
      icon: Facebook,
      url: `https://www.facebook.com/sharer/sharer.php?u=${shareData.url}&quote=${shareData.title}`,
      color: 'text-blue-600 hover:text-blue-700',
      bgColor: 'hover:bg-blue-50'
    },
    {
      name: 'Twitter',
      icon: Twitter,
      url: `https://twitter.com/intent/tweet?url=${shareData.url}&text=${shareData.title}`,
      color: 'text-sky-500 hover:text-sky-600',
      bgColor: 'hover:bg-sky-50'
    },
    {
      name: 'WhatsApp',
      icon: MessageCircle,
      url: `https://wa.me/?text=${shareData.title}%20${shareData.url}`,
      color: 'text-green-600 hover:text-green-700',
      bgColor: 'hover:bg-green-50'
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${shareData.url}`,
      color: 'text-blue-700 hover:text-blue-800',
      bgColor: 'hover:bg-blue-50'
    }
  ];

  const handleShare = (platform) => {
    window.open(platform.url, '_blank', 'width=600,height=400');
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: description,
          url: url,
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    }
  };

  if (compact) {
    return (
      <div className="flex items-center space-x-2">
        <button
          onClick={handleNativeShare}
          className="flex items-center space-x-1 text-gray-600 hover:text-gray-800 transition-colors"
          title="Share"
        >
          <Share2 className="w-4 h-4" />
          <span className="text-sm">Share</span>
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <h3 className="text-lg font-semibold mb-3 flex items-center">
        <Share2 className="w-5 h-5 mr-2" />
        Share this product
      </h3>

      <div className="grid grid-cols-2 gap-3 mb-4">
        {socialPlatforms.map((platform) => {
          const Icon = platform.icon;
          return (
            <button
              key={platform.name}
              onClick={() => handleShare(platform)}
              className={`flex items-center space-x-2 p-3 rounded-lg border border-gray-200 transition-all ${platform.color} ${platform.bgColor}`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{platform.name}</span>
            </button>
          );
        })}
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="text"
          value={url}
          readOnly
          className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm"
        />
        <button
          onClick={copyToClipboard}
          className="flex items-center space-x-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
        >
          {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
          <span className="text-sm">{copied ? 'Copied!' : 'Copy'}</span>
        </button>
      </div>
    </div>
  );
};

// Social Login Component
export const SocialLogin = ({ onLogin, compact = false }) => {
  const [loading, setLoading] = useState(null);

  const providers = [
    {
      name: 'Facebook',
      icon: Facebook,
      color: 'bg-blue-600 hover:bg-blue-700 text-white',
      action: 'facebook'
    },
    {
      name: 'Google',
      icon: () => (
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
      ),
      color: 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-300',
      action: 'google'
    }
  ];

  const handleSocialLogin = async (provider) => {
    setLoading(provider.action);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      onLogin && onLogin(provider.action);
    } catch (error) {
      console.error('Social login error:', error);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="space-y-3">
      {providers.map((provider) => {
        const Icon = provider.icon;
        const isLoading = loading === provider.action;

        return (
          <button
            key={provider.action}
            onClick={() => handleSocialLogin(provider)}
            disabled={isLoading}
            className={`w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-lg transition-all ${provider.color} ${
              isLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : (
              <Icon />
            )}
            <span className="font-medium">
              {isLoading ? 'Connecting...' : `Continue with ${provider.name}`}
            </span>
          </button>
        );
      })}
    </div>
  );
};

// Social Feed Component
export const SocialFeed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching social media posts
    const fetchPosts = async () => {
      try {
        // Mock data - in real app, this would fetch from social media APIs
        const mockPosts = [
          {
            id: 1,
            platform: 'Instagram',
            content: 'New arrivals in our health & wellness section! 💊✨ #Health #Wellness #GeneralStore',
            image: '${import.meta.env.VITE_API_URL}/api/placeholder/400/400',
            likes: 156,
            comments: 23,
            timestamp: '2 hours ago',
            url: 'https://instagram.com/droguerie_jamal'
          },
          {
            id: 2,
            platform: 'Facebook',
            content: 'Thank you to all our customers for your trust! Here\'s to better health together 🙏',
            image: '${import.meta.env.VITE_API_URL}/api/placeholder/400/300',
            likes: 89,
            comments: 12,
            timestamp: '1 day ago',
            url: 'https://facebook.com/drogueriejamal'
          },
          {
            id: 3,
            platform: 'Twitter',
            content: 'Did you know? Regular health checkups can prevent 80% of premature heart disease 💗 #HealthTips',
            likes: 34,
            comments: 8,
            timestamp: '2 days ago',
            url: 'https://twitter.com/droguerie_jamal'
          }
        ];

        setTimeout(() => {
          setPosts(mockPosts);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching social posts:', error);
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const getPlatformIcon = (platform) => {
    switch (platform) {
      case 'Instagram': return Instagram;
      case 'Facebook': return Facebook;
      case 'Twitter': return Twitter;
      default: return Camera;
    }
  };

  const getPlatformColor = (platform) => {
    switch (platform) {
      case 'Instagram': return 'text-pink-600';
      case 'Facebook': return 'text-blue-600';
      case 'Twitter': return 'text-sky-500';
      default: return 'text-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-gray-200 rounded-lg h-48"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">Follow us on social media</h3>

      {posts.map((post) => {
        const PlatformIcon = getPlatformIcon(post.platform);
        const platformColor = getPlatformColor(post.platform);

        return (
          <div key={post.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            {/* Post Header */}
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <PlatformIcon className={`w-6 h-6 ${platformColor}`} />
                  <div>
                    <p className="font-semibold text-gray-900">Droguerie Jamal</p>
                    <p className="text-sm text-gray-500">{post.timestamp}</p>
                  </div>
                </div>
                <a
                  href={post.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-gray-600"
                >
                  <ExternalLink className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Post Content */}
            <div className="p-4">
              <p className="text-gray-800 mb-3">{post.content}</p>

              {post.image && (
                <div className="mb-3">
                  <img
                    src={post.image}
                    alt="Social media post"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                </div>
              )}

              {/* Post Actions */}
              <div className="flex items-center space-x-4 text-gray-600">
                <div className="flex items-center space-x-1">
                  <Heart className="w-5 h-5" />
                  <span className="text-sm">{post.likes}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <MessageCircle className="w-5 h-5" />
                  <span className="text-sm">{post.comments}</span>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* Follow Buttons */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6">
        <h4 className="text-lg font-semibold mb-4 text-center">Stay Connected</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { name: 'Facebook', icon: Facebook, url: 'https://facebook.com/drogueriejamal', color: 'bg-blue-600 hover:bg-blue-700' },
            { name: 'Instagram', icon: Instagram, url: 'https://instagram.com/droguerie_jamal', color: 'bg-pink-600 hover:bg-pink-700' },
            { name: 'Twitter', icon: Twitter, url: 'https://twitter.com/droguerie_jamal', color: 'bg-sky-500 hover:bg-sky-600' },
            { name: 'YouTube', icon: Youtube, url: 'https://youtube.com/drogueriejamal', color: 'bg-red-600 hover:bg-red-700' }
          ].map((social) => {
            const Icon = social.icon;
            return (
              <a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center justify-center space-x-2 py-3 px-4 rounded-lg text-white transition-all ${social.color}`}
              >
                <Icon className="w-5 h-5" />
                <span className="hidden md:inline font-medium">{social.name}</span>
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// Social Proof Component (testimonials, reviews, etc.)
export const SocialProof = ({ reviews = [], showSocialShare = true }) => {
  const [selectedReview, setSelectedReview] = useState(0);

  const mockReviews = [
    {
      id: 1,
      name: "Sarah Johnson",
      avatar: "${import.meta.env.VITE_API_URL}/api/placeholder/50/50",
      rating: 5,
      comment: "Excellent service and quality products. The staff is very knowledgeable and helpful!",
      date: "2 weeks ago",
      verified: true,
      platform: "Google"
    },
    {
      id: 2,
      name: "Ahmed El Mansouri",
      avatar: "${import.meta.env.VITE_API_URL}/api/placeholder/50/50",
      rating: 5,
      comment: "Best general store in the area. Always have what I need and great prices.",
      date: "1 month ago",
      verified: true,
      platform: "Facebook"
    },
    {
      id: 3,
      name: "Maria Rodriguez",
      avatar: "${import.meta.env.VITE_API_URL}/api/placeholder/50/50",
      rating: 4,
      comment: "Professional service and clean environment. Highly recommended!",
      date: "3 weeks ago",
      verified: true,
      platform: "Yelp"
    }
  ];

  const displayReviews = reviews.length > 0 ? reviews : mockReviews;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-xl font-semibold mb-6 text-center">What Our Customers Say</h3>

      {/* Review Carousel */}
      <div className="mb-6">
        <div className="bg-gray-50 rounded-lg p-6 text-center">
          <div className="flex justify-center mb-4">
            {[...Array(5)].map((_, i) => (
              <span
                key={i}
                className={`text-2xl ${
                  i < displayReviews[selectedReview].rating ? 'text-yellow-400' : 'text-gray-300'
                }`}
              >
                ★
              </span>
            ))}
          </div>

          <p className="text-gray-800 text-lg mb-4 italic">
            "{displayReviews[selectedReview].comment}"
          </p>

          <div className="flex items-center justify-center space-x-3">
            <img
              src={displayReviews[selectedReview].avatar}
              alt={displayReviews[selectedReview].name}
              className="w-12 h-12 rounded-full"
            />
            <div className="text-left">
              <p className="font-semibold text-gray-900">
                {displayReviews[selectedReview].name}
                {displayReviews[selectedReview].verified && (
                  <span className="ml-2 text-green-600 text-sm">✓ Verified</span>
                )}
              </p>
              <p className="text-sm text-gray-600">
                {displayReviews[selectedReview].platform} • {displayReviews[selectedReview].date}
              </p>
            </div>
          </div>
        </div>

        {/* Review Navigation */}
        <div className="flex justify-center space-x-2 mt-4">
          {displayReviews.map((_, index) => (
            <button
              key={index}
              onClick={() => setSelectedReview(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === selectedReview ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Social Stats */}
      <div className="grid grid-cols-3 gap-4 text-center mb-6">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="text-2xl font-bold text-blue-600">4.8</div>
          <div className="text-sm text-gray-600">Average Rating</div>
        </div>
        <div className="bg-green-50 rounded-lg p-4">
          <div className="text-2xl font-bold text-green-600">500+</div>
          <div className="text-sm text-gray-600">Happy Customers</div>
        </div>
        <div className="bg-purple-50 rounded-lg p-4">
          <div className="text-2xl font-bold text-purple-600">50k+</div>
          <div className="text-sm text-gray-600">Social Followers</div>
        </div>
      </div>

      {showSocialShare && (
        <div className="text-center">
          <p className="text-gray-600 mb-3">Share your experience with us!</p>
          <SocialShare compact={true} />
        </div>
      )}
    </div>
  );
};

// Main Social Media Integration Component
const SocialMediaIntegration = ({
  showShare = true,
  showFeed = false,
  showProof = false,
  showLogin = false,
  className = ""
}) => {
  return (
    <div className={`space-y-6 ${className}`}>
      {showLogin && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold mb-4">Quick Login</h3>
          <SocialLogin />
        </div>
      )}

      {showShare && <SocialShare />}

      {showFeed && <SocialFeed />}

      {showProof && <SocialProof />}
    </div>
  );
};

export default SocialMediaIntegration;
