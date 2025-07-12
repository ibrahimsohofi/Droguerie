import React, { useState, useEffect } from 'react';
import {
  Crown, Star, Gift, Trophy, Coins, ShoppingBag,
  Calendar, TrendingUp, Award, Sparkles, Users,
  ArrowRight, Check, Clock
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

const LoyaltyProgram = () => {
  const [userPoints, setUserPoints] = useState(0);
  const [userTier, setUserTier] = useState('Bronze');
  const [availableRewards, setAvailableRewards] = useState([]);
  const [pointsHistory, setPointsHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { language, isRTL } = useLanguage();

  const tiers = [
    { name: 'Bronze', minPoints: 0, color: 'from-amber-600 to-amber-800', icon: Star },
    { name: 'Silver', minPoints: 500, color: 'from-gray-400 to-gray-600', icon: Award },
    { name: 'Gold', minPoints: 1500, color: 'from-yellow-400 to-yellow-600', icon: Trophy },
    { name: 'Platinum', minPoints: 3000, color: 'from-purple-400 to-purple-600', icon: Crown }
  ];

  const rewards = [
    {
      id: 1,
      title: 'Free Shipping',
      title_ar: 'شحن مجاني',
      description: 'Free shipping on your next order',
      description_ar: 'شحن مجاني على طلبك القادم',
      points: 100,
      type: 'shipping',
      icon: ShoppingBag,
      available: true
    },
    {
      id: 2,
      title: '10% Discount',
      title_ar: 'خصم 10%',
      description: '10% off on household items',
      description_ar: 'خصم 10% على الأدوات المنزلية',
      points: 200,
      type: 'discount',
      icon: Gift,
      available: true
    },
    {
      id: 3,
      title: 'Premium Support',
      title_ar: 'دعم مميز',
      description: '24/7 priority customer support',
      description_ar: 'دعم عملاء ذو أولوية على مدار الساعة',
      points: 300,
      type: 'support',
      icon: Users,
      available: false
    },
    {
      id: 4,
      title: 'Exclusive Products',
      title_ar: 'منتجات حصرية',
      description: 'Access to limited edition products',
      description_ar: 'الوصول إلى المنتجات محدودة الإصدار',
      points: 500,
      type: 'access',
      icon: Sparkles,
      available: true
    }
  ];

  useEffect(() => {
    if (user) {
      // Simulate loading user loyalty data
      setTimeout(() => {
        setUserPoints(750);
        setUserTier('Silver');
        setAvailableRewards(rewards);
        setPointsHistory([
          { date: '2024-01-15', points: 50, action: 'Purchase', description: 'Order #1001' },
          { date: '2024-01-10', points: 25, action: 'Review', description: 'Product review' },
          { date: '2024-01-05', points: 100, action: 'Purchase', description: 'Order #1000' },
        ]);
        setIsLoading(false);
      }, 1000);
    } else {
      setIsLoading(false);
    }
  }, [user]);

  const content = {
    ar: {
      title: 'برنامج الولاء',
      subtitle: 'اربح نقاط واحصل على مكافآت رائعة',
      yourPoints: 'نقاطك',
      currentTier: 'مستواك الحالي',
      nextTier: 'المستوى التالي',
      pointsToNext: 'نقطة للمستوى التالي',
      availableRewards: 'المكافآت المتاحة',
      redeemReward: 'استبدل المكافأة',
      notEnoughPoints: 'نقاط غير كافية',
      recentActivity: 'النشاط الأخير',
      joinProgram: 'انضم إلى برنامج الولاء',
      joinDescription: 'سجل دخولك أو أنشئ حساباً للبدء في كسب النقاط',
      login: 'تسجيل الدخول',
      register: 'إنشاء حساب',
      howItWorks: 'كيف يعمل',
      steps: [
        'تسوق واكسب نقاط',
        'اربح المزيد من النقاط مع المراجعات',
        'استبدل النقاط بمكافآت'
      ]
    },
    fr: {
      title: 'Programme de Fidélité',
      subtitle: 'Gagnez des points et obtenez de super récompenses',
      yourPoints: 'Vos Points',
      currentTier: 'Niveau Actuel',
      nextTier: 'Niveau Suivant',
      pointsToNext: 'points pour le niveau suivant',
      availableRewards: 'Récompenses Disponibles',
      redeemReward: 'Échanger la Récompense',
      notEnoughPoints: 'Points insuffisants',
      recentActivity: 'Activité Récente',
      joinProgram: 'Rejoindre le Programme de Fidélité',
      joinDescription: 'Connectez-vous ou créez un compte pour commencer à gagner des points',
      login: 'Se connecter',
      register: 'S\'inscrire',
      howItWorks: 'Comment ça marche',
      steps: [
        'Achetez et gagnez des points',
        'Gagnez plus de points avec les avis',
        'Échangez vos points contre des récompenses'
      ]
    },
    en: {
      title: 'Loyalty Program',
      subtitle: 'Earn points and get amazing rewards',
      yourPoints: 'Your Points',
      currentTier: 'Current Tier',
      nextTier: 'Next Tier',
      pointsToNext: 'points to next tier',
      availableRewards: 'Available Rewards',
      redeemReward: 'Redeem Reward',
      notEnoughPoints: 'Not enough points',
      recentActivity: 'Recent Activity',
      joinProgram: 'Join Loyalty Program',
      joinDescription: 'Login or create an account to start earning points',
      login: 'Login',
      register: 'Register',
      howItWorks: 'How it Works',
      steps: [
        'Shop and earn points',
        'Earn more points with reviews',
        'Redeem points for rewards'
      ]
    }
  };

  const t = content[language] || content.en;

  const getCurrentTier = () => {
    return tiers.reverse().find(tier => userPoints >= tier.minPoints) || tiers[0];
  };

  const getNextTier = () => {
    const sorted = [...tiers].sort((a, b) => a.minPoints - b.minPoints);
    return sorted.find(tier => tier.minPoints > userPoints);
  };

  const getProgressToNext = () => {
    const nextTier = getNextTier();
    if (!nextTier) return 100;
    const currentTier = getCurrentTier();
    const progress = ((userPoints - currentTier.minPoints) / (nextTier.minPoints - currentTier.minPoints)) * 100;
    return Math.min(progress, 100);
  };

  if (!user) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8 text-center">
        <div className="mb-6">
          <Crown className="h-16 w-16 text-purple-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{t.joinProgram}</h2>
          <p className="text-gray-600">{t.joinDescription}</p>
        </div>

        <div className={`flex gap-4 justify-center ${isRTL ? 'flex-row-reverse' : ''}`}>
          <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors">
            {t.login}
          </button>
          <button className="border border-blue-600 text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors">
            {t.register}
          </button>
        </div>

        {/* How it Works */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">{t.howItWorks}</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {t.steps.map((step, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="w-8 h-8 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center font-bold">
                  {index + 1}
                </div>
                <span className="text-gray-700">{step}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8 animate-pulse">
        <div className="h-8 bg-gray-200 rounded mb-4 w-1/3"></div>
        <div className="h-4 bg-gray-200 rounded mb-6 w-1/2"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  const currentTier = getCurrentTier();
  const nextTier = getNextTier();
  const progressToNext = getProgressToNext();

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className={`bg-gradient-to-r ${currentTier.color} text-white p-8`}>
        <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div>
            <h2 className="text-3xl font-bold mb-2">{t.title}</h2>
            <p className="text-blue-100">{t.subtitle}</p>
          </div>
          <currentTier.icon className="h-16 w-16 opacity-80" />
        </div>

        {/* Points and Tier */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white/10 backdrop-blur rounded-lg p-4">
            <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Coins className="h-8 w-8" />
              <div>
                <div className="text-2xl font-bold">{userPoints.toLocaleString()}</div>
                <div className="text-sm opacity-80">{t.yourPoints}</div>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur rounded-lg p-4">
            <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <currentTier.icon className="h-8 w-8" />
              <div>
                <div className="text-2xl font-bold">{currentTier.name}</div>
                <div className="text-sm opacity-80">{t.currentTier}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Progress to Next Tier */}
        {nextTier && (
          <div className="mt-6">
            <div className={`flex justify-between items-center mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <span className="text-sm">{t.nextTier}: {nextTier.name}</span>
              <span className="text-sm">{nextTier.minPoints - userPoints} {t.pointsToNext}</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-3">
              <div
                className="bg-white h-3 rounded-full transition-all duration-500"
                style={{ width: `${progressToNext}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>

      {/* Available Rewards */}
      <div className="p-8">
        <h3 className="text-xl font-semibold mb-6">{t.availableRewards}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {availableRewards.map((reward) => (
            <div key={reward.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className={`flex items-start gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <reward.icon className="h-6 w-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">
                    {language === 'ar' ? reward.title_ar : reward.title}
                  </h4>
                  <p className="text-sm text-gray-600 mb-3">
                    {language === 'ar' ? reward.description_ar : reward.description}
                  </p>
                  <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <Coins className="h-4 w-4 text-yellow-500" />
                      <span className="font-semibold text-gray-900">{reward.points}</span>
                    </div>
                    <button
                      disabled={userPoints < reward.points || !reward.available}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        userPoints >= reward.points && reward.available
                          ? 'bg-blue-600 text-white hover:bg-blue-700'
                          : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      {userPoints >= reward.points && reward.available ? t.redeemReward : t.notEnoughPoints}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4">{t.recentActivity}</h3>
          <div className="space-y-3">
            {pointsHistory.map((activity, index) => (
              <div key={index} className={`flex items-center justify-between p-3 bg-gray-50 rounded-lg ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                    <TrendingUp className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{activity.description}</div>
                    <div className="text-sm text-gray-500">{activity.date}</div>
                  </div>
                </div>
                <div className="text-green-600 font-semibold">+{activity.points}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoyaltyProgram;
