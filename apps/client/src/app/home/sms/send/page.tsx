"use client";
import { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";

type SenderId = {
id: string;
  status: "approved" | "pending" | "rejected";
  name: string;
};

type Template = {
  id: string;
  name: string;
  content: string;
  category: string;
  variables: string[];
  createdAt: string;
  updatedAt: string;
};

type ContactGroup = {
  id: string;
  name: string;
  recipients: number;
};

export default function SendSmsPage() {
  const [message, setMessage] = useState("");
  const [recipients, setRecipients] = useState<string[]>([]);
  const [newRecipient, setNewRecipient] = useState("");
  const [senderId, setSenderId] = useState("");
  const [templateId, setTemplateId] = useState("");
  const [contactGroupId, setContactGroupId] = useState("");
  const [characterCount, setCharacterCount] = useState(0);
  const [messageParts, setMessageParts] = useState(1);
  const [isSending, setIsSending] = useState(false);
  const [senderIds, setSenderIds] = useState<SenderId[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [contactGroups, setContactGroups] = useState<ContactGroup[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [creditBalance, setCreditBalance] = useState<{
    SMS: number;
    WALLET: number;
  }>({ SMS: 0, WALLET: 0 });
  const [estimatedCost, setEstimatedCost] = useState(0);
  const router = useRouter();

  // Fetch data from API including credit balance
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem("bearerToken");

        if (!token) {
          toast.error("Please login again");
          router.push("/login");
          return;
        }

        // Fetch all data including credit balance
        const [
          senderIdsResponse,
          templatesResponse,
          groupsResponse,
          creditsResponse,
        ] = await Promise.all([
          fetch("/api/sender-ids", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("/api/templates", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("/api/contacts/groups", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("/api/credit/balance", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (senderIdsResponse.ok) {
          const senderIdsData = await senderIdsResponse.json();
          setSenderIds(senderIdsData.data || [senderIdsData.name]);
        }

        if (templatesResponse.ok) {
          const templatesData = await templatesResponse.json();
          setTemplates(templatesData.data || []);
        }

        if (groupsResponse.ok) {
          const groupsData = await groupsResponse.json();
          setContactGroups(groupsData.data || []);
        }

        if (creditsResponse.ok) {
          const creditsData = await creditsResponse.json();
          setCreditBalance(creditsData.data?.balances || { SMS: 0, WALLET: 0 });
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [router]);

  // Parse recipients from textarea input
  useEffect(() => {
    if (newRecipient.trim()) {
      const parsedRecipients = newRecipient
        .split(/[,;\n\s]+/)
        .map((r) => r.trim())
        .filter((r) => r.length > 0 && /^[0-9+]+$/.test(r));

      const uniqueRecipients = [...new Set(parsedRecipients)];
      setRecipients(uniqueRecipients);
    } else {
      setRecipients([]);
    }
  }, [newRecipient]);

  // Update estimated cost when recipients or message changes
  useEffect(() => {
    if (recipients.length > 0 && message) {
      const cost = calculateMessageCost(message) * recipients.length;
      setEstimatedCost(cost);
    } else {
      setEstimatedCost(0);
    }
  }, [recipients, message]);

  // Handle contact group selection
  const handleContactGroupChange = async (groupId: string) => {
    setContactGroupId(groupId);
    if (groupId) {
      try {
        const token = localStorage.getItem("bearerToken");
        const response = await fetch(
          `/api/contacts/groups/${groupId}/contacts`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response.ok) {
          const data = await response.json();

          const groupRecipients = data.data
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .map((contact: any) => contact.phone)
            .filter(Boolean);
          setNewRecipient(groupRecipients.join("\n"));
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        toast.error("Failed to load group contacts");
      }
    }
  };

  const handleTemplateChange = (value: string) => {
    const selectedTemplate = templates.find((t) => t.id === value);
    if (selectedTemplate) {
      setTemplateId(value);
      setMessage(selectedTemplate.content);
      updateMessageStats(selectedTemplate.content);
    }
  };

  // Helper function to calculate message cost in credits
  const calculateMessageCost = (text: string): number => {
    const isUnicode = /[^\x00-\x7F]/.test(text);
    const charsPerPart = isUnicode ? 70 : 160;
    const segments = Math.ceil(text.length / charsPerPart);
    return segments; // Return number of segments (credits)
  };

  const updateMessageStats = (text: string) => {
    const count = text.length;
    setCharacterCount(count);
    const isUnicode = /[^\x00-\x7F]/.test(text);
    const charsPerPart = isUnicode ? 70 : 160;
    const parts = Math.ceil(count / charsPerPart);
    setMessageParts(parts);
  };

  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setMessage(text);
    updateMessageStats(text);
  };

  const sendSMS = async () => {
    setIsSending(true);

    try {
      const token = localStorage.getItem("bearerToken");

      if (!token) {
        toast.error("Please login again");
        return;
      }

      // Calculate total cost for all recipients (in credits)
      const totalCost = recipients.length * calculateMessageCost(message);

      // Check if we have enough credits locally first
      if (creditBalance.SMS < totalCost) {
        toast.error("Insufficient SMS credits", {
          description: `You need ${totalCost.toFixed(0)} credits but only have ${creditBalance.SMS.toFixed(0)}`,
          action: {
            label: "Buy Credits",
            onClick: () => router.push("/home/credits/buy"),
          },
        });
        setIsSending(false);
        return;
      }

      const sendPromises = recipients.map((recipient) => {
        return fetch("/api/sms/send", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
      
          body: JSON.stringify({
            recipient,
            message,
            senderId: senderId, 
            templateId: templateId || undefined,
          }),
        });
      });

      const toastId = toast.loading(
        `Sending ${messageParts * recipients.length} message parts to ${recipients.length} recipients...`
      );

      const responses = await Promise.all(sendPromises);

      let successCount = 0;
      let failedCount = 0;
      let insufficientCreditErrors = 0;

      for (const response of responses) {
        const result = await response.json();
        if (response.ok && result.success) {
          successCount++;
        } else {
          failedCount++;
          // Check if it's an insufficient credit error
          if (result.data?.currentBalance !== undefined) {
            insufficientCreditErrors++;
          }
        }
      }

      // Refresh credit balance after sending
      const creditsResponse = await fetch("/api/credit/balance", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (creditsResponse.ok) {
        const creditsData = await creditsResponse.json();
        setCreditBalance(creditsData.data?.balances || { SMS: 0, WALLET: 0 });
      }

      if (insufficientCreditErrors > 0) {
        toast.error(
          `Insufficient credits for ${insufficientCreditErrors} messages`,
          {
            id: toastId,
            description: "Please top up your SMS credits",
            action: {
              label: "Buy Credits",
              onClick: () => router.push("/home/credits/buy"),
            },
          }
        );
      } else if (failedCount === 0) {
        toast.success(
          `Successfully sent ${successCount * messageParts} message parts to ${recipients.length} recipients`,
          {
            id: toastId,
          }
        );
      } else if (successCount === 0) {
        toast.error(
          `Failed to send messages to all ${recipients.length} recipients`,
          {
            id: toastId,
            description: "Please check your balance and try again",
          }
        );
      } else {
        toast.warning(
          `Sent ${successCount * messageParts} message parts successfully, ${failedCount} recipients failed`,
          {
            id: toastId,
            description: "Some messages may not have been delivered",
          }
        );
      }
    } catch (error) {
      console.error("Error sending SMS:", error);
      toast.error("Failed to send messages", {
        description: "Please try again later",
      });
    } finally {
      setIsSending(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!message.trim()) {
      toast.error("Please enter a message");
      return;
    }

    if (recipients.length === 0) {
      toast.error("Please add at least one recipient");
      return;
    }

    if (!senderId) {
      toast.error("Please select a sender ID");
      return;
    }

    sendSMS();
  };

  const getStatusBadge = (status: SenderId["status"]) => {
    return (
      <Badge variant="status" status={status}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
          <div className="flex items-center gap-4">
            <Skeleton className="h-12 w-32" />
            <Skeleton className="h-9 w-24" />
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-[1fr_300px]">
          {/* Main compose area skeleton */}
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-64" />
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-24 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-32 w-full" />
                <div className="flex justify-between">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-3 w-32" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sidebar options skeleton */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-40" />
              </CardHeader>
              <CardContent className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-40" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-32 w-full" />
              </CardContent>
              <CardFooter>
                <Skeleton className="h-10 w-full" />
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with credit balance */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight">Send SMS</h1>
          <p className="text-muted-foreground">
            Compose and send messages to your recipients
          </p>
        </div>
        {/* <div className="flex items-center gap-4">
          <Card className="bg-blue-50">
            <CardContent className="p-3">
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium">SMS Credits:</span>
                <span className="font-bold text-blue-700">
                  {creditBalance.SMS.toFixed(0)}
                </span>
              </div>
            </CardContent>
          </Card>
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push("/home/credits/buy")}
          >
            Buy Credits
          </Button>
        </div> */}
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 md:grid-cols-[1fr_300px]">
          {/* Main compose area */}
          <Card>
            <CardHeader>
              <CardTitle>Compose Message</CardTitle>
              <CardDescription>
                Write your message and add recipients
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* <div className="space-y-2">
                <Label htmlFor="contact-group">Contact Group</Label>
                <Select
                  value={contactGroupId}
                  onValueChange={handleContactGroupChange}
                >
                  <SelectTrigger id="contact-group">
                    <SelectValue placeholder="Select a contact group" />
                  </SelectTrigger>
                  <SelectContent>
                    {contactGroups.map((group) => (
                      <SelectItem key={group.id} value={group.id}>
                        <div className="flex items-center gap-2">
                          {group.name}
                          <Badge variant="outline" className="ml-2">
                            {group.recipients} contacts
                          </Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div> */}

              <div className="space-y-2">
                <Label htmlFor="recipients">Recipients</Label>
                <Textarea
                  id="recipients"
                  placeholder="Enter phone numbers separated by commas, spaces, or new lines (e.g. 0244123456, 0551196764)"
                  value={newRecipient}
                  rows={4}
                  className="resize-none"
                  onChange={(e) => setNewRecipient(e.target.value)}
                />
                {recipients.length > 0 && (
                  <div className="text-sm text-muted-foreground">
                    {recipients.length} recipient
                    {recipients.length !== 1 ? "s" : ""} detected
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  value={message}
                  onChange={handleMessageChange}
                  placeholder="Type your message here..."
                  rows={8}
                  className="resize-none"
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>
                    {characterCount} character{characterCount !== 1 ? "s" : ""}
                  </span>
                  <span>
                    {messageParts} part{messageParts !== 1 ? "s" : ""} ×{" "}
                    {recipients.length} recipients ={" "}
                    {messageParts * recipients.length} total parts
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sidebar options */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Message Options</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                <Label htmlFor="contact-group">Contact Group</Label>
                <Select
                  value={contactGroupId}
                  onValueChange={handleContactGroupChange}
                >
                  <SelectTrigger id="contact-group">
                    <SelectValue placeholder="Select a contact group" />
                  </SelectTrigger>
                  <SelectContent>
                    {contactGroups.map((group) => (
                      <SelectItem key={group.id} value={group.id}>
                        <div className="flex items-center gap-2">
                          {group.name}
                          <Badge variant="outline" className="ml-2">
                            {group.recipients} contacts
                          </Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>



                <div className="space-y-2">
                  <Label htmlFor="sender-id">Sender ID</Label>
                  <Select value={senderId} onValueChange={setSenderId}>
                    <SelectTrigger id="sender-id">
                      <SelectValue placeholder="Select sender ID" />
                    </SelectTrigger>
                    <SelectContent>
                      {senderIds
                        .filter((sender) => sender.status === "approved")
                        .map((sender) => (
                          <SelectItem key={sender.name} value={sender.name}>
                            <div className="flex items-center gap-2">
                              {sender.name}
                              {getStatusBadge(sender.status)}
                            </div>
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="template">Template</Label>
                  <Select
                    value={templateId}
                    onValueChange={handleTemplateChange}
                  >
                    <SelectTrigger id="template">
                      <SelectValue placeholder="Select a template" />
                    </SelectTrigger>
                    <SelectContent>
                      {templates.map((tpl) => (
                        <SelectItem key={tpl.id} value={tpl.id}>
                          {tpl.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Message Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border bg-muted/50 p-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <span>
                      From:{" "}
                      {senderIds.find((s) => s.name === senderId)?.name ||
                        "Not selected"}
                    </span>
                  </div>
                  <div className="whitespace-pre-wrap text-sm">
                    {message || (
                      <span className="text-muted-foreground">
                        Message will appear here
                      </span>
                    )}
                  </div>
                  {recipients.length > 0 && (
                    <div className="mt-4 pt-2 border-t">
                      <div className="text-sm text-muted-foreground">
                        To: {recipients.length} recipient
                        {recipients.length !== 1 ? "s" : ""}
                      </div>
                      <div className="text-sm font-medium mt-1">
                        Estimated cost: {estimatedCost.toFixed(0)} credits
                      </div>
                      {creditBalance.SMS < estimatedCost && (
                        <div className="text-sm text-red-500 mt-1">
                          Insufficient credits! Need{" "}
                          {(estimatedCost - creditBalance.SMS).toFixed(0)} more
                          credits
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button
                  type="submit"
                  className="w-full md:w-auto"
                  disabled={
                    isSending ||
                    recipients.length === 0 ||
                    !senderId ||
                    !message ||
                    creditBalance.SMS < estimatedCost
                  }
                >
                  {isSending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    "Send Message"
                  )}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}
