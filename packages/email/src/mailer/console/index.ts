import { type Mailer, type MailerPayload } from '../types';

export class ConsoleMailer implements Mailer {
    public async sendEmail(payload: MailerPayload): Promise<unknown> {
        console.log('--------------------------------------------------');
        console.log('📧 Console Mailer: Sending Email');
        console.log('--------------------------------------------------');
        console.log(`To: ${payload.recipient}`);
        console.log(`Subject: ${payload.subject}`);
        console.log('--- Body (Text) ---');
        console.log(payload.text);
        console.log('--------------------------------------------------');

        return Promise.resolve({ success: true, message: 'Logged to console' });
    }
}
