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
import { Play, ArrowRight } from "lucide-react";

export default function VideoGuidePage() {
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
                <div className="text-center">
                  <Button size="lg" className="rounded-full w-16 h-16 p-0">
                    <Play className="h-8 w-8 ml-1" />
                  </Button>
                  <p className="mt-4 text-white text-sm">
                    Sendexa Platform Overview
                  </p>
                </div>
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
            <div className="flex items-start gap-4">
              <div className="bg-primary/10 p-2 rounded-lg text-primary mt-1">
                <span className="font-medium">1</span>
              </div>
              <div>
                <h4 className="font-medium">Register Your Sender ID</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Get your approved sender name for outgoing messages
                </p>
                <Button variant="outline" size="sm" className="mt-2" asChild>
                  <Link href="/home/sms/sender-ids">
                    Get Started <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-primary/10 p-2 rounded-lg text-primary mt-1">
                <span className="font-medium">3</span>
              </div>
              <div>
                <h4 className="font-medium">Top Up Your Account</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Add funds to start sending messages immediately
                </p>
                <Button variant="outline" size="sm" className="mt-2" asChild>
                  <Link href="/home/credits/buy">
                    Buy Credits <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
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
