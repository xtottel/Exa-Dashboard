"use client";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
  Loader2,
  AlertTriangle,
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type TeamMember = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string | { id: string; name: string; description?: string };
  isActive: boolean;
  lastActive: string | null;
  lastLogin: string | null;
  createdAt: string;
};

type Invitation = {
  id: string;
  email: string;
  role: { id: string; name: string; description?: string };
  invitedBy: {
    firstName: string;
    lastName: string;
  };
  status: string;
  expiresAt: string;
  createdAt: string;
};

interface ApiResponse {
  success: boolean;
  message: string;
  teamMembers?: TeamMember[];
  invitations?: Invitation[];
  currentUserRole?: string; // Add current user role to response
}

const getRoleName = (
  role: string | { id: string; name: string; description?: string }
): string => {
  if (typeof role === "string") {
    return role;
  }
  return role.name;
};

const getRoleBadge = (
  role: string | { id: string; name: string; description?: string }
) => {
  const roleName = getRoleName(role);

  const roleConfig = {
    owner: {
      label: "Owner",
      variant: "role" as const,
      roleType: "owner" as const,
    },
    admin: {
      label: "Admin",
      variant: "role" as const,
      roleType: "admin" as const,
    },
    member: {
      label: "Member",
      variant: "role" as const,
      roleType: "member" as const,
    },
  };

  const config = roleConfig[roleName as keyof typeof roleConfig] || {
    label: roleName,
    variant: "outline" as const,
  };

  if (config.variant === "role") {
    return (
      <Badge variant={config.variant} role={config.roleType}>
        {config.label}
      </Badge>
    );
  } else {
    return <Badge variant={config.variant}>{config.label}</Badge>;
  }
};

const getStatusBadge = (isActive: boolean) => {
  const statusString = isActive ? "success" : "failed";
  return (
    <Badge variant="status" status={statusString}>
      {isActive ? "Active" : "Inactive"}
    </Badge>
  );
};

// Skeleton Components
const TeamMemberSkeleton = () => (
  <TableRow>
    <TableCell>
      <div className="flex items-center gap-3">
        <Skeleton className="h-9 w-9 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-24" />
        </div>
      </div>
    </TableCell>
    <TableCell>
      <Skeleton className="h-6 w-16" />
    </TableCell>
    <TableCell>
      <Skeleton className="h-6 w-16" />
    </TableCell>
    <TableCell>
      <Skeleton className="h-4 w-20" />
    </TableCell>
    <TableCell className="text-right">
      <Skeleton className="h-8 w-8 rounded-md" />
    </TableCell>
  </TableRow>
);

const InvitationSkeleton = () => (
  <TableRow>
    <TableCell>
      <Skeleton className="h-4 w-40" />
    </TableCell>
    <TableCell>
      <Skeleton className="h-6 w-16" />
    </TableCell>
    <TableCell>
      <Skeleton className="h-4 w-32" />
    </TableCell>
    <TableCell>
      <Skeleton className="h-4 w-20" />
    </TableCell>
    <TableCell className="text-right">
      <div className="flex justify-end gap-2">
        <Skeleton className="h-8 w-16" />
        <Skeleton className="h-8 w-16" />
      </div>
    </TableCell>
  </TableRow>
);

export default function TeamPage() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isRemoveDialogOpen, setIsRemoveDialogOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [memberToRemove, setMemberToRemove] = useState<TeamMember | null>(null);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<string>("member");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentUserRole, setCurrentUserRole] = useState<string>("member");

  useEffect(() => {
    fetchTeamData();
  }, []);

  const fetchTeamData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/business/team");
      const data: ApiResponse = await response.json();

      if (data.success) {
        setTeamMembers(data.teamMembers || []);
        setInvitations(data.invitations || []);
        setCurrentUserRole(data.currentUserRole || "member");
      } else {
        toast.error("Failed to fetch team data");
      }
    } catch (error) {
      console.error("Error fetching team data:", error);
      toast.error("Failed to fetch team data");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredTeamMembers = teamMembers.filter(
    (member) =>
      `${member.firstName} ${member.lastName}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const canInvite = ["owner", "admin"].includes(currentUserRole);
  const canEdit = ["owner", "admin"].includes(currentUserRole);
  const canRemove = (member: TeamMember) => {
    const memberRole = getRoleName(member.role);
    return (
      ["owner", "admin"].includes(currentUserRole) && memberRole !== "owner"
    );
  };

  const handleInvite = async () => {
    if (!inviteEmail.trim()) return;

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/business/team/invite", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: inviteEmail,
          role: inviteRole,
        }),
      });

      const data = await response.json();

      if (data.success) {
        await fetchTeamData();
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
      } else {
        toast.error(data.message || "Failed to send invitation");
      }
    } catch (error) {
      console.error("Error sending invitation:", error);
      toast.error("Failed to send invitation");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendInvite = async (invitationId: string) => {
    try {
      const response = await fetch(
        `/api/business/invitations/${invitationId}/resend`,
        {
          method: "POST",
        }
      );

      const data = await response.json();

      if (data.success) {
        await fetchTeamData();
        toast.success(
          <div>
            <div className="font-medium">Invitation resent</div>
            <div className="text-sm text-muted-foreground">
              The invitation has been resent.
            </div>
          </div>
        );
      } else {
        toast.error(data.message || "Failed to resend invitation");
      }
    } catch (error) {
      console.error("Error resending invitation:", error);
      toast.error("Failed to resend invitation");
    }
  };

  const handleCancelInvite = async (invitationId: string) => {
    try {
      const response = await fetch(
        `/api/business/invitations/${invitationId}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (data.success) {
        await fetchTeamData();
        toast.success(
          <div>
            <div className="font-medium">Invitation canceled</div>
            <div className="text-sm text-muted-foreground">
              The invitation has been canceled.
            </div>
          </div>
        );
      } else {
        toast.error(data.message || "Failed to cancel invitation");
      }
    } catch (error) {
      console.error("Error canceling invitation:", error);
      toast.error("Failed to cancel invitation");
    }
  };

  const handleEditMember = (member: TeamMember) => {
    setSelectedMember(member);
    setIsEditDialogOpen(true);
  };

  const handleSaveMember = async () => {
    if (!selectedMember) return;

    setIsSubmitting(true);
    try {
      const roleValue =
        typeof selectedMember.role === "string"
          ? selectedMember.role
          : selectedMember.role.name;

      const response = await fetch(`/api/business/team/${selectedMember.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          role: roleValue,
        }),
      });

      const data = await response.json();

      if (data.success) {
        await fetchTeamData();
        toast.success(
          <div>
            <div className="font-medium">Member updated</div>
            <div className="text-sm text-muted-foreground">
              {`${selectedMember.firstName} ${selectedMember.lastName}'s role has been updated.`}
            </div>
          </div>
        );
        setIsEditDialogOpen(false);
        setSelectedMember(null);
      } else {
        toast.error(data.message || "Failed to update member");
      }
    } catch (error) {
      console.error("Error updating member:", error);
      toast.error("Failed to update member");
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmRemoveMember = (member: TeamMember) => {
    setMemberToRemove(member);
    setIsRemoveDialogOpen(true);
  };

  const handleRemoveMember = async () => {
    if (!memberToRemove) return;

    try {
      const response = await fetch(`/api/business/team/${memberToRemove.id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (data.success) {
        await fetchTeamData();
        toast(
          <div>
            <div className="font-medium text-destructive">Member removed</div>
            <div className="text-sm text-muted-foreground">
              {`${memberToRemove.firstName} ${memberToRemove.lastName} has been removed from the team.`}
            </div>
          </div>
        );
      } else {
        toast.error(data.message || "Failed to remove member");
      }
    } catch (error) {
      console.error("Error removing member:", error);
      toast.error("Failed to remove member");
    } finally {
      setIsRemoveDialogOpen(false);
      setMemberToRemove(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
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
            <h1 className="text-2xl font-bold tracking-tight">
              Team Management
            </h1>
            <p className="text-muted-foreground">
              Manage your team members and their permissions
            </p>
          </div>
        </div>

        {canInvite && (
          <Dialog
            open={isInviteDialogOpen}
            onOpenChange={setIsInviteDialogOpen}
          >
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
                  Send an invitation to someone to join your team. They will
                  receive an email with instructions.
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
                  <Select value={inviteRole} onValueChange={setInviteRole}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="member">Member</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Admins can manage team members and settings. Members have
                    limited access.
                  </p>
                </div>
              </div>
              <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setIsInviteDialogOpen(false)}
                  className="mt-2 sm:mt-0"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleInvite}
                  disabled={!inviteEmail.trim() || isSubmitting}
                >
                  {isSubmitting ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="mr-2 h-4 w-4" />
                  )}
                  Send Invitation
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <Tabs defaultValue="members" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="members">
            Team Members ({teamMembers.length})
          </TabsTrigger>
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
                    {canEdit && (
                      <TableHead className="text-right">Actions</TableHead>
                    )}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    Array.from({ length: 5 }).map((_, index) => (
                      <TeamMemberSkeleton key={index} />
                    ))
                  ) : filteredTeamMembers.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={canEdit ? 5 : 4}
                        className="h-24 text-center"
                      >
                        <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                          <UserCog className="h-8 w-8" />
                          <p>No team members found</p>
                          <p className="text-sm">
                            Try adjusting your search or invite new members
                          </p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredTeamMembers.map((member) => (
                      <TableRow key={member.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-9 w-9">
                              <AvatarFallback>
                                {member.firstName[0]}
                                {member.lastName[0]}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col">
                              <span className="font-medium">
                                {member.firstName} {member.lastName}
                              </span>
                              <span className="text-sm text-muted-foreground">
                                {member.email}
                              </span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{getRoleBadge(member.role)}</TableCell>
                        <TableCell>{getStatusBadge(member.isActive)}</TableCell>
                        <TableCell>{formatDate(member.createdAt)}</TableCell>
                        {canEdit && (
                          <TableCell className="text-right">
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
                                <DropdownMenuItem
                                  onClick={() => handleEditMember(member)}
                                  disabled={
                                    getRoleName(member.role) === "owner"
                                  }
                                >
                                  <Edit className="h-4 w-4 mr-2" />
                                  Edit Role
                                </DropdownMenuItem>
                                {canRemove(member) && (
                                  <>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                      className="text-red-600 focus:text-red-600"
                                      onClick={() =>
                                        confirmRemoveMember(member)
                                      }
                                    >
                                      <Trash2 className="h-4 w-4 mr-2" />
                                      Remove Member
                                    </DropdownMenuItem>
                                  </>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        )}
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
              {isLoading ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Invited By</TableHead>
                      <TableHead>Invited On</TableHead>
                      {canInvite && (
                        <TableHead className="text-right">Actions</TableHead>
                      )}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Array.from({ length: 3 }).map((_, index) => (
                      <InvitationSkeleton key={index} />
                    ))}
                  </TableBody>
                </Table>
              ) : invitations.length === 0 ? (
                <div className="text-center py-8">
                  <Mail className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">
                    No pending invitations
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    You haven&apos;t sent any invitations yet.
                  </p>
                  {canInvite && (
                    <Button onClick={() => setIsInviteDialogOpen(true)}>
                      <UserPlus className="mr-2 h-4 w-4" />
                      Invite Team Member
                    </Button>
                  )}
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Invited By</TableHead>
                      <TableHead>Invited On</TableHead>
                      {canInvite && (
                        <TableHead className="text-right">Actions</TableHead>
                      )}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {invitations.map((invitation) => (
                      <TableRow key={invitation.id}>
                        <TableCell className="font-medium">
                          {invitation.email}
                        </TableCell>
                        <TableCell>{getRoleBadge(invitation.role)}</TableCell>
                        <TableCell>{`${invitation.invitedBy.firstName} ${invitation.invitedBy.lastName}`}</TableCell>
                        <TableCell>
                          {formatDate(invitation.createdAt)}
                        </TableCell>
                        {canInvite && (
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  handleResendInvite(invitation.id)
                                }
                              >
                                Resend
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  handleCancelInvite(invitation.id)
                                }
                              >
                                Cancel
                              </Button>
                            </div>
                          </TableCell>
                        )}
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
              Update the role for {selectedMember?.firstName}{" "}
              {selectedMember?.lastName}.
            </DialogDescription>
          </DialogHeader>
          {selectedMember && (
            <div className="grid gap-4 py-4">
              <div className="flex items-center gap-3 p-3 border rounded-lg">
                <Avatar className="h-10 w-10">
                  <AvatarFallback>
                    {selectedMember.firstName[0]}
                    {selectedMember.lastName[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">
                    {selectedMember.firstName} {selectedMember.lastName}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {selectedMember.email}
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select
                  value={getRoleName(selectedMember.role)}
                  onValueChange={(value) =>
                    setSelectedMember({ ...selectedMember, role: value })
                  }
                  disabled={getRoleName(selectedMember.role) === "owner"}
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
                  {getRoleName(selectedMember.role) === "owner"
                    ? "Owners have full access to all team settings and cannot be demoted."
                    : "Admins can manage team members and settings. Members have limited access."}
                </p>
              </div>
            </div>
          )}
          <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 gap-2">
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveMember} disabled={isSubmitting}>
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Remove Member Confirmation Dialog */}
      <AlertDialog
        open={isRemoveDialogOpen}
        onOpenChange={setIsRemoveDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Remove Team Member
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove {memberToRemove?.firstName}{" "}
              {memberToRemove?.lastName} from your team? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRemoveMember}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Remove Member
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}