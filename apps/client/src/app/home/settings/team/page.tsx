"use client";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  MoreVertical,
  Mail,
  Search,
  ChevronLeft,
  UserPlus,
  UserCog,
  Trash2,
  Edit,
  Send,
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

type TeamMember = {
  id: string;
  name: string;
  email: string;
  role: "owner" | "admin" | "member";
  status: "active" | "invited" | "suspended";
  avatar?: string;
  lastActive?: string;
  joinedAt: string;
};

type Invitation = {
  id: string;
  email: string;
  role: "admin" | "member";
  invitedBy: string;
  invitedAt: string;
  status: "pending" | "expired";
};

const initialTeamMembers: TeamMember[] = [
  {
    id: "1",
    name: "Alex Johnson",
    email: "alex.johnson@example.com",
    role: "owner",
    status: "active",
    avatar: "/avatars/01.png",
    lastActive: "2023-10-15T14:30:00Z",
    joinedAt: "2022-05-10",
  },
  {
    id: "2",
    name: "Maria Garcia",
    email: "maria.garcia@example.com",
    role: "admin",
    status: "active",
    avatar: "/avatars/02.png",
    lastActive: "2023-10-14T09:15:00Z",
    joinedAt: "2023-01-15",
  },
  {
    id: "3",
    name: "James Wilson",
    email: "james.wilson@example.com",
    role: "member",
    status: "active",
    avatar: "/avatars/03.png",
    lastActive: "2023-10-13T16:45:00Z",
    joinedAt: "2023-06-20",
  },
  {
    id: "4",
    name: "Sarah Chen",
    email: "sarah.chen@example.com",
    role: "member",
    status: "invited",
    joinedAt: "2023-10-10",
  },
];

const initialInvitations: Invitation[] = [
  {
    id: "1",
    email: "michael.brown@example.com",
    role: "member",
    invitedBy: "Alex Johnson",
    invitedAt: "2023-10-12",
    status: "pending",
  },
  {
    id: "2",
    email: "emma.davis@example.com",
    role: "admin",
    invitedBy: "Maria Garcia",
    invitedAt: "2023-10-05",
    status: "pending",
  },
];

const getRoleBadge = (role: TeamMember["role"]) => {
  const roleConfig = {
    owner: { label: "Owner", variant: "default" as const },
    admin: { label: "Admin", variant: "secondary" as const },
    member: { label: "Member", variant: "outline" as const },
  };
  
  const config = roleConfig[role];
  return <Badge variant={config.variant}>{config.label}</Badge>;
};

const getStatusBadge = (status: TeamMember["status"]) => {
  const statusConfig = {
    active: { label: "Active", variant: "success" as const },
    invited: { label: "Invited", variant: "warning" as const },
    suspended: { label: "Suspended", variant: "destructive" as const },
  };
  
  const config = statusConfig[status];
  return <Badge variant={config.variant}>{config.label}</Badge>;
};

export default function TeamPage() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(initialTeamMembers);
  const [invitations, setInvitations] = useState<Invitation[]>(initialInvitations);
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<"admin" | "member">("member");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTeamMembers = teamMembers.filter(member =>
    member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleInvite = () => {
    if (!inviteEmail.trim()) return;
    
    const newInvitation: Invitation = {
      id: Date.now().toString(),
      email: inviteEmail,
      role: inviteRole,
      invitedBy: "You",
      invitedAt: new Date().toISOString().split('T')[0],
      status: "pending",
    };
    
    setInvitations([...invitations, newInvitation]);
    
    toast.success(
      <div>
        <div className="font-medium">Invitation sent</div>
        <div className="text-sm text-muted-foreground">
          An invitation has been sent to {inviteEmail}.
        </div>
      </div>
    );
    
    setInviteEmail("");
    setInviteRole("member");
    setIsInviteDialogOpen(false);
  };

  const handleResendInvite = (invitationId: string) => {
    const invitation = invitations.find(inv => inv.id === invitationId);
    if (invitation) {
      toast.success(
        <div>
          <div className="font-medium">Invitation resent</div>
          <div className="text-sm text-muted-foreground">
            An invitation has been resent to {invitation.email}.
          </div>
        </div>
      );
    }
  };

  const handleCancelInvite = (invitationId: string) => {
    setInvitations(invitations.filter(inv => inv.id !== invitationId));
    toast.success(
      <div>
        <div className="font-medium">Invitation canceled</div>
        <div className="text-sm text-muted-foreground">
          The invitation has been canceled.
        </div>
      </div>
    );
  };

  const handleEditMember = (member: TeamMember) => {
    setSelectedMember(member);
    setIsEditDialogOpen(true);
  };

  const handleSaveMember = () => {
    if (!selectedMember) return;
    
    setTeamMembers(teamMembers.map(member => 
      member.id === selectedMember.id ? selectedMember : member
    ));
    
    toast.success(
      <div>
        <div className="font-medium">Member updated</div>
        <div className="text-sm text-muted-foreground">
          {`${selectedMember.name}'s details have been updated.`}
        </div>
      </div>
    );
    
    setIsEditDialogOpen(false);
    setSelectedMember(null);
  };

  const handleRemoveMember = (memberId: string) => {
    const member = teamMembers.find(m => m.id === memberId);
    setTeamMembers(teamMembers.filter(m => m.id !== memberId));
    
    toast(
      <div>
        <div className="font-medium text-destructive">Member removed</div>
        <div className="text-sm text-muted-foreground">
          {`${member?.name} has been removed from the team.`}
        </div>
      </div>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
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
            <h1 className="text-2xl font-bold tracking-tight">Team Management</h1>
            <p className="text-muted-foreground">
              Manage your team members and their permissions
            </p>
          </div>
        </div>

        <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="mr-2 h-4 w-4" />
              Invite Member
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Invite Team Member</DialogTitle>
              <DialogDescription>
                Send an invitation to someone to join your team. They will receive an email with instructions.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="team.member@example.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select value={inviteRole} onValueChange={(value: "admin" | "member") => setInviteRole(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="member">Member</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Admins can manage team members and settings. Members have limited access.
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsInviteDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleInvite} disabled={!inviteEmail.trim()}>
                <Send className="mr-2 h-4 w-4" />
                Send Invitation
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="members" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="members">Team Members ({teamMembers.length})</TabsTrigger>
          <TabsTrigger value="invitations">
            Pending Invitations ({invitations.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="members" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <CardTitle>Team Members</CardTitle>
                  <CardDescription>
                    Manage your team members and their roles
                  </CardDescription>
                </div>
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search members..."
                    className="pl-8 w-full md:w-[300px]"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Member</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTeamMembers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="h-24 text-center">
                        <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                          <UserCog className="h-8 w-8" />
                          <p>No team members found</p>
                          <p className="text-sm">Try adjusting your search or invite new members</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredTeamMembers.map((member) => (
                      <TableRow key={member.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-9 w-9">
                              <AvatarImage src={member.avatar} alt={member.name} />
                              <AvatarFallback>
                                {member.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col">
                              <span className="font-medium">{member.name}</span>
                              <span className="text-sm text-muted-foreground">{member.email}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{getRoleBadge(member.role)}</TableCell>
                        <TableCell>{getStatusBadge(member.status)}</TableCell>
                        <TableCell>{formatDate(member.joinedAt)}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleEditMember(member)}>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit Role
                              </DropdownMenuItem>
                              {member.role !== "owner" && (
                                <>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem 
                                    className="text-red-600 focus:text-red-600"
                                    onClick={() => handleRemoveMember(member.id)}
                                  >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Remove Member
                                  </DropdownMenuItem>
                                </>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="invitations">
          <Card>
            <CardHeader>
              <CardTitle>Pending Invitations</CardTitle>
              <CardDescription>
                Invitations that have been sent but not yet accepted
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {invitations.length === 0 ? (
                <div className="text-center py-8">
                  <Mail className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No pending invitations</h3>
                  <p className="text-muted-foreground mb-4">
                    You haven&apos;t sent any invitations yet.
                  </p>
                  <Button onClick={() => setIsInviteDialogOpen(true)}>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Invite Team Member
                  </Button>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Invited By</TableHead>
                      <TableHead>Invited On</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {invitations.map((invitation) => (
                      <TableRow key={invitation.id}>
                        <TableCell className="font-medium">{invitation.email}</TableCell>
                        <TableCell>
                          <Badge variant={invitation.role === "admin" ? "secondary" : "outline"}>
                            {invitation.role.charAt(0).toUpperCase() + invitation.role.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>{invitation.invitedBy}</TableCell>
                        <TableCell>{formatDate(invitation.invitedAt)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleResendInvite(invitation.id)}
                            >
                              Resend
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleCancelInvite(invitation.id)}
                            >
                              Cancel
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit Member Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Team Member</DialogTitle>
            <DialogDescription>
              Update the role for {selectedMember?.name}.
            </DialogDescription>
          </DialogHeader>
          {selectedMember && (
            <div className="grid gap-4 py-4">
              <div className="flex items-center gap-3 p-3 border rounded-lg">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={selectedMember.avatar} alt={selectedMember.name} />
                  <AvatarFallback>
                    {selectedMember.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{selectedMember.name}</p>
                  <p className="text-sm text-muted-foreground">{selectedMember.email}</p>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select 
                  value={selectedMember.role} 
                  onValueChange={(value: "admin" | "member") => setSelectedMember({...selectedMember, role: value})}
                  disabled={selectedMember.role === "owner"}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="member">Member</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  {selectedMember.role === "owner" 
                    ? "Owners have full access to all team settings and cannot be demoted."
                    : "Admins can manage team members and settings. Members have limited access."
                  }
                </p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveMember}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}