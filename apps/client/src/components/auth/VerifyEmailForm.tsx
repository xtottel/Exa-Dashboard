"use client";

import { useEffect, useState, Suspense } from "react";
import { toast } from "sonner";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";

function VerifyEmailContent() {
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const searchParams = useSearchParams();
  const token = searchParams?.get("token");

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setStatus("error");
        toast.error("Invalid verification token");
        return;
      }

      try {
        const res = await fetch("/api/auth/verify-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });

        const result = await res.json();
        if (!res.ok) {
          setStatus("error");
          toast.error(result.error || "Email verification failed");
        } else {
          setStatus("success");
          toast.success("Email verified successfully!");
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        setStatus("error");
        toast.error("Something went wrong. Please try again.");
      }
    };

    verifyEmail();
  }, [token]);

  return (
    <div className="flex flex-col flex-1 lg:w-1/2 w-full overflow-y-auto no-scrollbar">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div className="flex justify-center mb-8">
          <Image
            src="https://cdn.sendexa.co/images/logo/exaweb.png"
            alt="Sendexa Logo"
            width={150}
            height={50}
          />
        </div>

        <div className="text-center">
          {status === "loading" && (
            <>
              <div className="mb-4">
                <div className="w-16 h-16 mx-auto border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
              <h1 className="mb-2 text-xl font-semibold text-gray-800 dark:text-white">
                Verifying your email...
              </h1>
              <p className="text-gray-500 dark:text-gray-400">
                Please wait while we verify your email address.
              </p>
            </>
          )}

          {status === "success" && (
            <>
              <div className="mb-4 text-green-500">
                <svg
                  className="w-16 h-16 mx-auto"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
              </div>
              <h1 className="mb-2 text-xl font-semibold text-gray-800 dark:text-white">
                Email Verified!
              </h1>
              <p className="mb-4 text-gray-500 dark:text-gray-400">
                Your email has been successfully verified. You can now login to
                your account.
              </p>
              <Button
                asChild
                className="w-full flex items-center justify-center bg-brand-500 hover:bg-brand-600 focus:ring-4 focus:ring-brand-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center disabled:opacity-50 text-white"
              >
                <Link href="/login">Go to Login</Link>
              </Button>
            </>
          )}

          {status === "error" && (
            <>
              <div className="mb-4 text-red-500">
                <svg
                  className="w-16 h-16 mx-auto"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  ></path>
                </svg>
              </div>
              <h1 className="mb-2 text-xl font-semibold text-gray-800 dark:text-white">
                Verification Failed
              </h1>
              <p className="mb-4 text-gray-500 dark:text-gray-400">
                The verification link is invalid or has expired.
              </p>
              <Button
                asChild
                className="w-full flex items-center justify-center bg-brand-500 hover:bg-brand-600 focus:ring-4 focus:ring-brand-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center disabled:opacity-50 text-white"
              >
                <Link href="/login">Go to Login</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// Fallback component for Suspense
function VerifyEmailFallback() {
  return (
    <div className="flex flex-col flex-1 lg:w-1/2 w-full overflow-y-auto no-scrollbar">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div className="flex justify-center mb-8">
          <Image
            src="https://cdn.sendexa.co/images/logo/exaweb.png"
            alt="Sendexa Logo"
            width={150}
            height={50}
          />
        </div>

        <div className="text-center">
          <div className="mb-4">
            <div className="w-16 h-16 mx-auto border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <h1 className="mb-2 text-xl font-semibold text-gray-800 dark:text-white">
            Loading...
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Please wait while we process your request.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function VerifyEmail() {
  return (
    <Suspense fallback={<VerifyEmailFallback />}>
      <VerifyEmailContent />
    </Suspense>
  );
}
