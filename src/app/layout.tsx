import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { SessionProvider } from "@/components/providers/session-provider";


export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://z-ai-pharmacy-platform.vercel.app'),
  title: {
    default: "Z-AI Pharmacy Platform | UAE Drug Database & AI Clinical Assistant",
    template: "%s | Z-AI Pharmacy Platform"
  },
  description: "Advanced AI-powered pharmaceutical intelligence platform for UAE healthcare professionals. Access 21,885+ MOH-approved drugs, check interactions, calculate dosages, verify pregnancy safety, and get AI-powered clinical decision support. Built on evidence-based guidelines from CDC, WHO, ACC/AHA, ADA, GINA, and GOLD.",
  keywords: [
    "UAE drug database",
    "pharmacy platform",
    "drug interactions checker",
    "clinical decision support",
    "AI pharmacist",
    "MOH drugs UAE",
    "pregnancy safety drugs",
    "G6PD safe medications",
    "dosage calculator",
    "ICD-10 codes",
    "pharmaceutical intelligence",
    "clinical assistant UAE",
    "evidence-based medicine"
  ],
  authors: [
    { name: "Z-AI Pharmacy Platform Team" },
    { name: "DrugEye Intelligence", url: "https://z-ai-pharmacy-platform.vercel.app" }
  ],
  creator: "Z-AI Pharmacy Platform",
  publisher: "Z-AI Pharmacy Platform",
  manifest: "/manifest.json",
  icons: {
    icon: "/drugeye-logo.png",
    apple: "/drugeye-logo.png",
    shortcut: "/drugeye-logo.png",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
  openGraph: {
    type: "website",
    locale: "en_AE",
    url: "https://z-ai-pharmacy-platform.vercel.app",
    siteName: "Z-AI Pharmacy Platform",
    title: "Z-AI Pharmacy Platform | AI-Powered Clinical Decision Support",
    description: "Advanced AI-powered pharmaceutical intelligence platform for UAE healthcare professionals. 21,885+ drugs, disease databases, interaction checking, and AI clinical assistant.",
    images: [
      {
        url: "/drugeye-logo.png",
        width: 1152,
        height: 896,
        alt: "DrugEye Intelligence - AI Clinical Decision Support",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Z-AI Pharmacy Platform | AI Clinical Assistant",
    description: "AI-powered pharmaceutical intelligence for UAE clinicians. 21,885+ drugs, disease databases, interaction checking, and clinical decision support.",
    images: ["/drugeye-logo.png"],
    creator: "@zaiplatform",
    site: "@zaiplatform",
  },
  alternates: {
    canonical: "https://z-ai-pharmacy-platform.vercel.app",
  },
  category: "Healthcare Technology",
};

import { ThemeProvider } from "next-themes";
import { AppProvider } from "@/providers/AppProvider";
import type { Viewport } from 'next'

export const viewport: Viewport = {
  themeColor: "#0f766e",
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className="antialiased bg-background text-foreground"
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <SessionProvider>
            <AppProvider>
              {children}
            </AppProvider>
          </SessionProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
