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
import { useState } from "react";
import { toast } from "sonner";

type TopUpPackage = {
  id: string;
  amount: number;
  bonus: number;
};

export default function TopUpWalletPage() {
  const [selectedPackage, setSelectedPackage] = useState("2");
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [customAmount, setCustomAmount] = useState("");

  const topUpPackages: TopUpPackage[] = [
    {
      id: "1",
      amount: 50,
      bonus: 0,
    },
    {
      id: "2",
      amount: 100,
      bonus: 5,
    },
    {
      id: "3",
      amount: 200,
      bonus: 15,
    },
    {
      id: "4",
      amount: 500,
      bonus: 50,
    },
  ];

  const handleTopUp = () => {
    const pkg = topUpPackages.find((p) => p.id === selectedPackage);
    if (customAmount) {
      const amount = parseFloat(customAmount);
      if (isNaN(amount) || amount <= 0) {
        toast.error("Please enter a valid amount");
        return;
      }
      toast.success(`Top up of GHS ${amount.toFixed(2)} initiated`);
    } else if (pkg) {
      toast.success(
        `Top up of GHS ${pkg.amount.toFixed(2)} with GHS ${pkg.bonus.toFixed(2)} bonus initiated`
      );
    }
  };

  const currentPackage = topUpPackages.find((p) => p.id === selectedPackage);
  const totalAmount = customAmount
    ? parseFloat(customAmount) || 0
    : currentPackage?.amount || 0;
  const totalBonus = customAmount ? 0 : currentPackage?.bonus || 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Top Up Wallet</h1>
        <p className="text-muted-foreground">
          Add funds to your digital wallet for seamless transactions
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Top Up Packages</CardTitle>
            <CardDescription>Choose from our prepaid packages</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2">
              {topUpPackages.map((pkg) => (
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
                      <div className="font-bold">GHS {pkg.amount.toFixed(2)}</div>
                      {pkg.bonus > 0 && (
                        <div className="text-sm text-muted-foreground">
                          +GHS {pkg.bonus.toFixed(2)} bonus
                        </div>
                      )}
                    </div>
                    {pkg.bonus > 0 && (
                      <Badge variant="secondary">
                        +{((pkg.bonus / pkg.amount) * 100).toFixed(0)}%
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
                  value="bank"
                  id="bank"
                  className="peer sr-only"
                />
                <Label
                  htmlFor="bank"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  <Wallet className="mb-2 h-6 w-6" />
                  Bank Transfer
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

            {paymentMethod === "bank" && (
              <div className="mt-6 space-y-4">
                <div className="space-y-2">
                  <Label>Bank</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select bank" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gtb">GT Bank</SelectItem>
                      <SelectItem value="absa">Absa Bank</SelectItem>
                      <SelectItem value="ecobank">Ecobank</SelectItem>
                      <SelectItem value="calbank">CAL Bank</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="account-number">Account Number</Label>
                  <Input id="account-number" placeholder="1234567890" />
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex flex-col items-start gap-4">
            <div className="w-full space-y-2">
              {customAmount ? (
                <div className="flex justify-between">
                  <span>Custom Amount</span>
                  <span className="font-medium">
                    GHS {parseFloat(customAmount).toFixed(2)}
                  </span>
                </div>
              ) : (
                <>
                  <div className="flex justify-between">
                    <span>Package Amount</span>
                    <span className="font-medium">
                      GHS {currentPackage?.amount.toFixed(2)}
                    </span>
                  </div>
                  {/* {currentPackage?.bonus > 0 && (
                    <div className="flex justify-between">
                      <span>Bonus</span>
                      <span className="font-medium text-green-600">
                        +GHS {currentPackage.bonus.toFixed(2)}
                      </span>
                    </div>
                  )} */}
                </>
              )}
              <div className="border-t pt-2 flex justify-between font-bold">
                <span>Total to be added</span>
                <span>
                  GHS {(totalAmount + totalBonus).toFixed(2)}
                </span>
              </div>
            </div>
            <Button className="w-full" onClick={handleTopUp}>
              Complete Top Up <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}