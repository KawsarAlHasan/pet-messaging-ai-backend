import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

// Hostinger SMTP credentials
let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_ADD,
    pass: process.env.EMAIL_PASS,
  },
});

// Function to send the reset email
const sendResetEmail = async (email, resetCode) => {
  const mailOptions = {
    from: `${process.env.APP_NAME} <${process.env.EMAIL_ADD}>`,
    to: email,
    subject: `${process.env.APP_NAME} - Password Reset Request`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0;">
        <h2 style="color: #333;">Password Reset Request</h2>
        <p>We received a request to reset your password for your ${process.env.APP_NAME} account.</p>
        
        <div style="background: #f5f5f5; padding: 15px; margin: 20px 0; text-align: center;">
          <strong style="font-size: 24px; letter-spacing: 2px;">${resetCode}</strong>
        </div>
        
        <p>This verification code will expire in <strong>5 minutes</strong>.</p>
        
        <p style="color: #666; font-size: 14px;">
          If you didn't request this, please ignore this email or contact support at 
          <a href="mailto:${process.env.SUPPORT_EMAIL}">${process.env.SUPPORT_EMAIL}</a>.
        </p>
        
        <p>Thanks,<br>The ${process.env.APP_NAME} Team</p>
      </div>
    `,
    text: `
      Password Reset Request\n\n
      We received a request to reset your password for your ${process.env.APP_NAME} account.\n\n
      Your verification code is: ${resetCode}\n\n
      This code will expire in 5 minutes.\n\n
      If you didn't request this, please ignore this email.\n\n
      Thanks,\nThe ${process.env.APP_NAME} Team
    `,
  };

  try {
    const emailResult = await transporter.sendMail(mailOptions);
    return emailResult;
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send email");
  }
};

const sendVerifyEmail = async (email, resetCode) => {
  const mailOptions = {
    from: process.env.EMAIL_ADD,
    to: email,
    subject: "Email Verification Code",
    html: `<p>Your verification code is <strong>${resetCode}</strong>. The code will expire in 5 minutes.</p>`,
  };

  try {
    const emailResult = await transporter.sendMail(mailOptions);
    return emailResult;
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send email");
  }
};

export { sendResetEmail, sendVerifyEmail };
