import { OTPForm } from "@/components/(auth)/otp-form"

export default function OTPPage() {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center px-2">
      <div className="w-full max-w-sm md:max-w-3xl">
        <OTPForm />
      </div>
    </div>
  )
}
