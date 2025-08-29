import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  pixelBasedPreset,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";
import React from "react";

interface Props {
  name: string;
  otp: string;
  type: string;
}

export const OTPEmail = ({ name, otp, type }: Props) => {
  return (
    <Html>
      <Head />
      <Tailwind
        config={{
          presets: [pixelBasedPreset],
        }}
      >
        <Body className="mx-auto my-auto bg-white px-2 font-sans">
          <Preview>Your OTP Code for {type}</Preview>
          <Container className="mx-auto my-[40px] max-w-[465px] p-[20px]">
            <Heading className="mx-0 my-[30px] p-0 text-center font-bold text-[24px] text-black">
              Your Verification Code
            </Heading>
            
            <Text className="text-[14px] text-black leading-[24px]">
              Hello {name},
            </Text>

            <Text className="text-[14px] text-black leading-[24px]">
              Your verification code for {type} is:
            </Text>

            <Section className="my-[32px] text-center">
              <Text className="inline-block rounded-lg bg-[#f3f4f6] px-6 py-4 text-center text-[32px] font-bold tracking-widest text-[#000000]">
                {otp}
              </Text>
            </Section>

            <Text className="text-[14px] text-black leading-[24px]">
              This verification code will expire in <strong>10 minutes</strong>.
              Please do not share this code with anyone.
            </Text>

            <Hr className="mx-0 my-[26px] w-full border border-[#eaeaea] border-solid" />
            
            <Text className="text-[#999999] text-[12px] leading-[20px] mt-6 text-center">
              If you didn't request this code, please ignore this email or{" "}
              <Link
                href="mailto:support@xtopay.com"
                className="text-blue-600 no-underline"
              >
                contact our support team
              </Link>
              .
            </Text>

            <Text className="text-[#999999] text-[12px] leading-[20px] mt-6 text-center">
              © {new Date().getFullYear()} Xtopay. All rights reserved.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default OTPEmail;