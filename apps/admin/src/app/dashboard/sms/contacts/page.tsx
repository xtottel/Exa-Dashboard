"use client";
import { useState } from "react"
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  CardFooter,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
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
} from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

type Contact = {
  id: string
  name: string
  phone: string
  email?: string
  groups: string[]
  createdAt: string
}

type ContactGroup = {
  id: string
  name: string
  count: number
}

export default function ContactsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedContacts, setSelectedContacts] = useState<string[]>([])
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null)
  const [isImporting, setIsImporting] = useState(false)
  const [isCreatingGroup, setIsCreatingGroup] = useState(false)
  const [newGroupName, setNewGroupName] = useState("")

  // Sample data
  const contacts: Contact[] = [
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
  ]

  const groups: ContactGroup[] = [
    { id: "1", name: "All Contacts", count: contacts.length },
    { id: "2", name: "Customers", count: 2 },
    { id: "3", name: "VIP", count: 2 },
    { id: "4", name: "Subscribers", count: 1 },
    { id: "5", name: "Employees", count: 1 },
  ]

  const filteredContacts = contacts.filter((contact) => {
    const matchesSearch = contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.phone.includes(searchTerm) ||
      (contact.email && contact.email.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesGroup = !selectedGroup || 
      selectedGroup === "1" || // "All Contacts"
      contact.groups.includes(selectedGroup)

    return matchesSearch && matchesGroup
  })

  const toggleContactSelection = (contactId: string) => {
    setSelectedContacts((prev) =>
      prev.includes(contactId)
        ? prev.filter((id) => id !== contactId)
        : [...prev, contactId]
    )
  }

  const toggleSelectAll = () => {
    if (selectedContacts.length === filteredContacts.length) {
      setSelectedContacts([])
    } else {
      setSelectedContacts(filteredContacts.map((contact) => contact.id))
    }
  }

  const handleCreateGroup = () => {
    if (newGroupName.trim() && selectedContacts.length > 0) {
      // In a real app, you would save the new group and update contacts
      alert(`Created group "${newGroupName}" with ${selectedContacts.length} contacts`)
      setIsCreatingGroup(false)
      setNewGroupName("")
      setSelectedContacts([])
    }
  }

  const handleDeleteContacts = () => {
    // In a real app, you would delete the selected contacts
    alert(`Deleted ${selectedContacts.length} contacts`)
    setSelectedContacts([])
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Contacts</h1>
          <p className="text-muted-foreground">
            Manage your contact list and groups
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setIsImporting(true)}>
            <Upload className="mr-2 h-4 w-4" />
            Import
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Contact
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-[250px_1fr]">
        {/* Groups sidebar */}
        <Card className="h-fit">
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
        <div className="space-y-6">
          {/* Search and actions */}
          <Card>
            <CardHeader className="p-4">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="relative w-full md:w-auto">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search contacts..."
                    className="pl-9 w-full md:w-[300px]"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                {selectedContacts.length > 0 && (
                  <div className="flex items-center gap-2">
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
                        <DropdownMenuItem
                          onClick={() => setIsCreatingGroup(true)}
                        >
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
                          onClick={handleDeleteContacts}
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

          {/* Create group modal */}
          {isCreatingGroup && (
            <Card>
              <CardHeader>
                <CardTitle>Create New Group</CardTitle>
                <CardDescription>
                  Add selected contacts to a new group
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Input
                    placeholder="Group name"
                    value={newGroupName}
                    onChange={(e) => setNewGroupName(e.target.value)}
                  />
                  <div className="flex gap-2">
                    <Button onClick={handleCreateGroup}>
                      <Check className="mr-2 h-4 w-4" />
                      Create Group
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsCreatingGroup(false)
                        setNewGroupName("")
                      }}
                    >
                      <X className="mr-2 h-4 w-4" />
                      Cancel
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Import modal */}
          {isImporting && (
            <Card>
              <CardHeader>
                <CardTitle>Import Contacts</CardTitle>
                <CardDescription>
                  Upload a CSV file with your contacts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-center w-full border-2 border-dashed rounded-lg p-8">
                    <div className="text-center">
                      <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
                      <p className="mt-2 text-sm text-muted-foreground">
                        Drag and drop your CSV file here, or click to browse
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-4"
                      >
                        Select File
                      </Button>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={() => setIsImporting(false)}>
                      <Check className="mr-2 h-4 w-4" />
                      Import
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setIsImporting(false)}
                    >
                      <X className="mr-2 h-4 w-4" />
                      Cancel
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Contacts table */}
          <Card>
            <CardHeader className="p-0">
              <Table>
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
                        // indeterminate={
                        //   selectedContacts.length > 0 &&
                        //   selectedContacts.length < filteredContacts.length
                        // }
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
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                              >
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Mail className="mr-2 h-4 w-4" />
                                Send Message
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-destructive">
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
                      <TableCell
                        colSpan={6}
                        className="h-24 text-center"
                      >
                        No contacts found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardHeader>
            <CardFooter className="flex items-center justify-between border-t px-6 py-4">
              <div className="text-sm text-muted-foreground">
                Showing <strong>1-{filteredContacts.length}</strong> of{" "}
                <strong>{contacts.length}</strong> contacts
              </div>
              <div className="space-x-2">
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
    </div>
  )
}