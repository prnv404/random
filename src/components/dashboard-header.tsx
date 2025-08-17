
'use client';

import * as React from 'react';
import {
  Globe,
  Search,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { SignedIn, UserButton } from '@clerk/nextjs';
import { cn } from '@/lib/utils';

export function DashboardHeader({ className }: { className?: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const pathParts = pathname.split('/').filter(part => part);
  const isCustomersPage = pathname.includes('/dashboard/customers');

  const handleSearch = (term: string) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set('search', term);
    } else {
      params.delete('search');
    }
    router.replace(`${pathname}?${params.toString()}`);
  }
  
  return (
    <header className={cn("flex h-16 items-center justify-between gap-4 border-b bg-card px-4 md:px-6", className)}>
      <div className="flex items-center gap-4">
        <SidebarTrigger className="md:hidden" />
        <nav className="hidden font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
           <span className="text-muted-foreground transition-colors hover:text-foreground capitalize">
             {pathParts.join(' / ')}
           </span>
        </nav>
      </div>

      <div className="flex items-center gap-4">
        <form className="relative flex-1 sm:flex-initial">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder={isCustomersPage ? "Search..." : "Search services..."}
            className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
            disabled={!isCustomersPage}
            onChange={(e) => handleSearch(e.target.value)}
            defaultValue={searchParams.get('search')?.toString()}
          />
        </form>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <Globe className="h-[1.2rem] w-[1.2rem]" />
              <span className="sr-only">Select language</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>English</DropdownMenuItem>
            <DropdownMenuItem>മലയാളം</DropdownMenuItem>
            <DropdownMenuItem>Hindi</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <SignedIn>
          <UserButton afterSignOutUrl="/home" />
        </SignedIn>

      </div>
    </header>
  );
}
