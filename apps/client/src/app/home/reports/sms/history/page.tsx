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
  Search,
  Filter,
  Download,
  ChevronDown,
  RefreshCw,
  Check,
  X,
  Clock,
  MoreVertical,
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
import { Progress } from "@/components/ui/progress"

const smsHistory = [
  {
    id: "1",
    recipient: "0244123456",
    message: "Your OTP is 123456",
    status: "delivered",
    senderId: "COMPANY",
    cost: 0.05,
    date: "2023-06-15 09:30:45",
  },
  {
    id: "2",
    recipient: "0209876543",
    message: "Special offer: 20% off today!",
    status: "failed",
    senderId: "PROMO",
    cost: 0.05,
    date: "2023-06-15 10:15:22",
  },
  {
    id: "3",
    recipient: "0543210987",
    message: "Your appointment is confirmed for tomorrow at 2pm",
    status: "pending",
    senderId: "ALERTS",
    cost: 0.05,
    date: "2023-06-14 14:45:33",
  },
  {
    id: "4",
    recipient: "Bulk (250)",
    message: "New product launch next week! Stay tuned...",
    status: "delivered",
    senderId: "NEWS",
    cost: 12.50,
    date: "2023-06-14 16:22:18",
  },
  {
    id: "5",
    recipient: "0276543210",
    message: "Your payment of GHS 150.00 was received",
    status: "delivered",
    senderId: "PAYMENT",
    cost: 0.05,
    date: "2023-06-13 11:05:49",
  },
]

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
                <TableHead>Status</TableHead>
                <TableHead>Sender ID</TableHead>
                <TableHead>Cost</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="w-[40px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {smsHistory.map((sms) => (
                <TableRow key={sms.id}>
                  <TableCell className="font-medium">
                    {sms.recipient}
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate">
                    {sms.message}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        sms.status === 'delivered'
                          ? 'success'
                          : sms.status === 'failed'
                          ? 'destructive'
                          : 'warning'
                      }
                      className="flex items-center gap-1"
                    >
                      {sms.status === 'delivered' ? (
                        <Check className="h-3 w-3" />
                      ) : sms.status === 'failed' ? (
                        <X className="h-3 w-3" />
                      ) : (
                        <Clock className="h-3 w-3" />
                      )}
                      {sms.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{sms.senderId}</Badge>
                  </TableCell>
                  <TableCell>GHS {sms.cost.toFixed(2)}</TableCell>
                  <TableCell>{sms.date}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreVertical className="h-4 w-4" />
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

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Total Messages</CardTitle>
            <CardDescription>All time sent messages</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">24,568</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Delivery Rate</CardTitle>
            <CardDescription>Successful deliveries</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">96.2%</div>
            <Progress value={96.2} className="h-2 mt-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Cost</CardTitle>
            <CardDescription>All time SMS spending</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">GHS 1,245.80</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}