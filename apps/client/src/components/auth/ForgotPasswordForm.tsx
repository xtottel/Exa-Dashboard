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

const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

type ForgotPasswordData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordForm() {
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ForgotPasswordData) => {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      if (!res.ok) {
        toast.error(result.error || "Failed to send reset email");
      } else {
        toast.success("Password reset email sent! Check your inbox.");
        setEmailSent(true);
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col flex-1 lg:w-1/2 w-full overflow-y-auto no-scrollbar">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto px-4">
        <div className="flex justify-center mb-8">
          <Image
            src="https://cdn.sendexa.co/images/logo/exaweb.png"
            alt="Sendexa Logo"
            width={120}
            height={50}
          />
        </div>

        {emailSent ? (
          <div className="text-center p-6 bg-green-50 dark:bg-green-900/20 rounded-lg">
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
              Check Your Email
            </h1>
            <p className="mb-4 text-gray-500 dark:text-gray-400">
              We&apos;ve sent password reset instructions to your email address.
            </p>
            <Button asChild className="w-full">
              <Link href="/login">Back to Login</Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="mb-6 text-center">
              <h1 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white">
                Forgot Password
              </h1>
              <p className="text-gray-500 dark:text-gray-400">
                Enter your email to receive a password reset link.
              </p>
            </div>

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
                  <p className="text-sm text-error-500 mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center bg-brand-500 hover:bg-brand-600 focus:ring-4 focus:ring-brand-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center disabled:opacity-50 text-white"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 mr-2 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
                    Sending...
                  </>
                ) : (
                  "Send Reset Link"
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm font-normal text-gray-700 dark:text-gray-400">
                Remember your password?{" "}
                <Link
                  href="/login"
                  className="text-brand-500 hover:text-brand-600 dark:text-brand-400 font-medium"
                >
                  Login
                </Link>
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
