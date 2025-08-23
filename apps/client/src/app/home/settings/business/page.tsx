

// app/settings/business/page.tsx
"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronLeft, Upload, Image as Image2, Building2} from "lucide-react";
import Link from "next/link";
import { useState, useRef } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function BusinessProfilePage() {
  const [logo, setLogo] = useState<string | null>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [businessType, setBusinessType] = useState("private");
  const [documents, setDocuments] = useState<{ [key: string]: File | null }>({
    certificate: null,
    formA: null,
  });



  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
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
    logoInputRef.current?.click();
  };

  const handleDocUpload = (key: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size should be less than 5MB");
        return;
      }
      setDocuments((prev) => ({ ...prev, [key]: file }));
      toast.success(`${file.name} uploaded successfully`);
    }
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
          {/* Company Branding */}
          <Card>
            <CardHeader>
              <CardTitle>Company Branding</CardTitle>
              <CardDescription>Upload your logo and set brand colors</CardDescription>
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
                    <Image2 className="h-4 w-4 text-white" />
                  </button>
                  <input
                    type="file"
                    ref={logoInputRef}
                    onChange={handleLogoUpload}
                    accept="image/*"
                    className="hidden"
                  />
                </div>
                <div className="space-y-2">
                  <Button variant="outline" type="button" onClick={triggerFileInput}>
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

          {/* Company Info */}
          <Card>
            <CardHeader>
              <CardTitle>Company Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="businessId">Business ID</Label>
                <Input id="businessId" value="exa-08025423" disabled />
              </div>

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
                  <Label htmlFor="address">Business Address</Label>
                  <Input id="address" defaultValue="123 Business Ave, Accra" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Documents */}
          <Card>
            <CardHeader>
              <CardTitle>Company Documents</CardTitle>
              <CardDescription>Upload important business documents</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                {/* Certificate of Incorporation */}
                <div className="space-y-2">
                  <Label>Certificate of Incorporation</Label>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      type="button"
                      onClick={() => document.getElementById("certificateInput")?.click()}
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      {documents.certificate ? "Change File" : "Upload Document"}
                    </Button>
                    <input
                      id="certificateInput"
                      type="file"
                      accept="application/pdf"
                      className="hidden"
                      onChange={(e) => handleDocUpload("certificate", e)}
                    />
                    {documents.certificate && (
                      <span className="text-sm">{documents.certificate.name}</span>
                    )}
                  </div>
                </div>

                {/* Form A */}
                <div className="space-y-2">
                  <Label>Form A</Label>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      type="button"
                      onClick={() => document.getElementById("formAInput")?.click()}
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      {documents.formA ? "Change File" : "Upload Document"}
                    </Button>
                    <input
                      id="formAInput"
                      type="file"
                      accept="application/pdf"
                      className="hidden"
                      onChange={(e) => handleDocUpload("formA", e)}
                    />
                    {documents.formA && (
                      <span className="text-sm">{documents.formA.name}</span>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action buttons */}
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
