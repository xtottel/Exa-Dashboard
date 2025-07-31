// app/contacts/view/[id]/page.tsx
'use client'

import { useParams } from 'next/navigation'
import { notFound } from 'next/navigation'
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, Mail, Phone, ChevronLeft } from "lucide-react"
import Link from "next/link"

// Mock data - in a real app you would fetch this from your API
const mockContactGroups = [
  {
    id: "1",
    name: "Customers",
    recipients: 2500,
    date: "2023-06-10",
    description: "All customer contacts from 2023",
    contacts: [
      { id: "101", name: "John Doe", email: "john@example.com", phone: "0244123456" },
      { id: "102", name: "Jane Smith", email: "jane@example.com", phone: "0209876543" },
    ]
  },
  {
    id: "2",
    name: "VIP Clients",
    recipients: 150,
    date: "2023-06-15",
    description: "High-value clients with premium status",
    contacts: [
      { id: "201", name: "Alice Johnson", email: "alice@example.com", phone: "0543210987" },
    ]
  },
]

export default function ContactGroupViewPage() {
  const params = useParams<{ id: string }>()
  
  // Find the group in our mock data
  const group = mockContactGroups.find(group => group.id === params.id)

  if (!group) {
    return notFound()
  }

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
            <CardTitle className="text-sm font-medium">Total Contacts</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{group.recipients.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Created on {group.date}</p>
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
                Export Contacts
              </Button>
              <Button variant="outline" size="sm">
                Add Contacts
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Contact List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {group.contacts.map((contact) => (
              <div key={contact.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium">{contact.name}</p>
                  <p className="text-sm text-muted-foreground">{contact.email}</p>
                </div>
                <div className="text-sm text-muted-foreground">{contact.phone}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}