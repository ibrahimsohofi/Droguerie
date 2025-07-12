const axios = require('axios');
require('dotenv').config();

class WhatsAppService {
  constructor() {
    // WhatsApp Business API Configuration
    this.apiUrl = process.env.WHATSAPP_API_URL || 'https://graph.facebook.com/v18.0';
    this.accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
    this.phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
    this.businessPhone = process.env.WHATSAPP_BUSINESS_PHONE || '+212522123456';

    // Droguerie Jamal business info
    this.businessInfo = {
      name: 'دروغري جمال - Droguerie Jamal',
      address: 'شارع الحسن الثاني، الدار البيضاء، المغرب',
      hours: 'الاثنين-السبت: 8:00-20:00، الأحد: 9:00-18:00',
      email: 'contact@drogueriejamal.ma',
      website: process.env.CORS_ORIGIN || 'https://drogueriejamal.ma'
    };

    this.isConfigured = !!(this.accessToken && this.phoneNumberId);

    if (!this.isConfigured) {
      console.log('📱 WhatsApp Business API not configured - using fallback methods');
    } else {
      console.log('✅ WhatsApp Business service configured successfully');
    }
  }

  // Generate WhatsApp direct chat link (works without API)
  generateWhatsAppLink(phoneNumber, message = '', language = 'ar') {
    // Clean phone number (remove +, spaces, etc.)
    const cleanPhone = phoneNumber.replace(/[^\d]/g, '');

    // Add Morocco country code if not present
    const fullPhone = cleanPhone.startsWith('212') ? cleanPhone : `212${cleanPhone}`;

    // Encode message for URL
    const encodedMessage = encodeURIComponent(message);

    return `https://wa.me/${fullPhone}${message ? `?text=${encodedMessage}` : ''}`;
  }

  // Generate business WhatsApp link
  generateBusinessWhatsAppLink(message = '', language = 'ar') {
    const defaultMessages = {
      ar: `مرحباً! أود الاستفسار عن منتجات دروغري جمال.`,
      fr: `Bonjour! Je souhaite me renseigner sur les produits de Droguerie Jamal.`,
      en: `Hello! I would like to inquire about Droguerie Jamal products.`
    };

    const defaultMessage = message || defaultMessages[language] || defaultMessages.ar;

    return this.generateWhatsAppLink(this.businessPhone.replace('+', ''), defaultMessage, language);
  }

  // Generate product sharing link
  generateProductShareLink(product, language = 'ar') {
    const messages = {
      ar: `🛒 اكتشف هذا المنتج من دروغري جمال:\n\n📦 ${product.name}\n💰 ${product.price} درهم\n\n${product.description || ''}\n\n🔗 ${this.businessInfo.website}/products/${product.id}\n\n📞 للطلب: ${this.businessPhone}`,
      fr: `🛒 Découvrez ce produit de Droguerie Jamal:\n\n📦 ${product.name}\n💰 ${product.price} DH\n\n${product.description || ''}\n\n🔗 ${this.businessInfo.website}/products/${product.id}\n\n📞 Pour commander: ${this.businessPhone}`,
      en: `🛒 Check out this product from Droguerie Jamal:\n\n📦 ${product.name}\n💰 ${product.price} MAD\n\n${product.description || ''}\n\n🔗 ${this.businessInfo.website}/products/${product.id}\n\n📞 To order: ${this.businessPhone}`
    };

    const message = messages[language] || messages.ar;
    return `https://wa.me/?text=${encodeURIComponent(message)}`;
  }

  // Generate order notification message
  generateOrderNotificationMessage(orderData, language = 'ar') {
    const messages = {
      ar: {
        title: '✅ تم تأكيد طلبك - دروغري جمال',
        content: `مرحباً ${orderData.customer_name}!\n\n🎉 تم تأكيد طلبك بنجاح\n📋 رقم الطلب: #${orderData.id}\n💰 المجموع: ${orderData.total} درهم\n🚚 طريقة الدفع: ${orderData.payment_method === 'cod' ? 'الدفع عند الاستلام' : 'بطاقة ائتمان'}\n\n📦 المنتجات:\n${orderData.items.map(item => `• ${item.name} (${item.quantity}x)`).join('\n')}\n\n📍 عنوان التوصيل:\n${orderData.shipping_address}\n${orderData.shipping_city}\n\n⏰ موعد التوصيل المتوقع: 2-3 أيام عمل\n\n📞 للاستفسار: ${this.businessPhone}\n\nشكراً لثقتكم بنا! 🙏`
      },
      fr: {
        title: '✅ Commande confirmée - Droguerie Jamal',
        content: `Bonjour ${orderData.customer_name}!\n\n🎉 Votre commande a été confirmée avec succès\n📋 Numéro de commande: #${orderData.id}\n💰 Total: ${orderData.total} DH\n🚚 Mode de paiement: ${orderData.payment_method === 'cod' ? 'Paiement à la livraison' : 'Carte de crédit'}\n\n📦 Produits:\n${orderData.items.map(item => `• ${item.name} (${item.quantity}x)`).join('\n')}\n\n📍 Adresse de livraison:\n${orderData.shipping_address}\n${orderData.shipping_city}\n\n⏰ Livraison estimée: 2-3 jours ouvrables\n\n📞 Pour toute question: ${this.businessPhone}\n\nMerci de votre confiance! 🙏`
      }
    };

    return messages[language] || messages.ar;
  }

  // Generate order tracking message
  generateOrderTrackingMessage(orderData, status, language = 'ar') {
    const statusMessages = {
      ar: {
        confirmed: '✅ تم تأكيد طلبك',
        preparing: '👨‍💼 جاري تحضير طلبك',
        shipped: '🚚 تم شحن طلبك',
        out_for_delivery: '🛵 طلبك في الطريق إليك',
        delivered: '📦 تم توصيل طلبك بنجاح'
      },
      fr: {
        confirmed: '✅ Commande confirmée',
        preparing: '👨‍💼 Préparation de votre commande',
        shipped: '🚚 Commande expédiée',
        out_for_delivery: '🛵 En cours de livraison',
        delivered: '📦 Commande livrée avec succès'
      }
    };

    const statusText = statusMessages[language]?.[status] || statusMessages.ar[status];

    const messages = {
      ar: `${statusText}\n\n📋 رقم الطلب: #${orderData.id}\n👤 العميل: ${orderData.customer_name}\n\n🔄 آخر تحديث: ${new Date().toLocaleString('ar-MA')}\n\n📞 للاستفسار: ${this.businessPhone}\n🌐 تتبع الطلب: ${this.businessInfo.website}/orders/${orderData.id}`,
      fr: `${statusText}\n\n📋 Numéro de commande: #${orderData.id}\n👤 Client: ${orderData.customer_name}\n\n🔄 Dernière mise à jour: ${new Date().toLocaleString('fr-MA')}\n\n📞 Contact: ${this.businessPhone}\n🌐 Suivi: ${this.businessInfo.website}/orders/${orderData.id}`
    };

    return messages[language] || messages.ar;
  }

  // Send WhatsApp message via API (if configured)
  async sendMessage(to, message, type = 'text') {
    if (!this.isConfigured) {
      console.log('📱 WhatsApp API not configured, using fallback link generation');
      return {
        success: false,
        fallbackLink: this.generateWhatsAppLink(to, message),
        message: 'API not configured, use fallback link'
      };
    }

    try {
      const response = await axios.post(
        `${this.apiUrl}/${this.phoneNumberId}/messages`,
        {
          messaging_product: 'whatsapp',
          to: to,
          type: type,
          text: {
            body: message
          }
        },
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log(`✅ WhatsApp message sent to ${to}`);
      return {
        success: true,
        messageId: response.data.messages[0].id,
        data: response.data
      };
    } catch (error) {
      console.error('❌ Error sending WhatsApp message:', error.response?.data || error.message);
      return {
        success: false,
        error: error.message,
        fallbackLink: this.generateWhatsAppLink(to, message)
      };
    }
  }

  // Send order confirmation via WhatsApp
  async sendOrderConfirmation(orderData, customerPhone, language = 'ar') {
    const notification = this.generateOrderNotificationMessage(orderData, language);

    if (customerPhone) {
      return await this.sendMessage(customerPhone, notification.content);
    }

    return {
      success: false,
      message: 'No customer phone number provided'
    };
  }

  // Send order tracking update
  async sendOrderTracking(orderData, customerPhone, status, language = 'ar') {
    const message = this.generateOrderTrackingMessage(orderData, status, language);

    if (customerPhone) {
      return await this.sendMessage(customerPhone, message);
    }

    return {
      success: false,
      message: 'No customer phone number provided'
    };
  }

  // Generate customer service chat templates
  getCustomerServiceTemplates(language = 'ar') {
    return {
      ar: {
        welcome: `مرحباً بك في دروغري جمال! 👋\n\nكيف يمكننا مساعدتك اليوم؟\n\n🛒 تصفح المنتجات\n📞 الاستفسار عن طلب\n💊 استشارة دوائية\n🚚 معلومات التوصيل\n\nنحن هنا لخدمتك! 😊`,

        hours: `🕒 أوقات عمل دروغري جمال:\n\n📅 الاثنين - السبت: 8:00 صباحاً - 8:00 مساءً\n📅 الأحد: 9:00 صباحاً - 6:00 مساءً\n\n📍 العنوان: شارع الحسن الثاني، الدار البيضاء\n📞 الهاتف: ${this.businessPhone}\n📧 البريد: ${this.businessInfo.email}`,

        delivery: `🚚 معلومات التوصيل:\n\n📦 توصيل مجاني للطلبات أكثر من 300 درهم\n⏰ مدة التوصيل: 2-3 أيام عمل\n🌍 نوصل لجميع أنحاء المغرب\n💰 رسوم التوصيل تختلف حسب المدينة\n\n🏙️ المدن الرئيسية:\n• الدار البيضاء: 25 درهم\n• الرباط: 30 درهم\n• فاس ومراكش: 35 درهم`,

        payment: `💳 طرق الدفع المتاحة:\n\n💰 الدفع عند الاستلام (الأكثر شعبية)\n🏦 البنك التجاري وفا CIH\n🏦 بنك المغرب الخارجي BMCE\n📱 وفا كاش Wafacash\n💳 البطاقات الائتمانية\n\nجميع المعاملات آمنة ومحمية! 🔒`
      },

      fr: {
        welcome: `Bienvenue chez Droguerie Jamal! 👋\n\nComment pouvons-nous vous aider aujourd'hui?\n\n🛒 Parcourir les produits\n📞 Renseignement sur commande\n💊 Conseil pharmaceutique\n🚚 Informations livraison\n\nNous sommes là pour vous servir! 😊`,

        hours: `🕒 Horaires de Droguerie Jamal:\n\n📅 Lundi - Samedi: 8h00 - 20h00\n📅 Dimanche: 9h00 - 18h00\n\n📍 Adresse: Avenue Hassan II, Casablanca\n📞 Téléphone: ${this.businessPhone}\n📧 Email: ${this.businessInfo.email}`,

        delivery: `🚚 Informations de livraison:\n\n📦 Livraison gratuite pour commandes > 300 DH\n⏰ Délai: 2-3 jours ouvrables\n🌍 Livraison dans tout le Maroc\n💰 Frais selon la ville\n\n🏙️ Villes principales:\n• Casablanca: 25 DH\n• Rabat: 30 DH\n• Fès et Marrakech: 35 DH`,

        payment: `💳 Modes de paiement:\n\n💰 Paiement à la livraison (plus populaire)\n🏦 CIH Bank\n🏦 BMCE Bank\n📱 Wafacash\n💳 Cartes de crédit\n\nToutes les transactions sont sécurisées! 🔒`
      }
    };
  }

  // Get business contact information
  getBusinessContactInfo(language = 'ar') {
    const info = {
      ar: {
        name: this.businessInfo.name,
        phone: this.businessPhone,
        address: this.businessInfo.address,
        hours: this.businessInfo.hours,
        email: this.businessInfo.email,
        website: this.businessInfo.website,
        whatsappLink: this.generateBusinessWhatsAppLink('', language)
      },
      fr: {
        name: 'Droguerie Jamal',
        phone: this.businessPhone,
        address: 'Avenue Hassan II, Casablanca, Maroc',
        hours: 'Lun-Sam: 8h00-20h00, Dim: 9h00-18h00',
        email: this.businessInfo.email,
        website: this.businessInfo.website,
        whatsappLink: this.generateBusinessWhatsAppLink('', language)
      }
    };

    return info[language] || info.ar;
  }

  // Validate Moroccan phone number
  validateMoroccanPhone(phone) {
    // Remove all non-digits
    const cleanPhone = phone.replace(/[^\d]/g, '');

    // Moroccan phone patterns
    const patterns = [
      /^212[5-7]\d{8}$/, // +212 format
      /^0[5-7]\d{8}$/, // Local format starting with 0
      /^[5-7]\d{8}$/ // Without country code
    ];

    return patterns.some(pattern => pattern.test(cleanPhone));
  }

  // Format Moroccan phone for WhatsApp
  formatMoroccanPhoneForWhatsApp(phone) {
    const cleanPhone = phone.replace(/[^\d]/g, '');

    if (cleanPhone.startsWith('212')) {
      return cleanPhone;
    } else if (cleanPhone.startsWith('0')) {
      return '212' + cleanPhone.substring(1);
    } else if (cleanPhone.length === 9) {
      return '212' + cleanPhone;
    }

    return null; // Invalid format
  }

  // Generate WhatsApp QR code URL
  generateWhatsAppQRCode(message = '', language = 'ar') {
    const whatsappLink = this.generateBusinessWhatsAppLink(message, language);
    const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(whatsappLink)}`;

    return {
      qrCodeUrl: qrApiUrl,
      whatsappLink: whatsappLink,
      message: message
    };
  }

  // Check if WhatsApp API is available
  async checkApiStatus() {
    if (!this.isConfigured) {
      return {
        available: false,
        message: 'WhatsApp Business API not configured'
      };
    }

    try {
      const response = await axios.get(
        `${this.apiUrl}/${this.phoneNumberId}`,
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`
          }
        }
      );

      return {
        available: true,
        phoneNumber: response.data.display_phone_number,
        verificationStatus: response.data.verified_name
      };
    } catch (error) {
      return {
        available: false,
        error: error.message
      };
    }
  }
}

module.exports = new WhatsAppService();
