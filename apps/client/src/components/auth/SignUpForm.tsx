// /* eslint-disable @typescript-eslint/no-unused-vars */
// "use client";

// import { useForm } from "react-hook-form";
// import { z } from "zod";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { toast } from "sonner";
// import { useState } from "react";
// import Link from "next/link";
// import Image from "next/image";
// import { useRouter } from "next/navigation";
// import { EyeIcon, EyeOff as EyeCloseIcon } from "lucide-react";

// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Checkbox } from "@/components/ui/checkbox";
// import { Button } from "@/components/ui/button";

// // ✅ Schema now matches backend
// const schema = z.object({
//   businessName: z.string().min(1, "Business name is required"),
//   firstName: z.string().min(1, "First name is required"),
//   lastName: z.string().min(1, "Last name is required"),
//   email: z.string().email("Invalid email address"),
//   phone: z.string().min(7, "Phone number is too short"),
//   password: z.string().min(6, "Password must be at least 6 characters"),
//   terms: z.boolean().refine((val) => val, {
//     message: "You must agree to the terms",
//   }),
// });

// type FormData = z.infer<typeof schema>;

// export default function SignUpForm() {
//   const [showPassword, setShowPassword] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [signupSuccess, setSignupSuccess] = useState(false);
//   const router = useRouter();

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//     watch,
//     setValue,
//   } = useForm<FormData>({
//     resolver: zodResolver(schema),
//     defaultValues: {
//       businessName: "",
//       firstName: "",
//       lastName: "",
//       email: "",
//       phone: "",
//       password: "",
//       terms: false,
//     },
//   });

//   const onSubmit = async (data: FormData) => {
//     setLoading(true);
//     try {
//       const res = await fetch("/api/auth/signup", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           firstName: data.firstName,
//           lastName: data.lastName,
//           email: data.email,
//           phone: data.phone,
//           password: data.password,
//           businessName: data.businessName,
//         }),
//       });

//       const result = await res.json();

//       if (!res.ok) {
//         // show backend error if available
//         toast.error(result.message || result.error || "Signup failed");
//       } else {
//         setSignupSuccess(true);
//         toast.success(
//           result.message || "Signup successful! Check your email to verify."
//         );

//         // Redirect to success page after a short delay
//         setTimeout(() => {
//           router.push("/signup-success");
//         }, 1500);
//       }
//     } catch (err) {
//       toast.error("Something went wrong. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const termsValue = watch("terms");

//   // If signup was successful, show a loading state before redirect
//   if (signupSuccess) {
//     return (
//       <div className="flex flex-col flex-1 lg:w-1/2 w-full overflow-y-auto no-scrollbar">
//         <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
//           <div className="flex justify-center mb-8">
//             <Image
//               src="/xtopay.png"
//               alt="Xtopay Logo"
//               width={150}
//               height={50}
//             />
//           </div>

//           <div className="text-center">
//             <div className="mb-4">
//               <div className="w-16 h-16 mx-auto border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
//             </div>
//             <h1 className="mb-2 text-xl font-semibold text-gray-800 dark:text-white">
//               Signup Successful!
//             </h1>
//             <p className="text-gray-500 dark:text-gray-400">
//               Redirecting to confirmation page...
//             </p>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="flex flex-col flex-1 lg:w-1/2 w-full overflow-y-auto md:no-scrollbar py-8">
//       <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
//         <div className="flex justify-center mb-8">
//           <Image src="/xtopay.png" alt="Xtopay Logo" width={150} height={50} />
//         </div>

//         <div className="mb-5 sm:mb-8">
//           <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white sm:text-title-md">
//             Sign Up
//           </h1>
//           <p className="text-sm text-gray-500 dark:text-gray-400">
//             Enter your details to create your account.
//           </p>
//         </div>

//         <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
//           <div>
//             <Label htmlFor="businessName">Business Name</Label>
//             <Input
//               id="businessName"
//               type="text"
//               {...register("businessName")}
//             />
//             {errors.businessName && (
//               <p className="text-sm text-error-500 mt-1">
//                 {errors.businessName.message}
//               </p>
//             )}
//           </div>
//           <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
//             <div>
//               <Label htmlFor="firstName">First Name</Label>
//               <Input id="firstName" {...register("firstName")} />
//               {errors.firstName && (
//                 <p className="text-sm text-error-500 mt-1">
//                   {errors.firstName.message}
//                 </p>
//               )}
//             </div>
//             <div>
//               <Label htmlFor="lastName">Last Name</Label>
//               <Input id="lastName" {...register("lastName")} />
//               {errors.lastName && (
//                 <p className="text-sm text-error-500 mt-1">
//                   {errors.lastName.message}
//                 </p>
//               )}
//             </div>
//           </div>

//           <div>
//             <Label htmlFor="email">Email</Label>
//             <Input id="email" type="email" {...register("email")} />
//             {errors.email && (
//               <p className="text-sm text-error-500 mt-1">
//                 {errors.email.message}
//               </p>
//             )}
//           </div>

//           <div>
//             <Label htmlFor="phone">Phone Number</Label>
//             <Input id="phone" type="tel" {...register("phone")} />
//             {errors.phone && (
//               <p className="text-sm text-error-500 mt-1">
//                 {errors.phone.message}
//               </p>
//             )}
//           </div>

//           <div>
//             <Label htmlFor="password">Password</Label>
//             <div className="relative">
//               <Input
//                 id="password"
//                 type={showPassword ? "text" : "password"}
//                 {...register("password")}
//               />
//               <span
//                 onClick={() => setShowPassword(!showPassword)}
//                 className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
//               >
//                 {showPassword ? (
//                   <EyeIcon size={18} />
//                 ) : (
//                   <EyeCloseIcon size={18} />
//                 )}
//               </span>
//             </div>
//             {errors.password && (
//               <p className="text-sm text-error-500 mt-1">
//                 {errors.password.message}
//               </p>
//             )}
//           </div>

//           <div className="mt-5"></div>

//           <div className="flex items-start space-x-2">
//             <Checkbox
//               id="terms"
//               checked={termsValue}
//               onCheckedChange={(checked) => setValue("terms", checked === true)}
//               className="data-[state=checked]:bg-brand-950 data-[state=checked]:border-brand-950 data-[state=checked]:text-white"
//             />
//             <Label
//               htmlFor="terms"
//               className="text-sm font-normal text-gray-600 dark:text-gray-400"
//             >
//               I agree to the{" "}
//               <Link
//                 href="https://xtopay.co/legal/terms"
//                 className="text-brand-500 hover:underline"
//               >
//                 Terms and Conditions
//               </Link>{" "}
//               and{" "}
//               <Link
//                 href="https://xtopay.co/legal/privacy"
//                 className="text-brand-500 hover:underline"
//               >
//                 Privacy Policy
//               </Link>
//             </Label>
//           </div>
//           {errors.terms && (
//             <p className="text-sm text-error-500 mt-1">
//               {errors.terms.message}
//             </p>
//           )}

//           <Button
//             type="submit"
//             disabled={loading}
//             className="w-full flex items-center justify-center bg-brand-500 hover:bg-brand-600 focus:ring-4 focus:ring-brand-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center disabled:opacity-50 text-white"
//           >
//             {loading && (
//               <div className="w-4 h-4 mr-2 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
//             )}
//             {loading ? "Signing up..." : "Sign Up"}
//           </Button>
//         </form>

//         <div className="mt-5">
//           <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
//             Already have an account?{" "}
//             <Link
//               href="/login"
//               className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
//             >
//               Login
//             </Link>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }

/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { EyeIcon, EyeOff as EyeCloseIcon } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

// ✅ Schema matches backend requirements
const schema = z.object({
  businessName: z.string().min(1, "Business name is required"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(7, "Phone number is too short"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  terms: z.boolean().refine((val) => val, {
    message: "You must agree to the terms",
  }),
});

type FormData = z.infer<typeof schema>;

export default function SignUpForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      businessName: "",
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
      terms: false,
    },
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone: data.phone,
          password: data.password,
          businessName: data.businessName,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        // show backend error if available
        toast.error(result.message || result.error || "Signup failed");
      } else {
        setSignupSuccess(true);
        toast.success(
          result.message || "Signup successful! Check your email to verify."
        );

        // Redirect to success page after a short delay
        setTimeout(() => {
          router.push("/signup-success");
        }, 1500);
      }
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const termsValue = watch("terms");

  // If signup was successful, show a loading state before redirect
  if (signupSuccess) {
    return (
      <div className="flex flex-col flex-1 lg:w-1/2 w-full overflow-y-auto no-scrollbar">
        <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
          <div className="flex justify-center mb-8">
            <Image
              src="https://cdn.sendexa.co/images/logo/exaweb.png"
              alt="Sendexa Logo"
              width={120}
              height={50}
            />
          </div>

          <div className="text-center">
            <div className="mb-4">
              <div className="w-16 h-16 mx-auto border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <h1 className="mb-2 text-xl font-semibold text-gray-800 dark:text-white">
              Signup Successful!
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              Redirecting to confirmation page...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 lg:w-1/2 w-full overflow-y-auto md:no-scrollbar py-8">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div className="flex justify-center mb-8">
          <Image
            src="https://cdn.sendexa.co/images/logo/exaweb.png"
            alt="Sendexa Logo"
            width={120}
            height={50}
          />
        </div>

        <div className="mb-5 sm:mb-8">
          <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white sm:text-title-md">
            Sign Up
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Enter your details to create your account.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <Label htmlFor="businessName">Business Name</Label>
            <Input
              id="businessName"
              type="text"
              {...register("businessName")}
            />
            {errors.businessName && (
              <p className="text-sm text-red-500 mt-1">
                {errors.businessName.message}
              </p>
            )}
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <Label htmlFor="firstName">First Name</Label>
              <Input id="firstName" {...register("firstName")} />
              {errors.firstName && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.firstName.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="lastName">Last Name</Label>
              <Input id="lastName" {...register("lastName")} />
              {errors.lastName && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.lastName.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" {...register("email")} />
            {errors.email && (
              <p className="text-sm text-red-500 mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="phone">Phone Number</Label>
            <Input id="phone" type="tel" {...register("phone")} />
            {errors.phone && (
              <p className="text-sm text-red-500 mt-1">
                {errors.phone.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                {...register("password")}
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
              >
                {showPassword ? (
                  <EyeIcon size={18} />
                ) : (
                  <EyeCloseIcon size={18} />
                )}
              </span>
            </div>
            {errors.password && (
              <p className="text-sm text-red-500 mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <div className="mt-5"></div>

          <div className="flex items-start space-x-2">
            <Checkbox
              id="terms"
              checked={termsValue}
              onCheckedChange={(checked) => setValue("terms", checked === true)}
              className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 data-[state=checked]:text-white"
            />
            <Label
              htmlFor="terms"
              className="text-sm font-normal text-gray-600 dark:text-gray-400"
            >
              I agree to the{" "}
              <Link
                href="https://sendexa.co/legal/terms" // Updated to Sendexa URL
                className="text-blue-600 hover:underline"
              >
                Terms and Conditions
              </Link>{" "}
              and{" "}
              <Link
                href="https://sendexa.co/legal/privacy" // Updated to Sendexa URL
                className="text-blue-600 hover:underline"
              >
                Privacy Policy
              </Link>
            </Label>
          </div>
          {errors.terms && (
            <p className="text-sm text-red-500 mt-1">{errors.terms.message}</p>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center disabled:opacity-50 text-white"
          >
            {loading && (
              <div className="w-4 h-4 mr-2 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
            )}
            {loading ? "Signing up..." : "Sign Up"}
          </Button>
        </form>

        <div className="mt-5">
          <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-blue-600 hover:text-blue-700 dark:text-blue-400"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
