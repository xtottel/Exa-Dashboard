"use client";
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
} from "@/components/ui/card"
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Copy,
  Plus,
  Trash2,
  Eye,
  EyeOff,
  Key,
  MoreVertical,
  ChevronLeft,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/components/ui/use-toast"
import { useState } from "react"
import { Switch } from "@/components/ui/switch"
import Link from "next/link";

const apiKeys = [
  {
    id: "1",
    name: "Production API",
    key: "sk_live_1234567890abcdef",
    lastUsed: "2023-06-15 09:30:45",
    created: "2023-05-10",
    status: "active",
  },
  {
    id: "2",
    name: "Development API",
    key: "sk_test_9876543210fedcba",
    lastUsed: "2023-06-10 14:22:18",
    created: "2023-04-15",
    status: "active",
  },
  {
    id: "3",
    name: "Old Mobile App",
    key: "sk_test_abcdef1234567890",
    lastUsed: "2023-03-28",
    created: "2023-01-20",
    status: "inactive",
  },
]

export default function ApiKeysPage() {
  const [showKey, setShowKey] = useState<string | null>(null)
  const [newKeyName, setNewKeyName] = useState("")
  const [isCreating, setIsCreating] = useState(false)

  const handleCopy = (key: string) => {
    navigator.clipboard.writeText(key)
    toast({
      title: "API key copied",
      description: "The API key has been copied to your clipboard.",
    })
  }

  const handleCreate = () => {
    if (newKeyName.trim()) {
      // In a real app, you would generate and save the API key
      toast({
        title: "API key created",
        description: `New key "${newKeyName}" has been generated.`,
      })
      setIsCreating(false)
      setNewKeyName("")
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleDelete = (id: string) => {
    // In a real app, you would delete the API key
    toast({
      title: "API key deleted",
      description: "The API key has been permanently removed.",
      variant: "destructive",
    })
  }

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
            Manage your API access credentials
          </p>
        </div>
      </div>
        
        <Dialog open={isCreating} onOpenChange={setIsCreating}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create New Key
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New API Key</DialogTitle>
              <DialogDescription>
                Generate a new secret key for API access
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Key Name</Label>
                <Input
                  id="name"
                  placeholder="e.g. Production Server"
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Permissions</Label>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Send SMS</span>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Verify OTP</span>
                    <Switch defaultChecked />
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleCreate} disabled={!newKeyName.trim()}>
                Generate Key
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
                <TableHead>Key</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Last Used</TableHead>
                <TableHead className="w-[40px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {apiKeys.map((key) => (
                <TableRow key={key.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <Key className="h-4 w-4 text-muted-foreground" />
                      {key.name}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
                        {showKey === key.id ? key.key : "••••••••••••••••"}
                      </code>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() =>
                          setShowKey(showKey === key.id ? null : key.id)
                        }
                      >
                        {showKey === key.id ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => handleCopy(key.key)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={key.status === "active" ? "success" : "destructive"}
                    >
                      {key.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{key.created}</TableCell>
                  <TableCell>{key.lastUsed}</TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Manage API Key</DialogTitle>
                          <DialogDescription>
                            Actions for {key.name}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="flex items-center justify-between">
                            <span>Status</span>
                            <Switch
                              defaultChecked={key.status === "active"}
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <span>Regenerate Key</span>
                            <Button variant="outline" size="sm">
                              Regenerate
                            </Button>
                          </div>
                        </div>
                        <DialogFooter>
                          <Button
                            variant="destructive"
                            onClick={() => handleDelete(key.id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Key
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

// app/settings/api-keys/page.tsx
// import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { ChevronLeft } from "lucide-react";
// import Link from "next/link";
// //import { Badge } from "@/components/ui/badge";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";

// export default function ApiKeysPage() {
//   const apiKeys = [
//     {
//       id: "api_123456",
//       name: "Production Key",
//       key: "sk_live_123...456",
//       lastUsed: "2023-06-15",
//     },
//     {
//       id: "api_789012",
//       name: "Development Key",
//       key: "sk_test_789...012",
//       lastUsed: "2023-05-28",
//     },
//   ];

//   return (
//     <div className="space-y-6">
//       <div className="flex items-center gap-4">
//         <Button variant="outline" size="icon" asChild>
//           <Link href="/home/settings">
//             <ChevronLeft className="h-4 w-4" />
//           </Link>
//         </Button>
//         <div>
//           <h1 className="text-2xl font-bold tracking-tight">API Keys</h1>
//           <p className="text-muted-foreground">
//             Manage your API access credentials
//           </p>
//         </div>
//       </div>

//       <Card>
//         <CardHeader>
//           <CardTitle>Create New API Key</CardTitle>
//         </CardHeader>
//         <CardContent className="space-y-4">
//           <div className="space-y-2">
//             <Label htmlFor="keyName">Key Name</Label>
//             <Input id="keyName" placeholder="e.g. Production Server" />
//           </div>
//           <div className="flex justify-end">
//             <Button>Generate API Key</Button>
//           </div>
//         </CardContent>
//       </Card>

//       <Card>
//         <CardHeader>
//           <CardTitle>Your API Keys</CardTitle>
//         </CardHeader>
//         <CardContent className="space-y-4">
//           {apiKeys.map((key) => (
//             <div key={key.id} className="border rounded-lg p-4 flex justify-between items-center">
//               <div>
//                 <div className="font-medium">{key.name}</div>
//                 <div className="text-sm text-muted-foreground">{key.key}</div>
//                 <div className="text-xs text-muted-foreground mt-1">
//                   Last used: {key.lastUsed}
//                 </div>
//               </div>
//               <div className="flex gap-2">
//                 <Button variant="outline" size="sm">
//                   Copy
//                 </Button>
//                 <Button variant="outline" size="sm">
//                   Revoke
//                 </Button>
//               </div>
//             </div>
//           ))}
//         </CardContent>
//       </Card>
//     </div>
//   );
// }