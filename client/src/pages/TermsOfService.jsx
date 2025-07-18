import React from 'react';
import { FileText, ShoppingCart, CreditCard, Truck, RotateCcw, AlertTriangle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const TermsOfService = () => {
  const { language, isRTL } = useLanguage();

  const content = {
    ar: {
      title: 'شروط الخدمة',
      lastUpdated: 'آخر تحديث: 30 يونيو 2025',
      intro: 'مرحباً بكم في دروغري جمال. باستخدام موقعنا وخدماتنا، توافقون على الالتزام بهذه الشروط والأحكام.',
      sections: [
        {
          title: 'قبول الشروط',
          icon: <FileText className="h-6 w-6" />,
          content: [
            'باستخدام موقع دروغري جمال، تقرون بأنكم قد قرأتم وفهمتم ووافقتم على الالتزام بهذه الشروط',
            'إذا لم توافقوا على هذه الشروط، يرجى عدم استخدام موقعنا أو خدماتنا',
            'نحتفظ بالحق في تعديل هذه الشروط في أي وقت دون إشعار مسبق',
            'استمراركم في استخدام الموقع بعد التعديلات يعني موافقتكم على الشروط الجديدة'
          ]
        },
        {
          title: 'استخدام الموقع',
          icon: <ShoppingCart className="h-6 w-6" />,
          content: [
            'يجب أن تكونوا بعمر 18 سنة أو أكثر لإجراء عمليات شراء',
            'تتعهدون بتقديم معلومات صحيحة ودقيقة عند التسجيل',
            'أنتم مسؤولون عن الحفاظ على سرية بيانات حسابكم',
            'يُمنع استخدام الموقع لأي أغراض غير قانونية أو غير مصرح بها',
            'نحتفظ بالحق في إيقاف أو إلغاء أي حساب ينتهك هذه الشروط'
          ]
        },
        {
          title: 'الطلبات والمدفوعات',
          icon: <CreditCard className="h-6 w-6" />,
          content: [
            'جميع الطلبات خاضعة للتوفر وقبول من طرفنا',
            'نحتفظ بالحق في رفض أو إلغاء أي طلب لأي سبب',
            'الأسعار المعروضة شاملة للضرائب ولا تشمل رسوم التوصيل',
            'المدفوعات تتم بشكل آمن عبر معالجات دفع معتمدة',
            'في حالة رفض الدفع، سيتم إلغاء الطلب تلقائياً'
          ]
        },
        {
          title: 'التوصيل',
          icon: <Truck className="h-6 w-6" />,
          content: [
            'نقدم خدمة التوصيل داخل المدن المغربية الرئيسية',
            'مدة التوصيل تتراوح بين 24-72 ساعة حسب الموقع',
            'رسوم التوصيل تحدد حسب المنطقة والوزن',
            'المشتري مسؤول عن التواجد لاستلام الطلب',
            'في حالة عدم التواجد، سيتم إعادة المحاولة مقابل رسوم إضافية'
          ]
        },
        {
          title: 'الاسترداد والإرجاع',
          icon: <RotateCcw className="h-6 w-6" />,
          content: [
            'يمكن إرجاع المنتجات خلال 14 يوماً من تاريخ الاستلام',
            'المنتجات يجب أن تكون في حالتها الأصلية وغير مستخدمة',
            'تكلفة الإرجاع على المشتري ما لم يكن المنتج معيباً',
            'المنتجات الشخصية والصحية غير قابلة للإرجاع',
            'الاسترداد يتم خلال 7-14 يوم عمل بعد استلام المنتج المرجع'
          ]
        },
        {
          title: 'المسؤولية',
          icon: <AlertTriangle className="h-6 w-6" />,
          content: [
            'نبذل قصارى جهدنا لضمان دقة المعلومات على الموقع',
            'لا نتحمل المسؤولية عن أي أضرار ناتجة عن استخدام منتجاتنا',
            'المسؤولية القصوى محدودة بقيمة الطلب',
            'لا نضمن التوفر المستمر لجميع المنتجات',
            'المستخدم مسؤول عن استخدام المنتجات وفقاً للتوجيهات'
          ]
        }
      ],
      contact: {
        title: 'تواصل معنا',
        text: 'لأي استفسارات حول شروط الخدمة، يرجى التواصل معنا:',
        email: 'support@drogueriejamal.ma',
        phone: '+212 522 123 456'
      }
    },
    fr: {
      title: 'Conditions de Service',
      lastUpdated: 'Dernière mise à jour : 30 juin 2025',
      intro: 'Bienvenue chez Droguerie Jamal. En utilisant notre site et nos services, vous acceptez de vous conformer à ces termes et conditions.',
      sections: [
        {
          title: 'Acceptation des conditions',
          icon: <FileText className="h-6 w-6" />,
          content: [
            'En utilisant le site Droguerie Jamal, vous reconnaissez avoir lu, compris et accepté ces conditions',
            'Si vous n\'acceptez pas ces conditions, veuillez ne pas utiliser notre site ou services',
            'Nous nous réservons le droit de modifier ces conditions à tout moment sans préavis',
            'Votre utilisation continue du site après les modifications constitue votre acceptation des nouvelles conditions'
          ]
        },
        {
          title: 'Utilisation du site',
          icon: <ShoppingCart className="h-6 w-6" />,
          content: [
            'Vous devez avoir 18 ans ou plus pour effectuer des achats',
            'Vous vous engagez à fournir des informations exactes lors de l\'inscription',
            'Vous êtes responsable de maintenir la confidentialité de vos données de compte',
            'Il est interdit d\'utiliser le site à des fins illégales ou non autorisées',
            'Nous nous réservons le droit de suspendre ou annuler tout compte violant ces conditions'
          ]
        },
        {
          title: 'Commandes et paiements',
          icon: <CreditCard className="h-6 w-6" />,
          content: [
            'Toutes les commandes sont soumises à disponibilité et acceptation de notre part',
            'Nous nous réservons le droit de refuser ou annuler toute commande pour quelque raison que ce soit',
            'Les prix affichés sont TTC et n\'incluent pas les frais de livraison',
            'Les paiements sont traités de manière sécurisée via des processeurs agréés',
            'En cas de refus de paiement, la commande sera automatiquement annulée'
          ]
        },
        {
          title: 'Livraison',
          icon: <Truck className="h-6 w-6" />,
          content: [
            'Nous livrons dans les principales villes du Maroc',
            'Le délai de livraison varie entre 24-72 heures selon la localisation',
            'Les frais de livraison sont déterminés selon la zone et le poids',
            'L\'acheteur est responsable d\'être présent pour réceptionner la commande',
            'En cas d\'absence, une nouvelle tentative sera facturée'
          ]
        },
        {
          title: 'Remboursements et retours',
          icon: <RotateCcw className="h-6 w-6" />,
          content: [
            'Les produits peuvent être retournés dans les 14 jours suivant la réception',
            'Les produits doivent être dans leur état original et non utilisés',
            'Les frais de retour sont à la charge de l\'acheteur sauf si le produit est défectueux',
            'Les produits personnels et de santé ne sont pas retournables',
            'Le remboursement s\'effectue sous 7-14 jours ouvrables après réception du retour'
          ]
        },
        {
          title: 'Responsabilité',
          icon: <AlertTriangle className="h-6 w-6" />,
          content: [
            'Nous faisons de notre mieux pour assurer l\'exactitude des informations sur le site',
            'Nous ne sommes pas responsables des dommages résultant de l\'utilisation de nos produits',
            'La responsabilité maximale est limitée à la valeur de la commande',
            'Nous ne garantissons pas la disponibilité continue de tous les produits',
            'L\'utilisateur est responsable d\'utiliser les produits selon les instructions'
          ]
        }
      ],
      contact: {
        title: 'Contactez-nous',
        text: 'Pour toute question concernant ces conditions de service, veuillez nous contacter :',
        email: 'support@drogueriejamal.ma',
        phone: '+212 522 123 456'
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

            {/* Contact Section */}
            <div className="bg-blue-50 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                {currentContent.contact.title}
              </h2>
              <p className="text-gray-700 mb-4">
                {currentContent.contact.text}
              </p>
              <div className="space-y-2">
                <p className="text-gray-700">
                  <strong>{language === 'ar' ? 'البريد الإلكتروني:' : 'Email:'}</strong> {currentContent.contact.email}
                </p>
                <p className="text-gray-700">
                  <strong>{language === 'ar' ? 'الهاتف:' : 'Téléphone:'}</strong> <span dir="ltr">{currentContent.contact.phone}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Footer note */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              {language === 'ar'
                ? 'هذه الشروط محكومة بقوانين المملكة المغربية. أي نزاع سيحل أمام المحاكم المختصة في الدار البيضاء.'
                : 'Ces conditions sont régies par les lois du Royaume du Maroc. Tout litige sera résolu devant les tribunaux compétents de Casablanca.'
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
