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
import { Download, Filter, Search, ChevronDown, RefreshCw } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

type OtpReports = {
  cost: number;
  code: string;
  status: "delivered" | "failed" | "pending";
  codeStatus: "active" | "expired" | "used";
  date: string;
  channel: string;
  id: string;
  senderId: string;
  phone: string;
};

const otpReports: OtpReports[] = [
  {
    id: "1",
    phone: "0244123456",
    status: "delivered",
    code: "280620",
    senderId: "Sendexa",
    cost: 0.05,
    channel: "SMS",
    date: "2023-06-15",
    codeStatus: "expired",
  },
  {
    id: "2",
    phone: "0209876543",
    status: "delivered",
    code: "123456",
    senderId: "MyApp",
    cost: 0.05,
    channel: "WhatsApp",
    date: "2023-06-16",
    codeStatus: "expired",
  },
  {
    id: "3",
    phone: "0543210987",
    status: "delivered",
    code: "654321",
    senderId: "Acme Inc",
    cost: 0.05,
    channel: "SMS",
    date: "2023-06-17",
    codeStatus: "used",
  },
  {
    id: "4",
    phone: "0271122334",
    status: "pending",
    code: "987654",
    senderId: "Sendexa",
    cost: 0.05,
    channel: "SMS",
    date: "2023-06-18",
    codeStatus: "active",
  },
  {
    id: "5",
    phone: "0245566778",
    status: "delivered",
    code: "456789",
    senderId: "MyApp",
    cost: 0.05,
    channel: "WhatsApp",
    date: "2023-06-19",
    codeStatus: "used",
  },
];

const getStatusBadge = (status: OtpReports["status"]) => {
  return (
    <Badge variant="status" status={status}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
};

export default function OtpReportsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">OTP Reports</h1>
          <p className="text-muted-foreground">
            Detailed OTP verification history and analytics
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
              placeholder="Search phone numbers..."
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

      {/* Reports Table */}
      <Card>
        <CardHeader className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Phone Number</TableHead>
                <TableHead>Code</TableHead>
                <TableHead>Sender ID</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Channel</TableHead>
                <TableHead>Cost</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Code Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {otpReports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell className="font-medium">{report.phone}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{report.code}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{report.senderId}</Badge>
                  </TableCell>
                  <TableCell>{getStatusBadge(report.status)}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{report.channel}</Badge>
                  </TableCell>
                  <TableCell>GHS {report.cost.toFixed(2)}</TableCell>
                  <TableCell>{report.date}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{report.codeStatus}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardHeader>
        <CardFooter className="flex items-center justify-between border-t px-6 py-4">
          <div className="text-sm text-muted-foreground">
            Showing <strong>1-{otpReports.length}</strong> of{" "}
            <strong>{otpReports.length}</strong> OTP Records
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
