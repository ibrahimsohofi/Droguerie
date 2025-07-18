// Re-export useTranslations hook from LanguageContext
export { useTranslations } from '../context/LanguageContext.jsx';

export const translations = {
  en: {
    // Navigation
    home: 'Home',
    products: 'Products',
    categories: 'Categories',
    brands: 'Brands',
    about: 'About',
    contact: 'Contact',
    cart: 'Cart',
    wishlist: 'Wishlist',
    account: 'Account',
    login: 'Login',
    register: 'Register',
    logout: 'Logout',
    admin: 'Admin Panel',

    // Common
    search: 'Search',
    price: 'Price',
    quantity: 'Quantity',
    total: 'Total',
    save: 'Save',
    cancel: 'Cancel',
    submit: 'Submit',
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',

    // Products
    addToCart: 'Add to Cart',
    addToWishlist: 'Add to Wishlist',
    outOfStock: 'Out of Stock',
    inStock: 'In Stock',
    productDetails: 'Product Details',
    relatedProducts: 'Related Products',
    reviews: 'Reviews',

    // Shopping
    checkout: 'Checkout',
    shippingAddress: 'Shipping Address',
    paymentMethod: 'Payment Method',
    orderSummary: 'Order Summary',
    placeOrder: 'Place Order',

    // Business
    businessName: 'Jamal General Store',
    businessDescription: 'Your trusted neighborhood droguerie',
    currency: 'DH'
  },
  ar: {
    // Navigation
    home: 'الرئيسية',
    products: 'المنتجات',
    categories: 'الفئات',
    brands: 'العلامات التجارية',
    about: 'من نحن',
    contact: 'اتصل بنا',
    cart: 'السلة',
    wishlist: 'قائمة الأمنيات',
    account: 'الحساب',
    login: 'تسجيل الدخول',
    register: 'إنشاء حساب',
    logout: 'تسجيل الخروج',
    admin: 'لوحة الإدارة',

    // Common
    search: 'بحث',
    price: 'السعر',
    quantity: 'الكمية',
    total: 'المجموع',
    save: 'حفظ',
    cancel: 'إلغاء',
    submit: 'إرسال',
    loading: 'جاري التحميل...',
    error: 'خطأ',
    success: 'نجح',

    // Products
    addToCart: 'أضف إلى السلة',
    addToWishlist: 'أضف إلى المفضلة',
    outOfStock: 'غير متوفر',
    inStock: 'متوفر',
    productDetails: 'تفاصيل المنتج',
    relatedProducts: 'منتجات ذات صلة',
    reviews: 'التقييمات',

    // Shopping
    checkout: 'إتمام الشراء',
    shippingAddress: 'عنوان التوصيل',
    paymentMethod: 'طريقة الدفع',
    orderSummary: 'ملخص الطلب',
    placeOrder: 'تأكيد الطلب',

    // Categories (Moroccan droguerie specific)
    cleaningProducts: 'منتجات التنظيف',
    personalCare: 'العناية الشخصية',
    cosmetics: 'مستحضرات التجميل',
    householdItems: 'أدوات منزلية',
    bathProducts: 'منتجات الحمام',
    hardwareTools: 'أدوات وعتاد',
    healthMedicine: 'صحة ودواء',
    babyProducts: 'منتجات الأطفال',
    laundryFabricCare: 'غسيل ونسيج',
    kitchenSupplies: 'مستلزمات المطبخ',
    electronicsBatteries: 'إلكترونيات وبطاريات',
    schoolOffice: 'مدرسة ومكتب',

    // Business
    businessName: 'دروغيري جمال',
    businessDescription: 'دروغيريتك المحلية الموثوقة',
    currency: 'د.م.',

    // Payment methods
    cashOnDelivery: 'الدفع عند التسليم',
    bankTransfer: 'تحويل بنكي',
    creditCard: 'بطاقة ائتمان',

    // Moroccan cities
    casablanca: 'الدار البيضاء',
    rabat: 'الرباط',
    fes: 'فاس',
    marrakech: 'مراكش',
    tangier: 'طنجة',
    agadir: 'أكادير',
    meknes: 'مكناس',
    oujda: 'وجدة',
    kenitra: 'القنيطرة',
    tetouan: 'تطوان'
  },
  fr: {
    // Navigation
    home: 'Accueil',
    products: 'Produits',
    categories: 'Catégories',
    brands: 'Marques',
    about: 'À propos',
    contact: 'Contact',
    cart: 'Panier',
    wishlist: 'Liste de souhaits',
    account: 'Compte',
    login: 'Connexion',
    register: 'S\'inscrire',
    logout: 'Déconnexion',
    admin: 'Panneau Admin',

    // Common
    search: 'Rechercher',
    price: 'Prix',
    quantity: 'Quantité',
    total: 'Total',
    save: 'Sauvegarder',
    cancel: 'Annuler',
    submit: 'Soumettre',
    loading: 'Chargement...',
    error: 'Erreur',
    success: 'Succès',

    // Products
    addToCart: 'Ajouter au panier',
    addToWishlist: 'Ajouter aux favoris',
    outOfStock: 'Rupture de stock',
    inStock: 'En stock',
    productDetails: 'Détails du produit',
    relatedProducts: 'Produits similaires',
    reviews: 'Avis',

    // Shopping
    checkout: 'Commander',
    shippingAddress: 'Adresse de livraison',
    paymentMethod: 'Méthode de paiement',
    orderSummary: 'Récapitulatif',
    placeOrder: 'Passer commande',

    // Business
    businessName: 'Droguerie Jamal',
    businessDescription: 'Votre droguerie de quartier de confiance',
    currency: 'DH'
  }
};
