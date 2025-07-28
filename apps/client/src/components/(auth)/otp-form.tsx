"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import Image from "next/image"
import { useState } from "react"

export function OTPForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""))

  const handleChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return // allow only one digit
    const updated = [...otp]
    updated[index] = value
    setOtp(updated)

    // Move to next input
    const next = document.getElementById(`otp-${index + 1}`)
    if (value && next) (next as HTMLInputElement).focus()
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8 w-full">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Enter OTP</h1>
                <p className="text-muted-foreground text-balance">
                  We sent a 6-digit code to your phone
                </p>
              </div>

              <div className="flex justify-between gap-2">
                {otp.map((digit, index) => (
                  <Input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    className="text-center text-lg font-bold w-full h-12"
                  />
                ))}
              </div>

              <Button type="submit" className="w-full">
                Verify
              </Button>

              <div className="text-center text-sm text-muted-foreground">
                Didn&apos;t receive it?{" "}
                <button type="button" className="text-primary underline">
                  Resend OTP
                </button>
              </div>
            </div>
          </form>

          <div className="bg-muted relative hidden md:block">
            <img
              src="https://cdn.sendexa.co/images/carousel/ussd.jpg"
              alt="OTP Side Image"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
