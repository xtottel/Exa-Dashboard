"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const resendVerificationSchema = z.object({
  email: z.string().email("Invalid email address"),
});

type ResendVerificationData = z.infer<typeof resendVerificationSchema>;

export default function ResendVerificationForm() {
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<ResendVerificationData>({
    resolver: zodResolver(resendVerificationSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ResendVerificationData) => {
    setLoading(true);
    setApiError(null); // Clear previous errors

    try {
      const res = await fetch("https://onetime.sendexa.co/api/auth/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      
      if (!res.ok) {
        // Display API error message to the user
        const errorMessage = result.message || result.error || "Failed to send verification email";
        setApiError(errorMessage);
        
        // You can also set field-specific errors if needed
        if (result.field === 'email') {
          setError('email', { message: errorMessage });
        }
        
        toast.error(errorMessage);
      } else {
        setSuccess(true);
        setApiError(null);
        toast.success(result.message || "Verification email sent! Check your inbox.");
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      const errorMessage = "Something went wrong. Please try again.";
      setApiError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex flex-col flex-1 lg:w-1/2 w-full overflow-y-auto no-scrollbar">
        <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto px-4">
          <div className="flex justify-center mb-8">
          <Image src="/xtopay.png" alt="Xtopay Logo" width={150} height={50} />
          </div>

          <div className="text-center">
            <div className="mb-4 text-green-500">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            
            <h1 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white">
              Verification Email Sent!
            </h1>
            
            <p className="mb-4 text-gray-500 dark:text-gray-400">
              We&apos;ve sent a new verification email to your inbox.
            </p>
            
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
              Please check your email and click the verification link to activate your account. 
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
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 lg:w-1/2 w-full overflow-y-auto no-scrollbar">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto px-4">
        <div className="flex justify-center mb-8">
         <Image src="/xtopay.png" alt="Xtopay Logo" width={150} height={50} />
        </div>

        <div className="mb-6 text-center">
          <h1 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white">
            Resend Verification Email
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Enter your email to receive a new verification link.
          </p>
        </div>

        {/* Display API error message */}
        {apiError && (
          <div className="mb-4 p-3 bg-error-50 border border-error-200 rounded-lg text-error-700 text-sm">
            {apiError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <Label htmlFor="email">Email Address</Label>
            <Input 
              id="email" 
              type="email" 
              placeholder="Enter your email"
              {...register("email")} 
            />
            {errors.email && (
              <p className="text-sm text-error-500 mt-1">{errors.email.message}</p>
            )}
          </div>

          <Button 
            type="submit" 
            disabled={loading}
            className="w-full"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 mr-2 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
                Sending...
              </>
            ) : (
              "Send Verification Email"
            )}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm font-normal text-gray-700 dark:text-gray-400">
            Already verified?{" "}
            <Link
              href="/login"
              className="text-brand-500 hover:text-brand-600 dark:text-brand-400 font-medium"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}