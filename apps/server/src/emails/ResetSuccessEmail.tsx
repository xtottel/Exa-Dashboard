import {
  Body,
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
  Button,
} from '@react-email/components'
import * as React from 'react'
import { Facebook, Twitter, Linkedin, Mail } from "lucide-react";

interface Props {
  name: string
  loginUrl: string
}

export const ResetSuccessEmail = ({ name, loginUrl }: Props) => (
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
        <Preview>Your Sendexa password has been reset successfully</Preview>
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
            Password Reset Successful
          </Heading>
          <Text className="text-[14px] text-black leading-[24px]">
            Hello {name},
          </Text>
          <Text className="text-[14px] text-black leading-[24px]">
            Your Sendexa password has been changed successfully. You can now log in
            using your new password and continue using our communication solutions.
          </Text>
          
          {/* CTA Button */}
          <Section className="mt-[32px] mb-[32px] text-center">
            <Button
              aria-label="Log in to your account"
              className="rounded-md bg-blue-500 px-6 py-3 text-center font-semibold text-[14px] text-white no-underline hover-bg-blue-600"
              href={loginUrl}
              rel="noopener noreferrer">
              Log In to Your Account
            </Button>
          </Section>
          
          <Hr className="mx-0 my-[26px] w-full border border-[#eaeaea] border-solid" />
          <Text className="text-[#666666] text-[13px] leading-[20px]">
            If you did not perform this action, please contact our support team
            immediately at{' '}
            <Link
              href="mailto:support@sendexa.co"
              className="text-blue-600 no-underline">
              support@sendexa.co
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

export default ResetSuccessEmail