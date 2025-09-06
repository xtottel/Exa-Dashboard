
"use client";
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
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

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

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

interface SMSHistoryResponse {
  data: SMSHistory[];
  pagination: PaginationInfo;
  summary: {
    totalCost: number;
    totalMessages: number;
  };
}

const getStatusBadge = (status: SMSHistory["status"]) => {
  return (
    <Badge variant="status" status={status}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
};

export default function SmsHistoryPage() {
  const [smsHistory, setSmsHistory] = useState<SMSHistory[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const router = useRouter();

  const fetchSMSHistory = async (page = 1, limit = 10, status = "all", search = "") => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("bearerToken");

      if (!token) {
        toast.error("Please login again");
        router.push("/login");
        return;
      }

      let url = `/api/sms/history?page=${page}&limit=${limit}`;
      if (status !== "all") url += `&status=${status}`;
      if (search) url += `&search=${encodeURIComponent(search)}`;

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch SMS history");
      }

      const data: SMSHistoryResponse = await response.json();
      setSmsHistory(data.data);
      setPagination(data.pagination);
    } catch (error) {
      console.error("Error fetching SMS history:", error);
      toast.error("Failed to load SMS history");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSMSHistory();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRefresh = () => {
    fetchSMSHistory(pagination.page, pagination.limit, statusFilter, searchTerm);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchSMSHistory(1, pagination.limit, statusFilter, searchTerm);
  };

  const handleStatusFilter = (value: string) => {
    setStatusFilter(value);
    fetchSMSHistory(1, pagination.limit, value, searchTerm);
  };

  const handlePageChange = (newPage: number) => {
    fetchSMSHistory(newPage, pagination.limit, statusFilter, searchTerm);
  };

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
          <Button variant="outline" onClick={handleRefresh} disabled={isLoading}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button disabled={isLoading}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-4">
          <form onSubmit={handleSearch} className="relative w-full md:w-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search messages or recipients..."
              className="pl-9 w-full md:w-[300px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              disabled={isLoading}
            />
          </form>
          <div className="flex items-center gap-2">
            <Select value={statusFilter} onValueChange={handleStatusFilter} disabled={isLoading}>
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
            <Button variant="outline" disabled={isLoading}>
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
              {isLoading ? (
                // Loading skeleton
                Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                    </TableCell>
                    <TableCell>
                      <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
                    </TableCell>
                    <TableCell>
                      <div className="h-6 bg-gray-200 rounded w-16 animate-pulse"></div>
                    </TableCell>
                    <TableCell>
                      <div className="h-6 bg-gray-200 rounded w-20 animate-pulse"></div>
                    </TableCell>
                    <TableCell>
                      <div className="h-6 bg-gray-200 rounded w-16 animate-pulse"></div>
                    </TableCell>
                    <TableCell>
                      <div className="h-4 bg-gray-200 rounded w-12 animate-pulse"></div>
                    </TableCell>
                    <TableCell>
                      <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
                    </TableCell>
                    <TableCell>
                      <div className="h-8 bg-gray-200 rounded w-16 animate-pulse"></div>
                    </TableCell>
                  </TableRow>
                ))
              ) : smsHistory.length > 0 ? (
                smsHistory.map((sms) => (
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
                    <TableCell>{new Date(sms.createdAt).toLocaleString()}</TableCell>
                    <TableCell>
                      <Button variant="default" className="h-8 gap-2" asChild>
                        <Link href={`/home/reports/sms/view/${sms.id}`}>
                          <Inbox className="h-4 w-4" />
                          Inbox
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                      <Inbox className="h-12 w-12 mb-4 opacity-50" />
                      <p>No SMS history found</p>
                      <p className="text-sm">
                        {searchTerm || statusFilter !== "all" 
                          ? "Try adjusting your search or filters" 
                          : "Send your first message to get started"}
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardHeader>
        {!isLoading && smsHistory.length > 0 && (
          <CardFooter className="flex items-center justify-between border-t px-6 py-4">
            <div className="text-sm text-muted-foreground">
              Showing <strong>{(pagination.page - 1) * pagination.limit + 1}-{Math.min(pagination.page * pagination.limit, pagination.total)}</strong> of{" "}
              <strong>{pagination.total}</strong> messages
            </div>
            <div className="space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
              >
                Previous
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.pages}
              >
                Next
              </Button>
            </div>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
