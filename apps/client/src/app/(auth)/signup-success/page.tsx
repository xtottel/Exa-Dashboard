"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function SignUpSuccess() {
  return (
    <div className="flex flex-col flex-1 lg:w-1/2 w-full overflow-y-auto no-scrollbar">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto px-4">
        <div className="flex justify-center mb-8">
          <Image
            src="https://cdn.sendexa.co/images/logo/exaweb.png"
            alt="Sendexa Logo"
            width={150}
            height={50}
          />
        </div>

        <div className="text-center">
          <div className="mb-4 text-green-500">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          
          <h1 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white">
            Signup Successful!
          </h1>
          
          <p className="mb-4 text-gray-500 dark:text-gray-400">
            Thank you for signing up. We&apos;ve sent a verification email to your email address.
          </p>
          
          <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
            Please check your inbox and click the verification link to activate your account. 
            If you don&apos;t see the email, check your spam folder.
          </p>

          <div className="space-y-3">
            <Button asChild className="w-full">
              <Link href="/login">Go to Login</Link>
            </Button>
            
            <Button variant="outline" asChild className="w-full">
              <Link href="/">Back to Home</Link>
            </Button>
          </div>

          <div className="mt-6 text-sm text-gray-500 dark:text-gray-400">
            Didn&apos;t receive the email?{" "}
            <Link href="/resend-verification" className="text-brand-500 hover:text-brand-600 dark:text-brand-400">
              Resend verification email
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}