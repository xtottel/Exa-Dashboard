import type React from "react";
import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "@/styles/globals.css";
//import { Toaster } from "@/components/ui/toaster"
import { Toaster } from "react-hot-toast";
import { Toaster as Exatoast } from 'sonner'



const outfit = Outfit({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-outfit",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: {
    default: "Sendexa Dashboard",
    template: "%s | Sendexa",
  },
  description:
    "Manage your SMS, OTP, Sender IDs, contacts, and credits with the Sendexa Dashboard — built for fast, reliable communication.",
  generator: "Sendexa Platform",
  applicationName: "Sendexa Dashboard",
  keywords: [
    "Sendexa",
    "SMS",
    "OTP",
    "Messaging Dashboard",
    "Sender ID",
    "SMS Campaigns",
    "Buy SMS Credits",
    "Ghana Bulk SMS",
  ],
  authors: [{ name: "Sendexa Team", url: "https://sendexa.co" }],
  creator: "Sendexa",
  publisher: "Xtottel Technologies",
  metadataBase: new URL("https://dashboard.sendexa.co"),
  openGraph: {
    title: "Sendexa Dashboard",
    description:
      "Access the Sendexa dashboard to send messages, manage contacts, view reports, and buy SMS credits.",
    url: "https://dashboard.sendexa.co",
    siteName: "Sendexa",
    images: [
      {
        url: "https://sendexa.co/og-image.jpg", // Replace with your actual OG image
        width: 1200,
        height: 630,
        alt: "Sendexa Dashboard",
      },
    ],
    locale: "en_GB",
    type: "website",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  // themeColor: "#1E40AF", // Or your primary branding color
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${outfit.variable} font-sans antialiased`}>
      
          {children}
          <Exatoast position="top-center" expand={true} richColors />
          <Toaster position="top-center" reverseOrder={false} />
        
      </body>
    </html>
  );
}
