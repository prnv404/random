import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { SearchX, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-center p-4">
      <div className="relative flex justify-center items-center">
        <span className="text-9xl font-bold text-primary opacity-20">4</span>
         <SearchX className="h-24 w-24 text-primary mx-4" />
        <span className="text-9xl font-bold text-primary opacity-20">4</span>
      </div>
      <h1 className="text-3xl font-bold text-foreground mt-8">
        Oops! Page Not Found
      </h1>
      <p className="text-muted-foreground mt-4 mb-8 max-w-md">
        It seems the page you were looking for doesn't exist or has been moved. Let's get you back on track.
      </p>
      <Button asChild>
        <Link href="/home">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go back to Homepage
        </Link>
      </Button>
    </div>
  );
}
