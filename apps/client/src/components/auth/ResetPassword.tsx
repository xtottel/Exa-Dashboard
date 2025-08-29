/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useEffect, useState, Suspense } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const resetPasswordSchema = z
  .object({
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type ResetPasswordData = z.infer<typeof resetPasswordSchema>;

function ResetPasswordContent() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [tokenValid, setTokenValid] = useState<boolean | null>(null);
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams?.get("token");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  // Verify token validity on component mount
  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setTokenValid(false);
        toast.error("Invalid or missing reset token");
        return;
      }

      try {
        // Check if token exists and is not expired
        // Since we don't have a verify endpoint, we'll try to use the reset endpoint
        // with a dummy password to check token validity
        const res = await fetch(
          "https://onetime.sendexa.co/api/auth/reset-password",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              token,
              newPassword: "dummy_password_check",
            }),
          }
        );

        const result = await res.json();

        // If we get a specific error about invalid token, mark as invalid
        if (res.status === 404 || res.status === 400) {
          setTokenValid(false);
          toast.error(result.message || "Invalid or expired reset token");
        } else {
          // For other errors (like password validation), consider token valid
          setTokenValid(true);
        }
      } catch (err) {
        // If there's a network error, we can't determine token validity
        setTokenValid(true); // Assume valid and let the actual reset handle the error
      }
    };

    if (token) {
      verifyToken();
    } else {
      setTokenValid(false);
      toast.error("Invalid or missing reset token");
    }
  }, [token]);

  const onSubmit = async (data: ResetPasswordData) => {
    if (!token) {
      toast.error("Invalid reset token");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        "https://onetime.sendexa.co/api/auth/reset-password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            token,
            newPassword: data.newPassword,
          }),
        }
      );

      const result = await res.json();
      if (!res.ok) {
        toast.error(result.message || "Password reset failed");
        setStatus("error");

        // If token is invalid, update state
        if (res.status === 404 || res.status === 400) {
          setTokenValid(false);
        }
      } else {
        toast.success("Password reset successfully!");
        setStatus("success");
        // Redirect to login after 3 seconds
        setTimeout(() => {
          router.push("/login");
        }, 3000);
      }
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  if (tokenValid === null) {
    return (
      <div className="text-center">
        <div className="mb-4">
          <div className="w-16 h-16 mx-auto border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
        <h1 className="mb-2 text-xl font-semibold text-gray-800 dark:text-white">
          Verifying reset link...
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          Please wait while we verify your reset link.
        </p>
      </div>
    );
  }

  if (!tokenValid) {
    return (
      <div className="text-center">
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
          Invalid Reset Link
        </h1>
        <p className="mb-4 text-gray-500 dark:text-gray-400">
          This password reset link is invalid or has expired.
        </p>
        <Button
          asChild
          className="w-full flex items-center justify-center bg-brand-500 hover:bg-brand-600 focus:ring-4 focus:ring-brand-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center disabled:opacity-50 text-white"
        >
          <Link href="/forgot-password">Request New Reset Link</Link>
        </Button>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="text-center">
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
          Password Reset Successfully!
        </h1>
        <p className="mb-4 text-gray-500 dark:text-gray-400">
          Your password has been updated. Redirecting to login page...
        </p>
        <Button asChild className="w-full">
          <Link href="/login">Go to Login Now</Link>
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="mb-6 text-center">
        <h1 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white">
          Set New Password
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          Please enter your new password below.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <Label htmlFor="newPassword">New Password</Label>
          <Input
            id="newPassword"
            type="password"
            placeholder="Enter new password"
            {...register("newPassword")}
          />
          {errors.newPassword && (
            <p className="text-sm text-error-500 mt-1">
              {errors.newPassword.message}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="Confirm new password"
            {...register("confirmPassword")}
          />
          {errors.confirmPassword && (
            <p className="text-sm text-error-500 mt-1">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? (
            <>
              <div className="w-4 h-4 mr-2 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
              Resetting...
            </>
          ) : (
            "Reset Password"
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
  );
}

// Fallback component for Suspense
function ResetPasswordFallback() {
  return (
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
  );
}

export default function ResetPassword() {
  return (
    <div className="flex flex-col flex-1 lg:w-1/2 w-full overflow-y-auto no-scrollbar">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto px-4">
        <div className="flex justify-center mb-8">
          <Image src="/xtopay.png" alt="Xtopay Logo" width={150} height={50} />
        </div>

        <Suspense fallback={<ResetPasswordFallback />}>
          <ResetPasswordContent />
        </Suspense>
      </div>
    </div>
  );
}
