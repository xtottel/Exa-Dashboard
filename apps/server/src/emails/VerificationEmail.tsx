
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
} from '@react-email/components'
import * as React from 'react'
import { Facebook, Twitter, Linkedin, Mail } from "lucide-react";

interface Props {
  name: string
  url: string
}

export const VerificationEmail = ({ name, url }: Props) => (
  <Html>
    <Head>
      <style>
        {`
          @media (hover: hover) {
            .hover-bg-blue-600:hover {
              background-color: #2563eb !important;
            }
          }
        `}
      </style>
    </Head>
    <Tailwind>
      <Body className="mx-auto my-auto bg-gray-50 px-2 font-sans">
        <Preview>Verify your email address to activate your Sendexa account</Preview>
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

          <Heading className="mx-0 my-[30px] text-center font-bold text-[24px] text-black">
            Verify your email
          </Heading>
          <Text className="text-[14px] text-black leading-[24px]">
            Hello {name},
          </Text>
          <Text className="text-[14px] text-black leading-[24px]">
            Thank you for registering with Sendexa. Please verify your email
            address to activate your account and start using our communication solutions.
          </Text>
          <Section className="mt-[32px] mb-[32px] text-center">
            <Button
              aria-label="Verify your email"
              className="rounded-md bg-blue-500 px-6 py-3 text-center font-semibold text-[14px] text-white no-underline hover-bg-blue-600"
              href={url}
              rel="noopener noreferrer">
              Verify Email
            </Button>
          </Section>
          <Text className="break-words text-[14px] text-black leading-[24px]">
            Or copy and paste this URL into your browser:{' '}
            <Link href={url} className="text-blue-600 no-underline">
              {url}
            </Link>
          </Text>
          <Hr className="mx-0 my-[26px] w-full border border-[#eaeaea] border-solid" />
          <Text className="text-[#666666] text-[13px] leading-[20px]">
            If you did not sign up for a Sendexa account, please ignore this
            email or{' '}
            <Link
              href="mailto:support@sendexa.co"
              className="text-blue-600 no-underline">
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
)

export default VerificationEmail
