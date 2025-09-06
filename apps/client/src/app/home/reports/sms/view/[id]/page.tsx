// "use client";

// import { notFound } from "next/navigation";
// import { useParams } from "next/navigation";
// import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { ChevronLeft, Clock, CheckCircle2, XCircle } from "lucide-react";
// import Link from "next/link";
// import { Badge } from "@/components/ui/badge";

// type SmsHistory = {
//   id: string;
//   recipient: string;
//   type: string;
//   message: string;
//   status: "delivered" | "pending" | "failed";
//   senderId: string;
//   cost: number;
//   date: string;
// };

// const smsHistory: SmsHistory[] = [
//   {
//     id: "1",
//     recipient: "0244123456",
//     type: "SMS API",
//     message:
//       "Welcome to Sendexa — your all-in-one platform for fast, secure, and reliable communications. Let's help you connect better!",
//     status: "delivered",
//     senderId: "Sendexa",
//     cost: 0.05,
//     date: "2023-06-15 09:30:45",
//   },
//   {
//     id: "2",
//     recipient: "0209876543",
//     type: "Outgoing",
//     message: "Special offer: 20% off today!",
//     status: "failed",
//     senderId: "Sendexa",
//     cost: 0.05,
//     date: "2023-06-15 10:15:22",
//   },
//   {
//     id: "3",
//     recipient: "0543210987",
//     type: "Outgoing",
//     message: "Your appointment is confirmed for tomorrow at 2pm",
//     status: "pending",
//     senderId: "Sendexa",
//     cost: 0.05,
//     date: "2023-06-14 14:45:33",
//   },
//   {
//     id: "4",
//     recipient: "0276543210",
//     type: "Outgoing",
//     message: "Your OTP is 123456",
//     status: "delivered",
//     senderId: "Sendexa",
//     cost: 0.05,
//     date: "2023-06-13 11:05:49",
//   },
//   {
//     id: "5",
//     recipient: "0276543210",
//     type: "Outgoing",
//     message: "Your payment of GHS 150.00 was received",
//     status: "delivered",
//     senderId: "Sendexa",
//     cost: 0.05,
//     date: "2023-06-13 11:05:49",
//   },
// ];

// const getStatusIcon = (status: SmsHistory["status"]) => {
//   switch (status) {
//     case "delivered":
//       return <CheckCircle2 className="h-5 w-5 text-green-500" />;
//     case "failed":
//       return <XCircle className="h-5 w-5 text-red-500" />;
//     case "pending":
//       return <Clock className="h-5 w-5 text-yellow-500" />;
//     default:
//       return null;
//   }
// };

// export default function SmsDetailPage() {
//   const params = useParams<{ id: string }>();
//   const sms = smsHistory.find((item) => item.id === params.id);

//   if (!sms) {
//     return notFound();
//   }

//   return (
//     <div className="space-y-6">
//       <div className="flex items-center gap-4">
//         <Button variant="outline" size="icon" asChild>
//           <Link href="/home/reports/sms/history">
//             <ChevronLeft className="h-4 w-4" />
//           </Link>
//         </Button>
//         <div>
//           <h1 className="text-2xl font-bold tracking-tight">SMS Details</h1>
//           <p className="text-muted-foreground">
//             Detailed information about this message
//           </p>
//         </div>
//       </div>

//       <div className="grid gap-6 md:grid-cols-2">
//         <Card>
//           <CardHeader>
//             <CardTitle>Message Information</CardTitle>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             <div className="flex items-center justify-between">
//               <span className="text-sm text-muted-foreground">Status</span>
//               <div className="flex items-center gap-2">
//                 {getStatusIcon(sms.status)}
//                 <Badge variant="status" status={sms.status}>
//                   {sms.status.charAt(0).toUpperCase() + sms.status.slice(1)}
//                 </Badge>
//               </div>
//             </div>

//             <div className="flex items-center justify-between">
//               <span className="text-sm text-muted-foreground">Recipient</span>
//               <span className="font-medium">{sms.recipient}</span>
//             </div>

//             <div className="flex items-center justify-between">
//               <span className="text-sm text-muted-foreground">Sender ID</span>
//               <span className="font-medium">{sms.senderId}</span>
//             </div>

//             <div className="flex items-center justify-between">
//               <span className="text-sm text-muted-foreground">Type</span>
//               <Badge variant="outline">{sms.type}</Badge>
//             </div>

//             <div className="flex items-center justify-between">
//               <span className="text-sm text-muted-foreground">Cost</span>
//               <span className="font-medium">GHS {sms.cost.toFixed(2)}</span>
//             </div>

//             <div className="flex items-center justify-between">
//               <span className="text-sm text-muted-foreground">Date Sent</span>
//               <span className="font-medium">{sms.date}</span>
//             </div>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader>
//             <CardTitle>Message Content</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="p-4 bg-muted/50 rounded-lg">
//               <p className="whitespace-pre-wrap">{sms.message}</p>
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// }



"use client";

import { notFound } from "next/navigation";
import { useParams } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Clock, CheckCircle2, XCircle, RefreshCw } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface SMSDetails {
  id: string;
  recipient: string;
  message: string;
  status: "delivered" | "pending" | "failed";
  type: string;
  senderId: string;
  cost: number;
  createdAt: string;
  deliveryStatus?: {
    status: string;
    timestamp?: string;
    errorCode?: string;
    errorMessage?: string;
  };
  analytics?: {
    segments: number;
    characters: number;
    costPerSegment: number;
  };
}

const getStatusIcon = (status: SMSDetails["status"]) => {
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
  const [sms, setSms] = useState<SMSDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // import { useCallback } from "react";

  const fetchSMSDetails = useCallback(async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("bearerToken");

      if (!token) {
        toast.error("Please login again");
        router.push("/login");
        return;
      }

      const response = await fetch(`/api/sms/details/${params.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          return notFound();
        }
        throw new Error("Failed to fetch SMS details");
      }

      const data = await response.json();
      setSms(data.data);
    } catch (error) {
      console.error("Error fetching SMS details:", error);
      toast.error("Failed to load SMS details");
    } finally {
      setIsLoading(false);
    }
  }, [params.id, router]);

  useEffect(() => {
    if (params.id) {
      fetchSMSDetails();
    }
  }, [params.id, fetchSMSDetails]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/home/reports/sms/history">
              <ChevronLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-48 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-64"></div>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <div className="h-6 bg-gray-200 rounded w-32 animate-pulse"></div>
            </CardHeader>
            <CardContent className="space-y-4">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
                  <div className="h-6 bg-gray-200 rounded w-20 animate-pulse"></div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="h-6 bg-gray-200 rounded w-32 animate-pulse"></div>
            </CardHeader>
            <CardContent>
              <div className="p-4 bg-muted/50 rounded-lg animate-pulse">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

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
        <Button variant="outline" size="sm" onClick={fetchSMSDetails}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
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
              <span className="font-medium">{new Date(sms.createdAt).toLocaleString()}</span>
            </div>

            {sms.analytics && (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Characters</span>
                  <span className="font-medium">{sms.analytics.characters}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Segments</span>
                  <span className="font-medium">{sms.analytics.segments}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Cost per Segment</span>
                  <span className="font-medium">GHS {sms.analytics.costPerSegment.toFixed(2)}</span>
                </div>
              </>
            )}
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
            
            {sms.deliveryStatus && (
              <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                <h3 className="font-semibold mb-2">Delivery Status</h3>
                <div className="text-sm space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status:</span>
                    <span className="font-medium">{sms.deliveryStatus.status}</span>
                  </div>
                  {sms.deliveryStatus.timestamp && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Timestamp:</span>
                      <span className="font-medium">{new Date(sms.deliveryStatus.timestamp).toLocaleString()}</span>
                    </div>
                  )}
                  {sms.deliveryStatus.errorCode && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Error Code:</span>
                      <span className="font-medium">{sms.deliveryStatus.errorCode}</span>
                    </div>
                  )}
                  {sms.deliveryStatus.errorMessage && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Error Message:</span>
                      <span className="font-medium">{sms.deliveryStatus.errorMessage}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}