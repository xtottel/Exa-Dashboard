import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  CardFooter,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table"
import {
  Download,
  Filter,
  Search,
  ChevronDown,
  RefreshCw,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

const otpReports = [
  {
    id: "1",
    phone: "0244123456",
    status: "verified",
    method: "SMS",
    createdAt: "2023-06-15 09:30:45",
    verifiedAt: "2023-06-15 09:31:12",
    expiresAt: "2023-06-15 09:35:45",
  },
  {
    id: "2",
    phone: "0209876543",
    status: "failed",
    method: "WhatsApp",
    createdAt: "2023-06-15 10:15:22",
    verifiedAt: null,
    expiresAt: "2023-06-15 10:20:22",
  },
  {
    id: "3",
    phone: "0543210987",
    status: "expired",
    method: "SMS",
    createdAt: "2023-06-14 14:45:33",
    verifiedAt: null,
    expiresAt: "2023-06-14 14:50:33",
  },
  {
    id: "4",
    phone: "0276543210",
    status: "verified",
    method: "SMS",
    createdAt: "2023-06-14 16:22:18",
    verifiedAt: "2023-06-14 16:23:05",
    expiresAt: "2023-06-14 16:27:18",
  },
  {
    id: "5",
    phone: "0551234567",
    status: "failed",
    method: "SMS",
    createdAt: "2023-06-13 11:05:49",
    verifiedAt: null,
    expiresAt: "2023-06-13 11:10:49",
  },
]

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
                <SelectItem value="verified">Verified</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="All Methods" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Methods</SelectItem>
                <SelectItem value="sms">SMS</SelectItem>
                <SelectItem value="whatsapp">WhatsApp</SelectItem>
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
                <TableHead>Status</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>Verified At</TableHead>
                <TableHead>Expires At</TableHead>
                <TableHead>Duration</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {otpReports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell className="font-medium">{report.phone}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        report.status === 'verified' 
                          ? 'success' 
                          : report.status === 'failed' 
                          ? 'destructive' 
                          : 'warning'
                      }
                    >
                      {report.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{report.method}</Badge>
                  </TableCell>
                  <TableCell>{report.createdAt}</TableCell>
                  <TableCell>
                    {report.verifiedAt || (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell>{report.expiresAt}</TableCell>
                  <TableCell>
                    {report.verifiedAt
                      ? "27s" // This would be calculated in a real app
                      : report.status === 'expired'
                      ? "Expired"
                      : "—"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardHeader>
        <CardFooter className="flex items-center justify-between border-t px-6 py-4">
          <div className="text-sm text-muted-foreground">
            Showing <strong>1-{otpReports.length}</strong> of{" "}
            <strong>{otpReports.length}</strong> OTP attempts
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

      {/* Analytics Summary */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Verification Rate</CardTitle>
            <CardDescription>Successful verifications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">94.5%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Average Time</CardTitle>
            <CardDescription>Time to verify</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">23s</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Failure Reasons</CardTitle>
            <CardDescription>Top causes of failures</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span>Expired</span>
              <span className="font-medium">58%</span>
            </div>
            <div className="flex justify-between">
              <span>Wrong Code</span>
              <span className="font-medium">32%</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Failed</span>
              <span className="font-medium">10%</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}