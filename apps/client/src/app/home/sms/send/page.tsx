"use client";
import { useState } from "react"
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent, 
  CardDescription, 
  CardFooter 
} from "@/components/ui/card"
import { 
  Button, 
  // buttonVariants 
} from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import {Plus, X } from "lucide-react"

import { Badge } from "@/components/ui/badge"

export default function SendSmsPage() {
  const [message, setMessage] = useState("")
  const [recipients, setRecipients] = useState<string[]>([])
  const [newRecipient, setNewRecipient] = useState("")
  const [senderId, setSenderId] = useState("")
  const [template, setTemplate] = useState("")
  const [characterCount, setCharacterCount] = useState(0)
  const [messageParts, setMessageParts] = useState(1)

  const senderIds = [
    { id: "Sendexa", status: "approved" },
  ]

  const templates = [
    { id: "welcome", name: "Welcome Message", content: "Hello {name}, welcome to our service!" },
    { id: "otp", name: "OTP Template", content: "Your verification code is {otp}. Valid for 5 minutes." },
    { id: "promo", name: "Promotional", content: "Special offer! Get 20% off today with code SAVE20" },
  ]

  const handleAddRecipient = () => {
    if (newRecipient.trim() && !recipients.includes(newRecipient)) {
      setRecipients([...recipients, newRecipient])
      setNewRecipient("")
    }
  }

  const handleRemoveRecipient = (recipientToRemove: string) => {
    setRecipients(recipients.filter(r => r !== recipientToRemove))
  }

  const handleTemplateChange = (value: string) => {
    const selectedTemplate = templates.find(t => t.id === value)
    if (selectedTemplate) {
      setTemplate(value)
      setMessage(selectedTemplate.content)
      updateMessageStats(selectedTemplate.content)
    }
  }

  const updateMessageStats = (text: string) => {
    const count = text.length
    setCharacterCount(count)
    setMessageParts(Math.ceil(count / 160)) // SMS are 160 chars per part
  }

  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value
    setMessage(text)
    updateMessageStats(text)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Submit logic here
    console.log({
      message,
      recipients,
      senderId,
      template
    })
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
                  <Input
                    id="recipients"
                    placeholder="Phone number (e.g. 0244123456)"
                    value={newRecipient}
                    onChange={(e) => setNewRecipient(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddRecipient()}
                  />
                  <Button 
                    type="button"
                    variant="outline" 
                    size="icon"
                    onClick={handleAddRecipient}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                
                {recipients.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {recipients.map(recipient => (
                      <Badge 
                        key={recipient} 
                        variant="secondary"
                        className="flex items-center gap-1"
                      >
                        {recipient}
                        <button
                          type="button"
                          onClick={() => handleRemoveRecipient(recipient)}
                          className="rounded-full p-0.5 hover:bg-muted"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
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
                    {characterCount} character{characterCount !== 1 ? 's' : ''}
                  </span>
                  <span>
                    {messageParts} part{messageParts !== 1 ? 's' : ''}
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
                              variant={sender.status === "approved" ? "approved" : "pending"}
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
                    {message || <span className="text-muted-foreground">Message will appear here</span>}
                  </div>
                  {recipients.length > 0 && (
                    <div className="mt-4 pt-2 border-t text-sm text-muted-foreground">
                      To: {recipients.length} recipient{recipients.length !== 1 ? 's' : ''}
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button type="submit" className="w-full md:w-auto">
                  Send Message
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </form>
    </div>
  )
}