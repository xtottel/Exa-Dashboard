import {
  Card,
  CardHeader,
  // CardTitle,
  // CardContent,
  // CardDescription,
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
  Search,
  Filter,
  ChevronDown,
  FileText,
  // Receipt,
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

const invoices = [
  {
    id: "INV-2023-06-001",
    date: "2023-06-15",
    amount: 50.00,
    status: "paid",
    type: "SMS Credits",
    downloadUrl: "#",
  },
  {
    id: "INV-2023-05-003",
    date: "2023-05-28",
    amount: 25.00,
    status: "paid",
    type: "SMS Credits",
    downloadUrl: "#",
  },
  {
    id: "INV-2023-05-002",
    date: "2023-05-15",
    amount: 100.00,
    status: "paid",
    type: "SMS Credits",
    downloadUrl: "#",
  },
  {
    id: "INV-2023-05-001",
    date: "2023-05-01",
    amount: 10.00,
    status: "paid",
    type: "SMS Credits",
    downloadUrl: "#",
  },
  {
    id: "INV-2023-04-002",
    date: "2023-04-22",
    amount: 50.00,
    status: "paid",
    type: "SMS Credits",
    downloadUrl: "#",
  },
]

export default function InvoicesPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Invoices</h1>
          <p className="text-muted-foreground">
            View and download your payment invoices
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export All
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-4">
          <div className="relative w-full md:w-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search invoices..."
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
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="credits">SMS Credits</SelectItem>
                <SelectItem value="subscription">Subscription</SelectItem>
                <SelectItem value="other">Other</SelectItem>
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

      {/* Invoices Table */}
      <Card>
        <CardHeader className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[100px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      {invoice.id}
                    </div>
                  </TableCell>
                  <TableCell>{invoice.date}</TableCell>
                  <TableCell>{invoice.type}</TableCell>
                  <TableCell>GHS {invoice.amount.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge variant="success">{invoice.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" className="h-8">
                      <Download className="h-4 w-4 mr-2" />
                      PDF
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardHeader>
        <CardFooter className="flex items-center justify-between border-t px-6 py-4">
          <div className="text-sm text-muted-foreground">
            Showing <strong>1-{invoices.length}</strong> of{" "}
            <strong>{invoices.length}</strong> invoices
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

      {/* Empty state example */}
      {/* <Card>
        <CardHeader>
          <CardTitle>No invoices found</CardTitle>
          <CardDescription>
            You don't have any invoices yet. When you make a purchase, it will appear here.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button>
            <Receipt className="mr-2 h-4 w-4" />
            Make a Purchase
          </Button>
        </CardContent>
      </Card> */}
    </div>
  )
}