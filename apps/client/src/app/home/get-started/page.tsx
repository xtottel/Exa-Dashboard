"use client";

import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useState } from "react";

export default function VideoGuidePage() {
  const [videoSource] = useState<{
    type: "youtube" | "self";
    src: string;
  }>({
    type: "youtube",
    src: "https://www.youtube.com/embed/hpcCQa7DY40", // replace with your YouTube embed link or self-hosted video
  });

  return (
    <div className="space-y-10 pb-10">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Sendexa Video Guide
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Watch our quick tutorial to get started with SMS messaging in minutes
        </p>
      </div>

      {/* Video + Next Steps */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Video Player Card */}
        <Card className="relative">
          <CardHeader>
            <Card className="rounded-xl overflow-hidden shadow-lg">
              <div className="aspect-video bg-black flex items-center justify-center">
                {videoSource.type === "youtube" ? (
                  <iframe
                    src={videoSource.src}
                    title="Sendexa Guide"
                    frameBorder="0"
                    allowFullScreen
                    className="w-full h-full"
                  />
                ) : (
                  <video
                    src={videoSource.src}
                    controls
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
            </Card>
          </CardHeader>
        </Card>

        {/* Next Steps Card */}
        <Card>
          <CardHeader>
            <CardTitle>Next Steps</CardTitle>
            <CardDescription>After watching the video</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <StepCard
              number="1"
              title="Register Your Sender ID"
              description="Get your approved sender name for outgoing messages"
              link="/home/sms/sender-ids"
              buttonText="Get Started"
            />
            <StepCard
              number="2"
              title="Top Up Your Account"
              description="Add funds to start sending messages immediately"
              link="/home/credits/buy"
              buttonText="Buy Credits"
            />
          </CardContent>
        </Card>
      </div>

      {/* Resources Section */}
      <div>
        <h2 className="text-xl font-semibold mb-4">More Help Resources</h2>
        <div className="grid gap-4 md:grid-cols-4">
          <ResourceCard
            title="Documentation"
            desc="Full platform guide"
            href="https://docs.sendexa.co"
          />
          <ResourceCard
            title="FAQs"
            desc="Common questions answered"
            href="https://sendexa.co/faqs"
          />
          <ResourceCard
            title="Contact Support"
            desc="Get personalized help"
            href="https://sendexa.co/contact"
          />
          <ResourceCard
            title="Payment Solutions"
            desc="Start accepting payments in just 30 minutes"
            href="https://xtopay.co"
          />
        </div>
      </div>
    </div>
  );
}

function StepCard({
  number,
  title,
  description,
  link,
  buttonText,
}: {
  number: string;
  title: string;
  description: string;
  link: string;
  buttonText: string;
}) {
  return (
    <div className="flex items-start gap-4">
      <div className="bg-primary/10 p-2 rounded-lg text-primary mt-1">
        <span className="font-medium">{number}</span>
      </div>
      <div>
        <h4 className="font-medium">{title}</h4>
        <p className="text-sm text-muted-foreground mt-1">{description}</p>
        <Button variant="outline" size="sm" className="mt-2" asChild>
          <Link href={link}>
            {buttonText} <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}

function ResourceCard({
  title,
  desc,
  href,
}: {
  title: string;
  desc: string;
  href: string;
}) {
  return (
    <Link href={href} target={href.startsWith("http") ? "_blank" : "_self"}>
      <Card className="hover:border-primary transition-colors cursor-pointer h-full">
        <CardHeader>
          <CardTitle className="text-lg">{title}</CardTitle>
          <CardDescription>{desc}</CardDescription>
        </CardHeader>
      </Card>
    </Link>
  );
}
