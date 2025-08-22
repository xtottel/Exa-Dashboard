// "use client";

// import { useForm } from "react-hook-form";
// import { z } from "zod";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { toast } from "sonner";
// import { useState } from "react";
// import Link from "next/link";
// import Image from "next/image";
// import { EyeOff, Eye } from "lucide-react";
// import { useSearchParams } from "next/navigation";

// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Button } from "@/components/ui/button";

// // Schema
// const schema = z.object({
//   email: z.string().email({ message: "Invalid email address" }),
//   password: z.string().min(6, { message: "Password must be at least 6 characters" }),
// });

// type FormData = z.infer<typeof schema>;

// export default function LogInForm() {
//   const [showPassword, setShowPassword] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const searchParams = useSearchParams();
//   const redirectTo = searchParams.get('from') || '/apps/home';

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

//   // Function to set cookies securely
//   const setCookie = (name: string, value: string, days: number) => {
//     const expires = new Date();
//     expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    
//     document.cookie = `${name}=${value}; expires=${expires.toUTCString()}; path=/; secure=${process.env.NODE_ENV === 'production'}; sameSite=lax`;
//   };

//   // Function to handle successful login
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   const handleSuccessfulLogin = (result: any) => {
//     // Set access token cookie (1 week expiry)
//     if (result.accessToken) {
//       setCookie('accessToken', result.accessToken, 7);
//     }
    
//     // Set refresh token cookie (30 days expiry)
//     if (result.refreshToken) {
//       setCookie('refreshToken', result.refreshToken, 30);
//     }
    
//     // Set user data in localStorage for client-side access
//     if (result.user) {
//       localStorage.setItem('user', JSON.stringify(result.user));
//     }
    
//     // Set Bearer token for immediate API calls
//     if (result.accessToken) {
//       localStorage.setItem('bearerToken', result.accessToken);
//     }
    
//     toast.success("Login successful!");
    
//     // Redirect to intended page or dashboard
//     window.location.href = redirectTo;
//   };

//   const onSubmit = async (data: FormData) => {
//     setLoading(true);
//     try {
//       const res = await fetch("https://onetime.sendexa.co/api/auth/login", {
//         method: "POST",
//         headers: { 
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(data),
//         credentials: 'include', // Include cookies in request
//       });

//       const result = await res.json();

//       if (!res.ok) {
//         toast.error(result.error || "Login failed");
//       } else {
//         handleSuccessfulLogin(result);
//       }
//     } catch (error) {
//       console.error('Login error:', error);
//       toast.error("Something went wrong. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

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
//                   {showPassword ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
//                 </button>
//               </div>
//               {errors.password && (
//                 <p className="text-sm text-red-500">{errors.password.message}</p>
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
//             <Button type="submit" className="w-full" disabled={loading}>
//               {loading ? "Logging in..." : "Login"}
//             </Button>

//           </form>

//           {/* Footer */}
//           <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
//             Don&apos;t have an account?{" "}
//             <Link
//               href="/signup"
//               className="text-brand-500 hover:underline"
//             >
//               Sign Up
//             </Link>
//           </div>

//           {/* Privacy Notice */}
//           <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
//             <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
//               By logging in, you agree to our{" "}
//               <Link href="https://sendexa.co/legal/terms" className="text-brand-500 hover:underline">
//                 Terms of Service
//               </Link>{" "}
//               and{" "}
//               <Link href="https://sendexa.co/legal/privacy" className="text-brand-500 hover:underline">
//                 Privacy Policy
//               </Link>
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { EyeOff, Eye } from "lucide-react";
import { useSearchParams } from "next/navigation";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

// Schema
const schema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

type FormData = z.infer<typeof schema>;

export default function LogInForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [redirectTo, setRedirectTo] = useState('/home');
  const searchParams = useSearchParams();

  useEffect(() => {
    // This ensures we only access searchParams on the client side
    if (searchParams) {
      setRedirectTo(searchParams.get('from') || '/home');
    }
  }, [searchParams]);

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

  // Function to set cookies securely
  const setCookie = (name: string, value: string, days: number) => {
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    
    document.cookie = `${name}=${value}; expires=${expires.toUTCString()}; path=/; secure=${process.env.NODE_ENV === 'production'}; sameSite=lax`;
  };

  // Function to handle successful login
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSuccessfulLogin = (result: any) => {
    // Set access token cookie (1 week expiry)
    if (result.accessToken) {
      setCookie('accessToken', result.accessToken, 7);
    }
    
    // Set refresh token cookie (30 days expiry)
    if (result.refreshToken) {
      setCookie('refreshToken', result.refreshToken, 30);
    }
    
    // Set user data in localStorage for client-side access
    if (result.user) {
      localStorage.setItem('user', JSON.stringify(result.user));
    }
    
    // Set Bearer token for immediate API calls
    if (result.accessToken) {
      localStorage.setItem('bearerToken', result.accessToken);
    }
    
    toast.success("Login successful!");
    
    // Redirect to intended page or dashboard
    window.location.href = redirectTo;
  };

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const res = await fetch("https://onetime.sendexa.co/api/auth/login", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        credentials: 'include', // Include cookies in request
      });

      const result = await res.json();

      if (!res.ok) {
        toast.error(result.error || "Login failed");
      } else {
        handleSuccessfulLogin(result);
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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
                  {showPassword ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-red-500">{errors.password.message}</p>
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
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </Button>

          </form>

          {/* Footer */}
          <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="text-brand-500 hover:underline"
            >
              Sign Up
            </Link>
          </div>

          {/* Privacy Notice */}
          <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
              By logging in, you agree to our{" "}
              <Link href="https://sendexa.co/legal/terms" className="text-brand-500 hover:underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="https://sendexa.co/legal/privacy" className="text-brand-500 hover:underline">
                Privacy Policy
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}