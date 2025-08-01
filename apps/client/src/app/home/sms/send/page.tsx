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

export default function SendSmsPage() {
  const [message, setMessage] = useState("");
  const [recipients, setRecipients] = useState<string[]>([]);
  const [newRecipient, setNewRecipient] = useState("");
  const [senderId, setSenderId] = useState("");
  const [template, setTemplate] = useState("");
  const [characterCount, setCharacterCount] = useState(0);
  const [messageParts, setMessageParts] = useState(1);
  const [isSending, setIsSending] = useState(false);

  const senderIds = [{ id: "Sendexa", status: "approved" }];

  const templates = [
    {
      id: "welcome",
      name: "Welcome Message",
      content: "Hello {name}, welcome to our service!",
    },
    {
      id: "otp",
      name: "OTP Template",
      content: "Your verification code is {otp}. Valid for 5 minutes.",
    },
    {
      id: "promo",
      name: "Promotional",
      content: "Special offer! Get 20% off today with code SAVE20",
    },
  ];

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
      setTemplate(value);
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

  const simulateSending = async () => {
    setIsSending(true);
    const totalMessages = recipients.length * messageParts;
    let successCount = 0;
    let failedCount = 0;

    // Simulate sending with random success/failure
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const sendPromises = recipients.map(recipient => {
      return new Promise((resolve) => {
        setTimeout(() => {
          const isSuccess = Math.random() > 0.1; // 90% success rate
          if (isSuccess) {
            successCount++;
          } else {
            failedCount++;
          }
          resolve(isSuccess);
        }, Math.random() * 1000); // Random delay up to 1s
      });
    });

    // Show progress toast
    const toastId = toast.loading(`Sending ${totalMessages} message parts to ${recipients.length} recipients...`);

    try {
      await Promise.all(sendPromises);
      
      // Update toast with result
      toast.success(`Successfully sent ${successCount * messageParts}/${totalMessages} message parts to ${recipients.length} recipients`, {
        id: toastId,
        description: failedCount > 0 ? `${failedCount} recipients failed` : undefined,
      });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error("Failed to send some messages", {
        id: toastId,
        description: "Please try again or check your balance",
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

    simulateSending();
  };

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
                      {senderIds.map((sender) => (
                        <SelectItem key={sender.id} value={sender.id}>
                          <div className="flex items-center gap-2">
                            {sender.id}
                            <Badge
                              variant={
                                sender.status === "approved"
                                  ? "approved"
                                  : "pending"
                              }
                              className="text-xs"
                            >
                              {sender.status}
                            </Badge>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="template">Template</Label>
                  <Select value={template} onValueChange={handleTemplateChange}>
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
                    <span>From: {senderId || "Not selected"}</span>
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
                <Button type="submit" className="w-full md:w-auto" disabled={isSending}>
                  {isSending ? "Sending..." : "Send Message"}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}