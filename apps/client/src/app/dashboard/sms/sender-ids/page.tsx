"use client";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { PlusCircle, Search, Edit, Trash2, CheckCircle2, XCircle } from "lucide-react"
import { useState } from "react"

export default function SenderIdPage() {
  const [senderIds, setSenderIds] = useState([
    { id: 1, name: "COMPANY", status: "approved", createdAt: "2023-10-15" },
    { id: 2, name: "SERVICES", status: "pending", createdAt: "2023-11-02" },
    { id: 3, name: "ALERTS", status: "rejected", createdAt: "2023-09-28" },
    { id: 4, name: "NOTIFY", status: "approved", createdAt: "2023-08-10" },
  ])

  const [newSenderId, setNewSenderId] = useState("")
  const [isAdding, setIsAdding] = useState(false)

  const handleAddSenderId = () => {
    if (newSenderId.trim() === "") return
    
    const newId = {
      id: senderIds.length + 1,
      name: newSenderId.toUpperCase(),
      status: "pending",
      createdAt: new Date().toISOString().split('T')[0]
    }
    
    setSenderIds([...senderIds, newId])
    setNewSenderId("")
    setIsAdding(false)
  }

  const handleDelete = (id: number) => {
    setSenderIds(senderIds.filter(sid => sid.id !== id))
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Sender ID Management</h1>
          <p className="text-muted-foreground">
            Register and manage your SMS sender identifiers
          </p>
        </div>
        <Button onClick={() => setIsAdding(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Sender ID
        </Button>
      </div>

      {isAdding && (
        <Card>
          <CardHeader>
            <CardTitle>Register New Sender ID</CardTitle>
            <CardDescription>
              Sender IDs must be 3-11 characters, alphanumeric (no spaces or special characters)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Input
                placeholder="Enter sender ID (e.g. COMPANY)"
                value={newSenderId}
                onChange={(e) => setNewSenderId(e.target.value.replace(/[^a-zA-Z0-9]/g, ''))}
                maxLength={11}
                className="max-w-[300px]"
              />
              <Button onClick={handleAddSenderId}>Submit</Button>
              <Button variant="outline" onClick={() => setIsAdding(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>Your Sender IDs</CardTitle>
              <CardDescription>
                {senderIds.length} registered sender IDs
              </CardDescription>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search sender IDs..."
                className="pl-9 w-full md:w-[300px]"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Sender ID</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date Registered</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {senderIds.map((senderId) => (
                <TableRow key={senderId.id}>
                  <TableCell className="font-medium">{senderId.name}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        senderId.status === "approved"
                          ? "success"
                          : senderId.status === "pending"
                          ? "warning"
                          : "destructive"
                      }
                    >
                      {senderId.status === "approved" ? (
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                      ) : senderId.status === "pending" ? (
                        <span className="h-3 w-3 mr-1 rounded-full bg-yellow-500" />
                      ) : (
                        <XCircle className="h-3 w-3 mr-1" />
                      )}
                      {senderId.status.charAt(0).toUpperCase() + senderId.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>{senderId.createdAt}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" disabled={senderId.status !== "approved"}>
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(senderId.id)}
                        disabled={senderId.status === "approved"}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
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
            Showing <strong>1-{senderIds.length}</strong> of <strong>{senderIds.length}</strong> sender IDs
          </div>
        </CardFooter>
      </Card>

      {/* <Card className="bg-muted/50">
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
      </Card> */}
    </div>
  )
}