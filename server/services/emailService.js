const nodemailer = require('nodemailer');
const path = require('path');
const fs = require('fs').promises;

class EmailService {
  constructor() {
    this.transporter = null;
    this.initialized = false;
    this.mockMode = false;
    this.initialize();
  }

  async initialize() {
    try {
      // Check if basic SMTP configuration exists
      if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
        console.log('⚠️ Email service running in MOCK MODE - SMTP credentials not configured');
        this.mockMode = true;
        this.initialized = true;
        return;
      }

      // Create transporter based on configuration
      this.transporter = await this.createTransporter();

      // Verify connection
      if (this.transporter) {
        await this.verifyConnection();
        this.initialized = true;
        this.mockMode = false;
        console.log('✅ Email service initialized successfully');
      }
    } catch (error) {
      console.log('⚠️ Email service falling back to MOCK MODE:', error.message);
      this.mockMode = true;
      this.initialized = true;
    }
  }

  async createTransporter() {
    // For development, use a test account if no real SMTP is configured
    if (process.env.NODE_ENV === 'development' &&
        (process.env.SMTP_PASS === 'dev_temp_pass_2024' ||
         process.env.SMTP_PASS === 'your_app_password_here')) {

      console.log('🔧 Creating test email account for development...');
      try {
        // Create a test account using Ethereal Email
        const testAccount = await nodemailer.createTestAccount();

        const testConfig = {
          host: 'smtp.ethereal.email',
          port: 587,
          secure: false,
          auth: {
            user: testAccount.user,
            pass: testAccount.pass,
          },
        };

        console.log('✅ Test email account created:', testAccount.user);
        console.log('📧 Preview emails at: https://ethereal.email');

        return nodemailer.createTransport(testConfig);
      } catch (error) {
        console.log('⚠️ Could not create test account, using console mock mode');
        return null;
      }
    }

    const config = {
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    };

    // Handle different email providers
    if (process.env.SMTP_HOST === 'smtp.gmail.com') {
      config.service = 'gmail';
      config.auth = {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      };
    } else if (process.env.SMTP_HOST === 'smtp.mailgun.org') {
      config.host = 'smtp.mailgun.org';
      config.port = 587;
      config.secure = false;
    } else if (process.env.SMTP_HOST === 'smtp.sendgrid.net') {
      config.host = 'smtp.sendgrid.net';
      config.port = 587;
      config.secure = false;
      config.auth = {
        user: 'apikey',
        pass: process.env.SMTP_PASS,
      };
    }

    return nodemailer.createTransport(config);
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

  // Mock email sending for development
  mockSendEmail(to, subject, content) {
    console.log('\n📧 ============= MOCK EMAIL =============');
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`Content: ${content.substring(0, 200)}...`);
    console.log('=====================================\n');

    return Promise.resolve({
      messageId: `mock-${Date.now()}@drogueriejamal.ma`,
      success: true,
      mock: true
    });
  }

  // Main send email method
  async sendEmail(to, subject, html, text = null) {
    try {
      if (!this.initialized) {
        await this.initialize();
      }

      // Use mock mode if SMTP is not configured
      if (this.mockMode) {
        return await this.mockSendEmail(to, subject, html);
      }

      const mailOptions = {
        from: process.env.SMTP_FROM || `"Droguerie Jamal" <${process.env.SMTP_USER}>`,
        to,
        subject,
        html,
        text: text || this.stripHtml(html)
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log('✅ Email sent successfully:', result.messageId);

      return {
        messageId: result.messageId,
        success: true,
        mock: false
      };
    } catch (error) {
      console.error('❌ Email sending failed:', error.message);

      // Fallback to mock mode on error
      console.log('📧 Falling back to mock email...');
      return await this.mockSendEmail(to, subject, html);
    }
  }

  // Strip HTML tags for text version
  stripHtml(html) {
    return html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
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

      // Email Verification Templates
      emailVerification: {
        ar: {
          subject: 'تفعيل حسابك - دروغيري جمال',
          html: this.getEmailVerificationTemplateAR(data),
          text: `مرحباً ${data.name || ''}، يرجى تفعيل حسابك بالنقر على الرابط: ${data.verificationUrl}`
        },
        fr: {
          subject: 'Vérification de votre compte - Droguerie Jamal',
          html: this.getEmailVerificationTemplateFR(data),
          text: `Bonjour ${data.name || ''}, veuillez vérifier votre compte en cliquant sur: ${data.verificationUrl}`
        },
        en: {
          subject: 'Verify Your Account - Droguerie Jamal',
          html: this.getEmailVerificationTemplateEN(data),
          text: `Hello ${data.name || ''}, please verify your account by clicking: ${data.verificationUrl}`
        }
      },

      // Password Reset Templates
      passwordReset: {
        ar: {
          subject: 'إعادة تعيين كلمة المرور - دروغيري جمال',
          html: this.getPasswordResetTemplateAR(data),
          text: `مرحباً، لإعادة تعيين كلمة المرور، انقر على: ${data.resetUrl}`
        },
        fr: {
          subject: 'Réinitialisation du mot de passe - Droguerie Jamal',
          html: this.getPasswordResetTemplateFR(data),
          text: `Bonjour, pour réinitialiser votre mot de passe, cliquez sur: ${data.resetUrl}`
        },
        en: {
          subject: 'Password Reset - Droguerie Jamal',
          html: this.getPasswordResetTemplateEN(data),
          text: `Hello, to reset your password, click on: ${data.resetUrl}`
        }
      }
    };

    return templates[type]?.[language] || templates[type]?.en || templates[type]?.ar;
  }

  // Arabic Order Confirmation Template
  getOrderConfirmationTemplateAR(data) {
    return `
      <div dir="rtl" style="font-family: 'Cairo', 'Amiri', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
        <div style="background: linear-gradient(135deg, #059669, #10b981); color: white; padding: 30px; text-align: center;">
          <h1 style="margin: 0; font-size: 28px; font-weight: bold;">دروغيري جمال</h1>
          <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">دروغيريتك المحلية الموثوقة</p>
        </div>

        <div style="padding: 30px;">
          <h2 style="color: #059669; margin-bottom: 20px;">تأكيد الطلب #${data.orderNumber}</h2>

          <p>مرحباً ${data.customerName || 'عميلنا الكريم'}،</p>
          <p>شكراً لك على طلبك من دروغيري جمال. تم استلام طلبك بنجاح وسنقوم بمعالجته قريباً.</p>

          <div style="background: #f8fafc; border-radius: 8px; padding: 20px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #374151;">تفاصيل الطلب:</h3>
            <p><strong>رقم الطلب:</strong> ${data.orderNumber}</p>
            <p><strong>تاريخ الطلب:</strong> ${new Date().toLocaleDateString('ar-MA')}</p>
            <p><strong>المجموع:</strong> ${data.total} د.م.</p>
          </div>

          <p>سنقوم بإشعارك عند شحن طلبك. شكراً لاختيارك دروغيري جمال!</p>
        </div>

        <div style="background: #f3f4f6; padding: 20px; text-align: center; font-size: 14px; color: #6b7280;">
          <p>دروغيري جمال - شارع الحسن الثاني، الدار البيضاء، المغرب</p>
          <p>+212 522 123 456 | contact@drogueriejamal.ma</p>
        </div>
      </div>
    `;
  }

  // Email Verification Template Arabic
  getEmailVerificationTemplateAR(data) {
    return `
      <div dir="rtl" style="font-family: 'Cairo', 'Amiri', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
        <div style="background: linear-gradient(135deg, #059669, #10b981); color: white; padding: 30px; text-align: center;">
          <h1 style="margin: 0; font-size: 28px; font-weight: bold;">دروغيري جمال</h1>
          <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">تفعيل حسابك</p>
        </div>

        <div style="padding: 30px;">
          <h2 style="color: #059669; margin-bottom: 20px;">مرحباً ${data.name || 'عميلنا الكريم'}!</h2>

          <p>شكراً لك لإنشاء حساب في دروغيري جمال. يرجى تفعيل حسابك بالنقر على الزر أدناه:</p>

          <div style="text-align: center; margin: 30px 0;">
            <a href="${data.verificationUrl}" style="background: #059669; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
              تفعيل الحساب
            </a>
          </div>

          <p style="font-size: 14px; color: #6b7280;">
            إذا لم تقم بإنشاء هذا الحساب، يرجى تجاهل هذا البريد الإلكتروني.
          </p>
        </div>

        <div style="background: #f3f4f6; padding: 20px; text-align: center; font-size: 14px; color: #6b7280;">
          <p>دروغيري جمال - شارع الحسن الثاني، الدار البيضاء، المغرب</p>
        </div>
      </div>
    `;
  }

  // Add placeholder methods for other templates
  getOrderConfirmationTemplateFR(data) { return `<h1>Commande confirmée #${data.orderNumber}</h1>`; }
  getOrderConfirmationTemplateEN(data) { return `<h1>Order confirmed #${data.orderNumber}</h1>`; }
  getEmailVerificationTemplateFR(data) { return `<h1>Vérifiez votre compte</h1><a href="${data.verificationUrl}">Vérifier</a>`; }
  getEmailVerificationTemplateEN(data) { return `<h1>Verify Your Account</h1><a href="${data.verificationUrl}">Verify</a>`; }
  getPasswordResetTemplateAR(data) { return `<h1>إعادة تعيين كلمة المرور</h1><a href="${data.resetUrl}">إعادة تعيين</a>`; }
  getPasswordResetTemplateFR(data) { return `<h1>Réinitialiser le mot de passe</h1><a href="${data.resetUrl}">Réinitialiser</a>`; }
  getPasswordResetTemplateEN(data) { return `<h1>Reset Password</h1><a href="${data.resetUrl}">Reset</a>`; }

  // Convenience methods for common email types
  async sendOrderConfirmation(to, orderData, language = 'ar') {
    const template = this.getEmailTemplate('orderConfirmation', language, orderData);
    return await this.sendEmail(to, template.subject, template.html, template.text);
  }

  async sendEmailVerification(to, verificationData, language = 'ar') {
    const template = this.getEmailTemplate('emailVerification', language, verificationData);
    return await this.sendEmail(to, template.subject, template.html, template.text);
  }

  async sendPasswordReset(to, resetData, language = 'ar') {
    const template = this.getEmailTemplate('passwordReset', language, resetData);
    return await this.sendEmail(to, template.subject, template.html, template.text);
  }
}

// Create and export a singleton instance
const emailService = new EmailService();

// Export convenience functions
module.exports = {
  emailService,
  sendEmail: (to, subject, html, text) => emailService.sendEmail(to, subject, html, text),
  sendOrderConfirmation: (to, orderData, language) => emailService.sendOrderConfirmation(to, orderData, language),
  sendEmailVerification: (to, verificationData, language) => emailService.sendEmailVerification(to, verificationData, language),
  sendPasswordReset: (to, resetData, language) => emailService.sendPasswordReset(to, resetData, language),
  sendVerificationEmail: (to, verificationData, language) => emailService.sendEmailVerification(to, verificationData, language),
};
