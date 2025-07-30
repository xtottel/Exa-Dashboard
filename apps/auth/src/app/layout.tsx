import { Outfit } from "next/font/google";
import "@/styles/globals.css";
//import type { Metadata } from "next";

//import TopBar from "@/layout/Topbar";

const outfit = Outfit({
  variable: "--font-outfit-sans",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

// export const metadata: Metadata = {
//   title: {
//     default: "Sendexa | Africa's Leading Communication APIs",
//     template: "%s | Sendexa",
//   },
//   description:
//     "Powering 10,000+ businesses with enterprise-grade SMS, WhatsApp, Email  APIs. 99.9% uptime, fastest delivery speeds, and developer-first tools.",
//   metadataBase: new URL("https://sendexa.co"),
//   alternates: {
//     canonical: "/",
//   },
//   openGraph: {
//     title: "Sendexa | All-in-One Platform for Communications ",
//     description:
//       "Everything to engage customers and collect payments across Africa. Get started with 10,000 free credits.",
//     url: "https://sendexa.co",
//     siteName: "Sendexa",
//     images: [
//       {
//         url: "/og/home.jpg",
//         width: 720,
//         height: 720,
//       },
//     ],
//     locale: "en_GH",
//     type: "website",
//   },
//   twitter: {
//     card: "summary_large_image",
//     title: "Sendexa | Build with Africa's Best APIs",
//     description:
//       "Node.js, Python & PHP SDKs available. 24/7 support with 15-min SLA.",
//     images: ["/og/home.jpg"],
//     creator: "@SendexaGH",
//   },
//   robots: {
//     index: true,
//     follow: true,
//     googleBot: {
//       index: true,
//       follow: true,
//       "max-image-preview": "large",
//     },
//   },
//   icons: {
//     icon: "/favicon.png",
//     shortcut: "/favicon-16x16.png",
//     apple: "/apple-touch-icon.png",
//     other: {
//       rel: "mask-icon",
//       url: "/safari-pinned-tab.svg",
//       color: "#3a0ca3",
//     },
//   },
//   themeColor: "#3a0ca3",
//   verification: {
//     google: "your-google-verification-code",
//   },
// };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${outfit.variable} font-sans antialiased bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-50`}
      >
        <main id="main-content" className="min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}
