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
  CheckCircle2,
  Clock,
  XCircle,
  Smartphone,
  ArrowUpRight,
} from "lucide-react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts'
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const otpData = [
  { name: 'Jan', sent: 4000, verified: 3800, failed: 200 },
  { name: 'Feb', sent: 3000, verified: 2800, failed: 200 },
  { name: 'Mar', sent: 5000, verified: 4800, failed: 200 },
  { name: 'Apr', sent: 2780, verified: 2500, failed: 280 },
  { name: 'May', sent: 3890, verified: 3700, failed: 190 },
  { name: 'Jun', sent: 2390, verified: 2200, failed: 190 },
]

const recentOtps = [
  { id: '1', phone: '0244123456', status: 'verified', time: '2 mins', method: 'SMS' },
  { id: '2', phone: '0209876543', status: 'failed', time: '5 mins', method: 'WhatsApp' },
  { id: '3', phone: '0543210987', status: 'pending', time: '3 mins', method: 'SMS' },
  { id: '4', phone: '0276543210', status: 'verified', time: '1 min', method: 'SMS' },
]

export default function OtpOverviewPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">OTP Overview</h1>
          <p className="text-muted-foreground">
            Monitor your one-time password verification performance
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Last 30 days" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
              <SelectItem value="year">This year</SelectItem>
            </SelectContent>
          </Select>
          <Button>
            <ArrowUpRight className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-green-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total OTPs Sent
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24,568</div>
            <p className="text-xs text-muted-foreground">
              +12.3% from last month
            </p>
          </CardContent>
        </Card>
        <Card className="bg-blue-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Verified</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23,210</div>
            <p className="text-xs text-muted-foreground">
              94.5% success rate
            </p>
          </CardContent>
        </Card>
        <Card className="bg-yellow-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">658</div>
            <p className="text-xs text-muted-foreground">
              Expiring soon
            </p>
          </CardContent>
        </Card>
        <Card className="bg-red-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Failed</CardTitle>
            <XCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">700</div>
            <p className="text-xs text-muted-foreground">
              2.8% failure rate
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="h-[350px]">
          <CardHeader>
            <CardTitle>OTP Volume</CardTitle>
            <CardDescription>Monthly sent and verified OTPs</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={otpData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="sent" fill="#8884d8" radius={[4, 4, 0, 0]} />
                <Bar dataKey="verified" fill="#82ca9d" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="h-[350px]">
          <CardHeader>
            <CardTitle>Verification Rate</CardTitle>
            <CardDescription>Monthly success rate percentage</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={otpData.map(d => ({
                name: d.name,
                rate: (d.verified / d.sent * 100).toFixed(1)
              }))}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="name" />
                <YAxis unit="%" />
                <Tooltip formatter={(value) => [`${value}%`, "Success rate"]} />
                <Line type="monotone" dataKey="rate" stroke="#ff7300" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent OTPs</CardTitle>
          <CardDescription>
            Last 50 OTP verification attempts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentOtps.map((otp) => (
              <div key={otp.id} className="flex items-center justify-between p-3 hover:bg-muted/50 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-full bg-secondary">
                    <Smartphone className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium">{otp.phone}</p>
                    <p className="text-sm text-muted-foreground">{otp.method}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Badge
                    variant={
                      otp.status === 'verified' 
                        ? 'success' 
                        : otp.status === 'failed' 
                        ? 'destructive' 
                        : 'warning'
                    }
                  >
                    {otp.status}
                  </Badge>
                  <span className="text-sm text-muted-foreground">{otp.time}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}