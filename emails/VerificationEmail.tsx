import {
  Html,
  Head,
  Font,
  Preview,
  Heading,
  Row,
  Section,
  Text,
  Button,
} from "@react-email/components";

interface VerificationEmailProps {
  username: string;
  otp: string;
}

export default function VerificationEmail ({username, otp}: VerificationEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Email Verification</Preview>
      <Section className="bg-gray-100 p-6 rounded-lg shadow-lg max-w-lg mx-auto">
        <Heading className="text-2xl font-bold text-gray-800 text-center">
          Hello, {username}!
        </Heading>
        <Text className="text-gray-600 text-lg text-center">
          Please use the following One-Time Password (OTP) to verify your account:
        </Text>
        <Text className="text-gray-600 text-lg text-center font-bold">
          OTP: {otp}
        </Text>
        <Text className="text-gray-600 text-lg text-center mt-4">
          This OTP is valid for 10 minutes. If you didn't request this, please ignore this email.
        </Text>
        <Row className="text-center">
          <Button
            href="#"
            className="mt-4 px-5 py-2 bg-blue-500 text-white text-lg rounded-md hover:bg-blue-600 transition duration-300"
          >
            Verify Now
          </Button>
        </Row>
      </Section>
    </Html>
  );
}
