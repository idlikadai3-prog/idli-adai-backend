import dotenv from 'dotenv';

dotenv.config();

export const emailConfig = {
  service: process.env.EMAIL_SERVICE || 'gmail', // 'gmail' or 'smtp'
  user: process.env.EMAIL_USER,
  password: process.env.EMAIL_PASSWORD,
  smtp: {
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === 'true'
  }
};

export const isEmailConfigured = () => {
  return !!(emailConfig.user && emailConfig.password);
};

