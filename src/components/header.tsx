
'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";

export function Header() {
    const pathname = usePathname();
    const isDashboard = pathname.startsWith('/dashboard');

    if (isDashboard) {
        return null;
    }

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center justify-between">
                <Link href="/home" className="flex items-center gap-2">
                    <Logo className="h-6 w-6 text-primary" />
                    <span className="font-bold text-xl">SNAP GRID</span>
                </Link>
                <div className="flex items-center gap-4">
                    <SignedOut>
                        <div className="hidden md:flex items-center gap-2">
                            <Button variant="ghost" asChild>
                                <Link href="/home#features">Features</Link>
                            </Button>
                            <Button variant="ghost" asChild>
                                <Link href="/home#pricing">Pricing</Link>
                            </Button>
                        </div>
                        <SignInButton mode="modal" fallbackRedirectUrl="/dashboard">
                            <Button>Sign In</Button>
                        </SignInButton>
                    </SignedOut>
                    <SignedIn>
                         <Button asChild>
                            <Link href="/dashboard">Dashboard</Link>
                        </Button>
                        <UserButton afterSignOutUrl="/home" />
                    </SignedIn>
                </div>
            </div>
        </header>
    );
}
