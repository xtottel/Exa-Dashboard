"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@/components/ui/use-toast";;

import { useState } from "react";
import { UploadCloud } from "lucide-react";
import { useDropzone } from "react-dropzone";

const profileFormSchema = z.object({
  username: z
    .string()
    .min(2, {
      message: "Username must be at least 2 characters.",
    })
    .max(30, {
      message: "Username must not be longer than 30 characters.",
    }),
  email: z
    .string({
      required_error: "Please provide an email address.",
    })
    .email(),
  phone: z.string().min(10, {
    message: "Please enter a valid phone number.",
  }),
  company: z.string().min(2, {
    message: "Company name must be at least 2 characters.",
  }),
  businessType: z.string().min(1, {
    message: "Please select your business type.",
  }),
  businessRegistration: z.string().optional(),
  nationalId: z.string().optional(),
  address: z.string().min(5, {
    message: "Please enter a valid address.",
  }),
  country: z.string().min(1, {
    message: "Please select your country.",
  }),
});


type ProfileFormValues = z.infer<typeof profileFormSchema>;

export default function ProfilePage() {
  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      username: "kwame_tech",
      email: "kwame@example.com",
      phone: "0244123456",
      company: "Tech Solutions GH",
      address: "123 Business Ave, Accra",
      country: "GH",
    },
    mode: "onChange",
  });

//  function ProfilePictureUpload() {
  const [profileImage, setProfileImage] = useState<string | null>("/user.jpg");
  const [isUploading] = useState(false);
  const [uploadProgress] = useState(0);

  const { getRootProps, getInputProps, open } = useDropzone({
    accept: {
      "image/*": [".png", ".jpg", ".jpeg"],
    },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024, // 5MB
    // onDrop: async (acceptedFiles) => {
    //   const file = acceptedFiles[0];
    //   await handleUpload(file);
    // },
    onDropRejected: () => {
      toast({
        title: "File rejected",
        description: "Please upload an image (PNG, JPG, JPEG) under 5MB",
        variant: "destructive",
      });
    },
  });


  const handleRemove = () => {
    if (profileImage && profileImage.startsWith("blob:")) {
      URL.revokeObjectURL(profileImage);
    }
    setProfileImage(null);
    toast({
      title: "Profile picture removed",
      description: "Your profile picture has been removed.",
    });
  };

  
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function onSubmitProfile(data: ProfileFormValues) {
    toast({
      title: "Profile updated successfully",
      description: "Your profile changes have been saved.",
    });
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Account Settings</h1>
        <p className="text-muted-foreground">
          Manage your profile.
        </p>
      </div>

      {/* Profile Section */}
       <Card>
      <CardHeader>
        <CardTitle>Profile Picture</CardTitle>
        <CardDescription>
          This will be displayed on your account and in emails.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage 
                src={profileImage || undefined} 
                alt="Profile picture" 
              />
              <AvatarFallback>
                {profileImage ? "" : "Upload"}
              </AvatarFallback>
            </Avatar>
            
            <div className="space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={open}
                disabled={isUploading}
              >
                {profileImage ? "Change" : "Upload"}
              </Button>
              {profileImage && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleRemove}
                  disabled={isUploading}
                >
                  Remove
                </Button>
              )}
            </div>
          </div>

          {!profileImage && (
            <div
              {...getRootProps()}
              className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:border-primary transition-colors"
            >
              <input {...getInputProps()} />
              <div className="flex flex-col items-center justify-center gap-2">
                <UploadCloud className="h-10 w-10 text-muted-foreground" />
                <div className="text-sm text-muted-foreground">
                  <p>Drag & drop your photo here, or click to select</p>
                  <p className="text-xs mt-1">Supports: JPG, PNG (Max 5MB)</p>
                </div>
              </div>
            </div>
          )}

          {isUploading && (
            <div className="w-full mt-2">
              <div className="flex justify-between text-xs text-muted-foreground mb-1">
                <span>Uploading...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="relative h-2 rounded-full bg-muted overflow-hidden">
                <div
                  className="absolute top-0 left-0 h-full bg-primary transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>

      {/* Personal  Information */}
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>
            Update your personal  details here.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...profileForm}>
            <form
              onSubmit={profileForm.handleSubmit(onSubmitProfile)}
              className="space-y-6"
            >
              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={profileForm.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input placeholder="Your username" {...field} />
                      </FormControl>
                      <FormDescription>
                        This is your public display name.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={profileForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="Your email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={profileForm.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="Your phone number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={profileForm.control}
                  name="company"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Your company" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
               
               
                <FormField
                  control={profileForm.control}
                  name="nationalId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>National ID (Optional)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="GHA-XXXXXXXXX-X"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={profileForm.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Input placeholder="Your business address" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex justify-end">
                <Button type="submit">Update Information</Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Password Section */}
      <Card>
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
          <CardDescription>
            Ensure your account is using a strong password.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="current">Current password</Label>
              <Input id="current" type="password" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new">New password</Label>
              <Input id="new" type="password" />
            </div>
          
            <div className="flex justify-end">
              <Button>Update password</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
