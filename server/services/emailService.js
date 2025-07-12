const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

class EmailService {
  constructor() {
    this.transporter = null;
    this.isConfigured = false;
    this.init();
  }

  async init() {
    try {
      // Create transporter based on environment
      if (process.env.NODE_ENV === 'production') {
        // Production SMTP configuration
        this.transporter = nodemailer.createTransporter({
          host: process.env.SMTP_HOST,
          port: process.env.SMTP_PORT,
          secure: process.env.SMTP_SECURE === 'true',
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
          }
        });
      } else {
        // Development: Use Ethereal for testing
        try {
          // Try to use configured SMTP first
          if (process.env.SMTP_USER && process.env.SMTP_PASS) {
            this.transporter = nodemailer.createTransporter({
              host: process.env.SMTP_HOST || 'smtp.gmail.com',
              port: process.env.SMTP_PORT || 587,
              secure: false,
              auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
              }
            });
          } else {
            // Fallback to Ethereal for testing
            const testAccount = await nodemailer.createTestAccount();
            this.transporter = nodemailer.createTransporter({
              host: 'smtp.ethereal.email',
              port: 587,
              secure: false,
              auth: {
                user: testAccount.user,
                pass: testAccount.pass
              }
            });
            console.log('📧 Using Ethereal test email service');
            console.log('📧 Test email account:', testAccount.user);
          }
        } catch (error) {
          console.warn('⚠️ Email service not configured, emails will be logged only');
          this.transporter = null;
        }
      }

      // Verify connection
      if (this.transporter) {
        await this.transporter.verify();
        this.isConfigured = true;
        console.log('✅ Email service configured successfully');
      }
    } catch (error) {
      console.warn('⚠️ Email service configuration failed:', error.message);
      this.isConfigured = false;
    }
  }

  // Email templates
  getEmailTemplate(type, data) {
    const templates = {
      welcome: {
        subject: {
          ar: 'مرحباً بك في دروغيري جمال',
          fr: 'Bienvenue chez Droguerie Jamal',
          en: 'Welcome to Droguerie Jamal'
        },
        html: `
          <div dir="${data.language === 'ar' ? 'rtl' : 'ltr'}" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: #059669; color: white; padding: 20px; text-align: center;">
              <h1 style="margin: 0;">${data.language === 'ar' ? 'دروغيري جمال' : 'Droguerie Jamal'}</h1>
              <p style="margin: 10px 0 0 0; opacity: 0.9;">
                ${data.language === 'ar' ? 'دروغيريتك المحلية الموثوقة' :
                  data.language === 'fr' ? 'Votre droguerie locale de confiance' :
                  'Your trusted neighborhood droguerie'}
              </p>
            </div>
            <div style="padding: 20px;">
              <h2 style="color: #059669;">
                ${data.language === 'ar' ? `مرحباً ${data.name}!` :
                  data.language === 'fr' ? `Bonjour ${data.name}!` :
                  `Hello ${data.name}!`}
              </h2>
              <p>
                ${data.language === 'ar' ? 'شكراً لتسجيلك في دروغيري جمال. نحن متحمسون لخدمتك!' :
                  data.language === 'fr' ? 'Merci de vous être inscrit chez Droguerie Jamal. Nous sommes ravis de vous servir!' :
                  'Thank you for registering with Droguerie Jamal. We\'re excited to serve you!'}
              </p>
              <div style="background: #f0f9f5; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #059669; margin-top: 0;">
                  ${data.language === 'ar' ? 'ما يمكنك فعله الآن:' :
                    data.language === 'fr' ? 'Ce que vous pouvez faire maintenant:' :
                    'What you can do now:'}
                </h3>
                <ul style="margin: 0; padding-${data.language === 'ar' ? 'right' : 'left'}: 20px;">
                  <li>${data.language === 'ar' ? 'تصفح منتجاتنا المتنوعة' :
                       data.language === 'fr' ? 'Parcourir nos produits variés' :
                       'Browse our diverse products'}</li>
                  <li>${data.language === 'ar' ? 'إضافة العناصر إلى قائمة الرغبات' :
                       data.language === 'fr' ? 'Ajouter des articles à votre liste de souhaits' :
                       'Add items to your wishlist'}</li>
                  <li>${data.language === 'ar' ? 'تتبع طلباتك' :
                       data.language === 'fr' ? 'Suivre vos commandes' :
                       'Track your orders'}</li>
                </ul>
              </div>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${data.loginUrl}" style="background: #059669; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block;">
                  ${data.language === 'ar' ? 'تسجيل الدخول الآن' :
                    data.language === 'fr' ? 'Se connecter maintenant' :
                    'Login Now'}
                </a>
              </div>
            </div>
            <div style="background: #f8f9fa; padding: 15px; text-align: center; font-size: 14px; color: #666;">
              <p style="margin: 0;">
                ${data.language === 'ar' ? 'شكراً لاختيارك دروغيري جمال' :
                  data.language === 'fr' ? 'Merci d\'avoir choisi Droguerie Jamal' :
                  'Thank you for choosing Droguerie Jamal'}
              </p>
              <p style="margin: 5px 0 0 0;">
                📞 ${process.env.BUSINESS_PHONE || '+212 522 123 456'} |
                📧 ${process.env.BUSINESS_EMAIL || 'contact@drogueriejamal.ma'}
              </p>
            </div>
          </div>
        `
      },

      orderConfirmation: {
        subject: {
          ar: `تأكيد الطلب #${data.orderNumber}`,
          fr: `Confirmation de commande #${data.orderNumber}`,
          en: `Order Confirmation #${data.orderNumber}`
        },
        html: `
          <div dir="${data.language === 'ar' ? 'rtl' : 'ltr'}" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: #059669; color: white; padding: 20px; text-align: center;">
              <h1 style="margin: 0;">${data.language === 'ar' ? 'تأكيد الطلب' : data.language === 'fr' ? 'Confirmation de commande' : 'Order Confirmation'}</h1>
              <p style="margin: 10px 0 0 0; opacity: 0.9;">
                ${data.language === 'ar' ? `رقم الطلب: #${data.orderNumber}` :
                  data.language === 'fr' ? `Numéro de commande: #${data.orderNumber}` :
                  `Order Number: #${data.orderNumber}`}
              </p>
            </div>
            <div style="padding: 20px;">
              <h2 style="color: #059669;">
                ${data.language === 'ar' ? `مرحباً ${data.customerName}` :
                  data.language === 'fr' ? `Bonjour ${data.customerName}` :
                  `Hello ${data.customerName}`}
              </h2>
              <p>
                ${data.language === 'ar' ? 'شكراً لطلبك من دروغيري جمال. تم استلام طلبك وسيتم تجهيزه قريباً.' :
                  data.language === 'fr' ? 'Merci pour votre commande chez Droguerie Jamal. Votre commande a été reçue et sera bientôt préparée.' :
                  'Thank you for your order from Droguerie Jamal. Your order has been received and will be processed soon.'}
              </p>

              <div style="background: #f0f9f5; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #059669; margin-top: 0;">
                  ${data.language === 'ar' ? 'تفاصيل الطلب:' :
                    data.language === 'fr' ? 'Détails de la commande:' :
                    'Order Details:'}
                </h3>
                <p><strong>${data.language === 'ar' ? 'المجموع:' : data.language === 'fr' ? 'Total:' : 'Total:'}</strong> ${data.total} ${data.language === 'ar' ? 'درهم' : 'MAD'}</p>
                <p><strong>${data.language === 'ar' ? 'طريقة الدفع:' : data.language === 'fr' ? 'Méthode de paiement:' : 'Payment Method:'}</strong> ${data.paymentMethod}</p>
                <p><strong>${data.language === 'ar' ? 'التوصيل المتوقع:' : data.language === 'fr' ? 'Livraison prévue:' : 'Expected Delivery:'}</strong> ${data.estimatedDelivery}</p>
              </div>

              <div style="text-align: center; margin: 30px 0;">
                <a href="${data.trackingUrl}" style="background: #059669; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block;">
                  ${data.language === 'ar' ? 'تتبع الطلب' :
                    data.language === 'fr' ? 'Suivre la commande' :
                    'Track Order'}
                </a>
              </div>
            </div>
            <div style="background: #f8f9fa; padding: 15px; text-align: center; font-size: 14px; color: #666;">
              <p style="margin: 0;">
                ${data.language === 'ar' ? 'شكراً لاختيارك دروغيري جمال' :
                  data.language === 'fr' ? 'Merci d\'avoir choisi Droguerie Jamal' :
                  'Thank you for choosing Droguerie Jamal'}
              </p>
            </div>
          </div>
        `
      },

      passwordReset: {
        subject: {
          ar: 'إعادة تعيين كلمة المرور - دروغيري جمال',
          fr: 'Réinitialisation du mot de passe - Droguerie Jamal',
          en: 'Password Reset - Droguerie Jamal'
        },
        html: `
          <div dir="${data.language === 'ar' ? 'rtl' : 'ltr'}" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: #059669; color: white; padding: 20px; text-align: center;">
              <h1 style="margin: 0;">${data.language === 'ar' ? 'إعادة تعيين كلمة المرور' : data.language === 'fr' ? 'Réinitialisation du mot de passe' : 'Password Reset'}</h1>
            </div>
            <div style="padding: 20px;">
              <p>
                ${data.language === 'ar' ? 'تم طلب إعادة تعيين كلمة المرور لحسابك. انقر على الرابط أدناه لإعادة تعيين كلمة المرور:' :
                  data.language === 'fr' ? 'Une réinitialisation du mot de passe a été demandée pour votre compte. Cliquez sur le lien ci-dessous pour réinitialiser votre mot de passe:' :
                  'A password reset was requested for your account. Click the link below to reset your password:'}
              </p>

              <div style="text-align: center; margin: 30px 0;">
                <a href="${data.resetUrl}" style="background: #059669; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block;">
                  ${data.language === 'ar' ? 'إعادة تعيين كلمة المرور' :
                    data.language === 'fr' ? 'Réinitialiser le mot de passe' :
                    'Reset Password'}
                </a>
              </div>

              <p style="font-size: 14px; color: #666;">
                ${data.language === 'ar' ? 'هذا الرابط صالح لمدة 24 ساعة فقط. إذا لم تطلب إعادة تعيين كلمة المرور، يمكنك تجاهل هذا البريد الإلكتروني.' :
                  data.language === 'fr' ? 'Ce lien est valide pendant 24 heures seulement. Si vous n\'avez pas demandé de réinitialisation de mot de passe, vous pouvez ignorer cet email.' :
                  'This link is valid for 24 hours only. If you didn\'t request a password reset, you can ignore this email.'}
              </p>
            </div>
          </div>
        `
      }
    };

    return templates[type] || null;
  }

  async sendEmail(type, to, data) {
    try {
      if (!this.isConfigured) {
        console.log(`📧 [EMAIL SIMULATION] ${type} email to ${to}:`, data);
        return { success: true, messageId: 'simulated', preview: null };
      }

      const template = this.getEmailTemplate(type, data);
      if (!template) {
        throw new Error(`Email template '${type}' not found`);
      }

      const language = data.language || 'en';
      const mailOptions = {
        from: process.env.SMTP_FROM || '"Droguerie Jamal" <contact@drogueriejamal.ma>',
        to: to,
        subject: template.subject[language] || template.subject.en,
        html: template.html
      };

      const info = await this.transporter.sendMail(mailOptions);

      // Log preview URL for Ethereal
      let previewUrl = null;
      if (process.env.NODE_ENV !== 'production') {
        previewUrl = nodemailer.getTestMessageUrl(info);
        if (previewUrl) {
          console.log(`📧 Email preview: ${previewUrl}`);
        }
      }

      console.log(`✅ Email sent successfully: ${info.messageId}`);
      return { success: true, messageId: info.messageId, preview: previewUrl };

    } catch (error) {
      console.error(`❌ Failed to send ${type} email to ${to}:`, error.message);
      return { success: false, error: error.message };
    }
  }

  // Convenience methods
  async sendWelcomeEmail(userEmail, userData) {
    return this.sendEmail('welcome', userEmail, {
      name: userData.name,
      language: userData.language || 'en',
      loginUrl: `${process.env.API_BASE_URL || 'http://localhost:5173'}/login`
    });
  }

  async sendOrderConfirmation(userEmail, orderData) {
    return this.sendEmail('orderConfirmation', userEmail, {
      customerName: orderData.customerName,
      orderNumber: orderData.orderNumber,
      total: orderData.total,
      paymentMethod: orderData.paymentMethod,
      estimatedDelivery: orderData.estimatedDelivery,
      language: orderData.language || 'en',
      trackingUrl: `${process.env.API_BASE_URL || 'http://localhost:5173'}/order-tracking/${orderData.orderNumber}`
    });
  }

  async sendPasswordReset(userEmail, resetData) {
    return this.sendEmail('passwordReset', userEmail, {
      language: resetData.language || 'en',
      resetUrl: resetData.resetUrl
    });
  }

  // Test email functionality
  async sendTestEmail(to) {
    return this.sendEmail('welcome', to, {
      name: 'Test User',
      language: 'en',
      loginUrl: 'http://localhost:5173/login'
    });
  }
}

module.exports = new EmailService();
