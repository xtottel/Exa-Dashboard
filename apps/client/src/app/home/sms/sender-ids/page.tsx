"use client";
import {
  Card,
  CardHeader,
  CardTitle,
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
import { PlusCircle, Trash2 } from "lucide-react";
import { useState } from "react";
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
  atWhitelisted: "Submitted" | "Not Submitted";
  createdAt: string;
};

const getStatusBadge = (status: SenderId["status"]) => {
  return (
    <Badge variant="status" status={status}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
};

export default function SenderIdPage() {
  const [senderIds, setSenderIds] = useState<SenderId[]>([
    {
      id: "1",
      status: "approved",
      name: "SENDEXA",
      atWhitelisted: "Submitted",
      createdAt: "2023-06-15 09:30:45",
    },
    {
      id: "2",
      status: "pending",
      name: "MYAPP",
      atWhitelisted: "Not Submitted",
      createdAt: "2023-06-16 10:15:22",
    },
    {
      id: "3",
      status: "rejected",
      name: "ACMEINC",
      atWhitelisted: "Not Submitted",
      createdAt: "2023-06-17 14:45:10",
    },
    {
      id: "4",
      status: "approved",
      name: "QUICKPAY",
      atWhitelisted: "Submitted",
      createdAt: "2023-06-18 11:20:33",
    },
    {
      id: "5",
      status: "approved",
      name: "EZSHOP",
      atWhitelisted: "Submitted",
      createdAt: "2023-06-19 16:05:47",
    },
  ]);

  const [newSenderId, setNewSenderId] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const handleAddSenderId = () => {
    if (newSenderId.trim() === "") {
      toast.error("Sender ID cannot be empty");
      return;
    }

    if (newSenderId.length < 3) {
      toast.error("Sender ID must be at least 3 characters");
      return;
    }

    if (senderIds.some((sid) => sid.name === newSenderId.toUpperCase())) {
      toast.error("This Sender ID is already registered");
      return;
    }

    const newId: SenderId = {
      id: (senderIds.length + 1).toString(),
      name: newSenderId.toUpperCase(),
      status: "pending",
      atWhitelisted: "Not Submitted",
      createdAt: new Date().toLocaleString(),
    };

    setSenderIds([...senderIds, newId]);
    setNewSenderId("");
    setIsDialogOpen(false);
    toast.success("Sender ID submitted for approval");
  };

  const handleDelete = (id: string) => {
    setIsDeleting(id);
    toast.promise(
      new Promise((resolve) => {
        setTimeout(() => {
          setSenderIds(senderIds.filter((sid) => sid.id !== id));
          resolve("success");
        }, 1000);
      }),
      {
        loading: "Deleting Sender ID...",
        success: "Sender ID deleted successfully",
        error: "Error deleting Sender ID",
      }
    );
  };

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
              Sender IDs must be 3-11 characters, alphanumeric (no spaces or
              special characters)
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input
              placeholder="Enter sender ID (e.g. COMPANY)"
              value={newSenderId}
              onChange={(e) =>
                setNewSenderId(e.target.value.replace(/[^a-zA-Z0-9]/g, ""))
              }
              maxLength={11}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddSenderId}>Submit for Approval</Button>
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
                <TableHead >Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {senderIds.map((senderId) => (
                <TableRow key={senderId.id}>
                  <TableCell className="font-medium">{senderId.name}</TableCell>
                  <TableCell>{getStatusBadge(senderId.status)}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{senderId.atWhitelisted}</Badge>
                  </TableCell>
                  <TableCell>{senderId.createdAt}</TableCell>
                  <TableCell >
                    <div >
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(senderId.id)}
                        disabled={
                          senderId.status === "approved" ||
                          isDeleting === senderId.id
                        }
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        {isDeleting === senderId.id}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="border-t px-6 py-4">
          <div className="text-sm text-muted-foreground">
            Showing <strong>1-{senderIds.length}</strong> of{" "}
            <strong>{senderIds.length}</strong> sender IDs
          </div>
        </CardFooter>
      </Card>

      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle>Sender ID Guidelines</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm list-disc pl-5">
            <li>Sender IDs must be 3-11 characters long</li>
            <li>Only alphanumeric characters are allowed (A-Z, 0-9)</li>
            <li>No spaces or special characters permitted</li>
            <li>Approval typically takes 1-3 business days</li>
            <li>Some countries have specific Sender ID restrictions</li>
            <li>Rejected Sender IDs can be modified and resubmitted</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
