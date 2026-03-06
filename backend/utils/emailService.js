// Placeholder email service. Adjust with real provider (SendGrid, nodemailer, etc.).
export async function sendDeliveryOtpMail(to, otp) {
  // In development, just log instead of sending.
  console.log(`sendDeliveryOtpMail called for ${to}. OTP: ${otp}`);
  return Promise.resolve({ success: true });
}
