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
    from: process.env.EMAIL_ADD,
    to: email,
    subject: "Password Reset Code",
    html: `<p>Your password reset code is <strong>${resetCode}</strong>. The code will expire in 5 minutes.</p>`,
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
