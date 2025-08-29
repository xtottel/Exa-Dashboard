import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Tailwind,
  Text,
  Img,
} from "@react-email/components";
import React from "react";
import { Facebook, Twitter, Linkedin, Mail } from "lucide-react";

interface Props {
  name?: string;
  url: string;
}

export const WelcomeEmail = ({ name, url }: Props) => {
  return (
    <Html>
      <Head>
        <title>Welcome to Sendexa</title>
        <style>
          {`
            @media (hover: hover) {
              .hover-bg-blue-700:hover {
                background-color: #1d4ed8 !important;
              }
            }
          `}
        </style>
      </Head>
      <Tailwind>
        <Body className="mx-auto my-auto bg-gray-50 px-2 font-sans">
          <Preview>Welcome to Sendexa 🚀</Preview>
          <Container className="mx-auto my-[40px] max-w-[465px] rounded-lg bg-white shadow-lg p-[20px]">
            
            {/* Logo */}
            <Section className="text-center mt-6">
              <Img
                src="https://cdn.sendexa.co/images/logo/exaweb.png"
                alt="Sendexa Logo"
                width="100"
                className="mx-auto"
              />
            </Section>

            {/* Title */}
            <Heading className="mx-0 my-[30px] text-center font-bold text-[24px] text-black">
              Welcome to Sendexa
            </Heading>

            {/* Greeting */}
            <Text className="text-[14px] text-black leading-[24px]">
              Hi {name || "there"},
            </Text>
            <Text className="text-[14px] text-black leading-[24px]">
              Your email has been successfully verified 🎉. You can now log in
              and start exploring our communication solutions.
            </Text>

            {/* CTA */}
            <Section className="mt-[32px] mb-[32px] text-center">
              <Button
                aria-label="Log in"
                className="rounded-md bg-blue-600 px-6 py-3 text-center font-semibold text-[14px] text-white no-underline hover-bg-blue-700"
                href={url}
                rel="noopener noreferrer"
              >
                Log in to Dashboard
              </Button>
            </Section>

            {/* Copy link */}
            <Text className="break-words text-[14px] text-black leading-[24px]">
              Or copy and paste this URL into your browser:{" "}
              <Link href={url} className="text-blue-600 no-underline">
                {url}
              </Link>
            </Text>

            <Hr className="mx-0 my-[26px] w-full border border-[#eaeaea] border-solid" />

            {/* Security Note */}
            <Text className="text-[#666666] text-[13px] leading-[20px]">
              For your security, never share this link with anyone. If you did
              not create an account, please ignore this email or{" "}
              <Link
                href="mailto:support@sendexa.co"
                className="text-blue-600 no-underline"
              >
                contact our support team
              </Link>
              .
            </Text>

            {/* Footer */}
            <Hr className="mx-0 my-[20px] w-full border border-[#eaeaea] border-solid" />
            <Section className="text-center">
              <Text className="text-[#999999] text-[12px] leading-[20px] mb-4">
                © {new Date().getFullYear()} Sendexa LLC. All rights reserved.
              </Text>
              <div className="flex justify-center gap-4">
                <Link href="https://facebook.com/sendexa">
                  <Facebook size={18} className="text-gray-500" />
                </Link>
                <Link href="https://twitter.com/sendexa">
                  <Twitter size={18} className="text-gray-500" />
                </Link>
                <Link href="https://linkedin.com/company/sendexa">
                  <Linkedin size={18} className="text-gray-500" />
                </Link>
                <Link href="mailto:support@sendexa.co">
                  <Mail size={18} className="text-gray-500" />
                </Link>
              </div>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default WelcomeEmail;