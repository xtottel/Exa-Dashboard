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
import { toast } from "sonner";

// Types for API responses
interface CreditBalance {
  SMS: number;
  WALLET: number;
}

interface SMSStats {
  totals: {
    messages: number;
    cost: number;
    averageCost: number;
  };
  byStatus: Array<{
    status: string;
    _count: { id: number };
    _sum: { cost: number };
  }>;
  timeline: Array<{
    date: string;
    messages: number;
    cost: number;
  }>;
  topRecipients: Array<{
    recipient: string;
    messages: number;
    cost: number;
  }>;
}

interface SMSHistory {
  id: string;
  recipient: string;
  message: string;
  status: "delivered" | "pending" | "failed";
  type: string;
  senderId: string;
  cost: number;
  createdAt: string;
}

interface NetworkDistribution {
  name: string;
  value: number;
}

interface MessageVolumeData {
  name: string;
  sent: number;
  delivered: number;
}

const COLORS = ["#FFCC00", "#E60000", "#0066CC"]; // MTN Yellow, Telecel Red, AT Blue

const getStatusBadge = (status: SMSHistory["status"]) => {
  return (
    <Badge variant="status" status={status}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
};

export default function DashboardHome() {
  const [currentDateTime, setCurrentDateTime] = useState<string>("");
  const [creditBalance, setCreditBalance] = useState<CreditBalance | null>(null);
  const [smsStats, setSmsStats] = useState<SMSStats | null>(null);
  const [smsHistory, setSmsHistory] = useState<SMSHistory[]>([]);
  const [networkDistribution, setNetworkDistribution] = useState<
    NetworkDistribution[]
  >([]);
  const [messageVolumeData, setMessageVolumeData] = useState<
    MessageVolumeData[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
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
    fetchDashboardData();
    updateDateTime();
    const interval = setInterval(updateDateTime, 60000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("bearerToken");

      if (!token) {
        toast.error("Please login again");
        router.push("/login");
        return;
      }

      // Fetch all data in parallel
      const [
        creditsResponse,
        statsResponse,
        historyResponse,
        networkResponse,
        volumeResponse,
      ] = await Promise.all([
        fetch("/api/credit/balance", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
        fetch("/api/sms/stats?period=30d", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
        fetch("/api/sms/history?limit=5", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
        fetch("/api/reports/network-distribution", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
        fetch("/api/reports/message-volume", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
      ]);

      // Handle credit balance response
      if (creditsResponse.ok) {
        const creditsData = await creditsResponse.json();
        setCreditBalance(creditsData.data?.balances || { SMS: 0, WALLET: 0 });
      } else {
        console.error("Failed to fetch credit balance");
        setCreditBalance({ SMS: 0, WALLET: 0 });
      }

      // Handle SMS stats response
      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setSmsStats(statsData.data);
      } else {
        console.error("Failed to fetch SMS stats");
        setSmsStats(null);
      }

      // Handle SMS history response
      if (historyResponse.ok) {
        const historyData = await historyResponse.json();
        setSmsHistory(historyData.data || []);
      } else {
        console.error("Failed to fetch SMS history");
        setSmsHistory([]);
      }

      // Handle network distribution response
      if (networkResponse.ok) {
        const networkData = await networkResponse.json();
        setNetworkDistribution(networkData.data || []);
      } else {
        console.error("Failed to fetch network distribution");
        setNetworkDistribution([]);
      }

      // Handle message volume response
      if (volumeResponse.ok) {
        const volumeData = await volumeResponse.json();
        setMessageVolumeData(volumeData.data || []);
      } else {
        console.error("Failed to fetch message volume");
        setMessageVolumeData([]);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setIsLoading(false);
    }
  };

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
    const formattedDate = new Intl.DateTimeFormat("en-GB", options).format(now);
    setCurrentDateTime(formattedDate + " (Accra / GMT)");
  };

  // Calculate stats from the API response
  const getTotalSent = () => {
    if (!smsStats) return 0;
    return smsStats.totals?.messages || 0;
  };

  const getTotalFailed = () => {
    if (!smsStats || !smsStats.byStatus) return 0;
    const failedStatus = smsStats.byStatus.find(
      (item) => item.status === "failed"
    );
    return failedStatus?._count?.id || 0;
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const getTotalDelivered = () => {
    if (!smsStats || !smsStats.byStatus) return 0;
    const deliveredStatus = smsStats.byStatus.find(
      (item) => item.status === "delivered"
    );
    return deliveredStatus?._count?.id || 0;
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="text-base font-semibold text-muted-foreground">
          Your snapshot for today, {currentDateTime || "loading..."}
        </div>

        {/* Loading skeletons for stats grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="h-4 w-20 bg-gray-200 rounded"></div>
                <div className="h-4 w-4 bg-gray-200 rounded"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 w-24 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 w-16 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Loading for charts */}
        <div className="grid gap-4 md:grid-cols-2">
          {[1, 2].map((i) => (
            <Card key={i} className="h-[350px] animate-pulse">
              <CardHeader>
                <div className="h-6 w-32 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 w-48 bg-gray-200 rounded"></div>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Loading for quick actions */}
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-6 w-32 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 w-48 bg-gray-200 rounded"></div>
              </CardHeader>
              <CardContent>
                <div className="h-9 w-full bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Loading for SMS history */}
        <Card className="animate-pulse">
          <CardHeader>
            <div className="h-6 w-48 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 w-64 bg-gray-200 rounded"></div>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-gray-200 rounded"></div>
          </CardContent>
        </Card>
      </div>
    );
  }

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
              <span className="text-base font-medium">GH₵</span>{" "}
              {creditBalance?.WALLET?.toLocaleString() || "0.00"}
            </div>
            <p className="text-xs text-yellow-900">Real-time balance</p>
          </CardContent>
        </Card>

        <Card className="bg-blue-100 transition-all duration-200 hover:shadow-md hover:scale-[1.01]">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">SMS Credits</CardTitle>
            <Send className="h-4 w-4 text-blue-700" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {creditBalance?.SMS?.toLocaleString() || "0"}
            </div>
            <p className="text-xs text-blue-900">Available credits</p>
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
            <div className="text-2xl font-bold">
              {getTotalSent()?.toLocaleString() || "0"}
            </div>
            <p className="text-xs text-green-900">All-time messages</p>
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
            <div className="text-2xl font-bold">
              {getTotalFailed()?.toLocaleString() || "0"}
            </div>
            <p className="text-xs text-red-900">
              {getTotalSent()
                ? `${((getTotalFailed() / getTotalSent()) * 100).toFixed(1)}% of total messages`
                : "0% of total messages"}
            </p>
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
            {messageVolumeData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={messageVolumeData}>
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
              <div className="h-full flex items-center justify-center">
                <p className="text-center text-muted-foreground">
                  No message data available
                </p>
              </div>
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
            {networkDistribution.length > 0 ? (
              <ResponsiveContainer width="100%" height={230}>
                <PieChart>
                  <Pie
                    data={networkDistribution}
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
                    {networkDistribution.map((_, index) => (
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
              <div className="h-full flex items-center justify-center">
                <p className="text-center text-sm text-muted-foreground">
                  No network distribution data
                </p>
              </div>
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
                  <TableCell>GHS {sms.cost.toFixed(2)}</TableCell>
                  <TableCell>
                    {new Date(sms.createdAt).toLocaleString()}
                  </TableCell>
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
              {smsHistory.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                      <Inbox className="h-12 w-12 mb-4 opacity-50" />
                      <p>No SMS history found</p>
                      <p className="text-sm">
                        Send your first message to get started
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardHeader>
        {smsHistory.length > 0 && (
          <CardFooter className="flex items-center justify-between border-t px-6 py-4">
            <div className="text-sm text-muted-foreground">
              Showing <strong>1-{smsHistory.length}</strong> of{" "}
              <strong>{smsHistory.length}</strong> messages
            </div>
            <div className="space-x-2">
              <Button variant="outline" size="sm" asChild>
                <Link href="/home/reports/sms/history">View All</Link>
              </Button>
            </div>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}