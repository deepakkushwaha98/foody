import { sendDeliveryOtpMail as sendDeliveryOtpMailUsingNodemailer } from './mail.js';

export async function sendDeliveryOtpMail(to, otp) {
  // Accept either a direct email string or an object with an `email` property.
  const email = typeof to === 'string' ? to : to?.email;
  if (!email) {
    throw new Error('No email address provided for delivery OTP');
  }

  return sendDeliveryOtpMailUsingNodemailer(email, otp);
}
