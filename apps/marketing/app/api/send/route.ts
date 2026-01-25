import { NextResponse, type NextRequest } from 'next/server';
import { z } from 'zod';

import { sendContactEmail } from '@workspace/email/send-contact-email';

const requestSchema = z.object({
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    email: z.string().email(),
    message: z.string().min(1)
});

export async function POST(req: NextRequest) {
    try {
        const json = await req.json();
        const body = requestSchema.parse(json);

        await sendContactEmail({
            name: `${body.firstName} ${body.lastName}`,
            email: body.email,
            message: body.message,
            recipient: 'integritassolutions457@gmail.com'
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Failed to send contact email:', error);
        return NextResponse.json(
            { error: 'Failed to send message' },
            { status: 500 }
        );
    }
}
