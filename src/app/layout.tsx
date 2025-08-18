
import type { Metadata, Viewport } from "next";
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

const APP_NAME = "SNAPGRID";
const APP_DEFAULT_TITLE = "SNAPGRID";
const APP_TITLE_TEMPLATE = "%s - SNAPGRID";
const APP_DESCRIPTION = "The Simple CRM & Marketing Tool for Your Service Center";


export const metadata: Metadata = {
  applicationName: APP_NAME,
  title: {
    default: APP_DEFAULT_TITLE,
    template: APP_TITLE_TEMPLATE,
  },
  description: APP_DESCRIPTION,
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/192.png", sizes: "192x192", type: "image/png" },
      { url: "/512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/192.png", sizes: "192x192", type: "image/png" }],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: APP_DEFAULT_TITLE,
    // startUpImage: [],
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: APP_NAME,
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
  twitter: {
    card: "summary",
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
};

export const viewport: Viewport = {
  themeColor: "#FFFFFF",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      signInUrl="https://valued-starfish-5.accounts.dev/sign-in"
      signUpUrl="https://valued-starfish-5.accounts.dev/sign-up"
      afterSignInUrl="/dashboard"
      afterSignUpUrl="/setup"
    >
      <html lang="en" suppressHydrationWarning>
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
