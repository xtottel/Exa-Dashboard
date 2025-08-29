// components/auth/OTPForm.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Suspense } from "react";

function OTPFormContent() {
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(""));
  const [loading, setLoading] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const inputRefs = useRef<HTMLInputElement[]>([]);
  const router = useRouter();
  const searchParams = useSearchParams();

  const email = searchParams?.get("email") || "";

  // Handle countdown timer
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Focus first input on mount
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleChange = (index: number, value: string) => {
    // Only allow numbers
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus to next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      // Move to previous input on backspace
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text");

    // Only allow numbers and exactly 6 digits
    if (/^\d{6}$/.test(pastedData)) {
      const pastedOtp = pastedData.split("");
      setOtp(pastedOtp);

      // Focus the last input
      inputRefs.current[5]?.focus();
    }
  };

  const resendOTP = async () => {
    if (!email) {
      toast.error("Email address is required");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        "https://onetime.sendexa.co/api/auth/resend-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      const result = await res.json();

      if (!res.ok) {
        toast.error(result.message || "Failed to resend OTP");
      } else {
        toast.success("OTP sent successfully");
        setCountdown(60); // Reset countdown
      }
    } catch (error) {
      console.error("Resend OTP error:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast.error("Email address is required");
      return;
    }

    const otpValue = otp.join("");

    if (otpValue.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        "https://onetime.sendexa.co/api/auth/verify-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, otp: otpValue }),
        }
      );

      const result = await res.json();

      if (!res.ok) {
        toast.error(result.message || "Invalid OTP");
      } else {
        // Handle successful OTP verification
        handleSuccessfulVerification(result);
      }
    } catch (error) {
      console.error("OTP verification error:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSuccessfulVerification = (result: any) => {
    console.log("✅ OTP verification successful! Result:", result);

    if (result.token) {
      localStorage.setItem("bearerToken", result.token);
      const expiryTime = Date.now() + 60 * 60 * 1000;
      localStorage.setItem("tokenExpiry", expiryTime.toString());
      document.cookie = `token=${result.token}; path=/; max-age=${60 * 60}; secure=${process.env.NODE_ENV === "production"}; sameSite=lax`;
    }

    if (result.user) {
      localStorage.setItem("user", JSON.stringify(result.user));
    }

    toast.success(result.message || "Login successful!");
    setIsRedirecting(true);

    setTimeout(() => {
      router.push("/home");
    }, 1000);
  };

  if (isRedirecting) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
          <div className="flex justify-center mb-8">
            <Image
              src="/xtopay.png"
              alt="Xtopay Logo"
              width={150}
              height={50}
            />
          </div>
          <div className="text-center">
            <div className="mb-4">
              <div className="w-16 h-16 mx-auto border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <h1 className="mb-2 text-xl font-semibold text-gray-800 dark:text-white">
              Redirecting...
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              Verification successful! Taking you to your dashboard.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 lg:w-1/2 w-full">
      <div className="w-full max-w-md sm:pt-10 mx-auto mb-5"></div>
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Image src="/xtopay.png" alt="Xtopay Logo" width={150} height={50} />
        </div>

        <div className="mb-8 text-center">
          <h1 className="mb-2 text-xl font-semibold text-gray-800 dark:text-white">
            Verify Your Email
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Enter the 6-digit code sent to <br />
            <span className="font-medium">{email || "your email"}</span>
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="otp">Verification Code</Label>
            <div className="flex justify-between space-x-2">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => {
                    if (el) inputRefs.current[index] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={index === 0 ? handlePaste : undefined}
                  className="w-12 h-12 text-center text-xl border border-gray-300 rounded-md focus:border-brand-500 focus:ring-2 focus:ring-brand-200 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                />
              ))}
            </div>
          </div>

          <Button
            type="submit"
            className="w-full flex items-center justify-center bg-brand-500 hover:bg-brand-600 focus:ring-4 focus:ring-brand-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center disabled:opacity-50 text-white"
            disabled={loading || !email}
          >
            {loading ? (
              <>
                <div className="w-4 h-4 mr-2 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
                Verifying...
              </>
            ) : (
              "Verify OTP"
            )}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Didn&apos;t receive the code?{" "}
            {countdown > 0 ? (
              <span className="text-gray-500">Resend in {countdown}s</span>
            ) : (
              <button
                onClick={resendOTP}
                disabled={loading || !email}
                className="text-brand-500 hover:underline disabled:opacity-50"
              >
                Resend OTP
              </button>
            )}
          </p>

          <Link
            href="/login"
            className="mt-4 text-sm text-gray-600 dark:text-gray-400 hover:underline block"
          >
            Back to login
          </Link>
        </div>
      </div>
    </div>
  );
}

// Fallback component for Suspense
function OTPFormFallback() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
        <div className="flex justify-center mb-8">
          <Image src="/xtopay.png" alt="Xtopay Logo" width={150} height={50} />
        </div>
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-4"></div>
          <div className="h-4 bg-gray-200 rounded mb-6"></div>
          <div className="space-y-4">
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OTPForm() {
  return (
    <Suspense fallback={<OTPFormFallback />}>
      <OTPFormContent />
    </Suspense>
  );
}
