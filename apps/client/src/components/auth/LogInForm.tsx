// "use client";

// import { useForm } from "react-hook-form";
// import { z } from "zod";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { toast } from "sonner";
// // eslint-disable-next-line @typescript-eslint/no-unused-vars
// import { useState, Suspense, useEffect } from "react";
// import Link from "next/link";
// import Image from "next/image";
// import { EyeOff, Eye } from "lucide-react";
// import { useRouter, useSearchParams } from "next/navigation";

// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Button } from "@/components/ui/button";

// // ✅ Schema
// const schema = z.object({
//   email: z.string().email({ message: "Invalid email address" }),
//   password: z
//     .string()
//     .min(6, { message: "Password must be at least 6 characters" }),
// });

// type FormData = z.infer<typeof schema>;

// function LoginFormContent() {
//   const [showPassword, setShowPassword] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [isRedirecting, setIsRedirecting] = useState(false);
//   const searchParams = useSearchParams();
//   const router = useRouter();

//   const redirectTo = searchParams?.get("from") || "/home";

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm<FormData>({
//     resolver: zodResolver(schema),
//     defaultValues: {
//       email: "",
//       password: "",
//     },
//   });

//   // ✅ Handle login success
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   const handleSuccessfulLogin = (result: any) => {
//     if (result.token) {
//       // Save token to localStorage
//       localStorage.setItem("bearerToken", result.token);
      
//       // Set token expiry (assuming 1 hour expiry - adjust based on your JWT expiry)
//       const expiryTime = Date.now() + (60 * 60 * 1000); // 1 hour
//       localStorage.setItem("tokenExpiry", expiryTime.toString());
      
//       // Also set a cookie for middleware compatibility
//       document.cookie = `token=${result.token}; path=/; max-age=${60 * 60}; secure=${process.env.NODE_ENV === "production"}; sameSite=lax`;
//     }

//     if (result.user) {
//       localStorage.setItem("user", JSON.stringify(result.user));
//     }

//     toast.success(result.message || "Login successful!");
    
//     // Set redirecting state and use router after a short delay
//     setIsRedirecting(true);
//     setTimeout(() => {
//       router.push(redirectTo);
//     }, 1000);
//   };

//   // ✅ Handle login errors
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   const handleApiErrors = (result: any) => {
//     if (result.errors && Array.isArray(result.errors)) {
//       result.errors.forEach((err: string) => toast.error(err));
//     } else if (typeof result.message === "string") {
//       toast.error(result.message);
//     } else if (typeof result.error === "string") {
//       toast.error(result.error);
//     } else {
//       toast.error("Login failed. Please try again.");
//     }
//   };

//   const onSubmit = async (data: FormData) => {
//     if (isRedirecting) return; // Prevent multiple submissions during redirect
    
//     setLoading(true);
//     try {
//       const res = await fetch("https://onetime.sendexa.co/api/auth/login", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(data),
//         credentials: "include",
//       });

//       const result = await res.json();

//       console.log("Login response:", result); // Debug log

//       if (!res.ok) {
//         handleApiErrors(result);
//       } else {
//         handleSuccessfulLogin(result);
//       }
//     } catch (error) {
//       console.error("Login error:", error);
//       toast.error("Something went wrong. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Show loading state when redirecting
//   if (isRedirecting) {
//     return (
//       <div className="flex flex-col flex-1 lg:w-1/2 w-full">
//         <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
//           <div className="flex justify-center mb-8">
//             <Image
//               src="https://cdn.sendexa.co/images/logo/exaweb.png"
//               alt="Sendexa Logo"
//               width={150}
//               height={50}
//             />
//           </div>
//           <div className="text-center">
//             <div className="mb-4">
//               <div className="w-16 h-16 mx-auto border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
//             </div>
//             <h1 className="mb-2 text-xl font-semibold text-gray-800 dark:text-white">
//               Redirecting...
//             </h1>
//             <p className="text-gray-500 dark:text-gray-400">
//               Login successful! Taking you to your dashboard.
//             </p>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="flex flex-col flex-1 lg:w-1/2 w-full">
//       <div className="w-full max-w-md sm:pt-10 mx-auto mb-5"></div>
//       <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
//         {/* Logo */}
//         <div className="flex justify-center mb-8 ">
//           <Image
//             src="https://cdn.sendexa.co/images/logo/exaweb.png"
//             alt="Sendexa Logo"
//             width={150}
//             height={50}
//           />
//         </div>

//         <div>
//           <div className="mb-5 sm:mb-8">
//             <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
//               Login
//             </h1>
//             <p className="text-sm text-gray-500 dark:text-gray-400">
//               Enter your email and password to login!
//             </p>
//           </div>

//           <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
//             {/* Email */}
//             <div className="space-y-2">
//               <Label htmlFor="email">
//                 Email <span className="text-red-500">*</span>
//               </Label>
//               <Input
//                 id="email"
//                 type="email"
//                 placeholder="email@example.com"
//                 {...register("email")}
//               />
//               {errors.email && (
//                 <p className="text-sm text-red-500">{errors.email.message}</p>
//               )}
//             </div>

//             {/* Password */}
//             <div className="space-y-2">
//               <Label htmlFor="password">
//                 Password <span className="text-red-500">*</span>
//               </Label>
//               <div className="relative">
//                 <Input
//                   id="password"
//                   type={showPassword ? "text" : "password"}
//                   placeholder="••••••••"
//                   {...register("password")}
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowPassword(!showPassword)}
//                   className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 focus:outline-none"
//                 >
//                   {showPassword ? (
//                     <Eye className="h-4 w-4" />
//                   ) : (
//                     <EyeOff className="h-4 w-4" />
//                   )}
//                 </button>
//               </div>
//               {errors.password && (
//                 <p className="text-sm text-red-500">
//                   {errors.password.message}
//                 </p>
//               )}
//             </div>

//             {/* Forgot Password */}
//             <div className="flex justify-end">
//               <Link
//                 href="/forgot-password"
//                 className="text-sm text-brand-500 hover:underline"
//               >
//                 Forgot password?
//               </Link>
//             </div>

//             {/* Submit Button */}
//             <Button 
//               type="submit" 
//               className="w-full" 
//               disabled={loading || isRedirecting}
//             >
//               {loading ? (
//                 <>
//                   <div className="w-4 h-4 mr-2 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
//                   Logging in...
//                 </>
//               ) : (
//                 "Login"
//               )}
//             </Button>
//           </form>

//           {/* Footer */}
//           <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
//             Don&apos;t have an account?{" "}
//             <Link href="/signup" className="text-brand-500 hover:underline">
//               Sign Up
//             </Link>
//           </div>

//           {/* Privacy Notice */}
//           <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
//             <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
//               By logging in, you agree to our{" "}
//               <Link
//                 href="https://sendexa.co/legal/terms"
//                 className="text-brand-500 hover:underline"
//               >
//                 Terms of Service
//               </Link>{" "}
//               and{" "}
//               <Link
//                 href="https://sendexa.co/legal/privacy"
//                 className="text-brand-500 hover:underline"
//               >
//                 Privacy Policy
//               </Link>
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// // Fallback component for Suspense
// function LoginFormFallback() {
//   return (
//     <div className="flex flex-col flex-1 lg:w-1/2 w-full">
//       <div className="w-full max-w-md sm:pt-10 mx-auto mb-5"></div>
//       <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
//         {/* Logo */}
//         <div className="flex justify-center mb-8">
//           <Image
//             src="https://cdn.sendexa.co/images/logo/exaweb.png"
//             alt="Sendexa Logo"
//             width={150}
//             height={50}
//           />
//         </div>

//         {/* Loading skeleton */}
//         <div className="animate-pulse">
//           <div className="h-8 bg-gray-200 rounded mb-4"></div>
//           <div className="h-4 bg-gray-200 rounded mb-6"></div>
//           <div className="space-y-4">
//             <div className="h-10 bg-gray-200 rounded"></div>
//             <div className="h-10 bg-gray-200 rounded"></div>
//             <div className="h-10 bg-gray-200 rounded"></div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default function LogInForm() {
//   return (
//     <Suspense fallback={<LoginFormFallback />}>
//       <LoginFormContent />
//     </Suspense>
//   );
// }


"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useState, Suspense, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { EyeOff, Eye } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

// ✅ Schema
const schema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

type FormData = z.infer<typeof schema>;

function LoginFormContent() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  const redirectTo = searchParams?.get("from") || "/home";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // ✅ Handle login success
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSuccessfulLogin = (result: any) => {
    console.log("✅ Login successful! Result:", result);
    
    if (result.token) {
      // Save token to localStorage
      localStorage.setItem("bearerToken", result.token);
      
      // Set token expiry (assuming 1 hour expiry - adjust based on your JWT expiry)
      const expiryTime = Date.now() + (60 * 60 * 1000); // 1 hour
      localStorage.setItem("tokenExpiry", expiryTime.toString());
      
      // Also set a cookie for middleware compatibility
      document.cookie = `token=${result.token}; path=/; max-age=${60 * 60}; secure=${process.env.NODE_ENV === "production"}; sameSite=lax`;
      console.log("✅ Token saved to cookie and localStorage");
    }

    if (result.user) {
      localStorage.setItem("user", JSON.stringify(result.user));
      console.log("✅ User data saved:", result.user);
    }

    toast.success(result.message || "Login successful!");
    
    // Set redirecting state and use router after a short delay
    setIsRedirecting(true);
    console.log("🚀 Redirecting to:", redirectTo);
    setTimeout(() => {
      router.push(redirectTo);
    }, 1000);
  };

  // ✅ Handle login errors
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleApiErrors = (result: any) => {
    console.error("❌ Login API error:", result);
    if (result.errors && Array.isArray(result.errors)) {
      result.errors.forEach((err: string) => toast.error(err));
    } else if (typeof result.message === "string") {
      toast.error(result.message);
    } else if (typeof result.error === "string") {
      toast.error(result.error);
    } else {
      toast.error("Login failed. Please try again.");
    }
  };

  const onSubmit = async (data: FormData) => {
    if (isRedirecting) return; // Prevent multiple submissions during redirect
    
    console.log("📤 Submitting login form with data:", { ...data, password: "***" });
    setLoading(true);
    try {
      const res = await fetch("https://onetime.sendexa.co/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        credentials: "include",
      });

      const result = await res.json();

      console.log("📥 Login response:", { 
        status: res.status, 
        ok: res.ok, 
        result 
      });

      if (!res.ok) {
        handleApiErrors(result);
      } else {
        handleSuccessfulLogin(result);
      }
    } catch (error) {
      console.error("❌ Login network error:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Show loading state when redirecting
  if (isRedirecting) {
    return (
      <div className="flex flex-col flex-1 lg:w-1/2 w-full">
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
              Redirecting...
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              Login successful! Taking you to your dashboard.
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
        <div className="flex justify-center mb-8 ">
          <Image
            src="https://cdn.sendexa.co/images/logo/exaweb.png"
            alt="Sendexa Logo"
            width={150}
            height={50}
          />
        </div>

        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Login
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Enter your email and password to login!
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">
                Email <span className="text-red-500">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="email@example.com"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">
                Password <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 focus:outline-none"
                >
                  {showPassword ? (
                    <Eye className="h-4 w-4" />
                  ) : (
                    <EyeOff className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Forgot Password */}
            <div className="flex justify-end">
              <Link
                href="/forgot-password"
                className="text-sm text-brand-500 hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <Button 
              type="submit" 
              className="w-full" 
              disabled={loading || isRedirecting}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 mr-2 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
                  Logging in...
                </>
              ) : (
                "Login"
              )}
            </Button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-brand-500 hover:underline">
              Sign Up
            </Link>
          </div>

          {/* Privacy Notice */}
          <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
              By logging in, you agree to our{" "}
              <Link
                href="https://sendexa.co/legal/terms"
                className="text-brand-500 hover:underline"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                href="https://sendexa.co/legal/privacy"
                className="text-brand-500 hover:underline"
              >
                Privacy Policy
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Fallback component for Suspense
function LoginFormFallback() {
  return (
    <div className="flex flex-col flex-1 lg:w-1/2 w-full">
      <div className="w-full max-w-md sm:pt-10 mx-auto mb-5"></div>
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Image
            src="https://cdn.sendexa.co/images/logo/exaweb.png"
            alt="Sendexa Logo"
            width={150}
            height={50}
          />
        </div>

        {/* Loading skeleton */}
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

export default function LogInForm() {
  return (
    <Suspense fallback={<LoginFormFallback />}>
      <LoginFormContent />
    </Suspense>
  );
}