"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Eye, Users, Building, MessageSquare, BadgeCheck } from "lucide-react";
import Link from "next/link";

// Define types
interface Business {
  id: string;
  BusinessId: string;
  name: string;
  phone: string;
  status: "active" | "suspended" | "pending";
  smsBalance: number;
  adminCount: number;
  createdAt: string;
}

// Mock data for businesses
const mockBusinesses: Business[] = [
  {
    id: "1",
    BusinessId: "0805412",
    name: "Tech Solutions Inc.",
    phone: "+1 (555) 123-4567",
    status: "active",
    smsBalance: 12500,
    adminCount: 3,
    createdAt: "2023-01-15",
  },
  {
    id: "2",
    BusinessId: "0805413",
    name: "Retail Plus",
    phone: "+1 (555) 987-6543",
    status: "active",
    smsBalance: 8500,
    adminCount: 2,
    createdAt: "2023-03-22",
  },
  {
    id: "3",
    BusinessId: "0805414",
    name: "Health First Clinic",
    phone: "+1 (555) 456-7890",
    status: "pending",
    smsBalance: 0,
    adminCount: 1,
    createdAt: "2023-05-10",
  },
  {
    id: "4",
    BusinessId: "0805415",
    name: "Logistics Pro",
    phone: "+1 (555) 234-5678",
    status: "suspended",
    smsBalance: 3000,
    adminCount: 2,
    createdAt: "2022-11-05",
  },
];

// Calculate stats for the cards
const calculateStats = (businesses: Business[]) => {
  const totalBusinesses = businesses.length;
  const activeBusinesses = businesses.filter(
    (b) => b.status === "active"
  ).length;
  const totalSmsBalance = businesses.reduce(
    (sum, business) => sum + business.smsBalance,
    0
  );
  const totalAdmins = businesses.reduce(
    (sum, business) => sum + business.adminCount,
    0
  );

  return {
    totalBusinesses,
    activeBusinesses,
    totalSmsBalance,
    totalAdmins,
  };
};

export default function BusinessesPage() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API fetch
    const fetchData = async () => {
      setIsLoading(true);
      // In a real application, you would fetch from your API here
      setTimeout(() => {
        setBusinesses(mockBusinesses);
        setIsLoading(false);
      }, 500);
    };

    fetchData();
  }, []);

  const stats = calculateStats(businesses);

  const getStatusBadge = (status: Business["status"]) => {
    return (
      <Badge variant="status" status={status}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Business Management</h1>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Businesses
            </CardTitle>
            <div className="p-2 rounded-lg bg-blue-100">
              <Building className="h-5 w-5 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalBusinesses}</div>
            <p className="text-xs text-muted-foreground">
              All registered businesses
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Businesses
            </CardTitle>
            <div className="p-2 rounded-lg bg-green-100">
              <BadgeCheck className="h-5 w-5 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeBusinesses}</div>
            <p className="text-xs text-muted-foreground">
              Currently active businesses
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total SMS Balance
            </CardTitle>
            <div className="p-2 rounded-lg bg-purple-100">
              <MessageSquare className="h-5 w-5 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.totalSmsBalance.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              SMS credits across all businesses
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Admins</CardTitle>
            <div className="p-2 rounded-lg bg-orange-100">
              <Users className="h-5 w-5 text-orange-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalAdmins}</div>
            <p className="text-xs text-muted-foreground">
              Admin users across businesses
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Businesses Table */}
      <h2 className="text-2xl font-semibold">Business List</h2>
      <p className="text-sm text-muted-foreground">
        Manage and view details of all registered businesses.
      </p>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Business ID</TableHead>
                <TableHead>Business Name</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>SMS Balance</TableHead>
                <TableHead>Admins</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center">
                    Loading businesses...
                  </TableCell>
                </TableRow>
              ) : businesses.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center">
                    No businesses found.
                  </TableCell>
                </TableRow>
              ) : (
                businesses.map((business) => (
                  <TableRow key={business.id}>
                    <TableCell className="font-medium">
                      {business.BusinessId}
                    </TableCell>
                    <TableCell className="font-medium">
                      {business.name}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-muted-foreground">
                        {business.phone}
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(business.status)}</TableCell>
                    <TableCell>
                      {business.smsBalance.toLocaleString()}
                    </TableCell>
                    <TableCell>{business.adminCount}</TableCell>
                    <TableCell>
                      {new Date(business.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="default" className="h-8 gap-2" asChild>
                        <Link
                          href={`/admin/businesses/view/${business.BusinessId}`}
                        >
                          <Eye className="h-4 w-4" />
                          View
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
