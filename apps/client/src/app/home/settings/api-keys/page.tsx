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
  DialogClose,
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
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useState } from "react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

// Generate a random 8-character string
const generateClientId = () => {
  return Math.random().toString(36).substring(2, 10);
};

// Generate a UUID v4
const generateClientSecret = () => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

type ClientCredential = {
  id: string;
  name: string;
  clientId: string;
  clientSecret: string;
  lastUsed: string;
  created: string;
  status: "live" | "test";
};

const initialClients: ClientCredential[] = [
  {
    id: "1",
    name: "Production App",
    clientId: "abc123def",
    clientSecret: "123e4567-e89b-12d3-a456-426614174000",
    lastUsed: "2023-06-15 09:30:45",
    created: "2023-05-10",
    status: "live",
  },
  {
    id: "2",
    name: "Test App",
    clientId: "test7890",
    clientSecret: "223e4567-e89b-12d3-a456-426614174001",
    lastUsed: "2023-06-10 14:22:18",
    created: "2023-04-15",
    status: "test",
  },
];

const getStatusBadge = (status: ClientCredential["status"]) => {
  return (
    <Badge variant="status" status={status}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
};

export default function ClientCredentialsPage() {
  const [clients, setClients] = useState<ClientCredential[]>(initialClients);
  const [showSecret, setShowSecret] = useState<string | null>(null);
  const [newClientName, setNewClientName] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [clientToDelete, setClientToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [viewClient, setViewClient] = useState<ClientCredential | null>(null);

  const handleCopy = (text: string, message: string) => {
    navigator.clipboard.writeText(text);
    toast.success(message);
  };

  const handleCreate = () => {
    if (newClientName.trim()) {
      // Generate new client credentials
      const newClient: ClientCredential = {
        id: Date.now().toString(),
        name: newClientName,
        clientId: generateClientId(),
        clientSecret: generateClientSecret(),
        lastUsed: "Never",
        created: new Date().toISOString().split("T")[0],
        status: "live", // All new keys are live automatically
      };

      setClients([...clients, newClient]);

      toast.success(
        `Client credentials created. New client "${newClientName}" has been generated.`
      );

      setIsCreating(false);
      setNewClientName("");
    }
  };

  const handleDelete = (id: string) => {
    setIsDeleting(true);
    setClientToDelete(id);
  };

  const confirmDelete = () => {
    if (clientToDelete) {
      const client = clients.find((c) => c.id === clientToDelete);
      if (client?.status === "test") {
        toast.error(
          "Cannot delete test credentials. Test credentials are permanent."
        );
        setIsDeleting(false);
        setClientToDelete(null);
        return;
      }

      setClients(clients.filter((client) => client.id !== clientToDelete));

      toast.success(
        <div>
          <strong>Client credentials deleted</strong>
          <div>The client credentials have been permanently removed.</div>
        </div>,
        { className: "bg-destructive text-destructive-foreground" }
      );
    }

    setIsDeleting(false);
    setClientToDelete(null);
  };

  const cancelDelete = () => {
    setIsDeleting(false);
    setClientToDelete(null);
  };

  const handleRegenerate = (
    id: string,
    types: ("clientId" | "clientSecret") | ("clientId" | "clientSecret")[]
  ) => {
    const typeArray = Array.isArray(types) ? types : [types];

    setClients(
      clients.map((client) => {
        if (client.id === id) {
          const updatedClient = { ...client, lastUsed: "Never" };

          if (typeArray.includes("clientId")) {
            updatedClient.clientId = generateClientId();
          }

          if (typeArray.includes("clientSecret")) {
            updatedClient.clientSecret = generateClientSecret();
          }

          return updatedClient;
        }
        return client;
      })
    );

    // Toast message
    if (typeArray.length === 2) {
      toast.success(
        <div>
          <strong>Credentials regenerated</strong>
          <div>
            Both Client ID and Client Secret have been successfully regenerated.
          </div>
        </div>
      );
    } else {
      const type = typeArray[0];
      toast.success(
        <div>
          <strong>
            {type === "clientId" ? "Client ID" : "Client Secret"} regenerated
          </strong>
          <div>
            The {type === "clientId" ? "Client ID" : "Client Secret"} has been
            successfully regenerated.
          </div>
        </div>
      );
    }
  };

  const openViewDialog = (client: ClientCredential) => {
    setViewClient(client);
  };

  const closeViewDialog = () => {
    setViewClient(null);
  };

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
            <h1 className="text-2xl font-bold tracking-tight">
              Client Credentials
            </h1>
            <p className="text-muted-foreground">
              Manage your OAuth client IDs and secrets
            </p>
          </div>
        </div>

        <Dialog open={isCreating} onOpenChange={setIsCreating}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create New Credentials
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Client Details</DialogTitle>
              <DialogDescription>
                Detailed information about this OAuth client application
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Credential Name *</Label>
                <Input
                  id="name"
                  placeholder="e.g. Production Server"
                  value={newClientName}
                  onChange={(e) => setNewClientName(e.target.value)}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  A descriptive name for your credentials.
                </p>
              </div>
            </div>

            <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 gap-2">
              <Button variant="outline" onClick={() => setIsCreating(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreate} disabled={!newClientName.trim()}>
                Generate Credentials
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
                <TableHead>Client ID</TableHead>
                <TableHead>Client Secret</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Last Used</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clients.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                      <Key className="h-8 w-8" />
                      <p>No client credentials found</p>
                      <p className="text-sm">
                        Create your first credentials to get started
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                clients.map((client) => (
                  <TableRow key={client.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <Key className="h-4 w-4 text-muted-foreground" />
                        {client.name}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm">
                          {client.clientId}
                        </code>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() =>
                            handleCopy(
                              client.clientId,
                              "Client ID copied to clipboard"
                            )
                          }
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm">
                          {showSecret === client.id
                            ? client.clientSecret
                            : "••••••••••••••••"}
                        </code>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() =>
                            setShowSecret(
                              showSecret === client.id ? null : client.id
                            )
                          }
                        >
                          {showSecret === client.id ? (
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
                              client.clientSecret,
                              "Client Secret copied to clipboard"
                            )
                          }
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(client.status)}</TableCell>
                    <TableCell>{client.created}</TableCell>
                    <TableCell>{client.lastUsed}</TableCell>
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
                            {/* View details of this client */}
                            <DropdownMenuItem
                              onClick={() => openViewDialog(client)}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>

                            <DropdownMenuSeparator />

                            <DropdownMenuItem
                              onClick={() =>
                                handleRegenerate(client.id, [
                                  "clientId",
                                  "clientSecret",
                                ])
                              }
                            >
                              <RefreshCw className="h-4 w-4 mr-2" />
                              Regenerate Credentials
                            </DropdownMenuItem>

                            {client.status !== "test" && (
                              <>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  className="text-red-600 focus:text-red-600"
                                  onClick={() => handleDelete(client.id)}
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete Credentials
                                </DropdownMenuItem>
                              </>
                            )}
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

      {/* View Client Details Dialog */}
      <Dialog
        open={!!viewClient}
        onOpenChange={(open) => !open && closeViewDialog()}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>SMS API Credentials</DialogTitle>
            <DialogDescription>
              Detailed information about your SMS API credentials
            </DialogDescription>
          </DialogHeader>
          {viewClient && (
            <div className="space-y-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Credential Name</Label>
                  <p className="text-sm font-medium">{viewClient.name}</p>
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <div>{getStatusBadge(viewClient.status)}</div>
                </div>
                <div className="space-y-2">
                  <Label>Client ID</Label>
                  <div className="flex items-center gap-2">
                    <code className="relative rounded bg-muted px-2 py-1 font-mono text-sm">
                      {viewClient.clientId}
                    </code>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() =>
                        handleCopy(viewClient.clientId, "Client ID copied")
                      }
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Client Secret</Label>
                  <div className="flex items-center gap-2">
                    <code className="relative rounded bg-muted px-2 py-1 font-mono text-sm">
                      {showSecret === viewClient.id
                        ? viewClient.clientSecret
                        : "••••••••••••••••"}
                    </code>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() =>
                        setShowSecret(
                          showSecret === viewClient.id ? null : viewClient.id
                        )
                      }
                    >
                      {showSecret === viewClient.id ? (
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
                        handleCopy(
                          viewClient.clientSecret,
                          "Client Secret copied"
                        )
                      }
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleting} onOpenChange={setIsDeleting}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete these client credentials? This
              action cannot be undone and any applications using these
              credentials will stop working.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={cancelDelete}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete Credentials
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
