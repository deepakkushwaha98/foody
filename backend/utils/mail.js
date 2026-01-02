import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASS,
  },
});

transporter
  .verify()
  .then(() => console.log('Mail transporter is ready'))
  .catch((err) => console.error('Mail transporter error:', err));

export const sendOtpMail = async (to, otp) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL,
      to,
      subject: 'Your OTP for Password Reset',
      html: `<p>Your OTP for password reset is: <b>${otp}</b>. It expires in 5 minutes.</p>`,
    });
  } catch (err) {
    console.error('SEND OTP MAIL ERROR 👉', err);
    throw err;
  }
};