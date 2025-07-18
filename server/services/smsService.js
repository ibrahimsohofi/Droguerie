const axios = require('axios');
require('dotenv').config();

class SMSService {
  constructor() {
    // Moroccan SMS API Configuration (using popular providers)
    this.providers = {
      // Moroccan SMS provider 1 - InMobile (popular in Morocco)
      inmobile: {
        apiUrl: process.env.SMS_INMOBILE_URL || 'https://api.inmobile.ma/v1',
        apiKey: process.env.SMS_INMOBILE_KEY,
        sender: process.env.SMS_SENDER_NAME || 'DroguerieJamal'
      },
      // Moroccan SMS provider 2 - SMS Gateway Morocco
      smsgateway: {
        apiUrl: process.env.SMS_GATEWAY_URL || 'https://api.smsgateway.ma/v1',
        username: process.env.SMS_GATEWAY_USER,
        password: process.env.SMS_GATEWAY_PASS,
        sender: process.env.SMS_SENDER_NAME || 'DroguerieJamal'
      },
      // Fallback: Twilio (international)
      twilio: {
        accountSid: process.env.TWILIO_ACCOUNT_SID,
        authToken: process.env.TWILIO_AUTH_TOKEN,
        phoneNumber: process.env.TWILIO_PHONE_NUMBER
      }
    };

    // Check configuration
    this.isConfigured = this.checkConfiguration();

    if (!this.isConfigured) {
      console.log('📱 SMS service not configured - notifications will be logged only');
    } else {
      console.log('✅ SMS service configured successfully');
    }

    // Droguerie Jamal business info
    this.businessInfo = {
      name: 'دروغري جمال',
      nameEn: 'Droguerie Jamal',
      phone: '+212522123456',
      website: process.env.CORS_ORIGIN || 'drogueriejamal.ma'
    };
  }

  checkConfiguration() {
    return !!(
      this.providers.inmobile.apiKey ||
      this.providers.smsgateway.username ||
      this.providers.twilio.accountSid
    );
  }

  // Format Moroccan phone number
  formatMoroccanPhone(phoneNumber) {
    // Remove all non-digit characters
    const cleaned = phoneNumber.replace(/\D/g, '');

    // Add Morocco country code if not present
    if (cleaned.startsWith('212')) {
      return `+${cleaned}`;
    } else if (cleaned.startsWith('0')) {
      return `+212${cleaned.substring(1)}`;
    } else if (cleaned.length === 9) {
      return `+212${cleaned}`;
    }

    return `+212${cleaned}`;
  }

  // Send SMS using InMobile (Moroccan provider)
  async sendViaInMobile(phoneNumber, message) {
    try {
      const response = await axios.post(`${this.providers.inmobile.apiUrl}/sms/send`, {
        to: this.formatMoroccanPhone(phoneNumber),
        message: message,
        sender: this.providers.inmobile.sender
      }, {
        headers: {
          'Authorization': `Bearer ${this.providers.inmobile.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      return {
        success: true,
        provider: 'inmobile',
        messageId: response.data.messageId
      };
    } catch (error) {
      console.error('InMobile SMS error:', error);
      return { success: false, error: error.message };
    }
  }

  // Send SMS using SMS Gateway Morocco
  async sendViaSMSGateway(phoneNumber, message) {
    try {
      const response = await axios.post(`${this.providers.smsgateway.apiUrl}/send`, {
        recipients: [this.formatMoroccanPhone(phoneNumber)],
        message: message,
        sender: this.providers.smsgateway.sender
      }, {
        auth: {
          username: this.providers.smsgateway.username,
          password: this.providers.smsgateway.password
        }
      });

      return {
        success: true,
        provider: 'smsgateway',
        messageId: response.data.id
      };
    } catch (error) {
      console.error('SMS Gateway error:', error);
      return { success: false, error: error.message };
    }
  }

  // Send SMS using Twilio (fallback)
  async sendViaTwilio(phoneNumber, message) {
    try {
      const client = require('twilio')(
        this.providers.twilio.accountSid,
        this.providers.twilio.authToken
      );

      const sms = await client.messages.create({
        body: message,
        from: this.providers.twilio.phoneNumber,
        to: this.formatMoroccanPhone(phoneNumber)
      });

      return {
        success: true,
        provider: 'twilio',
        messageId: sms.sid
      };
    } catch (error) {
      console.error('Twilio SMS error:', error);
      return { success: false, error: error.message };
    }
  }

  // Main SMS sending method with provider fallback
  async sendSMS(phoneNumber, message, language = 'ar') {
    if (!phoneNumber || !message) {
      console.log('❌ SMS: Missing phone number or message');
      return { success: false, error: 'Missing phone number or message' };
    }

    // Log SMS attempt (always log for debugging)
    console.log(`📱 SMS to ${phoneNumber}: ${message.substring(0, 50)}...`);

    if (!this.isConfigured) {
      console.log('📱 SMS service not configured - message logged only');
      return { success: true, provider: 'logged', messageId: 'LOGGED' };
    }

    // Try providers in order of preference
    const providers = ['inmobile', 'smsgateway', 'twilio'];

    for (const provider of providers) {
      try {
        let result;

        switch (provider) {
          case 'inmobile':
            if (this.providers.inmobile.apiKey) {
              result = await this.sendViaInMobile(phoneNumber, message);
            }
            break;
          case 'smsgateway':
            if (this.providers.smsgateway.username) {
              result = await this.sendViaSMSGateway(phoneNumber, message);
            }
            break;
          case 'twilio':
            if (this.providers.twilio.accountSid) {
              result = await this.sendViaTwilio(phoneNumber, message);
            }
            break;
        }

        if (result && result.success) {
          console.log(`✅ SMS sent via ${provider}: ${result.messageId}`);
          return result;
        }
      } catch (error) {
        console.error(`❌ SMS provider ${provider} failed:`, error);
        continue;
      }
    }

    console.log('❌ All SMS providers failed - message logged only');
    return { success: true, provider: 'logged', messageId: 'LOGGED' };
  }

  // Order notification templates
  getOrderConfirmationSMS(orderData, language = 'ar') {
    const { orderId, customerName, total } = orderData;

    if (language === 'ar') {
      return `مرحباً ${customerName}! ✅
تم تأكيد طلبكم #${orderId}
المبلغ: ${total} درهم
سنتواصل معكم قريباً لتأكيد التوصيل.
${this.businessInfo.name}
${this.businessInfo.phone}`;
    } else {
      return `Bonjour ${customerName}! ✅
Votre commande #${orderId} est confirmée
Montant: ${total} MAD
Nous vous contacterons bientôt.
${this.businessInfo.nameEn}
${this.businessInfo.phone}`;
    }
  }

  getOrderStatusUpdateSMS(orderData, language = 'ar') {
    const { orderId, customerName, status, trackingNumber } = orderData;

    const statusTexts = {
      ar: {
        confirmed: 'تم تأكيد الطلب',
        processing: 'جاري تحضير الطلب',
        shipped: 'تم شحن الطلب',
        out_for_delivery: 'الطلب في طريقه إليكم',
        delivered: 'تم تسليم الطلب',
        cancelled: 'تم إلغاء الطلب'
      },
      fr: {
        confirmed: 'Commande confirmée',
        processing: 'Commande en préparation',
        shipped: 'Commande expédiée',
        out_for_delivery: 'Commande en livraison',
        delivered: 'Commande livrée',
        cancelled: 'Commande annulée'
      }
    };

    const statusText = statusTexts[language][status] || status;

    if (language === 'ar') {
      return `${customerName}، تحديث طلبكم #${orderId}:
📦 ${statusText}
${trackingNumber ? `رقم التتبع: ${trackingNumber}` : ''}
${this.businessInfo.name}`;
    } else {
      return `${customerName}, mise à jour commande #${orderId}:
📦 ${statusText}
${trackingNumber ? `Suivi: ${trackingNumber}` : ''}
${this.businessInfo.nameEn}`;
    }
  }

  getDeliveryNotificationSMS(orderData, language = 'ar') {
    const { orderId, customerName, estimatedDelivery } = orderData;

    if (language === 'ar') {
      return `${customerName}، طلبكم #${orderId} في الطريق! 🚚
${estimatedDelivery ? `الوصول المتوقع: ${estimatedDelivery}` : 'سيصل اليوم'}
تأكدوا من توفركم لاستلام الطلب.
${this.businessInfo.name}`;
    } else {
      return `${customerName}, votre commande #${orderId} arrive! 🚚
${estimatedDelivery ? `Livraison prévue: ${estimatedDelivery}` : 'Livraison aujourd\'hui'}
Assurez-vous d'être disponible.
${this.businessInfo.nameEn}`;
    }
  }
}

module.exports = new SMSService();
