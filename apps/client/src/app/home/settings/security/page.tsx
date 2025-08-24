// app/settings/security/page.tsx
"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import { toast } from "sonner";

export default function SecuritySettingsPage() {
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [isLoading, setIsLoading] = useState(false);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch("/api/user/change-password", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          oldPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to change password");
      }

      toast.success("Password changed successfully");
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.message || "Failed to change password");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordData({
      ...passwordData,
      [e.target.id]: e.target.value
    });
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
          <h1 className="text-2xl font-bold tracking-tight">Security Settings</h1>
          <p className="text-muted-foreground">
            Configure authentication and security settings
          </p>
        </div>
      </div>

      <form onSubmit={handlePasswordChange}>
        <Card>
          <CardHeader>
            <CardTitle>Password</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input 
                id="currentPassword" 
                type="password" 
                value={passwordData.currentPassword}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input 
                id="newPassword" 
                type="password" 
                value={passwordData.newPassword}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input 
                id="confirmPassword" 
                type="password" 
                value={passwordData.confirmPassword}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="flex justify-end">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Changing..." : "Change Password"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>

      <Card>
        <CardHeader>
          <CardTitle>Two-Factor Authentication</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">SMS Authentication</h4>
              <p className="text-sm text-muted-foreground">
                Receive verification codes via SMS
              </p>
            </div>
            <Switch />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Active Sessions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg p-4">
            <div className="flex justify-between items-center">
              <div>
                <div className="font-medium">Chrome on Windows</div>
                <div className="text-sm text-muted-foreground">
                  Last active: 15 minutes ago
                </div>
                <div className="text-sm text-muted-foreground">
                  IP: 192.168.1.1
                </div>
              </div>
              <Button variant="outline" size="sm">
                Revoke
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}