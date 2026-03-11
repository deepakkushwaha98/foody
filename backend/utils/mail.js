import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

// Normalize env vars in case they include extra spaces/quotes.
const smtpUser = (process.env.EMAIL || '').trim().replace(/^['"]|['"]$/g, '');
const smtpPass = (process.env.PASS || '').trim().replace(/^['"]|['"]$/g, '');

export const transporter = nodemailer.createTransport({
  service: 'Gmail',
  port: 465,
  secure: true,
  auth: {
    user: smtpUser,
    pass: smtpPass,
  },
});

transporter
  .verify()
  .then(() => console.log('Mail transporter is ready'))
  .catch((err) => console.error('Mail transporter error:', err));

export const sendOtpMail = async (to, otp) => {
  try {
    await transporter.sendMail({
      from: smtpUser,
      to,
      subject: 'Your OTP for Password Reset',
      html: `<p>Your OTP for password reset is: <b>${otp}</b>. It expires in 5 minutes.</p>`,
    });
  } catch (err) {
    console.error('SEND OTP MAIL ERROR 👉', err);
    throw err;
  }
};





export const sendDeliveryOtpMail = async (to, otp) => {
  try {
    const recipient = typeof to === 'string' ? to : to?.email;
    if (!recipient) {
      throw new Error('No recipient email provided');
    }

    await transporter.sendMail({
      from: smtpUser,
      to: recipient,
      subject: 'Your Delivery OTP',
      html: `<p>Your OTP for delivery is: <b>${otp}</b>. It expires in 5 minutes.</p>`,
    });
  } catch (err) {
    console.error('SEND DELIVERY OTP MAIL ERROR 👉', err);
    throw err;
  }
};