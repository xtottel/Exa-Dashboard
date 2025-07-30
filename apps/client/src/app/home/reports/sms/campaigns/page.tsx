import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
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
  Plus,
  Search,
  Filter,
  ChevronDown,
  MoreVertical,
  Clock,
  Check,
  BarChart2,
  Users,
  Mail,
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

const campaigns = [
  {
    id: "1",
    name: "Summer Sale Promotion",
    status: "completed",
    recipients: 2500,
    delivered: 2450,
    cost: 125.00,
    date: "2023-06-10",
    type: "promotional",
  },
  {
    id: "2",
    name: "New Product Announcement",
    status: "sending",
    recipients: 5000,
    delivered: 3200,
    cost: 250.00,
    date: "2023-06-15",
    type: "marketing",
  },
  {
    id: "3",
    name: "Account Verification",
    status: "scheduled",
    recipients: 1200,
    delivered: 0,
    cost: 60.00,
    date: "2023-06-18",
    type: "transactional",
  },
  {
    id: "4",
    name: "Payment Reminders",
    status: "draft",
    recipients: 800,
    delivered: 0,
    cost: 0,
    date: "-",
    type: "transactional",
  },
]

export default function SmsCampaignsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">SMS Campaigns</h1>
          <p className="text-muted-foreground">
            Create and manage your bulk SMS campaigns
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Campaign
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-4">
          <div className="relative w-full md:w-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search campaigns..."
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
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="sending">Sending</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
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

      {/* Campaigns Table */}
      <Card>
        <CardHeader className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Campaign Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Recipients</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Cost</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="w-[40px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {campaigns.map((campaign) => (
                <TableRow key={campaign.id}>
                  <TableCell className="font-medium">
                    {campaign.name}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        campaign.status === 'completed'
                          ? 'success'
                          : campaign.status === 'sending'
                          ? 'warning'
                          : campaign.status === 'scheduled'
                          ? 'info'
                          : 'outline'
                      }
                      className="flex items-center gap-1"
                    >
                      {campaign.status === 'completed' ? (
                        <Check className="h-3 w-3" />
                      ) : campaign.status === 'sending' ? (
                        <Clock className="h-3 w-3" />
                      ) : campaign.status === 'scheduled' ? (
                        <Clock className="h-3 w-3" />
                      ) : null}
                      {campaign.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      {campaign.recipients.toLocaleString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress
                        value={(campaign.delivered / campaign.recipients) * 100}
                        className="h-2 w-[100px]"
                      />
                      <span className="text-sm text-muted-foreground">
                        {Math.round((campaign.delivered / campaign.recipients) * 100)}%
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{campaign.type}</Badge>
                  </TableCell>
                  <TableCell>
                    {campaign.cost > 0 ? (
                      <>GHS {campaign.cost.toFixed(2)}</>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>{campaign.date}</TableCell>
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
            Showing <strong>1-{campaigns.length}</strong> of{" "}
            <strong>{campaigns.length}</strong> campaigns
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

      {/* Campaign Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Campaigns
            </CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">
              +12% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Recipients
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">58,240</div>
            <p className="text-xs text-muted-foreground">
              +8.5% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Average Open Rate
            </CardTitle>
            <BarChart2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">78.3%</div>
            <p className="text-xs text-muted-foreground">
              +2.1% from last month
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}