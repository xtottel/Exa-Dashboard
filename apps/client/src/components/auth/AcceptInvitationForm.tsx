
// components/forms/AcceptInvitationForm.tsx
"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";

function AcceptInvitationContent() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    password: "",
    confirmPassword: "",
  });
  const searchParams = useSearchParams();
  const router = useRouter();

  const token = searchParams?.get("token");
  const email = searchParams?.get("email");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/business/invitations/accept", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          email,
          password: formData.password,
          firstName: formData.firstName,
          lastName: formData.lastName,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        toast.error(result.message || "Failed to accept invitation");
      } else {
        toast.success("Invitation accepted successfully!");
        router.push("/home");
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  if (!token || !email) {
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
            />
          </svg>
        </div>
        <h1 className="mb-2 text-xl font-semibold text-gray-800 dark:text-white">
          Invalid Invitation
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          The invitation link is invalid or missing required parameters.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="mb-6 text-center">
        <h1 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white">
          Join the Team
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          You&apos;ve been invited to join a business on Sendexa
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="firstName" className="text-gray-700 dark:text-gray-300">
              First Name
            </Label>
            <Input
              id="firstName"
              name="firstName"
              type="text"
              required
              value={formData.firstName}
              onChange={handleChange}
              disabled={loading}
              className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
            />
          </div>
          <div>
            <Label htmlFor="lastName" className="text-gray-700 dark:text-gray-300">
              Last Name
            </Label>
            <Input
              id="lastName"
              name="lastName"
              type="text"
              required
              value={formData.lastName}
              onChange={handleChange}
              disabled={loading}
              className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            value={email}
            disabled
            className="bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
          />
        </div>

        <div>
          <Label htmlFor="password" className="text-gray-700 dark:text-gray-300">
            Password
          </Label>
          <Input
            id="password"
            name="password"
            type="password"
            required
            value={formData.password}
            onChange={handleChange}
            disabled={loading}
            className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
          />
        </div>

        <div>
          <Label htmlFor="confirmPassword" className="text-gray-700 dark:text-gray-300">
            Confirm Password
          </Label>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            required
            value={formData.confirmPassword}
            onChange={handleChange}
            disabled={loading}
            className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
          />
        </div>

        <Button 
          type="submit" 
          className="w-full bg-brand-500 hover:bg-brand-600 text-white" 
          disabled={loading}
        >
          {loading ? (
            <>
              <div className="w-4 h-4 mr-2 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
              Accepting Invitation...
            </>
          ) : (
            "Accept Invitation"
          )}
        </Button>
      </form>
    </>
  );
}

function AcceptInvitationFallback() {
  return (
    <div className="text-center">
      <div className="mb-4">
        <div className="w-16 h-16 mx-auto border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
      <h1 className="mb-2 text-xl font-semibold text-gray-800 dark:text-white">
        Loading invitation...
      </h1>
      <p className="text-gray-500 dark:text-gray-400">
        Please wait while we load your invitation.
      </p>
    </div>
  );
}

export default function AcceptInvitationForm() {
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

        <Suspense fallback={<AcceptInvitationFallback />}>
          <AcceptInvitationContent />
        </Suspense>
      </div>
    </div>
  );
}
