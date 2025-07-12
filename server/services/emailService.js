const nodemailer = require('nodemailer');
const path = require('path');
const fs = require('fs').promises;

class EmailService {
  constructor() {
    this.transporter = null;
    this.initialized = false;
    this.initialize();
  }

  async initialize() {
    try {
      // Create transporter based on configuration
      this.transporter = await this.createTransporter();

      // Verify connection
      if (this.transporter) {
        await this.verifyConnection();
        this.initialized = true;
        console.log('✅ Email service initialized successfully');
      }
    } catch (error) {
      console.log('⚠️ Email service not configured:', error.message);
      this.initialized = false;
    }
  }

  async createTransporter() {
    const config = {
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    };

    // Handle different email providers
    if (process.env.SMTP_HOST === 'smtp.gmail.com') {
      // Gmail specific configuration
      config.service = 'gmail';
      config.auth = {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS, // Use App Password for Gmail
      };
    } else if (process.env.SMTP_HOST === 'smtp.mailgun.org') {
      // Mailgun configuration
      config.host = 'smtp.mailgun.org';
      config.port = 587;
      config.secure = false;
    } else if (process.env.SMTP_HOST === 'smtp.sendgrid.net') {
      // SendGrid configuration
      config.host = 'smtp.sendgrid.net';
      config.port = 587;
      config.secure = false;
      config.auth = {
        user: 'apikey',
        pass: process.env.SMTP_PASS, // SendGrid API key
      };
    }

    return nodemailer.createTransporter(config);
  }

  async verifyConnection() {
    if (!this.transporter) {
      throw new Error('Transporter not initialized');
    }

    return new Promise((resolve, reject) => {
      this.transporter.verify((error, success) => {
        if (error) {
          console.log('❌ SMTP connection failed:', error.message);
          reject(error);
        } else {
          console.log('✅ SMTP connection verified successfully');
          resolve(success);
        }
      });
    });
  }

  // Get email template based on language and type
  getEmailTemplate(type, language = 'en', data = {}) {
    const templates = {
      // Order Confirmation Templates
      orderConfirmation: {
        ar: {
          subject: `تأكيد الطلب #${data.orderNumber} - دروغيري جمال`,
          html: this.getOrderConfirmationTemplateAR(data),
          text: `شكراً لك على طلبك #${data.orderNumber}. سنقوم بمعالجة طلبك قريباً.`
        },
        fr: {
          subject: `Confirmation de commande #${data.orderNumber} - Droguerie Jamal`,
          html: this.getOrderConfirmationTemplateFR(data),
          text: `Merci pour votre commande #${data.orderNumber}. Nous traiterons votre commande bientôt.`
        },
        en: {
          subject: `Order Confirmation #${data.orderNumber} - Droguerie Jamal`,
          html: this.getOrderConfirmationTemplateEN(data),
          text: `Thank you for your order #${data.orderNumber}. We will process your order soon.`
        }
      },

      // Welcome Email Templates
      welcome: {
        ar: {
          subject: 'مرحباً بك في دروغيري جمال - متجر المنزل الموثوق',
          html: this.getWelcomeTemplateAR(data),
          text: `مرحباً ${data.name}، أهلاً بك في دروغيري جمال!`
        },
        fr: {
          subject: 'Bienvenue chez Droguerie Jamal - Votre droguerie de confiance',
          html: this.getWelcomeTemplateFR(data),
          text: `Bonjour ${data.name}, bienvenue chez Droguerie Jamal!`
        },
        en: {
          subject: 'Welcome to Droguerie Jamal - Your Trusted Home Store',
          html: this.getWelcomeTemplateEN(data),
          text: `Hello ${data.name}, welcome to Droguerie Jamal!`
        }
      },

      // Password Reset Templates
      passwordReset: {
        ar: {
          subject: 'إعادة تعيين كلمة المرور - دروغيري جمال',
          html: this.getPasswordResetTemplateAR(data),
          text: `استخدم هذا الرمز لإعادة تعيين كلمة المرور: ${data.resetCode}`
        },
        fr: {
          subject: 'Réinitialisation du mot de passe - Droguerie Jamal',
          html: this.getPasswordResetTemplateFR(data),
          text: `Utilisez ce code pour réinitialiser votre mot de passe: ${data.resetCode}`
        },
        en: {
          subject: 'Password Reset - Droguerie Jamal',
          html: this.getPasswordResetTemplateEN(data),
          text: `Use this code to reset your password: ${data.resetCode}`
        }
      }
    };

    return templates[type]?.[language] || templates[type]?.en;
  }

  // Order Confirmation Template - Arabic
  getOrderConfirmationTemplateAR(data) {
    return `
    <!DOCTYPE html>
    <html dir="rtl" lang="ar">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>تأكيد الطلب</title>
        <style>
            body { font-family: 'Cairo', Arial, sans-serif; background-color: #f9fafb; margin: 0; padding: 20px; }
            .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
            .header { background: linear-gradient(135deg, #0f766e, #059669); color: white; padding: 30px; text-align: center; }
            .content { padding: 30px; }
            .order-summary { background: #f0fdfa; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .footer { background: #f3f4f6; padding: 20px; text-align: center; font-size: 14px; color: #6b7280; }
            .btn { display: inline-block; background: #0f766e; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🛍️ دروغيري جمال</h1>
                <h2>تأكيد طلبك #${data.orderNumber}</h2>
            </div>
            <div class="content">
                <p>عزيزي/عزيزتي ${data.customerName},</p>
                <p>شكراً لك على ثقتك في دروغيري جمال. تم استلام طلبك بنجاح وسنقوم بمعالجته قريباً.</p>

                <div class="order-summary">
                    <h3>ملخص الطلب:</h3>
                    <p><strong>رقم الطلب:</strong> #${data.orderNumber}</p>
                    <p><strong>تاريخ الطلب:</strong> ${new Date().toLocaleDateString('ar-MA')}</p>
                    <p><strong>المبلغ الإجمالي:</strong> ${data.totalAmount} درهم</p>
                    <p><strong>طريقة الدفع:</strong> ${data.paymentMethod}</p>
                    <p><strong>عنوان التوصيل:</strong> ${data.shippingAddress}</p>
                </div>

                <p>سيتم التواصل معك قريباً لتأكيد موعد التوصيل.</p>

                <div style="text-align: center; margin: 30px 0;">
                    <a href="${process.env.BUSINESS_WEBSITE}/orders/${data.orderNumber}" class="btn">تتبع طلبك</a>
                </div>

                <p>إذا كان لديك أي استفسار، لا تتردد في التواصل معنا:</p>
                <p>📞 ${process.env.BUSINESS_PHONE}</p>
                <p>📧 ${process.env.ORDERS_EMAIL}</p>
                <p>💬 واتساب: ${process.env.WHATSAPP_BUSINESS_PHONE}</p>
            </div>
            <div class="footer">
                <p>دروغيري جمال - متجر المنزل الموثوق</p>
                <p>${process.env.BUSINESS_ADDRESS_AR}</p>
            </div>
        </div>
    </body>
    </html>
    `;
  }

  // Order Confirmation Template - French
  getOrderConfirmationTemplateFR(data) {
    return `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Confirmation de commande</title>
        <style>
            body { font-family: 'Inter', Arial, sans-serif; background-color: #f9fafb; margin: 0; padding: 20px; }
            .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
            .header { background: linear-gradient(135deg, #0f766e, #059669); color: white; padding: 30px; text-align: center; }
            .content { padding: 30px; }
            .order-summary { background: #f0fdfa; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .footer { background: #f3f4f6; padding: 20px; text-align: center; font-size: 14px; color: #6b7280; }
            .btn { display: inline-block; background: #0f766e; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🛍️ Droguerie Jamal</h1>
                <h2>Confirmation de votre commande #${data.orderNumber}</h2>
            </div>
            <div class="content">
                <p>Cher(e) ${data.customerName},</p>
                <p>Merci de votre confiance en Droguerie Jamal. Votre commande a été reçue avec succès et sera traitée prochainement.</p>

                <div class="order-summary">
                    <h3>Résumé de la commande:</h3>
                    <p><strong>Numéro de commande:</strong> #${data.orderNumber}</p>
                    <p><strong>Date de commande:</strong> ${new Date().toLocaleDateString('fr-FR')}</p>
                    <p><strong>Montant total:</strong> ${data.totalAmount} DH</p>
                    <p><strong>Mode de paiement:</strong> ${data.paymentMethod}</p>
                    <p><strong>Adresse de livraison:</strong> ${data.shippingAddress}</p>
                </div>

                <p>Nous vous contacterons bientôt pour confirmer l'heure de livraison.</p>

                <div style="text-align: center; margin: 30px 0;">
                    <a href="${process.env.BUSINESS_WEBSITE}/orders/${data.orderNumber}" class="btn">Suivre votre commande</a>
                </div>

                <p>Si vous avez des questions, n'hésitez pas à nous contacter:</p>
                <p>📞 ${process.env.BUSINESS_PHONE}</p>
                <p>📧 ${process.env.ORDERS_EMAIL}</p>
                <p>💬 WhatsApp: ${process.env.WHATSAPP_BUSINESS_PHONE}</p>
            </div>
            <div class="footer">
                <p>Droguerie Jamal - Votre droguerie de confiance</p>
                <p>${process.env.BUSINESS_ADDRESS}</p>
            </div>
        </div>
    </body>
    </html>
    `;
  }

  // Order Confirmation Template - English
  getOrderConfirmationTemplateEN(data) {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Order Confirmation</title>
        <style>
            body { font-family: 'Inter', Arial, sans-serif; background-color: #f9fafb; margin: 0; padding: 20px; }
            .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
            .header { background: linear-gradient(135deg, #0f766e, #059669); color: white; padding: 30px; text-align: center; }
            .content { padding: 30px; }
            .order-summary { background: #f0fdfa; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .footer { background: #f3f4f6; padding: 20px; text-align: center; font-size: 14px; color: #6b7280; }
            .btn { display: inline-block; background: #0f766e; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🛍️ Droguerie Jamal</h1>
                <h2>Order Confirmation #${data.orderNumber}</h2>
            </div>
            <div class="content">
                <p>Dear ${data.customerName},</p>
                <p>Thank you for your trust in Droguerie Jamal. Your order has been received successfully and will be processed soon.</p>

                <div class="order-summary">
                    <h3>Order Summary:</h3>
                    <p><strong>Order Number:</strong> #${data.orderNumber}</p>
                    <p><strong>Order Date:</strong> ${new Date().toLocaleDateString('en-US')}</p>
                    <p><strong>Total Amount:</strong> ${data.totalAmount} MAD</p>
                    <p><strong>Payment Method:</strong> ${data.paymentMethod}</p>
                    <p><strong>Shipping Address:</strong> ${data.shippingAddress}</p>
                </div>

                <p>We will contact you soon to confirm the delivery time.</p>

                <div style="text-align: center; margin: 30px 0;">
                    <a href="${process.env.BUSINESS_WEBSITE}/orders/${data.orderNumber}" class="btn">Track Your Order</a>
                </div>

                <p>If you have any questions, please don't hesitate to contact us:</p>
                <p>📞 ${process.env.BUSINESS_PHONE}</p>
                <p>📧 ${process.env.ORDERS_EMAIL}</p>
                <p>💬 WhatsApp: ${process.env.WHATSAPP_BUSINESS_PHONE}</p>
            </div>
            <div class="footer">
                <p>Droguerie Jamal - Your Trusted Home Store</p>
                <p>${process.env.BUSINESS_ADDRESS}</p>
            </div>
        </div>
    </body>
    </html>
    `;
  }

  // Welcome Template - Arabic
  getWelcomeTemplateAR(data) {
    return `
    <!DOCTYPE html>
    <html dir="rtl" lang="ar">
    <head>
        <meta charset="UTF-8">
        <style>
            body { font-family: 'Cairo', Arial, sans-serif; background-color: #f9fafb; margin: 0; padding: 20px; }
            .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
            .header { background: linear-gradient(135deg, #0f766e, #c2410c); color: white; padding: 30px; text-align: center; }
            .content { padding: 30px; }
            .features { background: #f0fdfa; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .footer { background: #f3f4f6; padding: 20px; text-align: center; font-size: 14px; color: #6b7280; }
            .btn { display: inline-block; background: #c2410c; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🎉 أهلاً وسهلاً</h1>
                <h2>مرحباً بك في دروغيري جمال</h2>
            </div>
            <div class="content">
                <p>عزيزي/عزيزتي ${data.name},</p>
                <p>أهلاً وسهلاً بك في عائلة دروغيري جمال! نحن سعداء لانضمامك إلينا.</p>

                <div class="features">
                    <h3>ما يميزنا:</h3>
                    <ul>
                        <li>🚚 توصيل سريع في جميع أنحاء المغرب</li>
                        <li>💳 طرق دفع متنوعة وآمنة</li>
                        <li>🛡️ ضمان الجودة على جميع المنتجات</li>
                        <li>📞 خدمة عملاء متاحة 24/7</li>
                        <li>💰 أسعار تنافسية وعروض حصرية</li>
                    </ul>
                </div>

                <div style="text-align: center; margin: 30px 0;">
                    <a href="${process.env.BUSINESS_WEBSITE}" class="btn">ابدأ التسوق الآن</a>
                </div>

                <p>تابعنا على وسائل التواصل الاجتماعي للحصول على آخر العروض والمنتجات الجديدة.</p>
            </div>
            <div class="footer">
                <p>دروغيري جمال - متجر المنزل الموثوق منذ 2009</p>
            </div>
        </div>
    </body>
    </html>
    `;
  }

  // Password Reset Templates (simplified for brevity)
  getPasswordResetTemplateAR(data) {
    return `
    <div style="font-family: Cairo, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2>إعادة تعيين كلمة المرور</h2>
        <p>مرحباً ${data.name},</p>
        <p>استخدم الرمز التالي لإعادة تعيين كلمة المرور:</p>
        <div style="background: #f0fdfa; padding: 20px; text-align: center; font-size: 24px; font-weight: bold; border-radius: 8px;">
            ${data.resetCode}
        </div>
        <p>هذا الرمز صالح لمدة ساعة واحدة فقط.</p>
    </div>
    `;
  }

  getPasswordResetTemplateFR(data) {
    return `
    <div style="font-family: Inter, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2>Réinitialisation du mot de passe</h2>
        <p>Bonjour ${data.name},</p>
        <p>Utilisez le code suivant pour réinitialiser votre mot de passe:</p>
        <div style="background: #f0fdfa; padding: 20px; text-align: center; font-size: 24px; font-weight: bold; border-radius: 8px;">
            ${data.resetCode}
        </div>
        <p>Ce code est valide pendant une heure seulement.</p>
    </div>
    `;
  }

  getPasswordResetTemplateEN(data) {
    return `
    <div style="font-family: Inter, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2>Password Reset</h2>
        <p>Hello ${data.name},</p>
        <p>Use the following code to reset your password:</p>
        <div style="background: #f0fdfa; padding: 20px; text-align: center; font-size: 24px; font-weight: bold; border-radius: 8px;">
            ${data.resetCode}
        </div>
        <p>This code is valid for one hour only.</p>
    </div>
    `;
  }

  // Welcome templates for other languages (simplified)
  getWelcomeTemplateFR(data) {
    return `<div style="font-family: Inter, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1>🎉 Bienvenue chez Droguerie Jamal!</h1>
        <p>Bonjour ${data.name}, merci de nous avoir rejoint!</p>
    </div>`;
  }

  getWelcomeTemplateEN(data) {
    return `<div style="font-family: Inter, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1>🎉 Welcome to Droguerie Jamal!</h1>
        <p>Hello ${data.name}, thank you for joining us!</p>
    </div>`;
  }

  // Main send email function
  async sendEmail({ to, type, language = 'en', data = {} }) {
    if (!this.initialized) {
      console.log('⚠️ Email service not initialized, logging email instead:');
      console.log(`To: ${to}, Type: ${type}, Language: ${language}`);
      return { success: false, message: 'Email service not configured' };
    }

    try {
      const template = this.getEmailTemplate(type, language, data);

      if (!template) {
        throw new Error(`Template not found for type: ${type}, language: ${language}`);
      }

      const mailOptions = {
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        to: to,
        subject: template.subject,
        text: template.text,
        html: template.html,
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log('✅ Email sent successfully:', result.messageId);

      return {
        success: true,
        messageId: result.messageId,
        message: 'Email sent successfully'
      };
    } catch (error) {
      console.error('❌ Failed to send email:', error.message);

      return {
        success: false,
        error: error.message,
        message: 'Failed to send email'
      };
    }
  }

  // Convenience methods for specific email types
  async sendOrderConfirmation(customerEmail, orderData, language = 'en') {
    return this.sendEmail({
      to: customerEmail,
      type: 'orderConfirmation',
      language,
      data: orderData
    });
  }

  async sendWelcomeEmail(customerEmail, userData, language = 'en') {
    return this.sendEmail({
      to: customerEmail,
      type: 'welcome',
      language,
      data: userData
    });
  }

  async sendPasswordReset(customerEmail, resetData, language = 'en') {
    return this.sendEmail({
      to: customerEmail,
      type: 'passwordReset',
      language,
      data: resetData
    });
  }
}

// Export singleton instance
const emailService = new EmailService();
module.exports = emailService;
