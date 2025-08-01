"use client";

import { notFound } from "next/navigation";
import { useParams } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Clock, CheckCircle2, XCircle } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

type SmsHistory = {
  id: string;
  recipient: string;
  type: string;
  message: string;
  status: "delivered" | "pending" | "failed";
  senderId: string;
  cost: number;
  date: string;
};

const smsHistory: SmsHistory[] = [
  {
    id: "1",
    recipient: "0244123456",
    type: "SMS API",
    message:
      "Welcome to Sendexa — your all-in-one platform for fast, secure, and reliable communications. Let's help you connect better!",
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

const getStatusIcon = (status: SmsHistory["status"]) => {
  switch (status) {
    case "delivered":
      return <CheckCircle2 className="h-5 w-5 text-green-500" />;
    case "failed":
      return <XCircle className="h-5 w-5 text-red-500" />;
    case "pending":
      return <Clock className="h-5 w-5 text-yellow-500" />;
    default:
      return null;
  }
};

export default function SmsDetailPage() {
  const params = useParams<{ id: string }>();
  const sms = smsHistory.find((item) => item.id === params.id);

  if (!sms) {
    return notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/home/reports/sms/history">
            <ChevronLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">SMS Details</h1>
          <p className="text-muted-foreground">
            Detailed information about this message
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Message Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Status</span>
              <div className="flex items-center gap-2">
                {getStatusIcon(sms.status)}
                <Badge variant="status" status={sms.status}>
                  {sms.status.charAt(0).toUpperCase() + sms.status.slice(1)}
                </Badge>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Recipient</span>
              <span className="font-medium">{sms.recipient}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Sender ID</span>
              <span className="font-medium">{sms.senderId}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Type</span>
              <Badge variant="outline">{sms.type}</Badge>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Cost</span>
              <span className="font-medium">GHS {sms.cost.toFixed(2)}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Date Sent</span>
              <span className="font-medium">{sms.date}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Message Content</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="whitespace-pre-wrap">{sms.message}</p>
            </div>
            {/* <div className="mt-4 flex justify-end">
              <Button variant="outline">
                Resend Message
                <ArrowUpRight className="ml-2 h-4 w-4" />
              </Button>
            </div> */}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
