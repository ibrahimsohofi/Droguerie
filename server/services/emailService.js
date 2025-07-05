const nodemailer = require('nodemailer');
require('dotenv').config();

class EmailService {
  constructor() {
    this.transporter = this.createTransporter();
  }

  createTransporter() {
    // Check if SMTP credentials are configured
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.log('📧 Email service disabled - SMTP credentials not configured');
      return null;
    }

    try {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: process.env.SMTP_PORT || 587,
        secure: process.env.SMTP_SECURE === 'true' || false,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        }
      });

      console.log('✅ Email service configured successfully');
      return transporter;
    } catch (error) {
      console.error('❌ Error configuring email service:', error);
      return null;
    }
  }

  // Email Templates
  getWelcomeEmailTemplate(userData) {
    return {
      subject: 'مرحباً بك في دروغري جمال - Welcome to Droguerie Jamal',
      html: `
        <!DOCTYPE html>
        <html dir="rtl" lang="ar">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>مرحباً بك في دروغري جمال</title>
          <style>
            body { font-family: 'Arial', 'Segoe UI', sans-serif; margin: 0; padding: 0; background-color: #f4f4f4; }
            .container { max-width: 600px; margin: 0 auto; background-color: white; }
            .header { background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); color: white; padding: 30px; text-align: center; }
            .logo { font-size: 28px; font-weight: bold; margin-bottom: 10px; }
            .content { padding: 30px; }
            .welcome-box { background-color: #eff6ff; border-left: 4px solid #3b82f6; padding: 20px; margin: 20px 0; }
            .button { display: inline-block; background-color: #f97316; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
            .footer { background-color: #1e40af; color: white; padding: 20px; text-align: center; font-size: 14px; }
            .social-links { margin: 15px 0; }
            .social-links a { color: white; text-decoration: none; margin: 0 10px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">🏪 دروغري جمال</div>
              <div>متجركم المفضل لجميع احتياجات المنزل والعناية الشخصية</div>
            </div>

            <div class="content">
              <h2>مرحباً ${userData.username}! 🎉</h2>

              <div class="welcome-box">
                <p><strong>أهلاً وسهلاً بك في عائلة دروغري جمال!</strong></p>
                <p>نحن سعداء لانضمامك إلينا. يمكنك الآن الاستفادة من:</p>
                <ul>
                  <li>✅ أكثر من 500 منتج عالي الجودة</li>
                  <li>✅ توصيل سريع لجميع أنحاء المغرب</li>
                  <li>✅ أسعار تنافسية وعروض حصرية</li>
                  <li>✅ خدمة عملاء متميزة</li>
                </ul>
              </div>

              <p>بيانات حسابك:</p>
              <ul>
                <li><strong>الاسم:</strong> ${userData.username}</li>
                <li><strong>البريد الإلكتروني:</strong> ${userData.email}</li>
                <li><strong>تاريخ التسجيل:</strong> ${new Date().toLocaleDateString('ar-MA')}</li>
              </ul>

              <div style="text-align: center;">
                <a href="${process.env.CORS_ORIGIN || 'http://localhost:5173'}" class="button">
                  🛒 ابدأ التسوق الآن
                </a>
              </div>

              <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">

              <h3>🏪 معلومات التواصل</h3>
              <p>
                📍 <strong>العنوان:</strong> شارع الحسن الثاني، الدار البيضاء، المغرب<br>
                📞 <strong>الهاتف:</strong> +212 522 123 456<br>
                📧 <strong>البريد الإلكتروني:</strong> contact@drogueriejamal.ma<br>
                🕒 <strong>أوقات العمل:</strong> الاثنين-السبت: 8:00-20:00، الأحد: 9:00-18:00
              </p>
            </div>

            <div class="footer">
              <div class="social-links">
                <a href="#" title="Facebook">📘 فيسبوك</a>
                <a href="#" title="Instagram">📷 انستجرام</a>
                <a href="#" title="Twitter">🐦 تويتر</a>
              </div>
              <p>© 2024 دروغري جمال. جميع الحقوق محفوظة.</p>
              <p style="font-size: 12px; color: #cbd5e1;">
                إذا لم تقم بإنشاء هذا الحساب، يرجى تجاهل هذا البريد الإلكتروني.
              </p>
            </div>
          </div>
        </body>
        </html>
      `
    };
  }

  getOrderConfirmationTemplate(orderData) {
    const products = orderData.items.map(item => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">${item.name}</td>
        <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; text-align: center;">${item.quantity}</td>
        <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; text-align: right;">${item.price} درهم</td>
      </tr>
    `).join('');

    return {
      subject: `تأكيد الطلب #${orderData.id} - Droguerie Jamal`,
      html: `
        <!DOCTYPE html>
        <html dir="rtl" lang="ar">
        <head>
          <meta charset="UTF-8">
          <style>
            body { font-family: 'Arial', sans-serif; margin: 0; padding: 0; background-color: #f4f4f4; }
            .container { max-width: 600px; margin: 0 auto; background-color: white; }
            .header { background: linear-gradient(135deg, #16a34a 0%, #22c55e 100%); color: white; padding: 30px; text-align: center; }
            .content { padding: 30px; }
            .order-box { background-color: #f0fdf4; border: 2px solid #22c55e; border-radius: 8px; padding: 20px; margin: 20px 0; }
            .table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            .table th { background-color: #1e40af; color: white; padding: 12px; text-align: right; }
            .total-row { background-color: #eff6ff; font-weight: bold; }
            .footer { background-color: #1e40af; color: white; padding: 20px; text-align: center; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>✅ تم تأكيد طلبك!</h1>
              <p>رقم الطلب: #${orderData.id}</p>
            </div>

            <div class="content">
              <div class="order-box">
                <h2>🎉 شكراً لك على طلبك!</h2>
                <p>تم استلام طلبك بنجاح وسيتم معالجته في أقرب وقت ممكن.</p>
              </div>

              <h3>📦 تفاصيل الطلب</h3>
              <table class="table">
                <thead>
                  <tr>
                    <th>المنتج</th>
                    <th>الكمية</th>
                    <th>السعر</th>
                  </tr>
                </thead>
                <tbody>
                  ${products}
                  <tr class="total-row">
                    <td colspan="2" style="padding: 15px; text-align: right;"><strong>المجموع الكلي:</strong></td>
                    <td style="padding: 15px; text-align: right;"><strong>${orderData.total} درهم</strong></td>
                  </tr>
                </tbody>
              </table>

              <h3>🚚 معلومات التوصيل</h3>
              <p>
                <strong>العنوان:</strong> ${orderData.shipping_address}<br>
                <strong>المدينة:</strong> ${orderData.shipping_city}<br>
                <strong>طريقة الدفع:</strong> ${orderData.payment_method === 'cash' ? 'الدفع عند الاستلام' : 'بطاقة ائتمان'}
              </p>

              <h3>📋 حالة الطلب</h3>
              <p>🔄 <strong>قيد المعالجة</strong> - سيتم تحضير طلبك خلال 24 ساعة</p>

              <div style="background-color: #fef3c7; border: 1px solid #f59e0b; border-radius: 6px; padding: 15px; margin: 20px 0;">
                <p><strong>💡 ملاحظة:</strong> ستتلقى رسالة تأكيد أخرى عند شحن طلبك مع رقم التتبع.</p>
              </div>
            </div>

            <div class="footer">
              <h3>🏪 دروغري جمال</h3>
              <p>📞 +212 522 123 456 | 📧 contact@drogueriejamal.ma</p>
              <p>شكراً لثقتكم بنا! 🙏</p>
            </div>
          </div>
        </body>
        </html>
      `
    };
  }

  getPasswordResetTemplate(resetData) {
    return {
      subject: 'إعادة تعيين كلمة المرور - Droguerie Jamal',
      html: `
        <!DOCTYPE html>
        <html dir="rtl" lang="ar">
        <head>
          <meta charset="UTF-8">
          <style>
            body { font-family: 'Arial', sans-serif; margin: 0; padding: 0; background-color: #f4f4f4; }
            .container { max-width: 600px; margin: 0 auto; background-color: white; }
            .header { background: linear-gradient(135deg, #dc2626 0%, #ef4444 100%); color: white; padding: 30px; text-align: center; }
            .content { padding: 30px; }
            .warning-box { background-color: #fef2f2; border: 2px solid #ef4444; border-radius: 8px; padding: 20px; margin: 20px 0; }
            .button { display: inline-block; background-color: #dc2626; color: white; padding: 15px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
            .footer { background-color: #1e40af; color: white; padding: 20px; text-align: center; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🔐 إعادة تعيين كلمة المرور</h1>
            </div>

            <div class="content">
              <p>مرحباً،</p>

              <div class="warning-box">
                <p><strong>🚨 طلب إعادة تعيين كلمة المرور</strong></p>
                <p>تم طلب إعادة تعيين كلمة المرور لحسابك في دروغري جمال.</p>
              </div>

              <p>إذا كنت قد طلبت إعادة تعيين كلمة المرور، اضغط على الزر أدناه:</p>

              <div style="text-align: center;">
                <a href="${resetData.resetLink}" class="button">
                  🔓 إعادة تعيين كلمة المرور
                </a>
              </div>

              <p><strong>⏰ هذا الرابط صالح لمدة 1 ساعة فقط.</strong></p>

              <div style="background-color: #fef3c7; border: 1px solid #f59e0b; border-radius: 6px; padding: 15px; margin: 20px 0;">
                <p><strong>🛡️ أمان حسابك مهم:</strong></p>
                <ul>
                  <li>إذا لم تطلب إعادة تعيين كلمة المرور، تجاهل هذا البريد</li>
                  <li>لا تشارك هذا الرابط مع أي شخص آخر</li>
                  <li>استخدم كلمة مرور قوية وفريدة</li>
                </ul>
              </div>

              <p>إذا واجهت أي مشاكل، تواصل معنا على: contact@drogueriejamal.ma</p>
            </div>

            <div class="footer">
              <h3>🏪 دروغري جمال</h3>
              <p>© 2024 جميع الحقوق محفوظة</p>
            </div>
          </div>
        </body>
        </html>
      `
    };
  }

  getEmailVerificationTemplate(verificationData) {
    return {
      subject: 'تأكيد البريد الإلكتروني - Verify Your Email - Droguerie Jamal',
      html: `
        <!DOCTYPE html>
        <html dir="rtl" lang="ar">
        <head>
          <meta charset="UTF-8">
          <style>
            body { font-family: 'Arial', sans-serif; margin: 0; padding: 0; background-color: #f4f4f4; }
            .container { max-width: 600px; margin: 0 auto; background-color: white; }
            .header { background: linear-gradient(135deg, #16a34a 0%, #22c55e 100%); color: white; padding: 30px; text-align: center; }
            .content { padding: 30px; }
            .verification-box { background-color: #f0fdf4; border: 2px solid #22c55e; border-radius: 8px; padding: 20px; margin: 20px 0; text-align: center; }
            .button { display: inline-block; background-color: #16a34a; color: white; padding: 15px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; font-weight: bold; }
            .button:hover { background-color: #15803d; }
            .footer { background-color: #1e40af; color: white; padding: 20px; text-align: center; }
            .warning-box { background-color: #fef3c7; border: 1px solid #f59e0b; border-radius: 6px; padding: 15px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>✉️ تأكيد البريد الإلكتروني</h1>
              <p>Email Verification Required</p>
            </div>

            <div class="content">
              <div class="verification-box">
                <h2>🎯 خطوة واحدة أخيرة!</h2>
                <p><strong>يرجى تأكيد عنوان بريدك الإلكتروني لتفعيل حسابك</strong></p>
                <p>Please verify your email address to activate your account</p>
              </div>

              <p>مرحباً، / Hello,</p>
              <p>شكراً لتسجيلك في دروغري جمال! لإكمال إنشاء حسابك، يرجى تأكيد عنوان بريدك الإلكتروني.</p>
              <p>Thank you for registering with Droguerie Jamal! To complete your account setup, please verify your email address.</p>

              <div style="text-align: center;">
                <a href="${verificationData.verificationLink}" class="button">
                  ✅ تأكيد البريد الإلكتروني / Verify Email
                </a>
              </div>

              <div class="warning-box">
                <p><strong>⏰ هذا الرابط صالح لمدة 24 ساعة فقط</strong></p>
                <p><strong>This link is valid for 24 hours only</strong></p>
                <ul>
                  <li>إذا لم تقم بإنشاء هذا الحساب، تجاهل هذا البريد</li>
                  <li>If you didn't create this account, please ignore this email</li>
                  <li>لا تشارك هذا الرابط مع أي شخص آخر</li>
                  <li>Don't share this link with anyone else</li>
                </ul>
              </div>

              <p>بعد تأكيد بريدك الإلكتروني، ستتمكن من:</p>
              <p>After verifying your email, you'll be able to:</p>
              <ul>
                <li>✅ تسجيل الدخول إلى حسابك / Access your account</li>
                <li>✅ تتبع طلباتك / Track your orders</li>
                <li>✅ حفظ المنتجات المفضلة / Save favorite products</li>
                <li>✅ الحصول على عروض حصرية / Get exclusive offers</li>
              </ul>

              <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">

              <p style="font-size: 14px; color: #6b7280;">
                إذا لم يعمل الزر أعلاه، انسخ والصق الرابط التالي في متصفحك:<br>
                If the button above doesn't work, copy and paste this link in your browser:<br>
                <a href="${verificationData.verificationLink}" style="color: #16a34a; word-break: break-all;">
                  ${verificationData.verificationLink}
                </a>
              </p>

              <p>إذا واجهت أي مشاكل، تواصل معنا على: contact@drogueriejamal.ma</p>
              <p>If you experience any issues, contact us at: contact@drogueriejamal.ma</p>
            </div>

            <div class="footer">
              <h3>🏪 دروغري جمال / Droguerie Jamal</h3>
              <p>📞 +212 522 123 456 | 📧 contact@drogueriejamal.ma</p>
              <p>© 2024 جميع الحقوق محفوظة / All rights reserved</p>
            </div>
          </div>
        </body>
        </html>
      `
    };
  }

  getContactFormTemplate(contactData) {
    return {
      subject: `رسالة جديدة من ${contactData.name} - Droguerie Jamal`,
      html: `
        <!DOCTYPE html>
        <html dir="rtl" lang="ar">
        <head>
          <meta charset="UTF-8">
          <style>
            body { font-family: 'Arial', sans-serif; margin: 0; padding: 0; background-color: #f4f4f4; }
            .container { max-width: 600px; margin: 0 auto; background-color: white; }
            .header { background: linear-gradient(135deg, #7c3aed 0%, #8b5cf6 100%); color: white; padding: 30px; text-align: center; }
            .content { padding: 30px; }
            .message-box { background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin: 20px 0; }
            .info-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            .info-table td { padding: 10px; border-bottom: 1px solid #e5e7eb; }
            .info-table .label { font-weight: bold; background-color: #f1f5f9; width: 30%; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>📧 رسالة جديدة من موقع دروغري جمال</h1>
            </div>

            <div class="content">
              <h2>معلومات المرسل:</h2>
              <table class="info-table">
                <tr>
                  <td class="label">الاسم:</td>
                  <td>${contactData.name}</td>
                </tr>
                <tr>
                  <td class="label">البريد الإلكتروني:</td>
                  <td>${contactData.email}</td>
                </tr>
                <tr>
                  <td class="label">الهاتف:</td>
                  <td>${contactData.phone || 'غير محدد'}</td>
                </tr>
                <tr>
                  <td class="label">الموضوع:</td>
                  <td>${contactData.subject}</td>
                </tr>
                <tr>
                  <td class="label">التاريخ:</td>
                  <td>${new Date().toLocaleString('ar-MA')}</td>
                </tr>
              </table>

              <h3>📝 الرسالة:</h3>
              <div class="message-box">
                ${contactData.message.replace(/\n/g, '<br>')}
              </div>

              <p><strong>💡 يرجى الرد على هذه الرسالة في أقرب وقت ممكن.</strong></p>
            </div>
          </div>
        </body>
        </html>
      `
    };
  }

  // Main sending methods
  async sendWelcomeEmail(userData) {
    if (!this.transporter) return false;

    try {
      const template = this.getWelcomeEmailTemplate(userData);
      await this.transporter.sendMail({
        from: process.env.SMTP_FROM || '"Droguerie Jamal" <noreply@drogueriejamal.ma>',
        to: userData.email,
        subject: template.subject,
        html: template.html
      });

      console.log(`✅ Welcome email sent to ${userData.email}`);
      return true;
    } catch (error) {
      console.error('❌ Error sending welcome email:', error);
      return false;
    }
  }

  async sendOrderConfirmation(orderData) {
    if (!this.transporter) return false;

    try {
      const template = this.getOrderConfirmationTemplate(orderData);
      await this.transporter.sendMail({
        from: process.env.SMTP_FROM || '"Droguerie Jamal" <noreply@drogueriejamal.ma>',
        to: orderData.customer_email,
        subject: template.subject,
        html: template.html
      });

      console.log(`✅ Order confirmation sent to ${orderData.customer_email}`);
      return true;
    } catch (error) {
      console.error('❌ Error sending order confirmation:', error);
      return false;
    }
  }

  async sendPasswordReset(email, resetToken) {
    if (!this.transporter) return false;

    try {
      const resetLink = `${process.env.CORS_ORIGIN || 'http://localhost:5173'}/reset-password?token=${resetToken}`;
      const template = this.getPasswordResetTemplate({ resetLink });

      await this.transporter.sendMail({
        from: process.env.SMTP_FROM || '"Droguerie Jamal" <noreply@drogueriejamal.ma>',
        to: email,
        subject: template.subject,
        html: template.html
      });

      console.log(`✅ Password reset email sent to ${email}`);
      return true;
    } catch (error) {
      console.error('❌ Error sending password reset email:', error);
      return false;
    }
  }

  async sendVerificationEmail(email, token) {
    if (!this.transporter) return false;

    try {
      const verificationLink = `${process.env.CORS_ORIGIN || 'http://localhost:5173'}/verify-email?token=${token}`;
      const template = this.getEmailVerificationTemplate({ verificationLink });

      await this.transporter.sendMail({
        from: process.env.SMTP_FROM || '"Droguerie Jamal" <noreply@drogueriejamal.ma>',
        to: email,
        subject: template.subject,
        html: template.html
      });

      console.log(`✅ Email verification sent to ${email}`);
      return true;
    } catch (error) {
      console.error('❌ Error sending verification email:', error);
      return false;
    }
  }

  async sendContactFormNotification(contactData) {
    if (!this.transporter) return false;

    try {
      const template = this.getContactFormTemplate(contactData);
      await this.transporter.sendMail({
        from: process.env.SMTP_FROM || '"Droguerie Jamal" <noreply@drogueriejamal.ma>',
        to: process.env.ADMIN_EMAIL || 'admin@drogueriejamal.ma',
        subject: template.subject,
        html: template.html,
        replyTo: contactData.email
      });

      console.log(`✅ Contact form notification sent to admin`);
      return true;
    } catch (error) {
      console.error('❌ Error sending contact form notification:', error);
      return false;
    }
  }

  // Utility method to test email configuration
  async testEmailConfiguration() {
    if (!this.transporter) {
      return { success: false, message: 'Email service not configured' };
    }

    try {
      await this.transporter.verify();
      return { success: true, message: 'Email configuration is valid' };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }
}

module.exports = new EmailService();
