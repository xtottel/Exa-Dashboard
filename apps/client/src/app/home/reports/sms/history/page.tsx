import { Card, CardHeader, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import {
  Search,
  Filter,
  Download,
  ChevronDown,
  RefreshCw,
  Inbox,
  // MoreVertical,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

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

export default function SmsHistoryPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">SMS History</h1>
          <p className="text-muted-foreground">
            View all sent messages and their delivery status
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-4">
          <div className="relative w-full md:w-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search messages or recipients..."
              className="pl-9 w-full md:w-[300px]"
            />
          </div>
          <div className="flex items-center gap-2">
            <Select>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Date Range
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
      </Card>

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
