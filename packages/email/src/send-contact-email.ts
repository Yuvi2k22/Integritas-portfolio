import { render } from '@react-email/render';

import {
    ContactEmail,
    type ContactEmailProps
} from '@workspace/email-templates/contact-email';

import { sendEmail } from './mailer/send-email';

export async function sendContactEmail(
    input: ContactEmailProps & { recipient: string }
): Promise<void> {
    const component = ContactEmail(input);
    const html = await render(component);
    const text = await render(component, { plainText: true });

    await sendEmail({
        recipient: input.recipient,
        subject: `New Contact from ${input.name}`,
        html,
        text
    });
}
