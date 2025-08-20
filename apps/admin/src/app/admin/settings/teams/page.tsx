

// app/settings/teams/page.tsx
import { Card,  CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

  type admins = {
    status: "active" | "pending";
    name: string;
    id: string;
    email: string;
    role: string;
    lastLogin: string;
  };

  const admins: admins[] = [
    {
      name: "Alice Johnson",
      id: "EXA-2806/152",
      email: "alice@sendexa.co",
      role: "Super Admin",
      status: "active",
      lastLogin: "2024-06-01 09:00",
    },
    {
      id: "EXA-2806/153",
      name: "Bob Smith",
      email: "bob@sendexa.co",
      role: "Super Admin",
      status: "active",
      lastLogin: "2024-06-01 10:30",
    },
  ];

  const getStatusBadge = (status: admins["status"]) => {
    return (
      <Badge variant="status" status={status}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

export default function TeamsSettingsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/admin/settings">
            <ChevronLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Teams Settings</h1>
          <p className="text-muted-foreground">
            Manage team members and permissions
          </p>
        </div>
      </div>

    <div>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableCell className="font-semibold text-gray-800 dark:text-white/90"> ID </TableCell> 
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Last Login</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {admins.map((admin, idx) => (
                <TableRow
                  key={idx}
                  className="hover:bg-gray-50 dark:hover:bg-white/5 transition"
                >
                  <TableCell className="font-mono text-xs text-gray-500">
                    {admin.id}
                  </TableCell>
                  <TableCell className="font-semibold text-gray-800 dark:text-white/90">
                    {admin.name}
                  </TableCell>
                  <TableCell>{admin.email}</TableCell>
                  <TableCell>
                    <span className="px-2 py-1 rounded text-xs bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium">
                      {admin.role}
                    </span>
                  </TableCell>
                  <TableCell>{getStatusBadge(admin.status)}</TableCell>
                  <TableCell className="font-mono text-xs text-gray-500">
                    {admin.lastLogin}
                  </TableCell>
                  <TableCell>
                    <button className="text-blue-600 hover:underline mr-2">
                      View
                    </button>
                    <button className="text-yellow-600 hover:underline mr-2">
                      Edit
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  

    </div>
  );
}