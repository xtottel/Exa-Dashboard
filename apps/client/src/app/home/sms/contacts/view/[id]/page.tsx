// app/contacts/view/[id]/page.tsx
"use client";

import { useParams } from "next/navigation";
import { notFound } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Users,
  Mail,
  Phone,
  ChevronLeft,
  Plus,
  MoreVertical,
  Edit,
  Trash2,
  Download,
  Calendar,
} from "lucide-react";

type Contact = {
  id: string;
  name: string;
  email: string;
  phone: string;
  dob?: string;
  address?: string;
};

type ContactGroup = {
  id: string;
  name: string;
  recipients: number;
  date: string;
  description?: string;
  contacts: Contact[];
};

// Mock data - in a real app you would fetch this from your API
const mockContactGroups: ContactGroup[] = [
  {
    id: "1",
    name: "Customers",
    recipients: 2500,
    date: "2023-06-10",
    description: "All customer contacts from 2023",
    contacts: [
      {
        id: "101",
        name: "John Doe",
        email: "john@example.com",
        phone: "0244123456",
        dob: "1985-05-15",
      },
      {
        id: "102",
        name: "Jane Smith",
        email: "jane@example.com",
        phone: "0209876543",
        dob: "1990-11-22",
      },
    ],
  },
  {
    id: "2",
    name: "VIP Clients",
    recipients: 150,
    date: "2023-06-15",
    description: "High-value clients with premium status",
    contacts: [
      {
        id: "201",
        name: "Alice Johnson",
        email: "alice@example.com",
        phone: "0543210987",
        dob: "1978-03-10",
      },
    ],
  },
];

export default function ContactGroupViewPage() {
  const params = useParams<{ id: string }>();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentContact, setCurrentContact] = useState<Contact | null>(null);
  const [groups, setGroups] = useState(mockContactGroups);

  // Find the group in our mock data
  const group = groups.find((group) => group.id === params.id);

  if (!group) {
    return notFound();
  }

  // Form state for new/edited contact
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [contactForm, setContactForm] = useState<Omit<Contact, "id">>({
    name: "",
    email: "",
    phone: "",
    dob: "",
    // address: ''
  });

  const handleAddContact = () => {
    if (!contactForm.name || !contactForm.email || !contactForm.phone) {
      toast.error("Please fill in all required fields");
      return;
    }

    const newContact: Contact = {
      id: Date.now().toString(),
      ...contactForm,
    };

    const updatedGroups = groups.map((g) => {
      if (g.id === group.id) {
        return {
          ...g,
          contacts: [...g.contacts, newContact],
          recipients: g.contacts.length + 1,
        };
      }
      return g;
    });

    setGroups(updatedGroups);
    setIsAddModalOpen(false);
    setContactForm({
      name: "",
      email: "",
      phone: "",
      dob: "",
      //   address: ''
    });
    toast.success("Contact added successfully");
  };

  const handleEditContact = () => {
    if (
      !currentContact ||
      !contactForm.name ||
      !contactForm.email ||
      !contactForm.phone
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    const updatedGroups = groups.map((g) => {
      if (g.id === group.id) {
        return {
          ...g,
          contacts: g.contacts.map((c) =>
            c.id === currentContact.id ? { ...c, ...contactForm } : c
          ),
        };
      }
      return g;
    });

    setGroups(updatedGroups);
    setIsEditModalOpen(false);
    setCurrentContact(null);
    toast.success("Contact updated successfully");
  };

  const handleDeleteContact = () => {
    if (!currentContact) return;

    const updatedGroups = groups.map((g) => {
      if (g.id === group.id) {
        return {
          ...g,
          contacts: g.contacts.filter((c) => c.id !== currentContact.id),
          recipients: Math.max(0, g.contacts.length - 1),
        };
      }
      return g;
    });

    setGroups(updatedGroups);
    setIsDeleteModalOpen(false);
    setCurrentContact(null);
    toast.success("Contact deleted successfully");
  };

  const openEditModal = (contact: Contact) => {
    setCurrentContact(contact);
    setContactForm({
      name: contact.name,
      email: contact.email,
      phone: contact.phone,
      dob: contact.dob || "",
      //   address: contact.address || ''
    });
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (contact: Contact) => {
    setCurrentContact(contact);
    setIsDeleteModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/home/sms/contacts">
            <ChevronLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{group.name}</h1>
          <p className="text-muted-foreground">{group.description}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Total Contacts
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {group.contacts.length.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Created on {group.date}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Last Updated</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Today</div>
            <p className="text-xs text-muted-foreground">2 changes this week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Actions</CardTitle>
            <Phone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
              <Button size="sm" onClick={() => setIsAddModalOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Contact
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Contact List</h1>
      </div>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Date of Birth</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {group.contacts.map((contact) => (
                <TableRow key={contact.id}>
                  <TableCell className="font-medium">{contact.name}</TableCell>
                  <TableCell>{contact.email}</TableCell>
                  <TableCell>{contact.phone}</TableCell>
                  <TableCell>{contact.dob || "-"}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => openEditModal(contact)}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => openDeleteModal(contact)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="border-t px-6 py-4">
          <div className="text-sm text-muted-foreground">
            Showing <strong>1-{group.contacts.length}</strong> of{" "}
            <strong>{group.contacts.length}</strong> contacts
          </div>
        </CardFooter>
      </Card>

      {/* Add Contact Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Contact</DialogTitle>
            <DialogDescription>
              Fill in the details for the new contact
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Input
                placeholder="Full Name"
                value={contactForm.name}
                onChange={(e) =>
                  setContactForm({ ...contactForm, name: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Input
                placeholder="Email"
                type="email"
                value={contactForm.email}
                onChange={(e) =>
                  setContactForm({ ...contactForm, email: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Input
                placeholder="Phone Number"
                value={contactForm.phone}
                onChange={(e) =>
                  setContactForm({ ...contactForm, phone: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Date of Birth (YYYY-MM-DD)"
                  type="date"
                  value={contactForm.dob}
                  onChange={(e) =>
                    setContactForm({ ...contactForm, dob: e.target.value })
                  }
                />
              </div>
            </div>
            {/* <div className="space-y-2">
              <Input
                placeholder="Address (Optional)"
                value={contactForm.address}
                onChange={(e) => setContactForm({...contactForm, address: e.target.value})}
              />
            </div> */}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddContact}>Add Contact</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Contact Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Contact</DialogTitle>
            <DialogDescription>Update the contact details</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Input
                placeholder="Full Name"
                value={contactForm.name}
                onChange={(e) =>
                  setContactForm({ ...contactForm, name: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Input
                placeholder="Email"
                type="email"
                value={contactForm.email}
                onChange={(e) =>
                  setContactForm({ ...contactForm, email: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Input
                placeholder="Phone Number"
                value={contactForm.phone}
                onChange={(e) =>
                  setContactForm({ ...contactForm, phone: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Date of Birth (YYYY-MM-DD)"
                  type="date"
                  value={contactForm.dob}
                  onChange={(e) =>
                    setContactForm({ ...contactForm, dob: e.target.value })
                  }
                />
              </div>
            </div>
            {/* <div className="space-y-2">
              <Input
                placeholder="Address (Optional)"
                value={contactForm.address}
                onChange={(e) => setContactForm({...contactForm, address: e.target.value})}
              />
            </div> */}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditContact}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Contact</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this contact? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteContact}>
              Delete Contact
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
