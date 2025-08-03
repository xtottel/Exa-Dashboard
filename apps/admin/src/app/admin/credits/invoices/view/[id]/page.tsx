// app/home/credits/invoices/view/[id]/page.tsx
"use client";

import { notFound } from "next/navigation";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ChevronLeft, Printer, ReceiptText } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type Invoice = {
  id: string;
  date: string;
  amount: number;
  status: "paid" | "pending" | "failed";
  type: string;
  items?: {
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }[];
  paymentMethod?: string;
  transactionId?: string;
  billingAddress?: string;
};

const invoices: Invoice[] = [
  {
    id: "INV-2023-06-001",
    date: "2023-06-15",
    amount: 50.0,
    status: "paid",
    type: "SMS Credits",
    items: [
      {
        description: "SMS Credits - 10,000 units",
        quantity: 1,
        unitPrice: 50.0,
        total: 50.0,
      },
    ],
    paymentMethod: "MTN Mobile Money",
    transactionId: "MTN123456789",
    billingAddress: "123 Business Ave, Accra, Ghana",
  },
  {
    id: "INV-2023-05-003",
    date: "2023-05-28",
    amount: 25.0,
    status: "paid",
    type: "SMS Credits",
    items: [
      {
        description: "SMS Credits - 5,000 units",
        quantity: 1,
        unitPrice: 25.0,
        total: 25.0,
      },
    ],
    paymentMethod: "Vodafone Cash",
    transactionId: "VOD123456789",
  },
  {
    id: "INV-2023-05-002",
    date: "2023-05-15",
    amount: 100.0,
    status: "paid",
    type: "SMS Credits",
    items: [
      {
        description: "SMS Credits - 20,000 units",
        quantity: 1,
        unitPrice: 100.0,
        total: 100.0,
      },
    ],
    paymentMethod: "Bank Transfer",
    transactionId: "BANK123456789",
  },
  {
    id: "INV-2023-05-001",
    date: "2023-05-01",
    amount: 10.0,
    status: "paid",
    type: "SMS Credits",
    items: [
      {
        description: "SMS Credits - 2,000 units",
        quantity: 1,
        unitPrice: 10.0,
        total: 10.0,
      },
    ],
    paymentMethod: "Hubtel Wallet",
    transactionId: "HUB123456789",
  },
  {
    id: "INV-2023-04-002",
    date: "2023-04-22",
    amount: 50.0,
    status: "paid",
    type: "SMS Credits",
    items: [
      {
        description: "SMS Credits - 10,000 units",
        quantity: 1,
        unitPrice: 50.0,
        total: 50.0,
      },
    ],
    paymentMethod: "MTN Mobile Money",
    transactionId: "MTN987654321",
  },
];

const getStatusBadge = (status: Invoice["status"]) => {
  return (
    <Badge variant="status" status={status}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
};

export default function InvoiceDetailPage() {
  const params = useParams<{ id: string }>();
  const invoice = invoices.find((inv) => inv.id === params.id);

  if (!invoice) {
    return notFound();
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 print:p-0">
      <div className="flex items-center justify-between gap-4 print:hidden">
        <Button variant="outline" size="icon" asChild>
          <Link href="/home/credits/invoices">
            <ChevronLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
        </div>
      </div>

      <Card className="print:shadow-none print:border-0">
        <CardHeader className="border-b">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl">Invoice #{invoice.id}</CardTitle>
              <div className="text-sm text-muted-foreground mt-2">
                Issued on{" "}
                {new Date(invoice.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <ReceiptText className="h-6 w-6 text-primary" />
              <span className="text-lg font-semibold">SENDEXA</span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="font-semibold mb-2">Bill To</h3>
              <div className="text-sm text-muted-foreground">
                {invoice.billingAddress || "Your Business Name"}
                <br />
                Accra, Ghana
                <br />
                support@sendexa.com
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Status</span>
                <span>{getStatusBadge(invoice.status)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                  Invoice Total
                </span>
                <span className="font-semibold">
                  GHS {invoice.amount.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                  Payment Method
                </span>
                <span className="font-medium">{invoice.paymentMethod}</span>
              </div>
              {invoice.transactionId && (
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    Transaction ID
                  </span>
                  <span className="font-medium">{invoice.transactionId}</span>
                </div>
              )}
            </div>
          </div>

          <Card>
            <CardHeader className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Description</TableHead>
                    <TableHead>Qty</TableHead>
                    <TableHead>Unit Price</TableHead>
                    <TableHead>Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoice.items?.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{item.description}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>GHS {item.unitPrice.toFixed(2)}</TableCell>

                      <TableCell>GHS {item.total.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardHeader>
          </Card>

          <div className="mt-8 p-4 bg-muted/50 rounded-lg">
            <h4 className="font-semibold mb-2">Payment Instructions</h4>
            <p className="text-sm text-muted-foreground">
              Thank you for your business. This invoice is{" "}
              {invoice.status === "paid" ? "paid" : "due upon receipt"}.
              {invoice.status !== "paid" &&
                " Please make payment within 7 days."}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
