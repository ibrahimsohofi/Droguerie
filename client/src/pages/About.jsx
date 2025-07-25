import React from 'react';
import { ShoppingBag, Heart, Users, Award, Clock, MapPin, Mail, Phone } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const About = () => {
  const { language, isRTL } = useLanguage();

  const content = {
    ar: {
      title: 'من نحن',
      subtitle: 'تعرف على قصة متجر جمال العام',
      hero: {
        title: 'متجركم المفضل منذ أكثر من 15 سنة',
        description: 'نحن في متجر جمال العام نفخر بخدمة العائلات المغربية منذ عام 2009، نقدم أجود منتجات التنظيف والعناية الشخصية والأدوات المنزلية بأسعار تنافسية وخدمة عملاء ممتازة.'
      },
      story: {
        title: 'قصتنا',
        content: [
          'بدأت رحلة متجر جمال العام في عام 2009 كمتجر صغير في قلب الدار البيضاء، بحلم بسيط وهو تقديم منتجات منزلية وشخصية عالية الجودة بأسعار معقولة لجميع أفراد المجتمع.',
          'على مر السنين، نمت ثقة عملائنا فينا وتوسعنا لنصبح واحداً من أكثر المتاجر موثوقية في المغرب. اليوم، نخدم آلاف العائلات ونفخر بكوننا جزءاً من حياتهم اليومية.',
          'مع التطور التكنولوجي، قررنا إطلاق متجرنا الإلكتروني لنصل إلى عملائنا في جميع أنحاء المملكة، مع الحفاظ على نفس مستوى الجودة والخدمة التي عهدتموها منا.'
        ]
      },
      values: {
        title: 'قيمنا',
        items: [
          {
            icon: <Heart className="h-8 w-8" />,
            title: 'الثقة والأمانة',
            description: 'نؤمن بأن الثقة هي أساس أي علاقة تجارية ناجحة. نلتزم بالشفافية والأمانة في جميع تعاملاتنا.'
          },
          {
            icon: <Award className="h-8 w-8" />,
            title: 'الجودة العالية',
            description: 'نختار منتجاتنا بعناية فائقة من أفضل الموردين لضمان حصولكم على أجود المنتجات.'
          },
          {
            icon: <Users className="h-8 w-8" />,
            title: 'خدمة العملاء',
            description: 'عملاؤنا هم أولويتنا الأولى. نسعى دائماً لتقديم تجربة تسوق مميزة وخدمة عملاء استثنائية.'
          },
          {
            icon: <Clock className="h-8 w-8" />,
            title: 'التوصيل السريع',
            description: 'نلتزم بأوقات التسليم ونحرص على وصول طلباتكم في الوقت المحدد وبأفضل حالة.'
          }
        ]
      },
      team: {
        title: 'فريقنا',
        description: 'يضم فريقنا مجموعة من المتخصصين المتفانين الذين يعملون بشغف لخدمتكم وتقديم أفضل تجربة تسوق ممكنة.',
        members: [
          {
            name: 'أحمد بنعلي',
            role: 'المدير العام',
            description: 'يقود الشركة برؤية واضحة وخبرة تزيد عن 20 عاماً في قطاع التجارة.'
          },
          {
            name: 'فاطمة الزهراء',
            role: 'مديرة التسويق',
            description: 'تختص في فهم احتياجات العملاء وتطوير استراتيgiات تسويقية مبتكرة.'
          },
          {
            name: 'محمد العلوي',
            role: 'مدير خدمة العملاء',
            description: 'يضمن حصول كل عميل على أفضل خدمة ودعم فني ممتاز.'
          }
        ]
      },
      contact: {
        title: 'تواصل معنا',
        description: 'نحن هنا لخدمتكم. لا تترددوا في التواصل معنا لأي استفسار أو اقتراح.',
        info: [
          {
            icon: <MapPin className="h-6 w-6" />,
            title: 'العنوان',
            content: 'شارع الحسن الثاني، الدار البيضاء، المغرب'
          },
          {
            icon: <Phone className="h-6 w-6" />,
            title: 'الهاتف',
            content: '+212 522 123 456'
          },
          {
            icon: <Mail className="h-6 w-6" />,
            title: 'البريد الإلكتروني',
            content: 'contact@jamalgeneralstore.ma'
          },
          {
            icon: <Clock className="h-6 w-6" />,
            title: 'ساعات العمل',
            content: 'الاثنين - السبت: 8:00 - 20:00\nالأحد: 9:00 - 18:00'
          }
        ]
      }
    },
    fr: {
      title: 'À propos de nous',
      subtitle: 'Découvrez l\'histoire de Jamal General Store',
      hero: {
        title: 'Votre magasin de confiance depuis plus de 15 ans',
        description: 'Chez Jamal General Store, nous sommes fiers de servir les familles marocaines depuis 2009, en offrant les meilleurs produits de nettoyage, soins personnels et articles ménagers à des prix compétitifs avec un service client exceptionnel.'
      },
      story: {
        title: 'Notre histoire',
        content: [
          'L\'aventure de Jamal General Store a commencé en 2009 comme un petit magasin au cœur de Casablanca, avec un rêve simple : offrir des produits ménagers et de soins de haute qualité à des prix abordables pour tous les membres de la communauté.',
          'Au fil des années, la confiance de nos clients a grandi et nous nous sommes développés pour devenir l\'un des magasins les plus fiables au Maroc. Aujourd\'hui, nous servons des milliers de familles et sommes fiers de faire partie de leur vie quotidienne.',
          'Avec l\'évolution technologique, nous avons décidé de lancer notre boutique en ligne pour atteindre nos clients dans tout le royaume, tout en maintenant le même niveau de qualité et de service que vous connaissez.'
        ]
      },
      values: {
        title: 'Nos valeurs',
        items: [
          {
            icon: <Heart className="h-8 w-8" />,
            title: 'Confiance et honnêteté',
            description: 'Nous croyons que la confiance est la base de toute relation commerciale réussie. Nous nous engageons à la transparence et à l\'honnêteté dans toutes nos transactions.'
          },
          {
            icon: <Award className="h-8 w-8" />,
            title: 'Haute qualité',
            description: 'Nous sélectionnons soigneusement nos produits auprès des meilleurs fournisseurs pour vous garantir des produits de la plus haute qualité.'
          },
          {
            icon: <Users className="h-8 w-8" />,
            title: 'Service client',
            description: 'Nos clients sont notre première priorité. Nous nous efforçons toujours d\'offrir une expérience d\'achat exceptionnelle et un service client remarquable.'
          },
          {
            icon: <Clock className="h-8 w-8" />,
            title: 'Livraison rapide',
            description: 'Nous respectons les délais de livraison et veillons à ce que vos commandes arrivent à temps et en parfait état.'
          }
        ]
      },
      team: {
        title: 'Notre équipe',
        description: 'Notre équipe comprend un groupe de spécialistes dévoués qui travaillent avec passion pour vous servir et offrir la meilleure expérience d\'achat possible.',
        members: [
          {
            name: 'Ahmed Benali',
            role: 'Directeur Général',
            description: 'Dirige l\'entreprise avec une vision claire et plus de 20 ans d\'expérience dans le secteur commercial.'
          },
          {
            name: 'Fatima Zahra',
            role: 'Directrice Marketing',
            description: 'Spécialisée dans la compréhension des besoins clients et le développement de stratégies marketing innovantes.'
          },
          {
            name: 'Mohammed Alaoui',
            role: 'Directeur Service Client',
            description: 'Garantit que chaque client reçoit le meilleur service et un excellent support technique.'
          }
        ]
      },
      contact: {
        title: 'Contactez-nous',
        description: 'Nous sommes là pour vous servir. N\'hésitez pas à nous contacter pour toute question ou suggestion.',
        info: [
          {
            icon: <MapPin className="h-6 w-6" />,
            title: 'Adresse',
            content: 'Avenue Hassan II, Casablanca, Maroc'
          },
          {
            icon: <Phone className="h-6 w-6" />,
            title: 'Téléphone',
            content: '+212 522 123 456'
          },
          {
            icon: <Mail className="h-6 w-6" />,
            title: 'Email',
            content: 'contact@jamalgeneralstore.ma'
          },
          {
            icon: <Clock className="h-6 w-6" />,
            title: 'Heures d\'ouverture',
            content: 'Lun - Sam: 8h00 - 20h00\nDimanche: 9h00 - 18h00'
          }
        ]
      }
    }
  };

  const currentContent = content[language] || content.fr;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-900 to-blue-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className={`text-center ${isRTL ? 'text-right' : 'text-left'}`}>
            <div className="flex justify-center mb-6">
              <ShoppingBag className="h-16 w-16 text-orange-500" />
            </div>
            <h1 className="text-4xl font-bold mb-4">
              {currentContent.title}
            </h1>
            <p className="text-xl text-blue-100 mb-8">
              {currentContent.subtitle}
            </p>
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl font-semibold mb-4">
                {currentContent.hero.title}
              </h2>
              <p className="text-lg text-blue-100 leading-relaxed">
                {currentContent.hero.description}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Story Section */}
      <div className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center mb-12 ${isRTL ? 'text-right' : 'text-left'}`}>
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              {currentContent.story.title}
            </h2>
            <div className="space-y-6 text-lg text-gray-700 leading-relaxed">
              {currentContent.story.content.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center mb-12 ${isRTL ? 'text-right' : 'text-left'}`}>
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              {currentContent.values.title}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {currentContent.values.items.map((value, index) => (
              <div key={index} className={`text-center bg-gray-50 p-6 rounded-lg ${isRTL ? 'text-right' : 'text-left'}`}>
                <div className="flex justify-center mb-4 text-blue-600">
                  {value.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {value.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center mb-12 ${isRTL ? 'text-right' : 'text-left'}`}>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {currentContent.team.title}
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              {currentContent.team.description}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {currentContent.team.members.map((member, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md text-center">
                <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-12 w-12 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {member.name}
                </h3>
                <p className="text-blue-600 font-medium mb-3">
                  {member.role}
                </p>
                <p className="text-gray-600">
                  {member.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center mb-12 ${isRTL ? 'text-right' : 'text-left'}`}>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {currentContent.contact.title}
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              {currentContent.contact.description}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {currentContent.contact.info.map((item, index) => (
              <div key={index} className={`text-center bg-blue-50 p-6 rounded-lg ${isRTL ? 'text-right' : 'text-left'}`}>
                <div className="flex justify-center mb-4 text-blue-600">
                  {item.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  {item.title}
                </h3>
                <p className="text-gray-700 whitespace-pre-line">
                  {item.content}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-4">
            {language === 'ar'
              ? 'ابدأ تجربة التسوق معنا اليوم'
              : 'Commencez votre expérience d\'achat avec nous aujourd\'hui'
            }
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            {language === 'ar'
              ? 'اكتشف مجموعتنا الواسعة من المنتجات عالية الجودة'
              : 'Découvrez notre large gamme de produits de haute qualité'
            }
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/products"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-blue-700 bg-white hover:bg-gray-50 transition-colors duration-300"
            >
              {language === 'ar' ? 'تصفح المنتجات' : 'Parcourir les produits'}
            </a>
            <a
              href="/contact"
              className="inline-flex items-center px-6 py-3 border border-white text-base font-medium rounded-md text-white bg-transparent hover:bg-blue-800 transition-colors duration-300"
            >
              {language === 'ar' ? 'تواصل معنا' : 'Nous contacter'}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
