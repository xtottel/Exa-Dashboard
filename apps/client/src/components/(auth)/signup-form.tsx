// components/signup-form.tsx
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div className={cn("flex flex-col gap-6  py-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Create your account</h1>
                <p className="text-muted-foreground text-balance">
                  Join Sendexa and start building
                </p>
              </div>

              <div className="grid gap-3">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" type="text" placeholder="John Doe" required />
              </div>

              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="m@example.com" required />
              </div>

              <div className="grid gap-3">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" type="tel" placeholder="+233xxxxxxxxx" required />
              </div>

              <div className="grid gap-3">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" required />
              </div>

              <Button type="submit" className="w-full">
                Sign Up
              </Button>

              <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                <span className="bg-card text-muted-foreground relative z-10 px-2">
                  Or continue with
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Button
                  variant="outline"
                  type="button"
                  className="w-full flex items-center justify-center gap-2"
                >
                  <Image src="/icons/google.svg" alt="Google Logo" width={30} height={30} />
                  <span className="sr-only">Sign up with Google</span>
                </Button>
                <Button
                  variant="outline"
                  type="button"
                  className="w-full flex items-center justify-center gap-2"
                >
                  <Image src="/icons/github.svg" alt="GitHub Logo" width={25} height={25} />
                  <span className="sr-only">Sign up with GitHub</span>
                </Button>
              </div>

              <div className="text-center text-sm">
                Already have an account?{" "}
                <a href="/login" className="underline underline-offset-4 text-primary">
                  Login
                </a>
              </div>
            </div>
          </form>

          <div className="bg-muted relative hidden md:block">
            <img
              src="https://cdn.sendexa.co/images/carousel/voice.jpg"
              alt="Signup Image"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
