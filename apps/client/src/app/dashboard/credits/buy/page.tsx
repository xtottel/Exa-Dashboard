"use client";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CreditCard, Smartphone, ArrowRight, Check } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

const creditPackages = [
  {
    id: "1",
    amount: 10,
    credits: 2000,
    bonus: 0,
  },
  {
    id: "2",
    amount: 25,
    credits: 5000,
    bonus: 500,
  },
  {
    id: "3",
    amount: 50,
    credits: 10000,
    bonus: 1500,
  },
  {
    id: "4",
    amount: 100,
    credits: 20000,
    bonus: 5000,
  },
];

export default function BuyCreditsPage() {
  const [selectedPackage, setSelectedPackage] = useState("2");
  const [paymentMethod, setPaymentMethod] = useState("card");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Buy SMS Credits</h1>
        <p className="text-muted-foreground">
          Top up your account balance to send messages
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Credit Packages</CardTitle>
            <CardDescription>Choose from our prepaid packages</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2">
              {creditPackages.map((pkg) => (
                <div
                  key={pkg.id}
                  onClick={() => setSelectedPackage(pkg.id)}
                  className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                    selectedPackage === pkg.id
                      ? "border-primary bg-primary/5"
                      : "hover:bg-muted/50"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-bold">
                        GHS {pkg.amount.toFixed(2)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {pkg.credits.toLocaleString()} credits
                      </div>
                    </div>
                    {pkg.bonus > 0 && (
                      <Badge variant="secondary">
                        +{pkg.bonus.toLocaleString()} bonus
                      </Badge>
                    )}
                  </div>
                  {selectedPackage === pkg.id && (
                    <div className="mt-2 flex justify-end">
                      <Check className="h-4 w-4 text-primary" />
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-6 space-y-2">
              <Label htmlFor="custom-amount">Or enter custom amount</Label>
              <div className="flex gap-2">
                <Input
                  id="custom-amount"
                  placeholder="Enter amount"
                  type="number"
                />
                <Button variant="outline">Calculate</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payment Method</CardTitle>
            <CardDescription>How would you like to pay?</CardDescription>
          </CardHeader>
          <CardContent>
            <RadioGroup
              // value={paymentMethod}
              // onValueChange={setPaymentMethod}
              // className="flex items-center justify-between col-2 gap-4"
              value={paymentMethod}
      onValueChange={setPaymentMethod}
      className="grid grid-cols-2 gap-4"
            >
              <div>
                <RadioGroupItem
                  value="card"
                  id="card"
                  className="peer sr-only"
                />
                <Label
                  htmlFor="card"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  <CreditCard className="mb-2 h-6 w-6" />
                  Bank Card
                </Label>
              </div>

              <div>
                <RadioGroupItem
                  value="mobile"
                  id="mobile"
                  className="peer sr-only"
                />
                <Label
                  htmlFor="mobile"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  <Smartphone className="mb-2 h-6 w-6" />
                  Mobile Money
                </Label>
              </div>
            </RadioGroup>

            

            {paymentMethod === "card" && (
              <div className="mt-6 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="card-number">Card Number</Label>
                  <Input id="card-number" placeholder="1234 5678 9012 3456" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expiry">Expiry Date</Label>
                    <Input id="expiry" placeholder="MM/YY" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cvc">CVC</Label>
                    <Input id="cvc" placeholder="123" />
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === "mobile" && (
              <div className="mt-6 space-y-4">
                <div className="space-y-2">
                  <Label>Mobile Network</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select network" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mtn">MTN Mobile Money</SelectItem>
                      <SelectItem value="vodafone">Vodafone Cash</SelectItem>
                      <SelectItem value="airteltigo">
                        AirtelTigo Money
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mobile-number">Mobile Number</Label>
                  <Input id="mobile-number" placeholder="0244123456" />
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex flex-col items-start gap-4">
            <div className="w-full space-y-2">
              <div className="flex justify-between">
                <span>Package</span>
                <span className="font-medium">
                  GHS{" "}
                  {creditPackages
                    .find((p) => p.id === selectedPackage)
                    ?.amount.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Credits</span>
                <span className="font-medium">
                  {creditPackages
                    .find((p) => p.id === selectedPackage)
                    ?.credits.toLocaleString()}
                </span>
              </div>
              {/* {creditPackages.find(p => p.id === selectedPackage)?.bonus > 0 && (
                <div className="flex justify-between">
                  <span>Bonus Credits</span>
                  <span className="font-medium text-green-600">
                    +{creditPackages.find(p => p.id === selectedPackage)?.bonus.toLocaleString()}
                  </span>
                </div>
              )} */}
              <div className="border-t pt-2 flex justify-between font-bold">
                <span>Total</span>
                <span>
                  GHS{" "}
                  {creditPackages
                    .find((p) => p.id === selectedPackage)
                    ?.amount.toFixed(2)}
                </span>
              </div>
            </div>
            <Button className="w-full">
              Complete Payment <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
