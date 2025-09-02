
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
import {
  ChevronLeft,
  Upload,
  Image as Image2,
  Globe,
  Building2,
  X,
  FileText,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
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

interface BusinessProfile {
  id: string;
  name: string;
  phone: string;
  address: string;
  businessType: string;
  businessSector: string;
  description: string;
  email: string;
  website: string;
  logo: string | null;
  businessCertificate: string | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  settings: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  users: any[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  invitations: any[];
}

export default function BusinessProfilePage() {
  const [logo, setLogo] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [businessType, setBusinessType] = useState("private");
  const [businessSector, setBusinessSector] = useState("IT Services");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [businessProfile, setBusinessProfile] = useState<BusinessProfile | null>(null);
  const [formData, setFormData] = useState({
    companyName: "",
    companyDescription: "",
    address: "",
    phone: "",
    email: "",
    website: "",
  });

  // Fetch business profile on component mount
  useEffect(() => {
    fetchBusinessProfile();
  }, []);

  const fetchBusinessProfile = async () => {
    try {
      setIsLoadingProfile(true);
      const response = await fetch('/api/business/profile', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch business profile');
      }

      const data = await response.json();
      if (data.success && data.business) {
        setBusinessProfile(data.business);
        setBusinessType(data.business.businessType || "private");
        setBusinessSector(data.business.businessSector || "IT Services");
        setLogo(data.business.logo);
        setFormData({
          companyName: data.business.name || "",
          companyDescription: data.business.description || "",
          address: data.business.address || "",
          phone: data.business.phone || "",
          email: data.business.email || "",
          website: data.business.website || "",
        });
      }
    } catch (error) {
      console.error('Error fetching business profile:', error);
      toast.error('Failed to load business profile');
    } finally {
      setIsLoadingProfile(false);
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        // 2MB limit
        toast.error("Logo size should be less than 2MB");
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        setLogo(event.target?.result as string);
        setLogoFile(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [businessCertificate, setBusinessCertificate] = useState<any | null>(null);
  const [certificateFile, setCertificateFile] = useState<File | null>(null);

  function handleBusinessCertUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Certificate size should be less than 5MB");
      return;
    }

    setCertificateFile(file);
    setBusinessCertificate({
      id: Date.now(),
      name: file.name,
      preview: URL.createObjectURL(file),
    });
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.companyName);
      formDataToSend.append('description', formData.companyDescription);
      formDataToSend.append('address', formData.address);
      formDataToSend.append('phone', formData.phone);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('website', formData.website);
      formDataToSend.append('businessType', businessType);
      formDataToSend.append('businessSector', businessSector);

      if (logoFile) {
        formDataToSend.append('logo', logoFile);
      }

      if (certificateFile) {
        formDataToSend.append('businessCertificate', certificateFile);
      }

      const response = await fetch('/api/business/profile', {
        method: 'PUT',
        body: formDataToSend,
      });

      if (!response.ok) {
        throw new Error('Failed to update business profile');
      }

      const result = await response.json();
      
      if (result.success) {
        toast.success("Business profile updated successfully");
        // Refresh the profile data
        fetchBusinessProfile();
      } else {
        throw new Error(result.message || 'Update failed');
      }
    } catch (error) {
      console.error('Error updating business profile:', error);
      toast.error('Failed to update business profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  if (isLoadingProfile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/home/settings">
            <ChevronLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Business Profile
          </h1>
          <p className="text-muted-foreground">
            Update your company details, compliance information and branding
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
                    <AvatarImage src={logo || "/Sendexa1.jpg"} />
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
                <Input 
                  id="companyName" 
                  value={formData.companyName}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="companyDescription">Company Description</Label>
                <Textarea
                  id="companyDescription"
                  value={formData.companyDescription}
                  onChange={handleInputChange}
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
                  <Label htmlFor="businessSector">Business Sector</Label>
                  <Select
                    value={businessSector}
                    onValueChange={setBusinessSector}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select business Sector" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="IT Services">IT Services</SelectItem>
                      <SelectItem value="Finance">Finance</SelectItem>
                      <SelectItem value="Healthcare">Healthcare</SelectItem>
                      <SelectItem value="Education">Education</SelectItem>
                      <SelectItem value="Retail">Retail</SelectItem>
                      <SelectItem value="Manufacturing">
                        Manufacturing
                      </SelectItem>
                      <SelectItem value="Hospitality">Hospitality</SelectItem>
                      <SelectItem value="Transportation">
                        Transportation
                      </SelectItem>
                      <SelectItem value="Real Estate">Real Estate</SelectItem>
                      <SelectItem value="Consulting">Consulting</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="address">Business Address</Label>
                  <Input 
                    id="address" 
                    value={formData.address}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Company Phone</Label>
                  <Input 
                    id="phone" 
                    type="tel" 
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Company Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <Input
                      id="website"
                      type="url"
                      value={formData.website}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Compliance Documents Section */}
          <Card>
            <CardHeader>
              <CardTitle>Compliance Document</CardTitle>
              <CardDescription>
                Upload company registration documents (Business Certificate)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Business Certificate</Label>
                  <span className="text-sm text-muted-foreground">
                    {businessCertificate ? "1/1 file" : "0/1 file"}
                  </span>
                </div>

                {businessCertificate ? (
                  <div className="relative border rounded-md p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <p className="text-sm truncate">
                        {businessCertificate.name}
                      </p>
                    </div>
                    {businessCertificate.preview && (
                      <div className="aspect-video bg-muted rounded-md overflow-hidden">
                        <Image
                          src={businessCertificate.preview}
                          alt={businessCertificate.name}
                          className="object-contain w-full h-full"
                          width={400}
                          height={300}
                        />
                      </div>
                    )}
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute top-1 right-1 h-6 w-6"
                      onClick={() => {
                        setBusinessCertificate(null);
                        setCertificateFile(null);
                      }}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed rounded-lg p-6 text-center">
                    <Input
                      type="file"
                      id="business-cert"
                      className="hidden"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => handleBusinessCertUpload(e)}
                    />
                    <Label htmlFor="business-cert" className="cursor-pointer">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <Upload className="h-8 w-8 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">
                            Click to upload certificate
                          </p>
                          <p className="text-xs text-muted-foreground">
                            PDF, JPG, PNG up to 5MB
                          </p>
                        </div>
                      </div>
                    </Label>
                  </div>
                )}
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