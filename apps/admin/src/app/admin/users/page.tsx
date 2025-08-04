"use client";

import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Mail,
  Phone,
  User,
  Building2,
  MoreVertical,
  Eye,
  Plus,
  Search,
  CreditCard,
} from "lucide-react";
import React from "react";

type clients = {
  status: "active" | "pending" ;
  phone: string;
  id: number;
  business: string;
  contact: string;
  email: string;
  credits: number;
  lastActive: string;
  signupDate: string;
};

export default function UsersPage() {
  const clients: clients[] = [
    {
      id: 1,
      business: "Acme Corp",
      contact: "John Doe",
      email: "john@acme.com",
      phone: "+2348012345678",
      status: "active",
      credits: 1200,
      lastActive: "2 hours ago",
      signupDate: "15 Jan 2023",
    },
    {
      id: 2,
      business: "Beta Solutions",
      contact: "Jane Smith",
      email: "jane@betasolutions.com",
      phone: "+2348098765432",
      status: "active",
      credits: 0,
      lastActive: "5 days ago",
      signupDate: "22 Feb 2023",
    },
    {
      id: 3,
      business: "Gamma Ltd",
      contact: "Samuel Johnson",
      email: "samuel@gammaltd.com",
      phone: "+2348011122233",
      status: "active",
      credits: 50000,
      lastActive: "30 minutes ago",
      signupDate: "5 Mar 2023",
    },
    {
      id: 4,
      business: "Delta Ventures",
      contact: "Grace Lee",
      email: "grace@deltaventures.com",
      phone: "+2348076543210",
      status: "active",
      credits: 350,
      lastActive: "1 hour ago",
      signupDate: "10 Apr 2023",
    },
    {
      id: 5,
      business: "Epsilon Tech",
      contact: "Michael Brown",
      email: "michael@epsilont.com",
      phone: "+2348055512345",
      status: "pending",
      credits: 100,
      lastActive: "Never",
      signupDate: "Yesterday",
    },
  ];

  const getStatusBadge = (status: clients["status"]) => {
    return (
      <Badge variant="status" status={status}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  return (
    <div>
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white/90">
            Client Accounts
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Manage all registered client accounts
          </p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search clients..."
              className="pl-9 w-[200px] sm:w-[250px]"
            />
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Client
          </Button>
        </div>
      </div>

      {/* Client Table */}
      <Card>
        <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableCell className="w-[200px]">
                    <div className="flex items-center gap-1">
                      <Building2 className="h-4 w-4" />
                      Business
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      Contact
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Mail className="h-4 w-4" />
                      Email
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Phone className="h-4 w-4" />
                      Phone
                    </div>
                  </TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <CreditCard className="h-4 w-4" />
                      Credits
                    </div>
                  </TableCell>
                  <TableCell>Last Active</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clients.map((client) => (
                  <TableRow
                    key={client.id}
                    className="hover:bg-gray-50 dark:hover:bg-white/5"
                  >
                    <TableCell className="font-semibold text-gray-800 dark:text-white/90">
                      {client.business}
                    </TableCell>
                    <TableCell>{client.contact}</TableCell>
                    <TableCell>
                      <a
                        href={`mailto:${client.email}`}
                        className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                      >
                        <Mail className="h-4 w-4" />
                        {client.email}
                      </a>
                    </TableCell>
                    <TableCell>
                      <a
                        href={`tel:${client.phone}`}
                        className="hover:underline flex items-center gap-1"
                      >
                        <Phone className="h-4 w-4" />
                        {client.phone}
                      </a>
                    </TableCell>
                    <TableCell>{getStatusBadge(client.status)}</TableCell>
                    <TableCell>
                      <span
                        className={`font-mono text-sm flex items-center gap-1 ${
                          client.credits === 0
                            ? "text-red-600"
                            : "text-gray-800 dark:text-white/90"
                        }`}
                      >
                        {client.credits.toLocaleString()}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm text-gray-500 dark:text-gray-400">
                      {client.lastActive}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
        </CardContent>
        <CardFooter className="flex items-center justify-between border-t px-6 py-4">
          <div className="text-sm text-muted-foreground">
            Showing <strong>1-{clients.length}</strong> of{" "}
            <strong>{clients.length}</strong> clients
          </div>
          <div className="space-x-2">
            <Button variant="outline" size="sm">
              Previous
            </Button>
            <Button variant="outline" size="sm">
              Next
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
