"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Users, UserCheck, Mail, Shield } from "lucide-react";

// Define types
interface User {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  status: "active" | "inactive" | "suspended" | "pending";
  emailVerified: boolean;
  lastLogin: string;
  createdAt: string;
}

// Mock data for users
const mockUsers: User[] = [
  {
    id: "1",
    userId: "USR-001",
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    status: "active",
    emailVerified: true,
    lastLogin: "2023-10-15T14:30:00Z",
    createdAt: "2023-01-15",
  },
  {
    id: "2",
    userId: "USR-002",
    firstName: "Jane",
    lastName: "Smith",
    email: "jane.smith@example.com",
    phone: "+1 (555) 987-6543",
    status: "active",
    emailVerified: true,
    lastLogin: "2023-10-14T09:15:00Z",
    createdAt: "2023-03-22",
  },
  {
    id: "3",
    userId: "USR-003",
    firstName: "Robert",
    lastName: "Johnson",
    email: "robert.j@example.com",
    phone: "+1 (555) 456-7890",
    status: "active",
    emailVerified: true,
    lastLogin: "2023-10-05T16:45:00Z",
    createdAt: "2023-05-10",
  },
  {
    id: "4",
    userId: "USR-004",
    firstName: "Sarah",
    lastName: "Williams",
    email: "sarah.w@example.com",
    phone: "+1 (555) 234-5678",
    status: "active",
    emailVerified: false,
    lastLogin: "2023-10-20T11:20:00Z",
    createdAt: "2022-11-05",
  },
  {
    id: "5",
    userId: "USR-005",
    firstName: "Michael",
    lastName: "Brown",
    email: "michael.b@example.com",
    phone: "+1 (555) 345-6789",
    status: "active",
    emailVerified: true,
    lastLogin: "2023-10-10T13:10:00Z",
    createdAt: "2023-08-15",
  },
];

// Calculate stats for the cards
const calculateStats = (users: User[]) => {
  const totalUsers = users.length;
  const activeUsers = users.filter((u) => u.status === "active").length;
  // const adminUsers = users.filter((u) => u.role === "admin").length;
  const verifiedEmails = users.filter((u) => u.emailVerified).length;

  return {
    totalUsers,
    activeUsers,
    // adminUsers,
    verifiedEmails,
  };
};

export default function ActiveUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API fetch
    const fetchData = async () => {
      setIsLoading(true);
      // In a real application, you would fetch from your API here
      setTimeout(() => {
        setUsers(mockUsers);
        setIsLoading(false);
      }, 500);
    };

    fetchData();
  }, []);

  const stats = calculateStats(users);

  const getStatusBadge = (status: User["status"]) => {
    const statusConfig = {
      active: { variant: "default" as const, text: "Active" },
      inactive: { variant: "secondary" as const, text: "Inactive" },
      suspended: { variant: "destructive" as const, text: "Suspended" },
      pending: { variant: "outline" as const, text: "Pending" },
    };

    const config = statusConfig[status];
    return <Badge variant={config.variant}>{config.text}</Badge>;
  };

  const getVerificationBadge = (verified: boolean) => {
    return verified ? (
      <Badge
        variant="outline"
        className="bg-green-50 text-green-700 border-green-200"
      >
        Verified
      </Badge>
    ) : (
      <Badge
        variant="outline"
        className="bg-yellow-50 text-yellow-700 border-yellow-200"
      >
        Unverified
      </Badge>
    );
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Active Users</h1>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <div className="p-2 rounded-lg bg-blue-100">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              All registered users
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <div className="p-2 rounded-lg bg-green-100">
              <UserCheck className="h-5 w-5 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeUsers}</div>
            <p className="text-xs text-muted-foreground">
              Currently active users
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Admin Users</CardTitle>
            <div className="p-2 rounded-lg bg-purple-100">
              <Shield className="h-5 w-5 text-purple-600" />
            </div>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Verified Emails
            </CardTitle>
            <div className="p-2 rounded-lg bg-orange-100">
              <Mail className="h-5 w-5 text-orange-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.verifiedEmails}</div>
            <p className="text-xs text-muted-foreground">
              Users with verified email
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Users Table */}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Active Users List
          </h1>
          <p className="text-muted-foreground">
            Manage and view details of all active users.
          </p>
        </div>
      </div>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Contact</TableHead>

                <TableHead>Status</TableHead>
                <TableHead>Email Verified</TableHead>

                <TableHead>Last Login</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={9} className="h-24 text-center">
                    Loading users...
                  </TableCell>
                </TableRow>
              ) : users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="h-24 text-center">
                    No active users found.
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.userId}</TableCell>
                    <TableCell className="font-medium">
                      {user.firstName} {user.lastName}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <div className="text-sm">{user.email}</div>
                        <div className="text-xs text-muted-foreground">
                          {user.phone}
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>{getStatusBadge(user.status)}</TableCell>
                    <TableCell>
                      {getVerificationBadge(user.emailVerified)}
                    </TableCell>
                    <TableCell>
                      {new Date(user.lastLogin).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="flex items-center justify-between border-t px-6 py-4">
          <div className="text-sm text-muted-foreground">
            Showing <strong>1-{users.length}</strong> of{" "}
            <strong>{users.length}</strong> users
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
