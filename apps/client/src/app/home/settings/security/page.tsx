// // app/settings/security/page.tsx
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
import { ChevronLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import Image from "next/image";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
//import { Switch } from "@/components/ui/switch";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  emailVerified: string | null;
  isActive: boolean;
  business: {
    id: string;
    name: string;
    isActive: boolean;
  };
  role: {
    name: string;
    permissions: string[];
  };
}

interface AuthSession {
  id: string;
  deviceInfo: string | null;
  ipAddress: string | null;
  location: string | null;
  userAgent: string | null;
  createdAt: string;
  expiresAt: string;
}
// Add this interface for MFA settings
interface MFASettings {
  id: string;
  method: string;
  isEnabled: boolean;
  backupCodes: string[];
}

export default function ProfileSettingsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [sessions, setSessions] = useState<AuthSession[]>([]);
  const [, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Fetch user data and sessions
  useEffect(() => {
    fetchUserData();
    fetchSessions();
  }, []);

  const fetchUserData = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("bearerToken");

      const response = await fetch("/api/user/profile", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        setFormData({
          firstName: data.user.firstName,
          lastName: data.user.lastName,
          email: data.user.email,
          phone: data.user.phone,
        });
      } else {
        toast.error("Failed to fetch user data");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      toast.error("Failed to fetch user data");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSessions = async () => {
    try {
      const token = localStorage.getItem("bearerToken");

      const response = await fetch("/api/user/sessions", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setSessions(data.sessions);
      }
    } catch (error) {
      console.error("Error fetching sessions:", error);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsChangingPassword(true);

    try {
      const token = localStorage.getItem("bearerToken");

      const response = await fetch("/api/user/change-password", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(passwordData),
      });

      if (response.ok) {
        toast.success("Password changed successfully. Please login again.");
        // Clear form
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        // Redirect to login after a delay
        setTimeout(() => {
          localStorage.removeItem("bearerToken");
          localStorage.removeItem("user");
          window.location.href = "/login";
        }, 2000);
      } else {
        const error = await response.json();
        toast.error(error.message || "Failed to change password");
      }
    } catch (error) {
      console.error("Error changing password:", error);
      toast.error("Failed to change password");
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleRevokeSession = async (sessionId: string) => {
    try {
      const token = localStorage.getItem("bearerToken");

      const response = await fetch(`/api/user/sessions/${sessionId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        toast.success("Session revoked successfully");
        // Refresh sessions list
        fetchSessions();
      } else {
        const error = await response.json();
        toast.error(error.message || "Failed to revoke session");
      }
    } catch (error) {
      console.error("Error revoking session:", error);
      toast.error("Failed to revoke session");
    }
  };

  const handleRevokeAllSessions = async () => {
    try {
      const token = localStorage.getItem("bearerToken");

      const response = await fetch("/api/user/sessions", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        toast.success("All other sessions revoked successfully");
        // Refresh sessions list
        fetchSessions();
      } else {
        const error = await response.json();
        toast.error(error.message || "Failed to revoke sessions");
      }
    } catch (error) {
      console.error("Error revoking sessions:", error);
      toast.error("Failed to revoke sessions");
    }
  };

  // Add this state variable with other useState declarations
  const [mfaSettings, setMfaSettings] = useState<MFASettings | null>(null);
  const [isSettingUpMFA, setIsSettingUpMFA] = useState(false);
  const [mfaSetupData, setMfaSetupData] = useState({
    qrCode: "",
    secret: "",
    backupCodes: [] as string[],
  });
  const [verificationCode, setVerificationCode] = useState("");

  // Add this effect to fetch MFA settings
  useEffect(() => {
    fetchMfaSettings();
  }, []);

  const fetchMfaSettings = async () => {
    try {
      const token = localStorage.getItem("bearerToken");
      const response = await fetch("/api/user/mfa", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setMfaSettings(data.mfaSettings);
      }
    } catch (error) {
      console.error("Error fetching MFA settings:", error);
    }
  };

  const handleEnableMFA = async () => {
    try {
      setIsSettingUpMFA(true);
      const token = localStorage.getItem("bearerToken");

      const response = await fetch("/api/user/mfa/setup", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setMfaSetupData({
          qrCode: data.qrCode,
          secret: data.secret,
          backupCodes: data.backupCodes,
        });
      } else {
        toast.error("Failed to setup MFA");
      }
    } catch (error) {
      console.error("Error setting up MFA:", error);
      toast.error("Failed to setup MFA");
    } finally {
      setIsSettingUpMFA(false);
    }
  };

  const handleVerifyMFA = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("bearerToken");

      const response = await fetch("/api/user/mfa/verify", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code: verificationCode }),
      });

      if (response.ok) {
        toast.success("MFA enabled successfully");
        setVerificationCode("");
        setMfaSetupData({ qrCode: "", secret: "", backupCodes: [] });
        fetchMfaSettings(); // Refresh MFA status
      } else {
        const error = await response.json();
        toast.error(error.message || "Failed to verify MFA code");
      }
    } catch (error) {
      console.error("Error verifying MFA:", error);
      toast.error("Failed to verify MFA code");
    }
  };

  const handleDisableMFA = async () => {
    try {
      const token = localStorage.getItem("bearerToken");

      const response = await fetch("/api/user/mfa/disable", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        toast.success("MFA disabled successfully");
        fetchMfaSettings(); // Refresh MFA status
      } else {
        const error = await response.json();
        toast.error(error.message || "Failed to disable MFA");
      }
    } catch (error) {
      console.error("Error disabling MFA:", error);
      toast.error("Failed to disable MFA");
    }
  };

  const handleRegenerateBackupCodes = async () => {
    try {
      const token = localStorage.getItem("bearerToken");

      const response = await fetch("/api/user/mfa/regenerate-backup-codes", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        toast.success("Backup codes regenerated successfully");
        setMfaSetupData({
          ...mfaSetupData,
          backupCodes: data.backupCodes,
        });
      } else {
        const error = await response.json();
        toast.error(error.message || "Failed to regenerate backup codes");
      }
    } catch (error) {
      console.error("Error regenerating backup codes:", error);
      toast.error("Failed to regenerate backup codes");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Failed to load user data</p>
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
            Security Settings
          </h1>
          <p className="text-muted-foreground">
            Configure authentication and security settings
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Password</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      currentPassword: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      newPassword: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      confirmPassword: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div className="flex justify-end">
                <Button type="submit" disabled={isChangingPassword}>
                  {isChangingPassword ? "Changing..." : "Change Password"}
                  {isChangingPassword && (
                    <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* // MFA Card */}
        <Card>
          <CardHeader>
            <CardTitle>Multi-Factor Authentication</CardTitle>
            <CardDescription>
              Add an extra layer of security to your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between py-4">
              <div className="space-y-0.5">
                <Label htmlFor="mfa-toggle" className="text-base">
                  Two-Factor Authentication
                </Label>
                <div className="text-sm text-muted-foreground">
                  {mfaSettings?.isEnabled
                    ? "MFA is currently enabled for your account"
                    : "MFA is not yet enabled for your account"}
                </div>
              </div>
              {mfaSettings?.isEnabled ? (
                <Button variant="destructive" onClick={handleDisableMFA}>
                  Disable MFA
                </Button>
              ) : (
                <Button onClick={handleEnableMFA} disabled={isSettingUpMFA}>
                  {isSettingUpMFA ? "Setting up..." : "Enable MFA"}
                  {isSettingUpMFA && (
                    <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                  )}
                </Button>
              )}
            </div>

            {mfaSetupData.qrCode && (
              <div className="mt-6 p-4 border rounded-lg">
                <h3 className="text-lg font-medium mb-4">
                  Set up Authenticator App
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Scan this QR code with your authenticator app
                    </p>
                    <div className="flex justify-center">
                      <Image
                        src={mfaSetupData.qrCode}
                        alt="QR Code"
                        width={192}
                        height={192}
                        className="w-48 h-48"
                      />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-mono bg-muted p-2 rounded">
                        {mfaSetupData.secret}
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        Or enter this code manually
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Enter the verification code from your authenticator app
                    </p>
                    <form onSubmit={handleVerifyMFA} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="verificationCode">
                          Verification Code
                        </Label>
                        <Input
                          id="verificationCode"
                          type="text"
                          placeholder="123456"
                          value={verificationCode}
                          onChange={(e) => setVerificationCode(e.target.value)}
                          required
                        />
                      </div>
                      <Button type="submit" className="w-full">
                        Verify and Enable
                      </Button>
                    </form>
                  </div>
                </div>
              </div>
            )}

            {mfaSettings?.isEnabled && mfaSetupData.backupCodes.length > 0 && (
              <div className="mt-6 p-4 border rounded-lg">
                <h3 className="text-lg font-medium mb-4">Backup Codes</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Save these backup codes in a secure place. Each code can be
                  used only once.
                </p>
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {mfaSetupData.backupCodes.map((code, index) => (
                    <div
                      key={index}
                      className="font-mono text-sm p-2 bg-muted rounded"
                    >
                      {code}
                    </div>
                  ))}
                </div>
                <Button variant="outline" onClick={handleRegenerateBackupCodes}>
                  Regenerate Backup Codes
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Active Sessions</CardTitle>
            <CardDescription>
              Manage your active login sessions
              <Button
                variant="outline"
                size="sm"
                className="ml-4"
                onClick={handleRevokeAllSessions}
              >
                Revoke All Other Sessions
              </Button>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Device</TableHead>
                  <TableHead>Browser</TableHead>
                  <TableHead>IP Address</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Last Active</TableHead>
                  <TableHead>Expires At</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sessions.map((session) => (
                  <TableRow key={session.id}>
                    <TableCell className="font-medium">
                      {session.deviceInfo ||
                        session.userAgent?.split(" ")[0] ||
                        "Unknown Device"}
                    </TableCell>
                    <TableCell>{session.userAgent || "N/A"}</TableCell>
                    <TableCell>{session.ipAddress || "N/A"}</TableCell>
                    <TableCell>{session.location || "N/A"}</TableCell>
                    <TableCell>
                      {new Date(session.createdAt).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      {new Date(session.expiresAt).toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRevokeSession(session.id)}
                      >
                        Revoke
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {sessions.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center text-muted-foreground"
                    >
                      No active sessions found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
