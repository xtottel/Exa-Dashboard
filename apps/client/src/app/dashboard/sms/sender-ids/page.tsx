"use client";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { PlusCircle, Search, Edit, Trash2, CheckCircle2, XCircle } from "lucide-react"
import { useState } from "react"
import { toast } from "react-hot-toast"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"

export default function SenderIdPage() {
  const [senderIds, setSenderIds] = useState([
    { id: 1, name: "COMPANY", status: "approved", createdAt: "2023-10-15" },
    { id: 2, name: "SERVICES", status: "pending", createdAt: "2023-11-02" },
    { id: 3, name: "ALERTS", status: "rejected", createdAt: "2023-09-28" },
    { id: 4, name: "NOTIFY", status: "approved", createdAt: "2023-08-10" },
  ])

  const [newSenderId, setNewSenderId] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState<number | null>(null)

  const handleAddSenderId = () => {
    if (newSenderId.trim() === "") {
      toast.error("Sender ID cannot be empty")
      return
    }

    if (newSenderId.length < 3) {
      toast.error("Sender ID must be at least 3 characters")
      return
    }

    // Check if sender ID already exists
    if (senderIds.some(sid => sid.name === newSenderId.toUpperCase())) {
      toast.error("This Sender ID is already registered")
      return
    }

    const newId = {
      id: senderIds.length + 1,
      name: newSenderId.toUpperCase(),
      status: "pending",
      createdAt: new Date().toISOString().split('T')[0]
    }
    
    setSenderIds([...senderIds, newId])
    setNewSenderId("")
    setIsDialogOpen(false)
    toast.success("Sender ID submitted for approval")
  }

  const handleDelete = (id: number) => {
    setIsDeleting(id)
    toast.promise(
      new Promise((resolve) => {
        setTimeout(() => {
          setSenderIds(senderIds.filter(sid => sid.id !== id))
          resolve("success")
        }, 1000)
      }),
      {
        loading: 'Deleting Sender ID...',
        success: 'Sender ID deleted successfully',
        error: 'Error deleting Sender ID',
      }
    ).finally(() => setIsDeleting(null))
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

      {/* Add Sender ID Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Register New Sender ID</DialogTitle>
            <DialogDescription>
              Sender IDs must be 3-11 characters, alphanumeric (no spaces or special characters)
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input
              placeholder="Enter sender ID (e.g. COMPANY)"
              value={newSenderId}
              onChange={(e) => setNewSenderId(e.target.value.replace(/[^a-zA-Z0-9]/g, ''))}
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
        {/* <CardHeader>
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
        </CardHeader> */}
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
                        <CheckCircle2 className="h-3 w-3 mr-1 text-green-600" />
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
                      <Button 
                        variant="outline" 
                        size="sm" 
                        disabled={senderId.status !== "approved"}
                        onClick={() => toast("Editing is only available for approved Sender IDs", { icon: "ℹ️" })}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(senderId.id)}
                        disabled={senderId.status === "approved" || isDeleting === senderId.id}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        {isDeleting === senderId.id ? "Deleting..." : "Delete"}
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
  )
}