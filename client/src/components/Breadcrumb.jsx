import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const Breadcrumb = ({ items = [], className = '' }) => {
  const location = useLocation();
  const { language, t } = useLanguage();

  // Auto-generate breadcrumbs if no items provided
  const generateBreadcrumbs = () => {
    const pathnames = location.pathname.split('/').filter((x) => x);
    const breadcrumbs = [{ name: t.home, path: '/' }];

    pathnames.forEach((pathname, index) => {
      const path = `/${pathnames.slice(0, index + 1).join('/')}`;
      let name = pathname.charAt(0).toUpperCase() + pathname.slice(1);

      // Custom name mappings
      const nameMap = {
        'products': t.products,
        'categories': t.categories,
        'cart': t.cart,
        'checkout': t.checkout,
        'profile': t.profile,
        'orders': t.orders,
        'wishlist': t.wishlist,
        'admin': t.admin,
        'contact': t.contact,
        'about': t.about,
        'faq': t.faq
      };

      name = nameMap[pathname] || name;
      breadcrumbs.push({ name, path });
    });

    return breadcrumbs;
  };

  const breadcrumbs = items.length > 0 ? items : generateBreadcrumbs();

  if (breadcrumbs.length <= 1) return null;

  return (
    <nav className={`flex ${className}`} aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-3">
        {breadcrumbs.map((breadcrumb, index) => {
          const isLast = index === breadcrumbs.length - 1;

          return (
            <li key={breadcrumb.path} className="inline-flex items-center">
              {index > 0 && (
                <ChevronRight className="w-4 h-4 text-gray-400 mx-1" />
              )}

              {isLast ? (
                <span className="text-sm font-medium text-gray-500 truncate max-w-xs">
                  {index === 0 && <Home className="w-4 h-4 mr-1 inline" />}
                  {breadcrumb.name}
                </span>
              ) : (
                <Link
                  to={breadcrumb.path}
                  className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
                >
                  {index === 0 && <Home className="w-4 h-4 mr-1" />}
                  {breadcrumb.name}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
