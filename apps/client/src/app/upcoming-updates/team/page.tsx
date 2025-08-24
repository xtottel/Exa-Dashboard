"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronLeft, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

type TeamMember = {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "Admin" | "Member" | "Viewer";
};

export default function TeamSettingsPage() {
  const [team, setTeam] = useState<TeamMember[]>([
    {
      id: "1",
      name: "Collins Joe",
      email: "iamcollinsjoe@gmail.com",
      phone: "0551196764",
      role: "Admin",
    },
    {
      id: "2",
      name: "Ethel Akorfa",
      email: "ethel.akorfa@sendexa.co",
      phone: "0244000000",
      role: "Member",
    },
  ]);

  const [newMember, setNewMember] = useState<Omit<TeamMember, "id">>({
    name: "",
    email: "",
    phone: "",
    role: "Member",
  });

  const addMember = (e: React.FormEvent) => {
    e.preventDefault();

    if (!newMember.name || !newMember.email || !newMember.phone) {
      toast.error("Please fill all fields");
      return;
    }

    setTeam([...team, { id: Date.now().toString(), ...newMember }]);
    setNewMember({ name: "", email: "", phone: "", role: "Member" });
    toast.success("Team member added successfully");
  };

  const removeMember = (id: string) => {
    setTeam(team.filter((m) => m.id !== id));
    toast.success("Team member removed");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/home/settings">
            <ChevronLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Team Management</h1>
          <p className="text-muted-foreground">
            Manage your team members and their roles
          </p>
        </div>
      </div>

      {/* Add Team Member Form */}
      <Card>
        <CardHeader>
          <CardTitle>Add Team Member</CardTitle>
          <CardDescription>
            Invite a new member to join your company dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={addMember}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                placeholder="Enter full name"
                value={newMember.name}
                onChange={(e) =>
                  setNewMember({ ...newMember, name: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter email address"
                value={newMember.email}
                onChange={(e) =>
                  setNewMember({ ...newMember, email: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="Enter phone number"
                value={newMember.phone}
                onChange={(e) =>
                  setNewMember({ ...newMember, phone: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select
                value={newMember.role}
                onValueChange={(val: TeamMember["role"]) =>
                  setNewMember({ ...newMember, role: val })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Admin">Admin</SelectItem>
                  <SelectItem value="Member">Member</SelectItem>
                  <SelectItem value="Viewer">Viewer</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="md:col-span-2 flex justify-end">
              <Button type="submit">
                <Plus className="mr-2 h-4 w-4" />
                Add Member
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Team Members Table */}
      <Card>
        <CardHeader>
          <CardTitle>Current Team</CardTitle>
          <CardDescription>
            A list of all active members in your company dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableCaption>Manage roles and remove inactive members.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Role</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {team.map((member) => (
                <TableRow key={member.id}>
                  <TableCell className="font-medium">{member.name}</TableCell>
                  <TableCell>{member.email}</TableCell>
                  <TableCell>{member.phone}</TableCell>
                  <TableCell>{member.role}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => removeMember(member.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Remove
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
