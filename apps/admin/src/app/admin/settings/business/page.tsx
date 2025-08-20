
// app/settings/business/page.tsx
"use client";

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronLeft, Upload, Image, Globe,  Building2, Landmark } from "lucide-react";
import Link from "next/link";
import { useState, useRef } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function BusinessProfilePage() {
  const [logo, setLogo] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [businessType, setBusinessType] = useState("private");
  const [incorporationDate, setIncorporationDate] = useState("2020-01-15");

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        toast.error("Logo size should be less than 2MB");
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        setLogo(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Business profile updated successfully");
    }, 1500);
  };

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
            Update your company details and branding
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          {/* Company Branding Section */}
          <Card>
            <CardHeader>
              <CardTitle>Company Branding</CardTitle>
              <CardDescription>
                Upload your logo and set brand colors
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-6">
                <div className="relative group">
                  <Avatar className="h-24 w-24 rounded-lg">
                    <AvatarImage src={logo || "/Sendexa.jpg"} />
                    <AvatarFallback>
                      <Building2 className="h-12 w-12 text-muted-foreground" />
                    </AvatarFallback>
                  </Avatar>
                  <button
                    type="button"
                    onClick={triggerFileInput}
                    className="absolute -bottom-2 -right-2 bg-primary rounded-full p-2 shadow-sm hover:bg-primary/90 transition-colors group-hover:opacity-100 opacity-0"
                  >
                    <Image className="h-4 w-4 text-white" />
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleLogoUpload}
                    accept="image/*"
                    className="hidden"
                  />
                </div>
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    type="button"
                    onClick={triggerFileInput}
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Logo
                  </Button>
                  <p className="text-sm text-muted-foreground">
                    JPG, GIF or PNG. Max 2MB. Recommended: 500x500px
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Company Information Section */}
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
                <Label htmlFor="companyDescription">Company Description</Label>
                <Textarea 
                  id="companyDescription" 
                  defaultValue="Leading SMS communication platform in Ghana"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="businessType">Business Type</Label>
                  <Select value={businessType} onValueChange={setBusinessType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select business type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sole">Sole Proprietorship</SelectItem>
                      <SelectItem value="private">Private Limited</SelectItem>
                      <SelectItem value="public">Public Limited</SelectItem>
                      <SelectItem value="ngo">NGO</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="incorporationDate">Incorporation Date</Label>
                  <Input 
                    id="incorporationDate" 
                    type="date" 
                    value={incorporationDate}
                    onChange={(e) => setIncorporationDate(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Business Address</Label>
                <Input id="address" defaultValue="123 Business Ave, Accra" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input id="city" defaultValue="Accra" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="region">Region</Label>
                  <Input id="region" defaultValue="Greater Accra" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Input id="country" defaultValue="Ghana" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact & Legal Information */}
          <Card>
            <CardHeader>
              <CardTitle>Contact & Legal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Company Email</Label>
                  <Input id="email" type="email" defaultValue="ceo@sendexa.co" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Company Phone</Label>
                  <Input id="phone" type="tel" defaultValue="0551196764" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <Input id="website" type="url" defaultValue="https://sendexa.co" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="taxId">Tax Identification Number</Label>
                  <div className="flex items-center gap-2">
                    <Landmark className="h-4 w-4 text-muted-foreground" />
                    <Input id="taxId" defaultValue="C123456789" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="regNumber">Registration Number</Label>
                  <Input id="regNumber" defaultValue="CS12345678" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vatNumber">VAT Number</Label>
                  <Input id="vatNumber" defaultValue="VAT123456789" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Social Media & Additional Info */}
          <Card>
            <CardHeader>
              <CardTitle>Social Media & Additional Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="facebook">Facebook</Label>
                  <Input id="facebook" placeholder="https://facebook.com/yourpage" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="twitter">Twitter</Label>
                  <Input id="twitter" placeholder="https://twitter.com/yourhandle" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="linkedin">LinkedIn</Label>
                  <Input id="linkedin" placeholder="https://linkedin.com/company/yourcompany" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="instagram">Instagram</Label>
                  <Input id="instagram" placeholder="https://instagram.com/yourhandle" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="businessHours">Business Hours</Label>
                <Input id="businessHours" defaultValue="Monday - Friday, 8:00 AM - 5:00 PM" />
              </div>
            </CardContent>
          </Card>

          {/* Documents Section */}
          <Card>
            <CardHeader>
              <CardTitle>Company Documents</CardTitle>
              <CardDescription>
                Upload important business documents
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Certificate of Incorporation</Label>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Document
                  </Button>
                  <span className="text-sm text-muted-foreground">PDF, Max 5MB</span>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Tax Clearance Certificate</Label>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Document
                  </Button>
                  <span className="text-sm text-muted-foreground">PDF, Max 5MB</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-2">
            <Button variant="outline" type="button" asChild>
              <Link href="/home/settings">Cancel</Link>
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}