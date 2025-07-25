import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Clock, Facebook, Instagram, Twitter, ShoppingBag } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const Footer = () => {
  const { language, isRTL, t } = useLanguage();

  const footerLinks = {
    quickLinks: [
      { name: t('home'), path: '/' },
      { name: t('products'), path: '/products' },
      { name: t('categories'), path: '/categories' },
      { name: t('contact'), path: '/contact' },
      { name: t('about'), path: '/about' },
      { name: language === 'ar' ? 'الأسئلة الشائعة' : 'FAQ', path: '/faq' }
    ],
    categories: [
      { name: language === 'ar' ? 'منتجات التنظيف' : language === 'fr' ? 'Produits de nettoyage' : 'Cleaning Products', path: '/categories/1' },
      { name: language === 'ar' ? 'العناية الشخصية' : language === 'fr' ? 'Soins personnels' : 'Personal Care', path: '/categories/2' },
      { name: language === 'ar' ? 'مستحضرات التجميل' : language === 'fr' ? 'Cosmétiques' : 'Cosmetics & Beauty', path: '/categories/3' },
      { name: language === 'ar' ? 'الأدوات المنزلية' : language === 'fr' ? 'Articles ménagers' : 'Household Items', path: '/categories/4' }
    ]
  };

  return (
    <footer className="bg-blue-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 ${isRTL ? 'text-right' : 'text-left'}`}>
          {/* Company Info */}
          <div className="space-y-6">
            <div className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
              <ShoppingBag className={`h-10 w-10 text-orange-500 ${isRTL ? 'ml-3' : 'mr-3'}`} />
              <h3 className="text-2xl font-bold text-orange-400">
                {language === 'ar' ? 'دروغري جمال' : 'Droguerie Jamal'}
              </h3>
            </div>
            <div className="bg-blue-800 p-4 rounded-lg border-l-4 border-orange-500">
              <p className="text-orange-100 leading-relaxed font-medium">
                {language === 'ar'
                  ? 'متجركم المفضل لجميع احتياجات المنزل والعناية الشخصية منذ أكثر من 15 سنة.'
                  : 'Votre magasin de confiance pour tous vos besoins ménagers et de soins personnels depuis plus de 15 ans.'
                }
              </p>
            </div>

            {/* Social Media */}
            <div className={`flex space-x-4 ${isRTL ? 'space-x-reverse' : ''}`}>
              <a
                href="#"
                className="bg-blue-800 hover:bg-orange-500 p-3 rounded-full transition-all duration-300 transform hover:scale-110"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="bg-blue-800 hover:bg-orange-500 p-3 rounded-full transition-all duration-300 transform hover:scale-110"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="bg-blue-800 hover:bg-orange-500 p-3 rounded-full transition-all duration-300 transform hover:scale-110"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h4 className="text-xl font-semibold text-orange-400">
              {language === 'ar' ? 'روابط سريعة' : 'Liens rapides'}
            </h4>
            <ul className="space-y-3">
              {footerLinks.quickLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.path}
                    className="text-gray-300 hover:text-orange-400 transition-colors duration-300 flex items-center"
                  >
                    <span className={`w-2 h-2 bg-orange-500 rounded-full ${isRTL ? 'ml-3' : 'mr-3'}`}></span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div className="space-y-6">
            <h4 className="text-xl font-semibold text-orange-400">
              {t('categories.title') || 'Categories'}
            </h4>
            <ul className="space-y-3">
              {footerLinks.categories.map((category, index) => (
                <li key={index}>
                  <Link
                    to={category.path}
                    className="text-gray-300 hover:text-orange-400 transition-colors duration-300 flex items-center"
                  >
                    <span className={`w-2 h-2 bg-orange-500 rounded-full ${isRTL ? 'ml-3' : 'mr-3'}`}></span>
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <h4 className="text-xl font-semibold text-orange-400">
              {language === 'ar' ? 'معلومات الاتصال' : 'Contact Info'}
            </h4>
            <div className="space-y-4">
              <div className={`flex items-start ${isRTL ? 'flex-row-reverse' : ''}`}>
                <MapPin className={`h-5 w-5 text-orange-500 mt-1 ${isRTL ? 'ml-3' : 'mr-3'} flex-shrink-0`} />
                <span className="text-gray-300">
                  {language === 'ar'
                    ? 'شارع الحسن الثاني، الدار البيضاء، المغرب'
                    : 'Avenue Hassan II, Casablanca, Maroc'
                  }
                </span>
              </div>

              <div className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Phone className={`h-5 w-5 text-orange-500 ${isRTL ? 'ml-3' : 'mr-3'} flex-shrink-0`} />
                <span className="text-gray-300" dir="ltr">+212 522 123 456</span>
              </div>

              <div className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Mail className={`h-5 w-5 text-orange-500 ${isRTL ? 'ml-3' : 'mr-3'} flex-shrink-0`} />
                <span className="text-gray-300">contact@drogueriejamal.ma</span>
              </div>

              <div className={`flex items-start ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Clock className={`h-5 w-5 text-orange-500 mt-1 ${isRTL ? 'ml-3' : 'mr-3'} flex-shrink-0`} />
                <div className="text-gray-300">
                  <div>{language === 'ar' ? 'الاثنين - السبت: 8:00 - 20:00' : 'Lun - Sam: 8h00 - 20h00'}</div>
                  <div>{language === 'ar' ? 'الأحد: 9:00 - 18:00' : 'Dimanche: 9h00 - 18h00'}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className={`border-t border-blue-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center ${isRTL ? 'md:flex-row-reverse' : ''}`}>
          <div className="text-gray-300 text-center md:text-left mb-4 md:mb-0">
            <p>
              © 2024 {language === 'ar' ? 'دروغري جمال' : 'Droguerie Jamal'}.
              {language === 'ar' ? ' جميع الحقوق محفوظة.' : ' Tous droits réservés.'}
            </p>
          </div>

          <div className={`flex space-x-6 text-sm text-gray-300 ${isRTL ? 'space-x-reverse' : ''}`}>
            <Link to="/privacy-policy" className="hover:text-orange-400 transition-colors duration-300">
              {language === 'ar' ? 'سياسة الخصوصية' : 'Politique de confidentialité'}
            </Link>
            <Link to="/terms-of-service" className="hover:text-orange-400 transition-colors duration-300">
              {language === 'ar' ? 'شروط الخدمة' : 'Conditions de service'}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
