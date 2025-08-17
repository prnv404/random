
import type { Metadata } from "next";
import { PT_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { cn } from "@/lib/utils";
import NextTopLoader from "nextjs-toploader";
import { ClerkProvider } from "@clerk/nextjs";
import { Header } from "@/components/header";
import { HealthCheckProvider } from "@/contexts/health-check-context";



const ptSans = PT_Sans({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "SNAP GRID",
  description: "A centralized dashboard to manage all available services.",
  manifest: "/manifest.json",
  themeColor: "#ffffff",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          <script defer data-workspace="68a0aa362493235550985791" 
            src="https://cdn.jsdelivr.net/npm/litlyx-js@latest/browser/litlyx.js"></script>
        </head>
        <body
          className={cn(
            "min-h-screen bg-background font-sans antialiased",
            ptSans.variable
          )}
        >
          <NextTopLoader color="hsl(var(--primary))" showSpinner={false} />
          <HealthCheckProvider>
            <Header />
            {children}
            <Toaster />
          </HealthCheckProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
