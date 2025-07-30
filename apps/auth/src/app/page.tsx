//redirect to /login

import { redirect } from "next/navigation";

export default function LoginPage() {
  // Redirect to the form page if already logged in
  redirect("/login");
  
  return (
    <main className="min-h-screen flex items-center justify-center px-4 bg-white text-black">
      <div className="w-full max-w-sm space-y-6">
        <h1 className="text-2xl font-semibold text-center">
          Redirecting to Login...
        </h1>
      </div>
    </main>
  );
}