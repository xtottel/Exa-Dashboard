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
  Send,
  Smartphone,
  CircleCheck,
  AlertCircle,
  CreditCard,
  Inbox,
  TrendingUp,
  Wallet,
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
  Legend,
  LabelList,
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
  { name: "MTN", value: 75 },
  { name: "Telecel", value: 15 },
  { name: "AT", value: 10 },
];

// const COLORS = ["#0088FE", "#00C49F", "#FFBB28"];
// Brand Colors
const COLORS = ["#FFCC00", "#E60000", "#0066CC"]; // MTN Yellow, Telecel Red, AT Blue

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
    message:
      "Welcome to Sendexa — your all-in-one platform for fast, secure, and reliable communications. Let's help you connect better!",
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

  const actions = [
    {
      icon: <Send className="h-5 w-5 text-primary" />,
      title: "Send SMS",
      description: "Compose and send messages",
      buttonLabel: "New Message",
      onClick: () => router.push("/home/sms/send"),
      variant: "default",
    },
    {
      icon: <Smartphone className="h-5 w-5 text-primary" />,
      title: "OTP Services",
      description: "Configure one-time passwords",
      buttonLabel: "Manage OTP",
      onClick: () => router.push("/home/otp/overview"),
      variant: "outline",
    },
    {
      icon: <CreditCard className="h-5 w-5 text-primary" />,
      title: "Credits",
      description: "Buy Credit or Top-up Balance",
      buttonLabel: "Buy Credits",
      onClick: () => router.push("/home/credits/buy"),
      variant: "outline",
    },
  ];

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

      {/* 4 Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-amber-100 transition-all duration-200 hover:shadow-md hover:scale-[1.01]">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Available Balance
            </CardTitle>
            <Wallet className="h-4 w-4 text-yellow-700" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              <span className="text-base font-medium">GH₵</span> 8,245.00
            </div>
            <p className="text-xs text-yellow-900">+12% from last month</p>
          </CardContent>
        </Card>

        <Card className="bg-blue-100 transition-all duration-200 hover:shadow-md hover:scale-[1.01]">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">SMS Credits</CardTitle>
            <Send className="h-4 w-4 text-blue-700" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24,500</div>
            <p className="text-xs text-blue-900">1,200 used this month</p>
          </CardContent>
        </Card>

        <Card className="bg-green-100 transition-all duration-200 hover:shadow-md hover:scale-[1.01]">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Total SMS Sent
            </CardTitle>
            <CircleCheck className="h-4 w-4 text-green-700" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7,000</div>
            <p className="text-xs text-green-900">+1.2% from last month</p>
          </CardContent>
        </Card>

        <Card className="bg-red-100 transition-all duration-200 hover:shadow-md hover:scale-[1.01]">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Failed Messages
            </CardTitle>
            <AlertCircle className="h-4 w-4 text-red-700" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45</div>
            <p className="text-xs text-red-900">0.8% of total messages</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Message Volume Bar Chart */}
        <Card className="h-[350px]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Message Volume
              <TrendingUp className="h-4 w-4 text-green-500" />
            </CardTitle>
            <CardDescription>
              Monthly sent vs delivered messages
            </CardDescription>
          </CardHeader>
          <CardContent>
            {messageData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={messageData}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip contentStyle={{ fontSize: "0.75rem" }} />
                  <Legend wrapperStyle={{ fontSize: "0.75rem" }} />
                  <Bar dataKey="sent" fill="#8884d8" radius={[4, 4, 0, 0]}>
                    <LabelList
                      dataKey="sent"
                      position="top"
                      className="text-xs fill-black"
                    />
                  </Bar>
                  <Bar dataKey="delivered" fill="#82ca9d" radius={[4, 4, 0, 0]}>
                    <LabelList
                      dataKey="delivered"
                      position="top"
                      className="text-xs fill-black"
                    />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-center text-muted-foreground">
                No data available.
              </p>
            )}
          </CardContent>
        </Card>


        {/* Channel Distribution Pie Chart */}
        <Card className="h-[350px]">
          <CardHeader>
            <CardTitle>Network Distribution</CardTitle>
            <CardDescription>Message delivery networks</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center">
            {channelData.length > 0 ? (
              <ResponsiveContainer width="100%" height={230}>
                <PieChart>
                  <Pie
                    data={channelData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    labelLine={false}
                    label={({ name, percent }) =>
                      percent !== undefined
                        ? `${name}: ${(percent * 100).toFixed(0)}%`
                        : name
                    }
                  >
                    {channelData.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>

                  <Tooltip
                    contentStyle={{ fontSize: "0.75rem" }}
                    formatter={(value: number, name: string) => [
                      `${value}%`,
                      name,
                    ]}
                  />
                  <Legend
                    verticalAlign="bottom"
                    iconType="circle"
                    wrapperStyle={{ fontSize: "0.75rem" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-center text-sm text-muted-foreground mt-4">
                No data available.
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        {actions.map((action, idx) => (
          <Card
            key={idx}
            className="hover:shadow-lg transition-shadow duration-300"
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                {action.icon}
                {action.title}
              </CardTitle>
              <CardDescription>{action.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                variant={action.variant as any}
                className="w-full"
                onClick={action.onClick}
                aria-label={action.buttonLabel}
              >
                {action.buttonLabel}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Last 5 SMS History
          </h1>
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
