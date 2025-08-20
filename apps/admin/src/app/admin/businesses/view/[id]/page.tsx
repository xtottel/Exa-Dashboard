"use client";

import { notFound } from "next/navigation";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ChevronLeft, 
  Building, 
  Phone, 
  Calendar, 
  MessageSquare, 
  Users, 
  Mail,
  MoreHorizontal,
  Edit,
  RefreshCw,
  Plus
} from "lucide-react";
import Link from "next/link";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";

// Define types
interface Business {
  id: string;
  BusinessId: string;
  name: string;
  phone: string;
  email: string;
  status: 'active' | 'suspended' | 'pending';
  smsBalance: number;
  adminCount: number;
  createdAt: string;
  address: string;
  plan: string;
  monthlyCost: number;
}

interface Admin {
  id: string;
  name: string;
  email: string;
  role: string;
  lastActive: string;
  status: 'active' | 'inactive';
}

interface SmsTransaction {
  id: string;
  date: string;
  type: 'purchase' | 'usage' | 'refund';
  amount: number;
  balanceAfter: number;
  description: string;
}

// Mock data for businesses
const mockBusinesses: Business[] = [
  {
    id: '1',
    BusinessId: '0805412',
    name: 'Tech Solutions Inc.',
    phone: '+1 (555) 123-4567',
    email: 'contact@techsolutions.com',
    status: 'active',
    smsBalance: 12500,
    adminCount: 3,
    createdAt: '2023-01-15',
    address: '123 Tech Avenue, San Francisco, CA 94103',
    plan: 'Enterprise',
    monthlyCost: 299,
  },
  {
    id: '2',
    BusinessId: '0805413',
    name: 'Retail Plus',
    phone: '+1 (555) 987-6543',
    email: 'info@retailplus.com',
    status: 'active',
    smsBalance: 8500,
    adminCount: 2,
    createdAt: '2023-03-22',
    address: '456 Commerce Street, New York, NY 10001',
    plan: 'Business',
    monthlyCost: 149,
  },
  {
    id: '3',
    BusinessId: '0805414',
    name: 'Health First Clinic',
    phone: '+1 (555) 456-7890',
    email: 'admin@healthfirst.com',
    status: 'pending',
    smsBalance: 0,
    adminCount: 1,
    createdAt: '2023-05-10',
    address: '789 Wellness Blvd, Austin, TX 78701',
    plan: 'Starter',
    monthlyCost: 49,
  },
  {
    id: '4',
    BusinessId: '0805415',
    name: 'Logistics Pro',
    phone: '+1 (555) 234-5678',
    email: 'support@logisticspro.com',
    status: 'suspended',
    smsBalance: 3000,
    adminCount: 2,
    createdAt: '2022-11-05',
    address: '101 Shipping Lane, Chicago, IL 60601',
    plan: 'Business',
    monthlyCost: 149,
  },
];

// Mock admin data
const mockAdmins: Record<string, Admin[]> = {
  '0805412': [
    {
      id: '1',
      name: 'John Smith',
      email: 'john@techsolutions.com',
      role: 'Owner',
      lastActive: '2023-10-15T14:30:00Z',
      status: 'active'
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      email: 'sarah@techsolutions.com',
      role: 'Manager',
      lastActive: '2023-10-14T09:15:00Z',
      status: 'active'
    },
    {
      id: '3',
      name: 'Michael Chen',
      email: 'michael@techsolutions.com',
      role: 'Support',
      lastActive: '2023-10-10T16:45:00Z',
      status: 'inactive'
    }
  ],
  '0805413': [
    {
      id: '1',
      name: 'Emma Wilson',
      email: 'emma@retailplus.com',
      role: 'Owner',
      lastActive: '2023-10-15T11:20:00Z',
      status: 'active'
    },
    {
      id: '2',
      name: 'David Brown',
      email: 'david@retailplus.com',
      role: 'Manager',
      lastActive: '2023-10-13T15:40:00Z',
      status: 'active'
    }
  ],
  '0805414': [
    {
      id: '1',
      name: 'Dr. Robert Taylor',
      email: 'robert@healthfirst.com',
      role: 'Owner',
      lastActive: '2023-10-12T08:30:00Z',
      status: 'active'
    }
  ],
  '0805415': [
    {
      id: '1',
      name: 'Lisa Garcia',
      email: 'lisa@logisticspro.com',
      role: 'Owner',
      lastActive: '2023-09-28T13:15:00Z',
      status: 'active'
    },
    {
      id: '2',
      name: 'James Wilson',
      email: 'james@logisticspro.com',
      role: 'Manager',
      lastActive: '2023-09-25T10:30:00Z',
      status: 'inactive'
    }
  ]
};

// Mock SMS transactions
const mockSmsTransactions: Record<string, SmsTransaction[]> = {
  '0805412': [
    {
      id: '1',
      date: '2023-10-01T10:30:00Z',
      type: 'purchase',
      amount: 5000,
      balanceAfter: 15000,
      description: 'Bulk purchase'
    },
    {
      id: '2',
      date: '2023-09-28T14:15:00Z',
      type: 'usage',
      amount: -2500,
      balanceAfter: 10000,
      description: 'Marketing campaign'
    },
    {
      id: '3',
      date: '2023-09-15T09:45:00Z',
      type: 'purchase',
      amount: 10000,
      balanceAfter: 12500,
      description: 'Monthly top-up'
    }
  ],
  '0805413': [
    {
      id: '1',
      date: '2023-10-05T11:20:00Z',
      type: 'usage',
      amount: -1500,
      balanceAfter: 7000,
      description: 'Customer notifications'
    },
    {
      id: '2',
      date: '2023-09-20T16:30:00Z',
      type: 'purchase',
      amount: 5000,
      balanceAfter: 8500,
      description: 'Additional credits'
    }
  ]
};

const getStatusVariant = (status: string) => {
  switch (status) {
    case 'active':
      return 'default';
    case 'suspended':
      return 'destructive';
    case 'pending':
      return 'secondary';
    default:
      return 'outline';
  }
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const formatDateTime = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export default function BusinessesDetailPage() {
  const params = useParams<{ id: string }>();
  const business = mockBusinesses.find((item) => item.BusinessId === params.id);
  const admins = business ? mockAdmins[business.BusinessId] || [] : [];
  const transactions = business ? mockSmsTransactions[business.BusinessId] || [] : [];

  if (!business) {
    return notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/admin/businesses/">
            <ChevronLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Business Details</h1>
          <p className="text-muted-foreground">
            Detailed information about {business.name}
          </p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem>
                <Edit className="mr-2 h-4 w-4" />
                Edit Business
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh Data
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="admins">Admins ({business.adminCount})</TabsTrigger>
          <TabsTrigger value="sms-history">SMS History</TabsTrigger>
         <TabsTrigger value="sender-ids">Sender IDs</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">SMS Balance</CardTitle>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{business.smsBalance.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  Available SMS credits
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Admins</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{business.adminCount}</div>
                <p className="text-xs text-muted-foreground">
                  Account administrators
                </p>
              </CardContent>
            </Card>
    
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total SMS Sent</CardTitle>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {transactions.reduce((total, tx) => total + (tx.type === 'usage' ? -tx.amount : tx.amount), 0).toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">
                  Total SMS sent across all transactions
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Status</CardTitle>
                <Badge variant={getStatusVariant(business.status)} className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold capitalize">{business.status}</div>
                <p className="text-xs text-muted-foreground">
                  Account status
                </p>
              </CardContent>
            </Card>
          </div>

            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Business Information</CardTitle>
                <CardDescription>
                  Details for {business.name}
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Business ID</p>
                    <p className="text-sm text-muted-foreground">{business.BusinessId}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Business Name</p>
                    <p className="text-sm text-muted-foreground">{business.name}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Email</p>
                    <div className="flex items-center">
                      <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">{business.email}</p>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Phone</p>
                    <div className="flex items-center">
                      <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">{business.phone}</p>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Created Date</p>
                    <div className="flex items-center">
                      <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">{formatDate(business.createdAt)}</p>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Plan</p>
                    <p className="text-sm text-muted-foreground">{business.plan} (${business.monthlyCost}/month)</p>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Address</p>
                  <div className="flex items-center">
                    <Building className="mr-2 h-4 w-4 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">{business.address}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
        </TabsContent>

        {/* Admins Tab */}
        <TabsContent value="admins">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Administrators</CardTitle>
                <CardDescription>
                  Users with admin access to {business.name}
                </CardDescription>
              </div>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Add Admin
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Last Active</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {admins.length > 0 ? (
                    admins.map((admin) => (
                      <TableRow key={admin.id}>
                        <TableCell className="font-medium">{admin.name}</TableCell>
                        <TableCell>{admin.email}</TableCell>
                        <TableCell>{admin.role}</TableCell>
                        <TableCell>{formatDateTime(admin.lastActive)}</TableCell>
                        <TableCell>
                          <Badge variant={admin.status === 'active' ? 'default' : 'secondary'}>
                            {admin.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="outline" size="sm">
                            Edit
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center">
                        No administrators found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* SMS History Tab */}
        <TabsContent value="sms-history">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>SMS History</CardTitle>
                    <CardDescription>
                    View all SMS sent from this business
                    </CardDescription>
                </div>
                <Button>
                    <Plus className="mr-2 h-4 w-4" /> Send SMS
                </Button>
                </CardHeader>
                <CardContent>
                {transactions.length > 0 ? (
                    <Table>
                    <TableHeader>
                        <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Description</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {transactions.map((transaction) => (
                        <TableRow key={transaction.id}>
                            <TableCell>{formatDateTime(transaction.date)}</TableCell>
                            <TableCell>{transaction.type}</TableCell>
                            <TableCell>{transaction.amount.toLocaleString()}</TableCell>
                            <TableCell>{transaction.description}</TableCell>
                        </TableRow>
                        ))}
                    </TableBody>
                    </Table>
                ) : (
                    <p className="text-sm text-muted-foreground">No SMS history available</p>
                )}
                </CardContent>
            </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}