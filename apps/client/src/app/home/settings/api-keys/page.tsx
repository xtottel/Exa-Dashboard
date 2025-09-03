"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Copy,
  Plus,
  Eye,
  EyeOff,
  Key,
  MoreVertical,
  ChevronLeft,
  Trash2,
  RefreshCw,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";

type ApiKey = {
  id: string;
  name: string;
  key: string;
  secret: string;
  permissions: string[];
  expiresAt: string | null;
  createdAt: string;
  lastUsedAt: string | null;
  isActive: boolean;
};

type CreateApiKeyRequest = {
  name: string;
  permissions?: string[];
};

export default function ApiKeysPage() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [showSecret, setShowSecret] = useState<string | null>(null);
  const [newKeyName, setNewKeyName] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [keyToDelete, setKeyToDelete] = useState<string | null>(null);
  const [viewKey, setViewKey] = useState<ApiKey | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState<string | null>(null);
  const [creatingLoading, setCreatingLoading] = useState(false);

  useEffect(() => {
    fetchApiKeys();
  }, []);

  const fetchApiKeys = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("bearerToken");

      const response = await fetch("/api/api-keys", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (data.success) {
        setApiKeys(data.data || []);
      } else {
        toast.error("Failed to fetch API keys");
      }
    } catch (error) {
      console.error("Error fetching API keys:", error);
      toast.error("Failed to fetch API keys");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (text: string, message: string) => {
    navigator.clipboard.writeText(text);
    toast.success(message);
  };

  const handleCreate = async () => {
    if (!newKeyName.trim()) return;

    try {
      setCreatingLoading(true);
      const token = localStorage.getItem("bearerToken");
      const response = await fetch("/api/api-keys", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newKeyName.trim(),
          permissions: ["sms.send", "sms.read", "contacts.read"],
        } as CreateApiKeyRequest),
      });

      const data = await response.json();

      if (data.success) {
        await fetchApiKeys();
        toast.success(`API key "${newKeyName}" created successfully`);

        // Show the secret key in a dialog
        setViewKey(data.data);
        setShowSecret(data.data.id);

        setIsCreating(false);
        setNewKeyName("");
      } else {
        toast.error(data.message || "Failed to create API key");
      }
    } catch (error) {
      console.error("Error creating API key:", error);
      toast.error("Failed to create API key");
    } finally {
      setCreatingLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!keyToDelete) return;

    try {
      const token = localStorage.getItem("bearerToken");
      const response = await fetch(`/api/api-keys/${keyToDelete}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (data.success) {
        await fetchApiKeys();
        toast.success("API key deleted successfully");
      } else {
        toast.error(data.message || "Failed to delete API key");
      }
    } catch (error) {
      console.error("Error deleting API key:", error);
      toast.error("Failed to delete API key");
    } finally {
      setIsDeleting(false);
      setKeyToDelete(null);
    }
  };

  const handleRegenerate = async (
    id: string,
    regenerateSecret: boolean = false
  ) => {
    try {
      setIsRegenerating(id);
      const token = localStorage.getItem("bearerToken");
      const response = await fetch(`/api/api-keys/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          regenerateSecret,
        }),
      });

      const data = await response.json();

      if (data.success) {
        await fetchApiKeys();

        if (regenerateSecret && data.data) {
          // Show the new secret key
          setViewKey(data.data);
          setShowSecret(data.data.id);
        }

        toast.success(
          regenerateSecret
            ? "API secret regenerated successfully"
            : "API key updated successfully"
        );
      } else {
        toast.error(data.message || "Failed to regenerate API key");
      }
    } catch (error) {
      console.error("Error regenerating API key:", error);
      toast.error("Failed to regenerate API key");
    } finally {
      setIsRegenerating(null);
    }
  };

  const toggleKeyStatus = async (id: string, isActive: boolean) => {
    try {
      const token = localStorage.getItem("bearerToken");
      const response = await fetch(`/api/api-keys/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          isActive,
        }),
      });

      const data = await response.json();

      if (data.success) {
        await fetchApiKeys();
        toast.success(
          `API key ${isActive ? "activated" : "deactivated"} successfully`
        );
      } else {
        toast.error(data.message || "Failed to update API key");
      }
    } catch (error) {
      console.error("Error updating API key:", error);
      toast.error("Failed to update API key");
    }
  };

  const getBase64Credentials = (apiKey: ApiKey) => {
    if (!apiKey.secret) return "";
    const credentials = `${apiKey.key}:${apiKey.secret}`;
    return btoa(credentials);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Never";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };


  const getStatusBadge = (isActive: boolean) => {
    const statusString = isActive ? "success" : "failed";
    return (
      <Badge variant="status" status={statusString}>
        {isActive ? "Active" : "Inactive"}
      </Badge>
    );
  };



  // Skeleton components
  const TableSkeleton = () => (
    <>
      {Array.from({ length: 5 }).map((_, index) => (
        <TableRow key={index}>
          <TableCell>
            <Skeleton className="h-4 w-32" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-48" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-40" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-6 w-16 rounded-full" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-24" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-20" />
          </TableCell>
          <TableCell className="text-right">
            <Skeleton className="h-8 w-8 ml-auto" />
          </TableCell>
        </TableRow>
      ))}
    </>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/home/settings">
              <ChevronLeft className="h-4 w-4" />
            </Link>
          </Button>

          <div>
            <h1 className="text-2xl font-bold tracking-tight">API Keys</h1>
            <p className="text-muted-foreground">
              Manage your API keys and secrets
            </p>
          </div>
        </div>

        <Dialog open={isCreating} onOpenChange={setIsCreating}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create New API Key
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Create API Key</DialogTitle>
              <DialogDescription>
                Create a new API key for your applications
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">API Key Name *</Label>
                <Input
                  id="name"
                  placeholder="e.g. Production Server"
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  A descriptive name for your API key.
                </p>
              </div>
            </div>

            <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 gap-2">
              <Button variant="outline" onClick={() => setIsCreating(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleCreate}
                disabled={!newKeyName.trim() || creatingLoading}
              >
                {creatingLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create API Key"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>API Key</TableHead>
                <TableHead>Secret Key</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Last Used</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableSkeleton />
              ) : apiKeys.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                      <Key className="h-8 w-8" />
                      <p>No API keys found</p>
                      <p className="text-sm">
                        Create your first API key to get started
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                apiKeys.map((key) => (
                  <TableRow key={key.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <Key className="h-4 w-4 text-muted-foreground" />
                        {key.name}
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-2">
                        <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm">
                          {
                            key.secret
                              ? showSecret === key.id
                                ? key.secret
                                : "••••••••••••"
                              : "••••••••••••" // Always show masked for list view
                          }
                        </code>
                        {key.secret ? ( // Only show buttons if secret is available (recently created/regenerated)
                          <>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() =>
                                setShowSecret(
                                  showSecret === key.id ? null : key.id
                                )
                              }
                            >
                              {showSecret === key.id ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() =>
                                handleCopy(
                                  key.secret!,
                                  "Secret key copied to clipboard"
                                )
                              }
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                          </>
                        ) : (
                          // Show regenerate button if secret is not available
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => handleRegenerate(key.id, true)}
                            disabled={isRegenerating === key.id}
                          >
                            {isRegenerating === key.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <RefreshCw className="h-4 w-4" />
                            )}
                          </Button>
                        )}
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-2">
                        <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm">
                          {key.secret
                            ? showSecret === key.id
                              ? key.secret
                              : "••••••••••••"
                            : "Not available"}
                        </code>
                        {key.secret && (
                          <>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() =>
                                setShowSecret(
                                  showSecret === key.id ? null : key.id
                                )
                              }
                            >
                              {showSecret === key.id ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() =>
                                handleCopy(
                                  key.secret!,
                                  "Secret key copied to clipboard"
                                )
                              }
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(key.isActive)}</TableCell>
                    <TableCell>{formatDate(key.createdAt)}</TableCell>
                    <TableCell>{formatDate(key.lastUsedAt)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                            >
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>

                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() =>
                                toggleKeyStatus(key.id, !key.isActive)
                              }
                            >
                              {key.isActive ? (
                                <>
                                  <EyeOff className="h-4 w-4 mr-2" />
                                  Deactivate
                                </>
                              ) : (
                                <>
                                  <Eye className="h-4 w-4 mr-2" />
                                  Activate
                                </>
                              )}
                            </DropdownMenuItem>

                            <DropdownMenuSeparator />

                            <DropdownMenuItem
                              onClick={() => handleRegenerate(key.id, true)}
                              disabled={isRegenerating === key.id}
                            >
                              {isRegenerating === key.id ? (
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              ) : (
                                <RefreshCw className="h-4 w-4 mr-2" />
                              )}
                              Regenerate Secret
                            </DropdownMenuItem>

                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-red-600 focus:text-red-600"
                              onClick={() => {
                                setKeyToDelete(key.id);
                                setIsDeleting(true);
                              }}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete API Key
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* View API Key Details Dialog */}
      <Dialog
        open={!!viewKey}
        onOpenChange={(open) => {
          if (!open) {
            setViewKey(null);
            setShowSecret(null); // Reset secret visibility when closing dialog
          }
        }}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>API Key Details</DialogTitle>
            <DialogDescription>
              Detailed information about your API key
            </DialogDescription>
          </DialogHeader>
          {viewKey && (
            <div className="space-y-6 py-4">
              {/* Disclaimer Banner - Only show if secret is available */}
              {viewKey.secret && (
                <div className="bg-amber-50 border border-amber-200 rounded-md p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <AlertTriangle className="h-5 w-5 text-amber-400" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-amber-800">
                        Important: Copy Your Secret Now
                      </h3>
                      <div className="mt-2 text-sm text-amber-700">
                        <p>
                          Your secret key will only be shown this one time. For
                          security reasons, it cannot be retrieved again. Please
                          copy and store it in a secure place.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>API Key Name</Label>
                  <p className="text-sm font-medium">{viewKey.name}</p>
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <div>{getStatusBadge(viewKey.isActive)}</div>
                </div>
                <div className="space-y-2">
                  <Label>API Key</Label>
                  <div className="flex items-center gap-2">
                    <code className="relative rounded bg-muted px-2 py-1 font-mono text-sm">
                      {viewKey.key}
                    </code>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => handleCopy(viewKey.key, "API key copied")}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Secret Key</Label>
                  <div className="flex items-center gap-2">
                    <code className="relative rounded bg-muted px-2 py-1 font-mono text-sm">
                      {viewKey.secret
                        ? showSecret === viewKey.id
                          ? viewKey.secret
                          : "••••••••••••"
                        : "••••••••••••"}
                    </code>
                    {viewKey.secret ? (
                      <>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() =>
                            setShowSecret(
                              showSecret === viewKey.id ? null : viewKey.id
                            )
                          }
                        >
                          {showSecret === viewKey.id ? (
                            <EyeOff className="h-3 w-3" />
                          ) : (
                            <Eye className="h-3 w-3" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() =>
                            handleCopy(viewKey.secret!, "Secret key copied")
                          }
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRegenerate(viewKey.id, true)}
                        disabled={isRegenerating === viewKey.id}
                      >
                        {isRegenerating === viewKey.id ? (
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        ) : (
                          <RefreshCw className="h-4 w-4 mr-2" />
                        )}
                        Regenerate Secret
                      </Button>
                    )}
                  </div>
                  {!viewKey.secret && (
                    <p className="text-xs text-muted-foreground">
                      Secret not available. You must regenerate to get a new
                      secret key.
                    </p>
                  )}
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>Base64 Credentials (for API authentication)</Label>
                  <div className="flex items-center gap-2">
                    <code className="relative rounded bg-muted px-2 py-1 font-mono text-sm break-all">
                      {getBase64Credentials(viewKey) || "Not available"}
                    </code>
                    {getBase64Credentials(viewKey) && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 flex-shrink-0"
                        onClick={() =>
                          handleCopy(
                            getBase64Credentials(viewKey),
                            "Base64 credentials copied"
                          )
                        }
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Use these credentials for Basic Auth: Authorization: Basic{" "}
                    {getBase64Credentials(viewKey)
                      ? "[above_credentials]"
                      : "Not available"}
                  </p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setViewKey(null);
                setShowSecret(null);
              }}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleting} onOpenChange={setIsDeleting}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this API key? This action cannot
              be undone and any applications using this key will stop working.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete API Key
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
