
"use client";
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

type SenderId = {
  id: string;
  status: "approved" | "pending" | "rejected";
  name: string;
  atWhitelisted: "Submitted" | "Not Submitted" | "Pending" | "Approved" | "Rejected";
  createdAt: string;
};

const getStatusBadge = (status: SenderId["status"]) => {
  return (
    <Badge variant="status" status={status}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
};

const getATWhitelistBadge = (status: SenderId["atWhitelisted"]) => {
  const variantMap = {
    "Submitted": "default",
    "Not Submitted": "outline",
    "Pending": "secondary",
    "Approved": "success",
    "Rejected": "destructive"
  } as const;

  return (
    <Badge variant={variantMap[status] || "outline"}>
      {status}
    </Badge>
  );
};

export default function SenderIdPage() {
  const [senderIds, setSenderIds] = useState<SenderId[]>([]);
  const [newSenderId, setNewSenderId] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch sender IDs from API
  const fetchSenderIds = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("bearerToken");
      
      if (!token) {
        toast.error("Please login again");
        return;
      }

      const response = await fetch("/api/sender-id", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch sender IDs");
      }

      const data = await response.json();
      setSenderIds(data.data || []);
    } catch (error) {
      console.error("Error fetching sender IDs:", error);
      toast.error("Failed to load sender IDs");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSenderIds();
  }, []);

  const formatSenderId = (input: string): string => {
    // Remove any characters that are not letters, numbers, or spaces
    const cleaned = input.replace(/[^a-zA-Z0-9\s]/g, "");
    
    // Convert to uppercase and trim whitespace
    return cleaned.toUpperCase().trim();
  };

  const validateSenderId = (senderId: string): { isValid: boolean; message?: string } => {
    const formatted = formatSenderId(senderId);
    
    if (!formatted) {
      return { isValid: false, message: "Sender ID cannot be empty" };
    }

    // Count characters (spaces count as characters)
    const charCount = formatted.length;
    
    if (charCount < 3) {
      return { isValid: false, message: "Sender ID must be at least 3 characters" };
    }

    if (charCount > 11) {
      return { isValid: false, message: "Sender ID cannot exceed 11 characters" };
    }

    // Check if it contains at least one letter or number (after removing spaces)
    const hasValidChars = /[a-zA-Z0-9]/.test(formatted.replace(/\s/g, ""));
    if (!hasValidChars) {
      return { isValid: false, message: "Sender ID must contain letters or numbers" };
    }

    return { isValid: true };
  };

  const handleAddSenderId = async () => {
    const formattedSenderId = formatSenderId(newSenderId);
    const validation = validateSenderId(formattedSenderId);
    
    if (!validation.isValid) {
      toast.error(validation.message);
      return;
    }

    // Check if sender ID already exists (case insensitive)
    if (senderIds.some((sid) => 
      sid.name.toUpperCase() === formattedSenderId.toUpperCase()
    )) {
      toast.error("This Sender ID is already registered");
      return;
    }

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("bearerToken");
      
      if (!token) {
        toast.error("Please login again");
        return;
      }

      const response = await fetch("/api/sender-id", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: formattedSenderId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create sender ID");
      }

      const result = await response.json();
      
      setNewSenderId("");
      setIsDialogOpen(false);
      toast.success(result.message || "Sender ID submitted for approval");
      
      // Refresh the list
      fetchSenderIds();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Error creating sender ID:", error);
      toast.error(error.message || "Failed to create sender ID");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (value: string) => {
    // Allow letters, numbers, and spaces
    const cleaned = value.replace(/[^a-zA-Z0-9\s]/g, "");
    setNewSenderId(cleaned);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Sender IDs</h1>
            <p className="text-muted-foreground">
              Register and manage your SMS sender identifiers
            </p>
          </div>
          <Button disabled>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Sender ID
          </Button>
        </div>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              <span className="ml-2 text-muted-foreground">Loading sender IDs...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Sender IDs</h1>
          <p className="text-muted-foreground">
            Register and manage your SMS sender identifiers
          </p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Sender ID
        </Button>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Register New Sender ID</DialogTitle>
            <DialogDescription>
              Sender IDs must be 3-11 characters, alphanumeric with spaces allowed.
              Spaces count towards the character limit.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-2">
            <Input
              placeholder="Enter sender ID (e.g. MY COMPANY)"
              value={newSenderId}
              onChange={(e) => handleInputChange(e.target.value)}
              maxLength={11}
            />
            <p className="text-xs text-muted-foreground">
              {newSenderId.length}/11 characters • {formatSenderId(newSenderId).length} characters when formatted
            </p>
            {newSenderId && (
              <p className="text-xs text-muted-foreground">
                Will be saved as: <strong>{formatSenderId(newSenderId)}</strong>
              </p>
            )}
          </div>
          <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
            <Button 
              variant="outline" 
              onClick={() => {
                setIsDialogOpen(false);
                setNewSenderId("");
              }}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleAddSenderId}
              disabled={isSubmitting || !formatSenderId(newSenderId)}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit for Approval"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Sender ID</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>AT Whitelisted</TableHead>
                <TableHead>Date Registered</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {senderIds.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8">
                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                      <PlusCircle className="h-12 w-12 mb-4 opacity-50" />
                      <p>No sender IDs found</p>
                      <p className="text-sm">Add your first sender ID to get started</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                senderIds.map((senderId) => (
                  <TableRow key={senderId.id}>
                    <TableCell className="font-medium">{senderId.name}</TableCell>
                    <TableCell>{getStatusBadge(senderId.status)}</TableCell>
                    <TableCell>
                      {getATWhitelistBadge(senderId.atWhitelisted)}
                    </TableCell>
                    <TableCell>
                      {new Date(senderId.createdAt).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
        {senderIds.length > 0 && (
          <CardFooter className="border-t px-6 py-4">
            <div className="text-sm text-muted-foreground">
              Showing <strong>1-{senderIds.length}</strong> of{" "}
              <strong>{senderIds.length}</strong> sender IDs
            </div>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}