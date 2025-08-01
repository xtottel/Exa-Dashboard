"use client";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Activity,
  Send,
  Smartphone,
  CircleCheck,
  AlertCircle,
  CreditCard,
  Inbox,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
const messageData = [
  { name: "Jan", sent: 4000, delivered: 3800 },
  { name: "Feb", sent: 3000, delivered: 2800 },
  { name: "Mar", sent: 5000, delivered: 4800 },
  { name: "Apr", sent: 2780, delivered: 2500 },
  { name: "May", sent: 3890, delivered: 3700 },
  { name: "Jun", sent: 2390, delivered: 2200 },
];

const channelData = [
  { name: "SMS", value: 75 },
  { name: "WhatsApp", value: 15 },
  { name: "Email", value: 10 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28"];

type smsHistory = {
  message: string;
  cost: number;
  status: "delivered" | "pending" | "failed";
  date: string;
  type: string;
  id: string;
  senderId: string;
  recipient: string;
};

const smsHistory: smsHistory[] = [
  {
    id: "1",
    recipient: "0244123456",
    type: "SMS API",
    message: "Welcome to Sendexa — your all-in-one platform for fast, secure, and reliable communications. Let's help you connect better!",
    status: "delivered",
    senderId: "Sendexa",
    cost: 0.05,
    date: "2023-06-15 09:30:45",
  },
  {
    id: "2",
    recipient: "0209876543",
    type: "Outgoing",
    message: "Special offer: 20% off today!",
    status: "failed",
    senderId: "Sendexa",
    cost: 0.05,
    date: "2023-06-15 10:15:22",
  },
  {
    id: "3",
    recipient: "0543210987",
    type: "Outgoing",
    message: "Your appointment is confirmed for tomorrow at 2pm",
    status: "pending",
    senderId: "Sendexa",
    cost: 0.05,
    date: "2023-06-14 14:45:33",
  },
  {
    id: "4",
    recipient: "0276543210",
    type: "Outgoing",
    message: "Your OTP is 123456",
    status: "delivered",
    senderId: "Sendexa",
    cost: 0.05,
    date: "2023-06-13 11:05:49",
  },
    {
    id: "5",
    recipient: "0276543210",
    type: "Outgoing",
    message: "Your payment of GHS 150.00 was received",
    status: "delivered",
    senderId: "Sendexa",
    cost: 0.05,
    date: "2023-06-13 11:05:49",
  },
];

const getStatusBadge = (status: smsHistory["status"]) => {
  return (
    <Badge variant="status" status={status}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
};

export default function DashboardHome() {
  const [currentDateTime, setCurrentDateTime] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    // Update date time every minute
    const updateDateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
        timeZone: "Africa/Accra",
      };
      const formattedDate = new Intl.DateTimeFormat("en-GB", options).format(
        now
      );
      setCurrentDateTime(formattedDate + " (Accra / GMT)");
    };

    updateDateTime();
    const interval = setInterval(updateDateTime, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      {/* Dynamic date/time display */}

      <div className="text-base font-semibold text-muted-foreground">
        Your snapshot for today, {currentDateTime || "loading..."}
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-green-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Available Balance
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground " />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">GHS 1,245.00</div>
            <p className="text-xs text-muted-foreground">
              +12% from last month
            </p>
          </CardContent>
        </Card>
        <Card className="bg-blue-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">SMS Credits</CardTitle>
            <Send className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24,500</div>
            <p className="text-xs text-muted-foreground">
              1,200 used this month
            </p>
          </CardContent>
        </Card>
        <Card className="bg-yellow-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Delivery Rate</CardTitle>
            <CircleCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">98.2%</div>
            <p className="text-xs text-muted-foreground">
              +1.2% from last month
            </p>
          </CardContent>
        </Card>
        <Card className="bg-red-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Failed Messages
            </CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45</div>
            <p className="text-xs text-muted-foreground">
              0.8% of total messages
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="h-[350px]">
          <CardHeader>
            <CardTitle>Message Volume</CardTitle>
            <CardDescription>
              Monthly sent vs delivered messages
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={messageData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="sent" fill="#8884d8" radius={[4, 4, 0, 0]} />
                <Bar dataKey="delivered" fill="#82ca9d" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="h-[350px]">
          <CardHeader>
            <CardTitle>Channel Distribution</CardTitle>
            <CardDescription>Message delivery channels</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={channelData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {channelData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Send className="h-5 w-5" />
              Send SMS
            </CardTitle>
            <CardDescription>Compose and send messages</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              className="w-full"
              onClick={() => router.push("/home/sms/send")}
            >
              New Message
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smartphone className="h-5 w-5" />
              OTP Services
            </CardTitle>
            <CardDescription>Configure one-time passwords</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => router.push("/home/otp/overview")}
            >
              Manage OTP
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Credits
            </CardTitle>
            <CardDescription>Buy Credit or Topup Balance</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => router.push("/home/credits/buy")}
            >
              View Groups
            </Button>
          </CardContent>
        </Card>
      </div>

<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Last 5 SMS History</h1>
          <p className="text-muted-foreground">
            View last 5 sent messages and their delivery status
          </p>
        </div>
      </div>
      {/* SMS History Table */}
      <Card>
        <CardHeader className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Recipient</TableHead>
                <TableHead>Message</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Sender ID</TableHead>
                <TableHead>Cost</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {smsHistory.map((sms) => (
                <TableRow key={sms.id}>
                  <TableCell className="font-medium">{sms.recipient}</TableCell>
                  <TableCell className="max-w-[200px] truncate">
                    {sms.message}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{sms.type}</Badge>
                  </TableCell>
                  <TableCell>{getStatusBadge(sms.status)}</TableCell>

                  <TableCell>
                    <Badge variant="outline">{sms.senderId}</Badge>
                  </TableCell>
                  <TableCell>GHS {sms.cost}</TableCell>
                  <TableCell>{sms.date}</TableCell>

                  <TableCell>
                    <Button variant="default" className="h-8 gap-2" asChild>
                      <Link href={`/home/reports/sms/view/${sms.id}`}>
                        <Inbox className="h-4 w-4" />
                        Inbox
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardHeader>
        <CardFooter className="flex items-center justify-between border-t px-6 py-4">
          <div className="text-sm text-muted-foreground">
            Showing <strong>1-{smsHistory.length}</strong> of{" "}
            <strong>{smsHistory.length}</strong> messages
          </div>
          <div className="space-x-2">
            <Button variant="outline" size="sm">
              <Link href={`/home/reports/sms/`}>View All</Link>
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
