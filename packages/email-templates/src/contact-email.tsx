import * as React from 'react';
import {
    Body,
    Container,
    Head,
    Heading,
    Hr,
    Html,
    Preview,
    Text
} from '@react-email/components';
import { Tailwind } from '@react-email/tailwind';

export type ContactEmailProps = {
    name: string;
    email: string;
    message: string;
};

export function ContactEmail({
    name,
    email,
    message
}: ContactEmailProps): React.JSX.Element {
    return (
        <Html>
            <Head />
            <Preview>New Contact Form Submission</Preview>
            <Tailwind>
                <Body className="m-auto bg-white px-2 font-sans">
                    <Container className="mx-auto my-[40px] max-w-[465px] rounded border border-solid border-[#eaeaea] p-[20px]">
                        <Heading className="mx-0 my-[30px] p-0 text-center text-[24px] font-normal text-black">
                            New Contact Message
                        </Heading>
                        <Text className="text-[14px] leading-[24px] text-black">
                            <strong>Name:</strong> {name}
                        </Text>
                        <Text className="text-[14px] leading-[24px] text-black">
                            <strong>Email:</strong> {email}
                        </Text>
                        <Hr className="mx-0 my-[26px] w-full border border-solid border-[#eaeaea]" />
                        <Text className="text-[14px] leading-[24px] text-black">
                            <strong>Message:</strong>
                        </Text>
                        <Text className="text-[14px] leading-[24px] text-black whitespace-pre-wrap">
                            {message}
                        </Text>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    );
}
