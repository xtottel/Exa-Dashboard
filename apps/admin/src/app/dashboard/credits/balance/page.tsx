"use client";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Activity,
  CreditCard,
  ArrowUpRight,
  Clock,
  RefreshCw,
} from "lucide-react"
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

const transactions = [
  {
    id: "1",
    date: "2023-06-15",
    description: "SMS Credits Purchase",
    amount: 50.00,
    type: "credit",
    status: "completed",
  },
  {
    id: "2",
    date: "2023-06-10",
    description: "SMS Usage",
    amount: -12.50,
    type: "debit",
    status: "completed",
  },
  {
    id: "3",
    date: "2023-06-05",
    description: "SMS Credits Purchase",
    amount: 25.00,
    type: "credit",
    status: "completed",
  },
  {
    id: "4",
    date: "2023-06-01",
    description: "Pending Top-up",
    amount: 30.00,
    type: "credit",
    status: "pending",
  },
]

export default function BalancePage() {
  const currentBalance = 62.50
  const smsCredits = 12500
  const estimatedUsage = "30 days"

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Account Balance</h1>
          <p className="text-muted-foreground">
            View your current balance and transaction history
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button>
            <ArrowUpRight className="mr-2 h-4 w-4" />
            Buy Credits
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Current Balance
            </CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">GHS {currentBalance.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              +12.5% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              SMS Credits
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{smsCredits.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              ~{estimatedUsage} of usage
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Transactions
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">GHS 30.00</div>
            <p className="text-xs text-muted-foreground">
              1 pending transaction
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
          <CardDescription>
            Your last 50 account transactions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((txn) => (
                <TableRow key={txn.id}>
                  <TableCell>{txn.date}</TableCell>
                  <TableCell>{txn.description}</TableCell>
                  <TableCell
                    className={
                      txn.type === "credit" ? "text-green-600" : "text-red-600"
                    }
                  >
                    {txn.type === "credit" ? "+" : "-"}GHS{" "}
                    {Math.abs(txn.amount).toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        txn.status === "completed" ? "success" : "warning"
                      }
                    >
                      {txn.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}