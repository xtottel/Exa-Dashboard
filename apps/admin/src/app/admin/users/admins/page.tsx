"use client";

import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import React from "react";
import { Badge } from "@/components/ui/badge";

export default function AdminUsersPage() {
  type admins = {
    status: "active" | "pending";
    name: string;
    email: string;
    role: string;
    lastLogin: string;
  };

  const admins: admins[] = [
    {
      name: "Alice Johnson",
      email: "alice@sendexa.co",
      role: "Super Admin",
      status: "active",
      lastLogin: "2024-06-01 09:00",
    },
    {
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

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Admin Users</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
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
  );
}
