
'use client';
import Link from 'next/link';
import {
  Home,
  Users,
  FileText,
  Bell,
  Megaphone,
  Ticket,
  Phone,
  Clock,
  Building,
  Wallet,
  Settings,
  Briefcase,
} from 'lucide-react';

import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarInset,
} from '@/components/ui/sidebar';
import { Logo } from '@/components/logo';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { DashboardHeader } from '@/components/dashboard-header';
import { Badge } from '@/components/ui/badge';
import { SignedIn } from '@clerk/nextjs';
import { AuthProvider } from '@/contexts/auth-context';


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
      <SignedIn>
        <AuthProvider>
            <SidebarProvider>
            <Sidebar>
                <SidebarHeader>
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="shrink-0" asChild>
                    <Link href="/dashboard">
                        <Logo className="size-5" />
                    </Link>
                    </Button>
                    <div className="flex items-center gap-2">
                    <span className="font-headline text-lg font-semibold">SNAP GRID</span>
                    <Badge variant="secondary">BETA</Badge>
                    </div>
                </div>
                </SidebarHeader>
                <SidebarContent>
                <SidebarMenu className="mt-8">
                    <SidebarMenuItem>
                    <Link href="/dashboard" passHref>
                        <SidebarMenuButton tooltip="Dashboard" size="lg">
                        <>
                            <Home />
                            <span>Dashboard</span>
                        </>
                        </SidebarMenuButton>
                    </Link>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                    <Link href="/dashboard/tickets" passHref>
                        <SidebarMenuButton tooltip="Tickets" size="lg">
                        <>
                            <Ticket />
                            <span>Tickets</span>
                        </>
                        </SidebarMenuButton>
                    </Link>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                    <Link href="/dashboard/calls" passHref>
                        <SidebarMenuButton tooltip="Calls" size="lg">
                        <>
                            <Phone />
                            <span>Calls</span>
                        </>
                        </SidebarMenuButton>
                    </Link>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                    <Link href="/dashboard/customers" passHref>
                        <SidebarMenuButton tooltip="Customers" size="lg">
                        <>
                            <Users />
                            <span>Customers</span>
                        </>
                        </SidebarMenuButton>
                    </Link>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                    <Link href="/dashboard/expirations" passHref>
                        <SidebarMenuButton tooltip="Expirations" size="lg">
                        <>
                            <Clock />
                            <span>Expirations</span>
                        </>
                        </SidebarMenuButton>
                    </Link>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                    <Link href="/dashboard/alerts" passHref>
                        <SidebarMenuButton tooltip="Alerts" size="lg">
                        <>
                            <Bell />
                            <span>Alerts</span>
                        </>
                        </SidebarMenuButton>
                    </Link>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                    <Link href="/dashboard/billing" passHref>
                        <SidebarMenuButton tooltip="Billing" size="lg">
                        <>
                            <FileText />
                            <span>Billing</span>
                        </>
                        </SidebarMenuButton>
                    </Link>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                    <Link href="/dashboard/campaigns" passHref>
                        <SidebarMenuButton tooltip="Campaigns" size="lg">
                        <>
                            <Megaphone />
                            <span>Campaigns</span>
                        </>
                        </SidebarMenuButton>
                    </Link>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                    <Link href="/dashboard/settings" passHref>
                        <SidebarMenuButton tooltip="Settings" size="lg">
                        <>
                            <Settings />
                            <span>Settings</span>
                        </>
                        </SidebarMenuButton>
                    </Link>
                    </SidebarMenuItem>
                     <SidebarMenuItem>
                    <Link href="/dashboard/settings/services" passHref>
                        <SidebarMenuButton tooltip="Services" size="lg">
                        <>
                            <Briefcase />
                            <span>Services</span>
                        </>
                        </SidebarMenuButton>
                    </Link>
                    </SidebarMenuItem>
                </SidebarMenu>
                </SidebarContent>
                <SidebarFooter>
                <Separator className="my-2" />
                    <Link href="/dashboard/organization">
                    <Button variant="ghost" className="w-full justify-start gap-2">
                        <Building />
                        <span className="group-data-[collapsible=icon]:hidden">
                        Organization
                        </span>
                    </Button>
                    </Link>
                </SidebarFooter>
            </Sidebar>
            <SidebarInset className="flex flex-col h-screen">
                <DashboardHeader className="sticky top-0 z-10" />
                <main className="flex-1 overflow-y-auto">{children}</main>
            </SidebarInset>
            </SidebarProvider>
        </AuthProvider>
      </SignedIn>
  );
}
