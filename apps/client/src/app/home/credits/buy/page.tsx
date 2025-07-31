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
import { CreditCard, Smartphone, ArrowRight, Check, Wallet } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect, useMemo } from "react";
import { toast } from "sonner";

type CreditPackage = {
  id: string;
  amount: number;
  credits: number;
  bonus: number;
  pricePerUnit: number;
};

export default function BuyCreditsPage() {
  const [selectedPackage, setSelectedPackage] = useState("2");
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [customAmount, setCustomAmount] = useState("");
  const [calculatedCredits, setCalculatedCredits] = useState(0);
  const [pricePerUnit, setPricePerUnit] = useState(0.028);
  const [calculatedAmount, setCalculatedAmount] = useState(0);

  const creditPackages: CreditPackage[] = useMemo(() => [
   {
      id: "1",
      amount: 83.972, // 2999 * 0.028
      credits: 2999,
      bonus: 0,
      pricePerUnit: 0.028
    },
    {
      id: "2",
      amount: 260, // 10000 * 0.026
      credits: 10000,
      bonus: 0,
      pricePerUnit: 0.026
    },
    {
      id: "3",
      amount: 240.024, // 10001 * 0.024
      credits: 10001,
      bonus: 0,
      pricePerUnit: 0.024
    },
    {
      id: "4",
      amount: 1760, // 80000 * 0.022
      credits: 80000,
      bonus: 0,
      pricePerUnit: 0.022
    },
  ], []);

  useEffect(() => {
    if (customAmount) {
      const amount = parseFloat(customAmount);
      if (isNaN(amount) || amount <= 0) return;

      let credits = 0;
      let price = 0.028;
      
      if (amount >= 83.972) {
        // Calculate based on tiered pricing
        if (amount >= 1760) {
          // Above 80,000 SMS
          credits = Math.floor(amount / 0.022);
          price = 0.022;
        } else if (amount >= 240.024) {
          // 10,001-80,000 SMS
          credits = Math.floor(amount / 0.024);
          price = 0.024;
        } else if (amount >= 260) {
          // 3,000-10,000 SMS
          credits = Math.floor(amount / 0.026);
          price = 0.026;
        } else {
          // 1-2,999 SMS
          credits = Math.floor(amount / 0.028);
          price = 0.028;
        }
      } else {
        // Below minimum package (83.972)
        credits = Math.floor(amount / 0.030);
        price = 0.030;
      }

      setPricePerUnit(price);
      setCalculatedCredits(credits);
      setCalculatedAmount(amount);
    }
  }, [customAmount]);

  const handleCalculate = () => {
    if (!customAmount) {
      toast.error("Please enter an amount");
      return;
    }

    const amount = parseFloat(customAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    toast.success(`Calculated: ${calculatedCredits} credits at ₵${pricePerUnit.toFixed(3)}/unit`);
  };

  const handlePayment = () => {
    const pkg = creditPackages.find((p) => p.id === selectedPackage);
    if (customAmount) {
      toast.success(`Payment of GHS ${calculatedAmount.toFixed(2)} for ${calculatedCredits} credits initiated`);
    } else if (pkg) {
      toast.success(`Payment of GHS ${pkg.amount.toFixed(2)} for ${pkg.credits} credits initiated`);
    }
  };

  const currentPackage = creditPackages.find((p) => p.id === selectedPackage);
  const totalCredits = customAmount 
    ? calculatedCredits 
    : (currentPackage ? currentPackage.credits : 0);
  const totalAmount = customAmount 
    ? calculatedAmount 
    : (currentPackage ? currentPackage.amount : 0);


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
                  onClick={() => {
                    setSelectedPackage(pkg.id);
                    setCustomAmount("");
                  }}
                  className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                    selectedPackage === pkg.id && !customAmount
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
                      <div className="text-xs text-muted-foreground">
                        ₵{pkg.pricePerUnit.toFixed(3)}/unit
                      </div>
                    </div>
                    {pkg.bonus > 0 && (
                      <Badge variant="secondary">
                        +{pkg.bonus.toLocaleString()} bonus
                      </Badge>
                    )}
                  </div>
                  {selectedPackage === pkg.id && !customAmount && (
                    <div className="mt-2 flex justify-end">
                      <Check className="h-4 w-4 text-primary" />
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-6 space-y-2">
              <Label htmlFor="custom-amount">Or enter custom amount (GHS)</Label>
              <div className="flex gap-2">
                <Input
                  id="custom-amount"
                  placeholder="Enter amount (GHS)"
                  type="number"
                  min="0"
                  step="0.01"
                  value={customAmount}
                  onChange={(e) => {
                    setCustomAmount(e.target.value);
                    setSelectedPackage("");
                  }}
                />
                <Button 
                  variant="outline" 
                  onClick={handleCalculate}
                  disabled={!customAmount}
                >
                  Calculate
                </Button>
              </div>
              {customAmount && (
                <div className="text-sm text-muted-foreground">
                  {calculatedCredits.toLocaleString()} credits at ₵{pricePerUnit.toFixed(3)}/unit
                </div>
              )}
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
              value={paymentMethod}
              onValueChange={setPaymentMethod}
              className="grid md:grid-cols-3 grid-cols-2 gap-4"
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
              <div>
                <RadioGroupItem
                  value="wallet"
                  id="wallet"
                  className="peer sr-only"
                />
                <Label
                  htmlFor="wallet"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  <Wallet className="mb-2 h-6 w-6" />
                  Digital Wallet
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

            {paymentMethod === "wallet" && (
              <div className="mt-6 space-y-4">
                <div className="space-y-2">
                  <Label>Wallet Provider</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select wallet" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hubtel">Hubtel</SelectItem>
                      <SelectItem value="zeepay">Zeepay</SelectItem>
                      <SelectItem value="kowri">Kowri</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="wallet-number">Mobile Number</Label>
                  <Input id="wallet-number" placeholder="0244123456" />
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex flex-col items-start gap-4">
            <div className="w-full space-y-2">
              {customAmount ? (
                <>
                  <div className="flex justify-between">
                    <span>Custom Amount</span>
                    <span className="font-medium">GHS {parseFloat(customAmount).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Price Per Unit</span>
                    <span className="font-medium">₵{pricePerUnit.toFixed(3)}</span>
                  </div>
                </>
              ) : (
                <div className="flex justify-between">
                  <span>Package</span>
                  <span className="font-medium">
                    GHS {currentPackage?.amount.toFixed(2)}
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Credits</span>
                <span className="font-medium">{totalCredits.toLocaleString()}</span>
              </div>
              {/* {!customAmount && currentPackage?.bonus > 0 && (
                <div className="flex justify-between">
                  <span>Bonus Credits</span>
                  <span className="font-medium text-green-600">
                    +{currentPackage.bonus.toLocaleString()}
                  </span>
                </div>
              )} */}
              <div className="border-t pt-2 flex justify-between font-bold">
                <span>Total</span>
                <span>GHS {totalAmount.toFixed(2)}</span>
              </div>
            </div>
            <Button className="w-full" onClick={handlePayment}>
              Complete Payment <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}