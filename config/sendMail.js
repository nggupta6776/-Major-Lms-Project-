import dotenv from "dotenv";
import nodemailer from 'nodemailer';
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "Gmail",
  port: 465,
  secure: true,
  auth: {
    user: process.env.USER_EMAIL,     // your Gmail address
    pass: process.env.USER_PASSWORD,  // 16-character App Password
  },
});

const sendMail = async (to, otp) => {
  try {
    await transporter.sendMail({
      from: process.env.USER_EMAIL,
      to: to,
      subject: "Reset Your Password",
      html: `<p>Your OTP for password reset is <b>${otp}</b>. It will expire in 5 minutes.</p>`,
    });
    console.log(` OTP sent to ${to}`);
  } catch (error) {
    console.error(" Email send failed:", error.message);
    throw error;
  }
};

export default sendMail;

