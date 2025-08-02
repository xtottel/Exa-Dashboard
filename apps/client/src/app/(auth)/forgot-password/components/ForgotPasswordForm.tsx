"use client";

import React, { useState } from "react";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Link from "next/link";
import Image from "next/image";

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMessage("Please enter a valid email address.");
      setSuccessMessage("");
      return;
    }

    // Clear messages
    setErrorMessage("");
    setSuccessMessage("A password reset link has been sent to your email.");

    // TODO: Integrate with backend or Supabase forgot password
    console.log("Password reset link sent to:", email);
  };

  return (
    <div className="flex flex-col flex-1 w-full lg:w-1/2 min-h-screen">
      <div className="flex justify-center mb-8 ">
        <Image
          src="https://cdn.sendexa.co/images/logo/exaweb.png"
          alt="Sendexa Logo"
          width={150}
          height={48}
        />
      </div>

      <div className="flex flex-col justify-center w-full max-w-md mx-auto">
        <div className="mb-6 text-center">
          <h1 className="text-title-md font-semibold text-gray-800 dark:text-white">
            Forgot Your Password?
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Enter your email address to receive a password reset link.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="email">
              Email Address <span className="text-error-500">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={handleEmailChange}
              placeholder="Enter your email address"
             
            />
          </div>

          {errorMessage && (
            <p className="text-sm text-error-500 text-center">{errorMessage}</p>
          )}

          {successMessage && (
            <p className="text-sm text-success-500 text-center">
              {successMessage}
            </p>
          )}

          <button
            type="submit"
            className="w-full px-4 py-3 text-sm font-medium text-white bg-brand-500 hover:bg-brand-600 rounded-lg shadow-theme-xs transition"
          >
            Send Reset Link
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Remember your password?{" "}
            <Link
              href="/login"
              className="text-brand-500 hover:underline font-medium"
            >
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordForm;
