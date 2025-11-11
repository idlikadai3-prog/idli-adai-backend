import { Router } from 'express';
import { verifyEmailTransport, sendEmail } from '../services/email.service.js';

const router = Router();

// Health check for email config
router.get('/health', async (req, res) => {
  const verification = await verifyEmailTransport();
  const maskedUser = process.env.EMAIL_USER ? process.env.EMAIL_USER.replace(/(.{2}).+(@.*)/, '$1***$2') : null;
  res.json({
    configured: !!(process.env.EMAIL_USER && process.env.EMAIL_PASSWORD),
    verification,
    service: process.env.EMAIL_SERVICE || 'gmail',
    user: maskedUser
  });
});

// Send a test email
router.post('/test', async (req, res) => {
  try {
    const to = (req.body?.to || process.env.EMAIL_USER || '').trim();
    if (!to) {
      return res.status(400).json({ detail: 'Provide a "to" email or set EMAIL_USER' });
    }
    const subject = 'idli kadai - Test Email';
    const html = `<p>This is a test email from idli kadai backend.</p><p>Timestamp: ${new Date().toISOString()}</p>`;
    const text = `This is a test email from idli kadai backend.\nTimestamp: ${new Date().toISOString()}`;
    const result = await sendEmail(to, subject, html, text);
    if (result.success) {
      return res.json({ message: 'Test email sent', messageId: result.messageId, to });
    }
    return res.status(500).json({ detail: 'Failed to send test email', error: result.error || result.message });
  } catch (err) {
    return res.status(500).json({ detail: 'Error sending test email', error: err.message });
  }
});

export default router;

