import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
dotenv.config()

const transporter = nodemailer.createTransport({
  host:'smtp-relay.brevo.com',
  port: 587,
  auth: {
    user: process.env.SMPT_USER,
    pass: process.env.BREVO_API_KEY
  }
})

export const sendVerificationEmail = async (userEmail, otp) => {
  const subject = 'Verify your Email - Paytm Wallet';
  const htmlContent = `
    <div style="font-family: 'Arial', sans-serif; background-color: #f4f6f9; padding: 40px; color: #333;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
        
        <h2 style="font-size: 24px; color: #0073e6; text-align: center;">Welcome to Paytm Wallet</h2>

        <p style="font-size: 16px; line-height: 1.6; text-align: center; color: #555;">
          Thank you for signing up with Paytm Wallet. Please verify your email to complete the registration process.
        </p>
        
        <h1 style="text-align: center; font-size: 36px; color: #333; letter-spacing: 3px; margin: 20px 0;">${otp}</h1>
        
        <p style="font-size: 14px; line-height: 1.6; color: #555; text-align: center;">
          This OTP will expire in 10 minutes. Please enter it in the app to verify your account.
        </p>
        
        <p style="font-size: 14px; line-height: 1.6; text-align: center; color: #888;">
          If you didn't request this, please ignore this email.
        </p>

        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />

        <div style="text-align: center;">
          <p style="font-size: 12px; color: #888;">&copy; 2025 Paytm Wallet. All rights reserved.</p>
          <p style="font-size: 12px; color: #888;">
            <a href="#" style="color: #0073e6; text-decoration: none;">Privacy Policy</a> | 
            <a href="#" style="color: #0073e6; text-decoration: none;">Terms of Service</a>
          </p>
        </div>
      </div>
    </div>
  `;

  const mailOptions = {
    from: `"Paytm Wallet" <${process.env.BREVO_EMAIL}>`,
    to: userEmail,
    subject,
    html: htmlContent,
  }

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Verification email sent to ${info.accepted[0]} | Response: ${info.response}`);
  } catch (error) {
    console.error('❌ Error sending verification email:', error.message);
    throw error;
  }
}