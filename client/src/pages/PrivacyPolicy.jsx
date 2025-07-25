import React from 'react';
import { Shield, Eye, Lock, UserCheck, Mail, Phone } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const PrivacyPolicy = () => {
  const { language, isRTL } = useLanguage();

  const content = {
    ar: {
      title: 'سياسة الخصوصية',
      lastUpdated: 'آخر تحديث: 30 يونيو 2025',
      intro: 'نحن في دروغري جمال نحترم خصوصيتكم ونلتزم بحماية بياناتكم الشخصية. توضح هذه السياسة كيفية جمع واستخدام وحماية معلوماتكم.',
      sections: [
        {
          title: 'المعلومات التي نجمعها',
          icon: <Eye className="h-6 w-6" />,
          content: [
            'معلومات الحساب: الاسم، البريد الإلكتروني، رقم الهاتف، العنوان',
            'معلومات الطلبات: تاريخ الشراء، المنتجات المطلوبة، تفاصيل الدفع',
            'معلومات التصفح: عنوان IP، نوع المتصفح، صفحات الموقع المزارة',
            'ملفات تعريف الارتباط: لتحسين تجربة المستخدم وتذكر التفضيلات'
          ]
        },
        {
          title: 'كيف نستخدم معلوماتكم',
          icon: <UserCheck className="h-6 w-6" />,
          content: [
            'معالجة الطلبات وتأكيد المشتريات',
            'إرسال تحديثات حول حالة الطلبات',
            'تقديم خدمة العملاء والدعم الفني',
            'تحسين خدماتنا وتجربة الموقع',
            'إرسال عروض وإشعارات تسويقية (بموافقتكم)',
            'ضمان أمان الموقع ومنع الاحتيال'
          ]
        },
        {
          title: 'حماية البيانات',
          icon: <Lock className="h-6 w-6" />,
          content: [
            'تشفير جميع البيانات الحساسة باستخدام SSL',
            'تخزين آمن للمعلومات في قواعد بيانات محمية',
            'وصول محدود للموظفين المخولين فقط',
            'نسخ احتياطية منتظمة للبيانات',
            'مراقبة مستمرة للأنشطة المشبوهة',
            'امتثال للمعايير الدولية لحماية البيانات'
          ]
        },
        {
          title: 'مشاركة المعلومات',
          icon: <Shield className="h-6 w-6" />,
          content: [
            'لا نبيع أو نؤجر معلوماتكم الشخصية لأطراف ثالثة',
            'قد نشارك المعلومات مع شركاء الشحن لتوصيل الطلبات',
            'قد نشارك البيانات مع معالجات الدفع لإتمام المعاملات',
            'قد نفصح عن المعلومات إذا طلبت السلطات القانونية ذلك',
            'في حالة اندماج أو استحواذ، قد تنتقل البيانات للشركة الجديدة'
          ]
        }
      ],
      rights: {
        title: 'حقوقكم',
        items: [
          'الحق في الوصول إلى بياناتكم الشخصية',
          'الحق في تصحيح أو تحديث المعلومات',
          'الحق في حذف بياناتكم ("الحق في النسيان")',
          'الحق في تقييد معالجة البيانات',
          'الحق في نقل البيانات',
          'الحق في الاعتراض على المعالجة',
          'الحق في سحب الموافقة في أي وقت'
        ]
      },
      contact: {
        title: 'اتصل بنا',
        text: 'لأي استفسارات حول سياسة الخصوصية أو لممارسة حقوقكم، يرجى التواصل معنا:',
        email: 'privacy@drogueriejamal.ma',
        phone: '+212 522 123 456',
        address: 'شارع الحسن الثاني، الدار البيضاء، المغرب'
      }
    },
    fr: {
      title: 'Politique de Confidentialité',
      lastUpdated: 'Dernière mise à jour : 30 juin 2025',
      intro: 'Chez Droguerie Jamal, nous respectons votre vie privée et nous nous engageons à protéger vos données personnelles. Cette politique explique comment nous collectons, utilisons et protégeons vos informations.',
      sections: [
        {
          title: 'Informations que nous collectons',
          icon: <Eye className="h-6 w-6" />,
          content: [
            'Informations de compte : nom, email, téléphone, adresse',
            'Informations de commande : historique d\'achat, produits commandés, détails de paiement',
            'Informations de navigation : adresse IP, type de navigateur, pages visitées',
            'Cookies : pour améliorer l\'expérience utilisateur et mémoriser les préférences'
          ]
        },
        {
          title: 'Comment nous utilisons vos informations',
          icon: <UserCheck className="h-6 w-6" />,
          content: [
            'Traitement des commandes et confirmation des achats',
            'Envoi de mises à jour sur le statut des commandes',
            'Fourniture du service client et support technique',
            'Amélioration de nos services et de l\'expérience du site',
            'Envoi d\'offres et notifications marketing (avec votre consentement)',
            'Assurer la sécurité du site et prévenir la fraude'
          ]
        },
        {
          title: 'Protection des données',
          icon: <Lock className="h-6 w-6" />,
          content: [
            'Chiffrement de toutes les données sensibles avec SSL',
            'Stockage sécurisé des informations dans des bases de données protégées',
            'Accès limité aux employés autorisés uniquement',
            'Sauvegardes régulières des données',
            'Surveillance continue des activités suspectes',
            'Conformité aux normes internationales de protection des données'
          ]
        },
        {
          title: 'Partage d\'informations',
          icon: <Shield className="h-6 w-6" />,
          content: [
            'Nous ne vendons ni ne louons vos informations personnelles à des tiers',
            'Nous pouvons partager des informations avec des partenaires de livraison',
            'Nous pouvons partager des données avec des processeurs de paiement',
            'Nous pouvons divulguer des informations si requis par les autorités légales',
            'En cas de fusion ou acquisition, les données peuvent être transférées'
          ]
        }
      ],
      rights: {
        title: 'Vos droits',
        items: [
          'Droit d\'accès à vos données personnelles',
          'Droit de rectification ou mise à jour des informations',
          'Droit à l\'effacement de vos données ("droit à l\'oubli")',
          'Droit de restriction du traitement',
          'Droit à la portabilité des données',
          'Droit d\'opposition au traitement',
          'Droit de retirer le consentement à tout moment'
        ]
      },
      contact: {
        title: 'Contactez-nous',
        text: 'Pour toute question concernant cette politique de confidentialité ou pour exercer vos droits, veuillez nous contacter :',
        email: 'privacy@drogueriejamal.ma',
        phone: '+212 522 123 456',
        address: 'Avenue Hassan II, Casablanca, Maroc'
      }
    }
  };

  const currentContent = content[language] || content.fr;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`bg-white rounded-lg shadow-lg p-8 ${isRTL ? 'text-right' : 'text-left'}`}>
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {currentContent.title}
            </h1>
            <p className="text-gray-600 mb-4">
              {currentContent.lastUpdated}
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              {currentContent.intro}
            </p>
          </div>

          {/* Main Sections */}
          <div className="space-y-8">
            {currentContent.sections.map((section, index) => (
              <div key={index} className="border-b border-gray-200 pb-8 last:border-b-0">
                <div className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''} mb-4`}>
                  <div className={`text-blue-600 ${isRTL ? 'ml-3' : 'mr-3'}`}>
                    {section.icon}
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    {section.title}
                  </h2>
                </div>
                <ul className="space-y-3">
                  {section.content.map((item, itemIndex) => (
                    <li key={itemIndex} className={`flex items-start ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <span className={`w-2 h-2 bg-blue-600 rounded-full mt-2 ${isRTL ? 'ml-3' : 'mr-3'} flex-shrink-0`}></span>
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* Rights Section */}
            <div className="bg-blue-50 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                {currentContent.rights.title}
              </h2>
              <ul className="space-y-3">
                {currentContent.rights.items.map((right, index) => (
                  <li key={index} className={`flex items-start ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <span className={`w-2 h-2 bg-blue-600 rounded-full mt-2 ${isRTL ? 'ml-3' : 'mr-3'} flex-shrink-0`}></span>
                    <span className="text-gray-700">{right}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Section */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                {currentContent.contact.title}
              </h2>
              <p className="text-gray-700 mb-4">
                {currentContent.contact.text}
              </p>
              <div className="space-y-3">
                <div className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <Mail className={`h-5 w-5 text-blue-600 ${isRTL ? 'ml-3' : 'mr-3'}`} />
                  <span className="text-gray-700">{currentContent.contact.email}</span>
                </div>
                <div className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <Phone className={`h-5 w-5 text-blue-600 ${isRTL ? 'ml-3' : 'mr-3'}`} />
                  <span className="text-gray-700" dir="ltr">{currentContent.contact.phone}</span>
                </div>
                <div className={`flex items-start ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <Shield className={`h-5 w-5 text-blue-600 mt-0.5 ${isRTL ? 'ml-3' : 'mr-3'}`} />
                  <span className="text-gray-700">{currentContent.contact.address}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
