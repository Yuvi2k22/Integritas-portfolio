'use server';

import { z } from 'zod';
import { sendContactEmail } from '@workspace/email/send-contact-email';

const contactSchema = z.object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().optional(),
    email: z.string().email('Invalid email address'),
    message: z.string().min(10, 'Message must be at least 10 characters'),
});

export type ContactFormData = z.infer<typeof contactSchema>;

export async function submitContactForm(data: ContactFormData) {
    const result = contactSchema.safeParse(data);

    if (!result.success) {
        const text = result.error.errors.map(e => e.message).join(', ');
        return { success: false, error: text || 'Invalid form data' };
    }

    try {
        await sendContactEmail({
            name: `${data.firstName} ${data.lastName || ''}`.trim(),
            email: data.email,
            message: data.message,
        });
        return { success: true };
    } catch (error) {
        console.error('Failed to send email:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to send message. Please try again later.'
        };
    }
}
