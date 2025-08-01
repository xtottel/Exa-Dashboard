// app/settings/page.tsx
import { Card } from "@/components/ui/card";
//import { Button } from "@/components/ui/button";
import { User, Building, Key, Shield } from "lucide-react";
import Link from "next/link";

export default function SettingsPage() {
  const settingsSections = [
    {
      title: "Profile",
      description: "Manage your personal information",
      icon: <User className="h-5 w-5" />,
      href: "/home/settings/profile",
    },
    {
      title: "Business Profile",
      description: "Update your company details",
      icon: <Building className="h-5 w-5" />,
      href: "/home/settings/business",
    },
    {
      title: "API Keys",
      description: "Manage your API access credentials",
      icon: <Key className="h-5 w-5" />,
      href: "/home/settings/api-keys",
    },
    {
      title: "Security",
      description: "Configure authentication and security settings",
      icon: <Shield className="h-5 w-5" />,
      href: "/home/settings/security",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account and application preferences
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {settingsSections.map((section) => (
          <Card key={section.title} className="hover:border-primary transition-colors">
            <Link href={section.href} className="p-6 block">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                  {section.icon}
                </div>
                <div>
                  <h3 className="font-semibold">{section.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {section.description}
                  </p>
                </div>
              </div>
            </Link>
          </Card>
        ))}
      </div>
    </div>
  );
}