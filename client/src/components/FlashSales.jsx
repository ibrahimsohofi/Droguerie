import React, { useState, useEffect } from 'react';
import { Clock, Zap, ShoppingCart, Heart, Tag, TrendingUp } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

const FlashSales = () => {
  const [flashDeals, setFlashDeals] = useState([]);
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const { language, isRTL } = useLanguage();
  const { addToCart } = useCart();
  const { addToWishlist, isInWishlist } = useWishlist();

  // Sample flash deals data
  useEffect(() => {
    const sampleDeals = [
      {
        id: 1,
        name: 'Ariel Detergent 3kg',
        name_ar: 'مسحوق أريال 3 كيلو',
        originalPrice: 59.99,
        salePrice: 39.99,
        discount: 33,
        image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300',
        stock: 15,
        sold: 45
      },
      {
        id: 2,
        name: 'Dove Beauty Bar Set',
        name_ar: 'طقم صابون دوف',
        originalPrice: 89.99,
        salePrice: 64.99,
        discount: 28,
        image: 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=300',
        stock: 23,
        sold: 32
      },
      {
        id: 3,
        name: 'Kitchen Essentials Pack',
        name_ar: 'حزمة أساسيات المطبخ',
        originalPrice: 129.99,
        salePrice: 89.99,
        discount: 31,
        image: 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=300',
        stock: 8,
        sold: 67
      }
    ];
    setFlashDeals(sampleDeals);
    setIsLoading(false);
  }, []);

  // Countdown timer
  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);
      const difference = endOfDay.getTime() - now;

      if (difference > 0) {
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({ hours, minutes, seconds });
      } else {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, []);

  const content = {
    ar: {
      title: 'عروض فلاش اليوم',
      subtitle: 'خصومات حصرية لفترة محدودة',
      endsToday: 'ينتهي اليوم في',
      originalPrice: 'السعر الأصلي',
      save: 'وفر',
      stock: 'متبقي',
      sold: 'تم بيع',
      addToCart: 'أضف للسلة',
      addToWishlist: 'أضف للمفضلة',
      viewAll: 'عرض جميع العروض'
    },
    fr: {
      title: 'Ventes Flash du Jour',
      subtitle: 'Remises exclusives à durée limitée',
      endsToday: 'Se termine aujourd\'hui à',
      originalPrice: 'Prix original',
      save: 'Économisez',
      stock: 'Restant',
      sold: 'Vendus',
      addToCart: 'Ajouter au panier',
      addToWishlist: 'Ajouter aux favoris',
      viewAll: 'Voir toutes les offres'
    },
    en: {
      title: 'Today\'s Flash Sales',
      subtitle: 'Exclusive discounts for limited time',
      endsToday: 'Ends today at',
      originalPrice: 'Original price',
      save: 'Save',
      stock: 'Left',
      sold: 'Sold',
      addToCart: 'Add to Cart',
      addToWishlist: 'Add to Wishlist',
      viewAll: 'View All Deals'
    }
  };

  const t = content[language] || content.en;

  const formatTime = (time) => time.toString().padStart(2, '0');

  const getProgressPercentage = (sold, stock) => {
    const total = sold + stock;
    return total > 0 ? (sold / total) * 100 : 0;
  };

  if (isLoading) {
    return (
      <div className="bg-gradient-to-r from-red-600 to-orange-600 p-6 rounded-xl animate-pulse">
        <div className="h-8 bg-white/20 rounded mb-4"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white/10 h-48 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-xl overflow-hidden shadow-lg my-8">
      {/* Header */}
      <div className="p-6">
        <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Zap className="h-8 w-8 animate-pulse" />
            <div>
              <h2 className="text-2xl font-bold">{t.title}</h2>
              <p className="text-red-100">{t.subtitle}</p>
            </div>
          </div>

          {/* Countdown Timer */}
          <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className="text-center">
              <div className="text-xs text-red-100">{t.endsToday}</div>
              <div className={`flex items-center gap-2 bg-black/20 px-3 py-2 rounded-lg ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Clock className="h-4 w-4" />
                <span className="font-mono text-lg">
                  {formatTime(timeLeft.hours)}:{formatTime(timeLeft.minutes)}:{formatTime(timeLeft.seconds)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Flash Deals Grid */}
      <div className="px-6 pb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {flashDeals.map((deal) => (
            <div key={deal.id} className="bg-white rounded-lg p-4 text-gray-900 relative overflow-hidden">
              {/* Discount Badge */}
              <div className="absolute top-0 right-0 bg-red-500 text-white px-2 py-1 rounded-bl-lg text-sm font-bold">
                -{deal.discount}%
              </div>

              {/* Product Image */}
              <div className="aspect-square bg-gray-100 rounded-lg mb-3 overflow-hidden">
                <img
                  src={deal.image}
                  alt={deal.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Product Info */}
              <h3 className="font-semibold text-sm mb-2 line-clamp-2">
                {language === 'ar' ? deal.name_ar : deal.name}
              </h3>

              {/* Pricing */}
              <div className={`flex items-center gap-2 mb-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <span className="text-lg font-bold text-red-600">{deal.salePrice} DH</span>
                <span className="text-sm line-through text-gray-500">{deal.originalPrice} DH</span>
              </div>

              {/* Progress Bar */}
              <div className="mb-3">
                <div className={`flex justify-between text-xs text-gray-600 mb-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <span>{t.sold}: {deal.sold}</span>
                  <span>{t.stock}: {deal.stock}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${getProgressPercentage(deal.sold, deal.stock)}%` }}
                  ></div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <button
                  onClick={() => addToCart({
                    id: deal.id,
                    name: deal.name,
                    price: deal.salePrice,
                    image: deal.image
                  })}
                  className="flex-1 bg-red-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors flex items-center justify-center gap-1"
                >
                  <ShoppingCart className="h-4 w-4" />
                  {t.addToCart}
                </button>
                <button
                  onClick={() => addToWishlist({
                    id: deal.id,
                    name: deal.name,
                    price: deal.salePrice,
                    image: deal.image
                  })}
                  className={`p-2 rounded-lg border-2 transition-colors ${
                    isInWishlist(deal.id)
                      ? 'bg-red-100 border-red-300 text-red-600'
                      : 'border-gray-300 text-gray-600 hover:border-red-300 hover:text-red-600'
                  }`}
                >
                  <Heart className={`h-4 w-4 ${isInWishlist(deal.id) ? 'fill-current' : ''}`} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-6">
          <button className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-lg font-medium transition-colors">
            {t.viewAll}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FlashSales;
