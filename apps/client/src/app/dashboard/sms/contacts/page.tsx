"use client";
import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  ChevronDown,
  Plus,
  Search,
  MoreVertical,
  Download,
  Upload,
  Trash2,
  Edit,
  Users,
  Phone,
  Mail,
  Check,
  X,
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { toast } from "react-hot-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

type Contact = {
  id: string;
  name: string;
  phone: string;
  email?: string;
  groups: string[];
  createdAt: string;
};

type ContactGroup = {
  id: string;
  name: string;
  count: number;
};

export default function ContactsPage() {
  // State management
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<string | null>("1");
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [isGroupDialogOpen, setIsGroupDialogOpen] = useState(false);
  const [isContactDialogOpen, setIsContactDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [currentContact, setCurrentContact] = useState<Partial<Contact> | null>(null);

  // Sample data - in a real app, this would come from an API
  const [contacts, setContacts] = useState<Contact[]>([
    {
      id: "1",
      name: "John Doe",
      phone: "0244123456",
      email: "john@example.com",
      groups: ["Customers", "VIP"],
      createdAt: "2023-10-15",
    },
    {
      id: "2",
      name: "Jane Smith",
      phone: "0209876543",
      groups: ["Subscribers"],
      createdAt: "2023-11-02",
    },
    {
      id: "3",
      name: "Kwame Mensah",
      phone: "0543210987",
      email: "kwame@business.com",
      groups: ["Customers", "Employees"],
      createdAt: "2023-09-28",
    },
    {
      id: "4",
      name: "Ama Johnson",
      phone: "0276543210",
      groups: ["VIP"],
      createdAt: "2023-08-10",
    },
  ]);

  const [groups, setGroups] = useState<ContactGroup[]>([
    { id: "1", name: "All Contacts", count: 4 },
    { id: "2", name: "Customers", count: 2 },
    { id: "3", name: "VIP", count: 2 },
    { id: "4", name: "Subscribers", count: 1 },
    { id: "5", name: "Employees", count: 1 },
  ]);

  // Filter contacts based on search and group selection
  const filteredContacts = contacts.filter((contact) => {
    const matchesSearch =
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.phone.includes(searchTerm) ||
      (contact.email && contact.email.toLowerCase().includes(searchTerm.toLowerCase()));

    if (!selectedGroup || selectedGroup === "1") {
      return matchesSearch;
    }

    const selectedGroupName = groups.find(g => g.id === selectedGroup)?.name;
    return matchesSearch && selectedGroupName && contact.groups.includes(selectedGroupName);
  });

  // Contact selection handlers
  const toggleContactSelection = (contactId: string) => {
    setSelectedContacts((prev) =>
      prev.includes(contactId)
        ? prev.filter((id) => id !== contactId)
        : [...prev, contactId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedContacts.length === filteredContacts.length) {
      setSelectedContacts([]);
    } else {
      setSelectedContacts(filteredContacts.map((contact) => contact.id));
    }
  };

  // Group operations
  const handleCreateGroup = () => {
    if (!newGroupName.trim()) {
      toast.error("Please enter a group name");
      return;
    }

    if (selectedContacts.length === 0) {
      toast.error("Please select at least one contact");
      return;
    }

    // Check if group already exists
    if (groups.some((group) => group.name === newGroupName)) {
      toast.error("A group with this name already exists");
      return;
    }

    // Create new group
    const newGroup = {
      id: Date.now().toString(),
      name: newGroupName,
      count: selectedContacts.length,
    };

    // Update contacts with the new group
    const updatedContacts = contacts.map((contact) =>
      selectedContacts.includes(contact.id)
        ? {
            ...contact,
            groups: [...contact.groups, newGroupName],
          }
        : contact
    );

    setGroups([...groups, newGroup]);
    setContacts(updatedContacts);
    setNewGroupName("");
    setIsGroupDialogOpen(false);
    setSelectedContacts([]);
    toast.success(`Group "${newGroupName}" created successfully`);
  };

  // Contact operations
  const handleAddOrUpdateContact = () => {
    if (!currentContact?.name || !currentContact?.phone) {
      toast.error("Name and phone are required");
      return;
    }

    if (currentContact.id) {
      // Update existing contact
      setContacts(
        contacts.map((contact) =>
          contact.id === currentContact.id
            ? {
                ...contact,
                name: currentContact.name || "",
                phone: currentContact.phone || "",
                email: currentContact.email || undefined,
              }
            : contact
        )
      );
      toast.success("Contact updated successfully");
    } else {
      // Add new contact
      const newContact = {
        id: Date.now().toString(),
        name: currentContact.name || "",
        phone: currentContact.phone || "",
        email: currentContact.email || undefined,
        groups: [],
        createdAt: new Date().toISOString().split("T")[0],
      };
      setContacts([...contacts, newContact]);
      
      // Update "All Contacts" count
      setGroups(
        groups.map((group) =>
          group.id === "1" ? { ...group, count: group.count + 1 } : group
        )
      );
      toast.success("Contact added successfully");
    }

    setIsContactDialogOpen(false);
    setCurrentContact(null);
  };

  const handleDeleteContacts = () => {
    if (selectedContacts.length === 0) return;

    setContacts(contacts.filter((contact) => !selectedContacts.includes(contact.id)));
    
    // Update group counts
    setGroups(
      groups.map((group) => ({
        ...group,
        count:
          group.id === "1"
            ? contacts.length - selectedContacts.length
            : group.count -
              contacts.filter(
                (contact) =>
                  selectedContacts.includes(contact.id) &&
                  contact.groups.includes(group.name)
              ).length,
      }))
    );

    setSelectedContacts([]);
    setIsDeleteDialogOpen(false);
    toast.success(`${selectedContacts.length} contacts deleted successfully`);
  };

  // Import contacts
  const handleImportContacts = () => {
    if (!csvFile) {
      toast.error("Please select a CSV file");
      return;
    }

    // Mock import - in a real app you would parse the CSV
    toast.promise(
      new Promise((resolve) => {
        setTimeout(() => {
          const newContacts = [
            {
              id: Date.now().toString(),
              name: "Imported Contact",
              phone: "0200000000",
              groups: [],
              createdAt: new Date().toISOString().split("T")[0],
            },
          ];
          setContacts([...contacts, ...newContacts]);
          setGroups(
            groups.map((group) =>
              group.id === "1" ? { ...group, count: group.count + 1 } : group
            )
          );
          resolve("success");
        }, 1500);
      }),
      {
        loading: "Importing contacts...",
        success: "Contacts imported successfully",
        error: "Error importing contacts",
      }
    );

    setCsvFile(null);
    setIsImportDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Contacts</h1>
          <p className="text-muted-foreground">
            Manage your contact list and groups
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setIsImportDialogOpen(true)}
          >
            <Upload className="mr-2 h-4 w-4" />
            Import
          </Button>
          <Button onClick={() => {
            setCurrentContact({});
            setIsContactDialogOpen(true);
          }}>
            <Plus className="mr-2 h-4 w-4" />
            Add Contact
          </Button>
        </div>
      </div>

      {/* Main content grid */}
     {/* Main content grid */}
<div className="grid gap-6 md:grid-cols-1 lg:grid-cols-[250px_1fr] w-full overflow-x-hidden">
  {/* Groups sidebar */}
  <Card className="h-fit w-full md:w-full lg:w-auto">
    <CardHeader>
      <CardTitle>Groups</CardTitle>
    </CardHeader>
    <CardContent className="p-0">
      <div className="space-y-1">
        {groups.map((group) => (
          <button
            key={group.id}
            className={cn(
              "flex items-center justify-between w-full px-4 py-2 text-left text-sm",
              selectedGroup === group.id
                ? "bg-accent font-medium"
                : "hover:bg-muted/50"
            )}
            onClick={() => setSelectedGroup(group.id)}
          >
            <span className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              {group.name}
            </span>
            <Badge variant="secondary">{group.count}</Badge>
          </button>
        ))}
      </div>
    </CardContent>
  </Card>

  {/* Main content */}
  <div className="space-y-6 w-full overflow-auto">
    {/* Search and actions */}
    <Card>
      <CardHeader className="p-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="relative w-full md:w-[300px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search contacts..."
              className="pl-9 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {selectedContacts.length > 0 && (
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {selectedContacts.length} selected
              </span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    Actions <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setIsGroupDialogOpen(true)}>
                    <Users className="mr-2 h-4 w-4" />
                    Add to group
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Mail className="mr-2 h-4 w-4" />
                    Send message
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-destructive"
                    onClick={() => setIsDeleteDialogOpen(true)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>
      </CardHeader>
    </Card>

    {/* Contacts table */}
    <Card className="overflow-auto">
      <CardHeader className="p-0">
        <Table className="min-w-[800px] w-full">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40px]">
                <Checkbox
                  className="ml-3"
                  checked={
                    selectedContacts.length === filteredContacts.length &&
                    filteredContacts.length > 0
                  }
                  onCheckedChange={toggleSelectAll}
                />
              </TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Groups</TableHead>
              <TableHead>Added</TableHead>
              <TableHead className="w-[40px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredContacts.length > 0 ? (
              filteredContacts.map((contact) => (
                <TableRow key={contact.id}>
                  <TableCell>
                    <Checkbox
                      className="ml-3"
                      checked={selectedContacts.includes(contact.id)}
                      onCheckedChange={() =>
                        toggleContactSelection(contact.id)
                      }
                    />
                  </TableCell>
                  <TableCell className="font-medium">
                    {contact.name}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      {contact.phone}
                    </div>
                  </TableCell>
                  <TableCell>
                    {contact.email ? (
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        {contact.email}
                      </div>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {contact.groups.map((group) => (
                        <Badge
                          key={group}
                          variant="outline"
                          className="text-xs"
                        >
                          {group}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {contact.createdAt}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => {
                            setCurrentContact(contact);
                            setIsContactDialogOpen(true);
                          }}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Mail className="mr-2 h-4 w-4" />
                          Send Message
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => {
                            setSelectedContacts([contact.id]);
                            setIsDeleteDialogOpen(true);
                          }}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No contacts found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardHeader>
      <CardFooter className="flex flex-col sm:flex-row sm:items-center justify-between border-t px-6 py-4 gap-4">
        <div className="text-sm text-muted-foreground">
          Showing <strong>1-{filteredContacts.length}</strong> of{' '}
          <strong>{contacts.length}</strong> contacts
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            Previous
          </Button>
          <Button variant="outline" size="sm">
            Next
          </Button>
        </div>
      </CardFooter>
    </Card>
  </div>
</div>


      {/* Create Group Dialog */}
      <Dialog open={isGroupDialogOpen} onOpenChange={setIsGroupDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Group</DialogTitle>
            <DialogDescription>
              Add selected contacts to a new group
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="groupName">Group Name</Label>
              <Input
                id="groupName"
                placeholder="Enter group name"
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
              />
            </div>
            <div className="text-sm text-muted-foreground">
              {selectedContacts.length} contacts will be added to this group
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsGroupDialogOpen(false);
              setNewGroupName("");
            }}>
              Cancel
            </Button>
            <Button onClick={handleCreateGroup}>Create Group</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Import Contacts Dialog */}
      <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Import Contacts</DialogTitle>
            <DialogDescription>
              Upload a CSV file with your contacts. The file should include name,
              phone, and email columns.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center justify-center w-full border-2 border-dashed rounded-lg p-8">
              <div className="text-center">
                <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
                <p className="mt-2 text-sm text-muted-foreground">
                  Drag and drop your CSV file here, or click to browse
                </p>
                <Input
                  type="file"
                  accept=".csv"
                  className="hidden"
                  id="csvUpload"
                  onChange={(e) => setCsvFile(e.target.files?.[0] || null)}
                />
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-4"
                  onClick={() => document.getElementById("csvUpload")?.click()}
                >
                  Select File
                </Button>
                {csvFile && (
                  <p className="mt-2 text-sm">
                    Selected file: {csvFile.name}
                  </p>
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsImportDialogOpen(false);
                setCsvFile(null);
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleImportContacts}>Import</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add/Edit Contact Dialog */}
      <Dialog open={isContactDialogOpen} onOpenChange={setIsContactDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {currentContact?.id ? "Edit Contact" : "Add New Contact"}
            </DialogTitle>
            <DialogDescription>
              {currentContact?.id
                ? "Update the contact details"
                : "Fill in the contact information"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                placeholder="John Doe"
                value={currentContact?.name || ""}
                onChange={(e) =>
                  setCurrentContact({
                    ...currentContact,
                    name: e.target.value,
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone *</Label>
              <Input
                id="phone"
                placeholder="0244123456"
                value={currentContact?.phone || ""}
                onChange={(e) =>
                  setCurrentContact({
                    ...currentContact,
                    phone: e.target.value,
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                placeholder="john@example.com"
                type="email"
                value={currentContact?.email || ""}
                onChange={(e) =>
                  setCurrentContact({
                    ...currentContact,
                    email: e.target.value,
                  })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsContactDialogOpen(false);
                setCurrentContact(null);
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleAddOrUpdateContact}>
              {currentContact?.id ? "Update" : "Add"} Contact
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure?</DialogTitle>
            <DialogDescription>
              This will permanently delete {selectedContacts.length} contact(s).
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteContacts}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}