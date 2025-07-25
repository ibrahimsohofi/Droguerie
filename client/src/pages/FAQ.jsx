import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle, Search, ShoppingCart, Truck, CreditCard, RotateCcw, Phone } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const FAQ = () => {
  const [openItems, setOpenItems] = useState(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const { language, isRTL } = useLanguage();

  const content = {
    ar: {
      title: 'الأسئلة الشائعة',
      subtitle: 'إجابات على أكثر الأسئلة شيوعاً',
      searchPlaceholder: 'ابحث في الأسئلة الشائعة...',
      categories: [
        {
          title: 'الطلبات والشراء',
          icon: <ShoppingCart className="h-6 w-6" />,
          faqs: [
            {
              question: 'كيف يمكنني إجراء طلب؟',
              answer: 'يمكنكم إجراء طلب بسهولة من خلال تصفح منتجاتنا، إضافة المنتجات المرغوبة إلى السلة، ثم الانتقال إلى صفحة الدفع لإكمال الطلب. ستحتاجون إلى إنشاء حساب أو تسجيل الدخول أولاً.'
            },
            {
              question: 'هل يمكنني تعديل أو إلغاء طلبي؟',
              answer: 'يمكنكم تعديل أو إلغاء طلبكم خلال الساعة الأولى من إجراء الطلب. بعد ذلك، يرجى التواصل مع خدمة العملاء على الرقم +212 522 123 456 للمساعدة.'
            },
            {
              question: 'ما هو الحد الأدنى لقيمة الطلب؟',
              answer: 'الحد الأدنى لقيمة الطلب هو 100 درهم. للطلبات التي تزيد عن 500 درهم، التوصيل مجاني داخل الدار البيضاء والرباط.'
            },
            {
              question: 'هل تتوفر المنتجات دائماً؟',
              answer: 'نحرص على تحديث مخزوننا بانتظام، لكن قد تنفد بعض المنتجات أحياناً. سيتم إشعاركم فوراً إذا لم يكن المنتج متوفراً عند معالجة طلبكم.'
            }
          ]
        },
        {
          title: 'التوصيل والشحن',
          icon: <Truck className="h-6 w-6" />,
          faqs: [
            {
              question: 'ما هي مناطق التوصيل؟',
              answer: 'نقوم بالتوصيل في جميع المدن الرئيسية بالمغرب: الدار البيضاء، الرباط، فاس، مراكش، طنجة، أكادير، مكناس، وتطوان. للمناطق الأخرى، يرجى التواصل معنا للاستفسار.'
            },
            {
              question: 'كم يستغرق التوصيل؟',
              answer: 'مدة التوصيل تتراوح بين 24-72 ساعة حسب موقعكم. في الدار البيضاء والرباط، التوصيل خلال 24 ساعة. للمدن الأخرى، قد يستغرق 48-72 ساعة.'
            },
            {
              question: 'ما هي تكلفة التوصيل؟',
              answer: 'تكلفة التوصيل تختلف حسب المنطقة:\n• الدار البيضاء والرباط: 30 درهم\n• المدن الكبرى الأخرى: 40 درهم\n• المناطق النائية: 50 درهم\nالتوصيل مجاني للطلبات التي تزيد عن 500 درهم.'
            },
            {
              question: 'كيف يمكنني تتبع طلبي؟',
              answer: 'بعد إتمام الطلب، ستحصلون على رقم تتبع عبر الرسائل النصية والبريد الإلكتروني. يمكنكم أيضاً تتبع طلبكم من خلال حسابكم على الموقع.'
            }
          ]
        },
        {
          title: 'الدفع والفواتير',
          icon: <CreditCard className="h-6 w-6" />,
          faqs: [
            {
              question: 'ما هي طرق الدفع المتاحة؟',
              answer: 'نقبل الدفع بالطرق التالية:\n• البطاقات البنكية (Visa, Mastercard)\n• الدفع عند التسليم\n• التحويل البنكي\n• محافظ الدفع الإلكترونية'
            },
            {
              question: 'هل الدفع آمن؟',
              answer: 'نعم، جميع معاملات الدفع محمية بأحدث تقنيات التشفير SSL. لا نحتفظ ببيانات بطاقاتكم البنكية على خوادمنا لضمان أقصى درجات الأمان.'
            },
            {
              question: 'متى يتم خصم المبلغ؟',
              answer: 'يتم خصم المبلغ فور تأكيد الطلب للدفع بالبطاقة البنكية. للدفع عند التسليم، يتم الدفع عند استلام الطلب.'
            },
            {
              question: 'هل يمكنني الحصول على فاتورة؟',
              answer: 'نعم، يمكنكم الحصول على فاتورة إلكترونية فور إتمام الطلب، وستصلكم نسخة على البريد الإلكتروني. كما يمكن طلب فاتورة ورقية مع التوصيل.'
            }
          ]
        },
        {
          title: 'الإرجاع والاسترداد',
          icon: <RotateCcw className="h-6 w-6" />,
          faqs: [
            {
              question: 'ما هي سياسة الإرجاع؟',
              answer: 'يمكنكم إرجاع المنتجات خلال 14 يوماً من تاريخ الاستلام، شرط أن تكون في حالتها الأصلية ولم يتم استخدامها. المنتجات الشخصية والصحية غير قابلة للإرجاع.'
            },
            {
              question: 'كيف يمكنني إرجاع منتج؟',
              answer: 'للإرجاع، يرجى التواصل مع خدمة العملاء أولاً على +212 522 123 456. سنرسل لكم تعليمات الإرجاع وترتيب استلام المنتج من عندكم.'
            },
            {
              question: 'متى سأحصل على استرداد؟',
              answer: 'بعد استلام المنتج المرجع والتأكد من حالته، سيتم الاسترداد خلال 7-14 يوم عمل. الاسترداد سيكون بنفس طريقة الدفع الأصلية.'
            },
            {
              question: 'من يتحمل تكلفة الإرجاع؟',
              answer: 'إذا كان المنتج معيباً أو مختلفاً عن الوصف، نتحمل نحن تكلفة الإرجاع. في الحالات الأخرى، تكون تكلفة الإرجاع على العميل.'
            }
          ]
        }
      ],
      contact: {
        title: 'لم تجد ما تبحث عنه؟',
        description: 'فريق خدمة العملاء مستعد لمساعدتكم',
        phone: '+212 522 123 456',
        email: 'support@drogueriejamal.ma',
        hours: 'الاثنين - السبت: 8:00 - 20:00'
      }
    },
    fr: {
      title: 'Questions Fréquemment Posées',
      subtitle: 'Réponses aux questions les plus courantes',
      searchPlaceholder: 'Rechercher dans la FAQ...',
      categories: [
        {
          title: 'Commandes et Achats',
          icon: <ShoppingCart className="h-6 w-6" />,
          faqs: [
            {
              question: 'Comment puis-je passer une commande ?',
              answer: 'Vous pouvez facilement passer une commande en parcourant nos produits, en ajoutant les articles souhaités au panier, puis en procédant au paiement. Vous devrez créer un compte ou vous connecter d\'abord.'
            },
            {
              question: 'Puis-je modifier ou annuler ma commande ?',
              answer: 'Vous pouvez modifier ou annuler votre commande dans la première heure suivant la commande. Après cela, veuillez contacter le service client au +212 522 123 456 pour assistance.'
            },
            {
              question: 'Quel est le montant minimum de commande ?',
              answer: 'Le montant minimum de commande est de 100 DH. Pour les commandes de plus de 500 DH, la livraison est gratuite à Casablanca et Rabat.'
            },
            {
              question: 'Les produits sont-ils toujours disponibles ?',
              answer: 'Nous veillons à mettre à jour notre stock régulièrement, mais certains produits peuvent parfois être en rupture. Vous serez immédiatement informé si un produit n\'est pas disponible lors du traitement de votre commande.'
            }
          ]
        },
        {
          title: 'Livraison et Expédition',
          icon: <Truck className="h-6 w-6" />,
          faqs: [
            {
              question: 'Quelles sont les zones de livraison ?',
              answer: 'Nous livrons dans toutes les principales villes du Maroc : Casablanca, Rabat, Fès, Marrakech, Tanger, Agadir, Meknès et Tétouan. Pour les autres régions, veuillez nous contacter pour vous renseigner.'
            },
            {
              question: 'Combien de temps prend la livraison ?',
              answer: 'Le délai de livraison varie entre 24-72 heures selon votre localisation. À Casablanca et Rabat, livraison sous 24h. Pour les autres villes, cela peut prendre 48-72h.'
            },
            {
              question: 'Quels sont les frais de livraison ?',
              answer: 'Les frais de livraison varient selon la région :\n• Casablanca et Rabat : 30 DH\n• Autres grandes villes : 40 DH\n• Régions éloignées : 50 DH\nLivraison gratuite pour les commandes de plus de 500 DH.'
            },
            {
              question: 'Comment puis-je suivre ma commande ?',
              answer: 'Après avoir passé votre commande, vous recevrez un numéro de suivi par SMS et email. Vous pouvez également suivre votre commande via votre compte sur le site.'
            }
          ]
        },
        {
          title: 'Paiement et Facturation',
          icon: <CreditCard className="h-6 w-6" />,
          faqs: [
            {
              question: 'Quels sont les moyens de paiement acceptés ?',
              answer: 'Nous acceptons les moyens de paiement suivants :\n• Cartes bancaires (Visa, Mastercard)\n• Paiement à la livraison\n• Virement bancaire\n• Portefeuilles électroniques'
            },
            {
              question: 'Le paiement est-il sécurisé ?',
              answer: 'Oui, toutes les transactions de paiement sont protégées par les dernières technologies de cryptage SSL. Nous ne conservons pas les données de vos cartes bancaires sur nos serveurs pour assurer une sécurité maximale.'
            },
            {
              question: 'Quand le montant est-il débité ?',
              answer: 'Le montant est débité immédiatement lors de la confirmation de commande pour le paiement par carte bancaire. Pour le paiement à la livraison, le paiement s\'effectue lors de la réception de la commande.'
            },
            {
              question: 'Puis-je obtenir une facture ?',
              answer: 'Oui, vous pouvez obtenir une facture électronique dès la finalisation de votre commande, et vous recevrez une copie par email. Une facture papier peut également être demandée avec la livraison.'
            }
          ]
        },
        {
          title: 'Retours et Remboursements',
          icon: <RotateCcw className="h-6 w-6" />,
          faqs: [
            {
              question: 'Quelle est la politique de retour ?',
              answer: 'Vous pouvez retourner les produits dans les 14 jours suivant la réception, à condition qu\'ils soient dans leur état d\'origine et non utilisés. Les produits personnels et de santé ne sont pas retournables.'
            },
            {
              question: 'Comment puis-je retourner un produit ?',
              answer: 'Pour un retour, veuillez d\'abord contacter le service client au +212 522 123 456. Nous vous enverrons les instructions de retour et organiserons la collecte du produit chez vous.'
            },
            {
              question: 'Quand vais-je recevoir mon remboursement ?',
              answer: 'Après réception du produit retourné et vérification de son état, le remboursement sera effectué sous 7-14 jours ouvrables. Le remboursement se fera par le même moyen de paiement utilisé.'
            },
            {
              question: 'Qui supporte les frais de retour ?',
              answer: 'Si le produit est défectueux ou différent de la description, nous prenons en charge les frais de retour. Dans les autres cas, les frais de retour sont à la charge du client.'
            }
          ]
        }
      ],
      contact: {
        title: 'Vous n\'avez pas trouvé ce que vous cherchiez ?',
        description: 'Notre équipe de service client est prête à vous aider',
        phone: '+212 522 123 456',
        email: 'support@drogueriejamal.ma',
        hours: 'Lun - Sam : 8h00 - 20h00'
      }
    }
  };

  const currentContent = content[language] || content.fr;

  const toggleItem = (categoryIndex, faqIndex) => {
    const key = `${categoryIndex}-${faqIndex}`;
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(key)) {
      newOpenItems.delete(key);
    } else {
      newOpenItems.add(key);
    }
    setOpenItems(newOpenItems);
  };

  const filteredCategories = currentContent.categories.map(category => ({
    ...category,
    faqs: category.faqs.filter(faq =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.faqs.length > 0);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className={`text-center mb-12 ${isRTL ? 'text-right' : 'text-left'}`}>
          <div className="flex justify-center mb-6">
            <HelpCircle className="h-16 w-16 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {currentContent.title}
          </h1>
          <p className="text-xl text-gray-600">
            {currentContent.subtitle}
          </p>
        </div>

        {/* Search */}
        <div className="mb-12">
          <div className="relative max-w-md mx-auto">
            <input
              type="text"
              placeholder={currentContent.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full px-4 py-3 ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'} border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-300`}
              dir={isRTL ? 'rtl' : 'ltr'}
            />
            <Search className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-3 h-5 w-5 text-gray-400`} />
          </div>
        </div>

        {/* FAQ Categories */}
        <div className="space-y-8">
          {filteredCategories.map((category, categoryIndex) => (
            <div key={categoryIndex} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className={`bg-blue-50 px-6 py-4 border-b border-gray-200 ${isRTL ? 'text-right' : 'text-left'}`}>
                <div className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div className={`text-blue-600 ${isRTL ? 'ml-3' : 'mr-3'}`}>
                    {category.icon}
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    {category.title}
                  </h2>
                </div>
              </div>

              <div className="divide-y divide-gray-200">
                {category.faqs.map((faq, faqIndex) => {
                  const isOpen = openItems.has(`${categoryIndex}-${faqIndex}`);
                  return (
                    <div key={faqIndex}>
                      <button
                        onClick={() => toggleItem(categoryIndex, faqIndex)}
                        className={`w-full px-6 py-4 text-left hover:bg-gray-50 focus:outline-none focus:bg-gray-50 transition-colors duration-300 ${isRTL ? 'text-right' : 'text-left'}`}
                      >
                        <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                          <h3 className="text-lg font-medium text-gray-900 flex-1">
                            {faq.question}
                          </h3>
                          <div className={`text-blue-600 ${isRTL ? 'mr-4' : 'ml-4'}`}>
                            {isOpen ? (
                              <ChevronUp className="h-5 w-5" />
                            ) : (
                              <ChevronDown className="h-5 w-5" />
                            )}
                          </div>
                        </div>
                      </button>
                      {isOpen && (
                        <div className="px-6 pb-4">
                          <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                            {faq.answer}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {searchQuery && filteredCategories.length === 0 && (
          <div className="text-center py-12">
            <Search className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {language === 'ar' ? 'لم نجد نتائج' : 'Aucun résultat trouvé'}
            </h3>
            <p className="text-gray-600">
              {language === 'ar'
                ? 'جرب البحث بكلمات مختلفة أو تواصل مع خدمة العملاء'
                : 'Essayez avec d\'autres mots-clés ou contactez le service client'
              }
            </p>
          </div>
        )}

        {/* Contact Section */}
        <div className="mt-16 bg-blue-50 rounded-lg p-8 text-center">
          <Phone className="mx-auto h-12 w-12 text-blue-600 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {currentContent.contact.title}
          </h2>
          <p className="text-gray-700 mb-6">
            {currentContent.contact.description}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                {language === 'ar' ? 'الهاتف' : 'Téléphone'}
              </h3>
              <p className="text-blue-600 font-medium" dir="ltr">
                {currentContent.contact.phone}
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                {language === 'ar' ? 'البريد الإلكتروني' : 'Email'}
              </h3>
              <p className="text-blue-600 font-medium">
                {currentContent.contact.email}
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                {language === 'ar' ? 'ساعات العمل' : 'Heures d\'ouverture'}
              </h3>
              <p className="text-gray-700">
                {currentContent.contact.hours}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
