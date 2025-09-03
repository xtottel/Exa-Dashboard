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

export default function SendSmsPage() {
  const [message, setMessage] = useState("");
  const [recipients, setRecipients] = useState<string[]>([]);
  const [newRecipient, setNewRecipient] = useState("");
  const [senderId, setSenderId] = useState("");
  const [templateId, setTemplateId] = useState("");
  const [characterCount, setCharacterCount] = useState(0);
  const [messageParts, setMessageParts] = useState(1);
  const [isSending, setIsSending] = useState(false);
  const [senderIds, setSenderIds] = useState<SenderId[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch sender IDs and templates from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem("bearerToken");
        
        if (!token) {
          toast.error("Please login again");
          return;
        }

        // Fetch sender IDs
        const senderIdsResponse = await fetch("/api/sender-ids", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (senderIdsResponse.ok) {
          const senderIdsData = await senderIdsResponse.json();
          setSenderIds(senderIdsData.data || []);
        } else {
          console.error("Failed to fetch sender IDs");
        }

        // Fetch templates
        const templatesResponse = await fetch("/api/templates", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (templatesResponse.ok) {
          const templatesData = await templatesResponse.json();
          setTemplates(templatesData.data || []);
        } else {
          console.error("Failed to fetch templates");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Parse recipients from textarea input
  useEffect(() => {
    if (newRecipient.trim()) {
      const parsedRecipients = newRecipient
        .split(/[,;\n\s]+/)
        .map(r => r.trim())
        .filter(r => r.length > 0 && /^[0-9+]+$/.test(r));
      
      // Remove duplicates and empty entries
      const uniqueRecipients = [...new Set(parsedRecipients)];
      setRecipients(uniqueRecipients);
    } else {
      setRecipients([]);
    }
  }, [newRecipient]);

  const handleTemplateChange = (value: string) => {
    const selectedTemplate = templates.find((t) => t.id === value);
    if (selectedTemplate) {
      setTemplateId(value);
      setMessage(selectedTemplate.content);
      updateMessageStats(selectedTemplate.content);
    }
  };

  const updateMessageStats = (text: string) => {
    const count = text.length;
    setCharacterCount(count);
    // SMS are 160 chars per part for GSM charset, 70 for Unicode
    const isUnicode = /[^\x00-\x7F]/.test(text);
    const charsPerPart = isUnicode ? 70 : 160;
    setMessageParts(Math.ceil(count / charsPerPart));
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

      // Send to each recipient
      const sendPromises = recipients.map(recipient => {
        return fetch("/api/sms/send", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            recipient,
            message,
            senderId,
            templateId: templateId || undefined,
          }),
        });
      });

      // Show progress toast
      const toastId = toast.loading(`Sending ${messageParts * recipients.length} message parts to ${recipients.length} recipients...`);

      const responses = await Promise.all(sendPromises);
      
      // Count successful and failed sends
      let successCount = 0;
      let failedCount = 0;
      
      for (const response of responses) {
        if (response.ok) {
          successCount++;
        } else {
          failedCount++;
        }
      }

      // Update toast with result
      if (failedCount === 0) {
        toast.success(`Successfully sent ${successCount * messageParts} message parts to ${recipients.length} recipients`, {
          id: toastId,
        });
      } else if (successCount === 0) {
        toast.error(`Failed to send messages to all ${recipients.length} recipients`, {
          id: toastId,
          description: "Please check your balance and try again",
        });
      } else {
        toast.warning(`Sent ${successCount * messageParts} message parts successfully, ${failedCount} recipients failed`, {
          id: toastId,
          description: "Some messages may not have been delivered",
        });
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
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight">Send SMS</h1>
          <p className="text-muted-foreground">
            Compose and send messages to your recipients
          </p>
        </div>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <span className="ml-2 text-muted-foreground">Loading data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">Send SMS</h1>
        <p className="text-muted-foreground">
          Compose and send messages to your recipients
        </p>
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
              <div className="space-y-2">
                <Label htmlFor="recipients">Recipients</Label>
                <div className="flex gap-2">
                  <Textarea
                    id="recipients"
                    placeholder="Enter phone numbers separated by commas, spaces, or new lines (e.g. 0244123456, 0551196764)"
                    value={newRecipient}
                    rows={4}
                    className="resize-none"
                    onChange={(e) => setNewRecipient(e.target.value)}
                  />
                </div>
                {recipients.length > 0 && (
                  <div className="text-sm text-muted-foreground">
                    {recipients.length} recipient{recipients.length !== 1 ? "s" : ""} detected
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
                    {messageParts} part{messageParts !== 1 ? "s" : ""} × {recipients.length} recipients = {messageParts * recipients.length} total parts
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
                  <Label htmlFor="sender-id">Sender ID</Label>
                  <Select value={senderId} onValueChange={setSenderId}>
                    <SelectTrigger id="sender-id">
                      <SelectValue placeholder="Select sender ID" />
                    </SelectTrigger>
                    <SelectContent>
                      {senderIds
                        .filter(sender => sender.status === "approved")
                        .map((sender) => (
                          <SelectItem key={sender.id} value={sender.id}>
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
                  <Label htmlFor="contact">Contact</Label>
                  <Select value={templateId} onValueChange={handleTemplateChange}>
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

                <div className="space-y-2">
                  <Label htmlFor="template">Template</Label>
                  <Select value={templateId} onValueChange={handleTemplateChange}>
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
                    <span>From: {senderIds.find(s => s.id === senderId)?.name || "Not selected"}</span>
                  </div>
                  <div className="whitespace-pre-wrap text-sm">
                    {message || (
                      <span className="text-muted-foreground">
                        Message will appear here
                      </span>
                    )}
                  </div>
                  {recipients.length > 0 && (
                    <div className="mt-4 pt-2 border-t text-sm text-muted-foreground">
                      To: {recipients.length} recipient
                      {recipients.length !== 1 ? "s" : ""}
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button 
                  type="submit" 
                  className="w-full md:w-auto" 
                  disabled={isSending || recipients.length === 0 || !senderId || !message}
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

