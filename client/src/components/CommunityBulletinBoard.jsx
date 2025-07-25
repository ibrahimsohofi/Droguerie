import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import {
  MessageCircle, MapPin, Users, Calendar, Clock, Tag, Heart,
  Star, Share2, Phone, MessageSquare, AlertCircle, Megaphone,
  Home, Handshake, Gift, Plus, Filter, Search
} from 'lucide-react';

const CommunityBulletinBoard = () => {
  const { language, isRTL, formatCurrency } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [posts, setPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewPostForm, setShowNewPostForm] = useState(false);

  const translations = {
    ar: {
      title: 'لوحة إعلانات الحي',
      subtitle: 'تواصل مع جيرانك وشارك في مجتمعك المحلي',
      categories: {
        all: 'الكل',
        announcements: 'الإعلانات',
        recommendations: 'التوصيات',
        events: 'الأحداث',
        services: 'الخدمات',
        exchange: 'التبادل',
        help: 'المساعدة',
        lost_found: 'المفقودات'
      },
      newPost: 'إعلان جديد',
      search: 'البحث...',
      filter: 'تصفية',
      recentPosts: 'المنشورات الحديثة',
      popularPosts: 'المنشورات الشائعة',
      location: 'الموقع',
      contact: 'التواصل',
      helpful: 'مفيد',
      share: 'مشاركة',
      reply: 'رد',
      timeAgo: 'منذ',
      minutes: 'دقائق',
      hours: 'ساعات',
      days: 'أيام',
      weeks: 'أسابيع',
      addPost: 'أضف منشور',
      postTitle: 'عنوان المنشور',
      postContent: 'محتوى المنشور',
      selectCategory: 'اختر الفئة',
      yourLocation: 'موقعك',
      contactInfo: 'معلومات التواصل',
      publish: 'نشر',
      cancel: 'إلغاء'
    },
    fr: {
      title: 'Tableau d\'Annonces du Quartier',
      subtitle: 'Connectez-vous avec vos voisins et participez à votre communauté locale',
      categories: {
        all: 'Tout',
        announcements: 'Annonces',
        recommendations: 'Recommandations',
        events: 'Événements',
        services: 'Services',
        exchange: 'Échange',
        help: 'Aide',
        lost_found: 'Objets Perdus'
      },
      newPost: 'Nouvelle Annonce',
      search: 'Rechercher...',
      filter: 'Filtrer',
      recentPosts: 'Publications Récentes',
      popularPosts: 'Publications Populaires',
      location: 'Localisation',
      contact: 'Contact',
      helpful: 'Utile',
      share: 'Partager',
      reply: 'Répondre',
      timeAgo: 'il y a',
      minutes: 'minutes',
      hours: 'heures',
      days: 'jours',
      weeks: 'semaines',
      addPost: 'Ajouter une Publication',
      postTitle: 'Titre de la Publication',
      postContent: 'Contenu de la Publication',
      selectCategory: 'Sélectionner une Catégorie',
      yourLocation: 'Votre Localisation',
      contactInfo: 'Informations de Contact',
      publish: 'Publier',
      cancel: 'Annuler'
    },
    en: {
      title: 'Community Bulletin Board',
      subtitle: 'Connect with your neighbors and participate in your local community',
      categories: {
        all: 'All',
        announcements: 'Announcements',
        recommendations: 'Recommendations',
        events: 'Events',
        services: 'Services',
        exchange: 'Exchange',
        help: 'Help',
        lost_found: 'Lost & Found'
      },
      newPost: 'New Post',
      search: 'Search...',
      filter: 'Filter',
      recentPosts: 'Recent Posts',
      popularPosts: 'Popular Posts',
      location: 'Location',
      contact: 'Contact',
      helpful: 'Helpful',
      share: 'Share',
      reply: 'Reply',
      timeAgo: 'ago',
      minutes: 'minutes',
      hours: 'hours',
      days: 'days',
      weeks: 'weeks',
      addPost: 'Add Post',
      postTitle: 'Post Title',
      postContent: 'Post Content',
      selectCategory: 'Select Category',
      yourLocation: 'Your Location',
      contactInfo: 'Contact Information',
      publish: 'Publish',
      cancel: 'Cancel'
    }
  };

  const t = translations[language] || translations.ar;

  // Sample community posts data
  const samplePosts = [
    {
      id: 1,
      category: 'recommendations',
      author: language === 'ar' ? 'أم محمد' : 'Oum Mohammed',
      title: language === 'ar' ? 'أفضل مخبزة في الحي' : 'Meilleure boulangerie du quartier',
      content: language === 'ar'
        ? 'أنصح بمخبزة "الأمل" في شارع الحسن الثاني. خبزهم طازج ولذيذ والأسعار معقولة.'
        : 'Je recommande la boulangerie "Al Amal" dans la rue Hassan II. Leur pain est frais et délicieux avec des prix raisonnables.',
      location: language === 'ar' ? 'حي النهضة، الدار البيضاء' : 'Quartier Nahda, Casablanca',
      timeAgo: '2h',
      likes: 15,
      replies: 8,
      isLiked: false,
      contact: '+212 6XX XXX XXX',
      tags: [language === 'ar' ? 'مخبزة' : 'boulangerie', language === 'ar' ? 'توصية' : 'recommandation']
    },
    {
      id: 2,
      category: 'services',
      author: language === 'ar' ? 'عبد الله الحداد' : 'Abdellah El Haddad',
      title: language === 'ar' ? 'خدمات السباكة والكهرباء' : 'Services de plomberie et électricité',
      content: language === 'ar'
        ? 'أقدم خدمات إصلاح السباكة والكهرباء بأسعار مناسبة. خبرة 15 سنة. متوفر 7/7.'
        : 'Je propose des services de réparation plomberie et électricité à prix raisonnables. 15 ans d\'expérience. Disponible 7j/7.',
      location: language === 'ar' ? 'حي المعاريف، الدار البيضاء' : 'Quartier Maarif, Casablanca',
      timeAgo: '5h',
      likes: 12,
      replies: 3,
      isLiked: true,
      contact: '+212 6XX XXX XXX',
      tags: [language === 'ar' ? 'سباكة' : 'plomberie', language === 'ar' ? 'كهرباء' : 'électricité']
    },
    {
      id: 3,
      category: 'events',
      author: language === 'ar' ? 'جمعية أطفال الحي' : 'Association Enfants du Quartier',
      title: language === 'ar' ? 'يوم ترفيهي للأطفال - السبت القادم' : 'Journée récréative pour enfants - Samedi prochain',
      content: language === 'ar'
        ? 'ندعوكم للمشاركة في يوم ترفيهي للأطفال يوم السبت في الحديقة العمومية. أنشطة، ألعاب ووجبات مجانية.'
        : 'Nous vous invitons à participer à une journée récréative pour enfants samedi dans le parc public. Activités, jeux et repas gratuits.',
      location: language === 'ar' ? 'الحديقة العمومية، حي النهضة' : 'Parc Public, Quartier Nahda',
      timeAgo: '1d',
      likes: 28,
      replies: 15,
      isLiked: false,
      contact: '+212 6XX XXX XXX',
      tags: [language === 'ar' ? 'أطفال' : 'enfants', language === 'ar' ? 'ترفيه' : 'loisirs']
    },
    {
      id: 4,
      category: 'exchange',
      author: language === 'ar' ? 'سارة' : 'Sara',
      title: language === 'ar' ? 'أبحث عن مبادلة كتب الأطفال' : 'Recherche échange de livres pour enfants',
      content: language === 'ar'
        ? 'لدي مجموعة كبيرة من كتب الأطفال وأرغب في مبادلتها بكتب جديدة. مناسبة للأعمار 5-10 سنوات.'
        : 'J\'ai une grande collection de livres pour enfants et je souhaite les échanger contre de nouveaux livres. Convient aux âges 5-10 ans.',
      location: language === 'ar' ? 'حي الراشدية، الدار البيضاء' : 'Quartier Rachdia, Casablanca',
      timeAgo: '3d',
      likes: 9,
      replies: 6,
      isLiked: false,
      contact: 'sara.books@email.com',
      tags: [language === 'ar' ? 'كتب' : 'livres', language === 'ar' ? 'مبادلة' : 'échange']
    },
    {
      id: 5,
      category: 'announcements',
      author: language === 'ar' ? 'مجلس الحي' : 'Conseil de Quartier',
      title: language === 'ar' ? 'أعمال صيانة في شبكة المياه' : 'Travaux de maintenance du réseau d\'eau',
      content: language === 'ar'
        ? 'إعلان: ستتم أعمال صيانة في شبكة المياه يوم الثلاثاء من 9 صباحاً حتى 3 مساءً. انقطاع مؤقت للمياه.'
        : 'Annonce: Des travaux de maintenance du réseau d\'eau auront lieu mardi de 9h à 15h. Coupure temporaire d\'eau.',
      location: language === 'ar' ? 'جميع أحياء المنطقة' : 'Tous les quartiers de la zone',
      timeAgo: '1w',
      likes: 45,
      replies: 22,
      isLiked: false,
      contact: 'conseil.quartier@ville.ma',
      tags: [language === 'ar' ? 'صيانة' : 'maintenance', language === 'ar' ? 'مياه' : 'eau'],
      isPinned: true
    }
  ];

  useEffect(() => {
    setPosts(samplePosts);
  }, [language]);

  const getCategoryIcon = (category) => {
    const icons = {
      announcements: <Megaphone className="w-4 h-4" />,
      recommendations: <Star className="w-4 h-4" />,
      events: <Calendar className="w-4 h-4" />,
      services: <Handshake className="w-4 h-4" />,
      exchange: <Gift className="w-4 h-4" />,
      help: <Heart className="w-4 h-4" />,
      lost_found: <AlertCircle className="w-4 h-4" />
    };
    return icons[category] || <MessageCircle className="w-4 h-4" />;
  };

  const getCategoryColor = (category) => {
    const colors = {
      announcements: 'text-red-600 bg-red-50 border-red-200',
      recommendations: 'text-yellow-600 bg-yellow-50 border-yellow-200',
      events: 'text-purple-600 bg-purple-50 border-purple-200',
      services: 'text-blue-600 bg-blue-50 border-blue-200',
      exchange: 'text-green-600 bg-green-50 border-green-200',
      help: 'text-pink-600 bg-pink-50 border-pink-200',
      lost_found: 'text-orange-600 bg-orange-50 border-orange-200'
    };
    return colors[category] || 'text-gray-600 bg-gray-50 border-gray-200';
  };

  const filteredPosts = posts.filter(post => {
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    const matchesSearch = searchTerm === '' ||
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.content.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleLike = (postId) => {
    setPosts(posts.map(post =>
      post.id === postId
        ? { ...post, isLiked: !post.isLiked, likes: post.isLiked ? post.likes - 1 : post.likes + 1 }
        : post
    ));
  };

  const formatTimeAgo = (timeAgo) => {
    const unit = timeAgo.slice(-1);
    const number = timeAgo.slice(0, -1);

    const timeUnits = {
      'm': t.minutes,
      'h': t.hours,
      'd': t.days,
      'w': t.weeks
    };

    return `${number} ${timeUnits[unit]} ${t.timeAgo}`;
  };

  return (
    <div className={`max-w-7xl mx-auto p-6 ${isRTL ? 'rtl' : 'ltr'}`}>
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">{t.title}</h2>
        <p className="text-gray-600">{t.subtitle}</p>
      </div>

      {/* Search and Filter */}
      <div className="mb-8 flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder={t.search}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <button
          onClick={() => setShowNewPostForm(true)}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          {t.newPost}
        </button>
      </div>

      {/* Category Filter */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-2">
          {Object.entries(t.categories).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setSelectedCategory(key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedCategory === key
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {key !== 'all' && getCategoryIcon(key)}
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Posts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredPosts.map((post) => (
          <div key={post.id} className={`bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow ${post.isPinned ? 'ring-2 ring-yellow-300' : ''}`}>
            {/* Post Header */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-medium text-sm">
                      {post.author.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{post.author}</h3>
                    <p className="text-sm text-gray-500">{formatTimeAgo(post.timeAgo)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {post.isPinned && (
                    <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center">
                      <Star className="w-3 h-3 text-yellow-600 fill-current" />
                    </div>
                  )}
                  <span className={`px-2 py-1 text-xs font-medium rounded-full border flex items-center gap-1 ${getCategoryColor(post.category)}`}>
                    {getCategoryIcon(post.category)}
                    {t.categories[post.category]}
                  </span>
                </div>
              </div>
            </div>

            {/* Post Content */}
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 mb-2">{post.title}</h3>
              <p className="text-gray-700 mb-3">{post.content}</p>

              {/* Tags */}
              {post.tags && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {post.tags.map((tag, index) => (
                    <span key={index} className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                      <Tag className="w-3 h-3" />
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Location */}
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                <MapPin className="w-4 h-4" />
                {post.location}
              </div>

              {/* Contact */}
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                <Phone className="w-4 h-4" />
                {post.contact}
              </div>
            </div>

            {/* Post Actions */}
            <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => toggleLike(post.id)}
                    className={`flex items-center gap-2 text-sm transition-colors ${
                      post.isLiked ? 'text-red-600' : 'text-gray-600 hover:text-red-600'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${post.isLiked ? 'fill-current' : ''}`} />
                    {post.likes}
                  </button>

                  <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 transition-colors">
                    <MessageSquare className="w-4 h-4" />
                    {post.replies}
                  </button>
                </div>

                <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 transition-colors">
                  <Share2 className="w-4 h-4" />
                  {t.share}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* New Post Form Modal */}
      {showNewPostForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">{t.addPost}</h3>

              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.postTitle}
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder={t.postTitle}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.selectCategory}
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option value="">{t.selectCategory}</option>
                    {Object.entries(t.categories).filter(([key]) => key !== 'all').map(([key, label]) => (
                      <option key={key} value={key}>{label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.postContent}
                  </label>
                  <textarea
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder={t.postContent}
                  ></textarea>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t.yourLocation}
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder={t.yourLocation}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t.contactInfo}
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder={t.contactInfo}
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {t.publish}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowNewPostForm(false)}
                    className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
                  >
                    {t.cancel}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Community Stats */}
      <div className="mt-12 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          {language === 'ar' ? 'إحصائيات المجتمع' : 'Statistiques de la Communauté'}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">127</div>
            <div className="text-sm text-gray-600">
              {language === 'ar' ? 'عضو نشط' : 'Membres Actifs'}
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">89</div>
            <div className="text-sm text-gray-600">
              {language === 'ar' ? 'منشور هذا الشهر' : 'Publications ce Mois'}
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">15</div>
            <div className="text-sm text-gray-600">
              {language === 'ar' ? 'حدث محلي' : 'Événements Locaux'}
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-600 mb-2">200+</div>
            <div className="text-sm text-gray-600">
              {language === 'ar' ? 'تفاعل يومياً' : 'Interactions Quotidiennes'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityBulletinBoard;
