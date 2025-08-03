"use client";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Activity, 
  Send, 
  Smartphone, 
  Users,
  CircleCheck,
  AlertCircle
} from "lucide-react"
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
  Cell
} from 'recharts'

const messageData = [
  { name: 'Jan', sent: 4000, delivered: 3800 },
  { name: 'Feb', sent: 3000, delivered: 2800 },
  { name: 'Mar', sent: 5000, delivered: 4800 },
  { name: 'Apr', sent: 2780, delivered: 2500 },
  { name: 'May', sent: 3890, delivered: 3700 },
  { name: 'Jun', sent: 2390, delivered: 2200 },
]

const channelData = [
  { name: 'SMS', value: 75 },
  { name: 'WhatsApp', value: 15 },
  { name: 'Email', value: 10 },
]

const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

export default function DashboardHome() {
  return (
    <div className="space-y-6">
      {/* <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">SMS & OTP Dashboard</h1>
        <p className="text-muted-foreground">
          Manage your messaging services and monitor performance
        </p>
      </div> */}

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-green-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Available Balance
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground " />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">GHS 1,245.00</div>
            <p className="text-xs text-muted-foreground">
              +12% from last month
            </p>
          </CardContent>
        </Card>
        <Card className="bg-blue-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">SMS Credits</CardTitle>
            <Send className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24,500</div>
            <p className="text-xs text-muted-foreground">
              1,200 used this month
            </p>
          </CardContent>
        </Card>
        <Card className="bg-yellow-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Delivery Rate</CardTitle>
            <CircleCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">98.2%</div>
            <p className="text-xs text-muted-foreground">
              +1.2% from last month
            </p>
          </CardContent>
        </Card>
        <Card className="bg-red-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Failed Messages</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45</div>
            <p className="text-xs text-muted-foreground">
              0.8% of total messages
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="h-[350px]">
          <CardHeader>
            <CardTitle>Message Volume</CardTitle>
            <CardDescription>Monthly sent vs delivered messages</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={messageData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="sent" fill="#8884d8" radius={[4, 4, 0, 0]} />
                <Bar dataKey="delivered" fill="#82ca9d" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="h-[350px]">
          <CardHeader>
            <CardTitle>Channel Distribution</CardTitle>
            <CardDescription>Message delivery channels</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={channelData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {channelData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Send className="h-5 w-5" />
              Send SMS
            </CardTitle>
            <CardDescription>Compose and send messages</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full">New Message</Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smartphone className="h-5 w-5" />
              OTP Services
            </CardTitle>
            <CardDescription>Configure one-time passwords</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">
              Manage OTP
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Contacts
            </CardTitle>
            <CardDescription>Manage recipient groups</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">
              View Groups
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Messages</CardTitle>
          <CardDescription>Your most recent communications</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {[1, 2, 3].map((item) => (
              <div key={item} className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="rounded-full bg-primary/10 p-2">
                    <Send className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium leading-none">
                      {item === 1 ? "OTP Verification" : "Promotional Campaign"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {item === 1 
                        ? "Sent to 024XXXXXXX" 
                        : "Bulk to 250 recipients"}
                    </p>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  {item === 1 ? "2 mins ago" : "1 hour ago"}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}