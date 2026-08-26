import { Resend } from 'resend';
import dotenv from 'dotenv';
dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);
const resendSender = 'onboarding@resend.dev';

export const sendOtpMail = async (to, otp) => {
  try {
    if (!process.env.RESEND_API_KEY) {
      throw new Error('Email service is not configured: RESEND_API_KEY is missing');
    }

    const { data, error } = await resend.emails.send({
      from: resendSender,
      to,
      subject: 'Your OTP for Password Reset',
      html: `<p>Your OTP for password reset is: <b>${otp}</b>. It expires in 5 minutes.</p>`,
    });

    if (error) {
      throw new Error(error.message || 'Resend failed to send password reset OTP');
    }

    console.log('Password reset OTP email accepted by Resend', { id: data?.id });
  } catch (err) {
    console.error('SEND OTP MAIL ERROR 👉', err);
    throw err;
  }
};





export const sendDeliveryOtpMail = async (to, otp) => {
  try {
    if (!process.env.RESEND_API_KEY) {
      throw new Error('Email service is not configured: RESEND_API_KEY is missing');
    }

    const recipient = typeof to === 'string' ? to : to?.email;
    if (!recipient) {
      throw new Error('No recipient email provided');
    }

    const { data, error } = await resend.emails.send({
      from: resendSender,
      to: recipient,
      subject: 'Your Delivery OTP',
      html: `<p>Your OTP for delivery is: <b>${otp}</b>. It expires in 5 minutes.</p>`,
    });

    if (error) {
      throw new Error(error.message || 'Resend failed to send delivery OTP');
    }

    console.log('Delivery OTP email accepted by Resend', { id: data?.id });
  } catch (err) {
    console.error('SEND DELIVERY OTP MAIL ERROR 👉', err);
    throw err;
  }
};