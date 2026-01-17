import { sendEmail } from './mailer/send-email';
import { keys } from '../keys';

interface ContactEmailProps {
    name: string;
    email: string;
    message: string;
    recipient?: string;
}

export async function sendContactEmail({
    name,
    email,
    message,
    recipient,
}: ContactEmailProps): Promise<void> {
    const subject = `New Project Inquiry: ${name}`;

    // App Theme Colors (based on Integritas globals.css)
    const colors = {
        primary: '#4696e5ff', // approximate hex for oklch indigo
        background: '#f8fafc',
        card: '#ffffff',
        text: '#1e293b',
        muted: '#64748b',
        border: '#e2e8f0',
    };

    const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Message Received</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: ${colors.background}; color: ${colors.text}; -webkit-font-smoothing: antialiased;">
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;">
            <tr>
                <td align="center" style="padding: 40px 20px;">
                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: ${colors.card}; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); border: 1px solid ${colors.border};">
                        <!-- Header -->
                        <tr>
                            <td style="padding: 32px 40px; background-color: ${colors.primary};">
                                <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 700; letter-spacing: -0.025em;">Integritas</h1>
                                <p style="margin: 8px 0 0 0; color: rgba(255, 255, 255, 0.8); font-size: 14px;">Contact Form Submission</p>
                            </td>
                        </tr>

                        <!-- Content Body -->
                        <tr>
                            <td style="padding: 40px;">
                                <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                    <tr>
                                        <td style="padding-bottom: 24px;">
                                            <h2 style="margin: 0 0 16px 0; font-size: 18px; font-weight: 600; color: ${colors.text};">Hello! You received a new message.</h2>
                                            <p style="margin: 0; font-size: 15px; line-height: 1.6; color: ${colors.muted};">A visitor just submitted the contact form on your portfolio website. Here are the details:</p>
                                        </td>
                                    </tr>

                                    <!-- Sender Info -->
                                    <tr>
                                        <td style="padding: 24px; background-color: ${colors.background}; border-radius: 12px; border: 1px solid ${colors.border};">
                                            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                                <tr>
                                                    <td style="padding-bottom: 12px; width: 80px; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: ${colors.muted};">From</td>
                                                    <td style="padding-bottom: 12px; font-size: 15px; font-weight: 510; color: ${colors.text};">${name}</td>
                                                </tr>
                                                <tr>
                                                    <td style="padding-bottom: 12px; width: 80px; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: ${colors.muted};">Email</td>
                                                    <td style="padding-bottom: 12px; font-size: 15px; color: ${colors.primary}; font-weight: 500;"><a href="mailto:${email}" style="color: ${colors.primary}; text-decoration: none;">${email}</a></td>
                                                </tr>
                                                <tr>
                                                    <td style="width: 80px; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: ${colors.muted};">Date</td>
                                                    <td style="font-size: 15px; color: ${colors.text};">${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'long', timeStyle: 'short' })}</td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>

                                    <!-- Message Section -->
                                    <tr>
                                        <td style="padding-top: 32px;">
                                            <h3 style="margin: 0 0 12px 0; font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: ${colors.muted};">Message</h3>
                                            <div style="padding: 24px; background-color: #ffffff; border: 1px dashed ${colors.border}; border-radius: 12px; font-size: 16px; line-height: 1.6; color: ${colors.text}; white-space: pre-wrap;">${message}</div>
                                        </td>
                                    </tr>

                                    <!-- CTA -->
                                    <tr>
                                        <td align="center" style="padding-top: 40px;">
                                            <a href="mailto:${email}" style="display: inline-block; padding: 14px 28px; background-color: ${colors.primary}; color: #ffffff; font-weight: 600; text-decoration: none; border-radius: 8px; font-size: 15px;">Reply to ${name.split(' ')[0]}</a>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>

                        <!-- Footer -->
                        <tr>
                            <td style="padding: 24px 40px; background-color: #f1f5f9; border-top: 1px solid ${colors.border};">
                                <p style="margin: 0; font-size: 12px; text-align: center; color: ${colors.muted};">
                                    This email was sent from the contact form at <strong>Integritas Portfolio</strong>.
                                    <br>Please do not reply directly to this automated notification.
                                </p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </body>
    </html>
    `;

    await sendEmail({
        recipient: recipient || keys().EMAIL_FEEDBACK_INBOX || 'contact@example.com',
        subject,
        html: htmlContent,
        text: `New Project Inquiry from ${name}\n\nFrom: ${name}\nEmail: ${email}\nDate: ${new Date().toLocaleString()}\n\nMessage:\n${message}`,
    });
}
