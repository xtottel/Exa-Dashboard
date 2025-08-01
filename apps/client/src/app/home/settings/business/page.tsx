// app/settings/business/page.tsx
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function BusinessProfilePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/home/settings">
            <ChevronLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Business Profile</h1>
          <p className="text-muted-foreground">
            Update your company details
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Company Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="companyName">Company Name</Label>
            <Input id="companyName" defaultValue="Sendexa Inc" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Business Address</Label>
            <Input id="address" defaultValue="123 Business Ave, Accra" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input id="city" defaultValue="Accra" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Input id="country" defaultValue="Ghana" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Company Email</Label>
              <Input id="email" type="email" defaultValue="ceo@sendexa.co" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Company Phone Number</Label>
              <Input id="phone" type="tel" defaultValue="0551196764" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="taxId">Tax Identification Number</Label>
            <Input id="taxId" defaultValue="C123456789" />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button>Save Changes</Button>
      </div>
    </div>
  );
}