
'use client';
import Image from 'next/image';
import { Button } from './ui/button';

export const ServerDownPage = () => {
    const handleRetry = () => {
        window.location.reload();
    }
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-center p-4 overflow-hidden">
        <div className="relative w-full max-w-lg h-auto rounded-lg shadow-2xl overflow-hidden">
            <Image 
                src="https://miro.medium.com/0*BRb4NEcy6xYsLQYv.jpg"
                alt="A funny programming meme about debugging"
                width={700}
                height={500}
                className="object-contain"
                data-ai-hint="funny programming meme"
                unoptimized
            />
        </div>
      <h1 className="text-4xl font-bold text-foreground mt-8">
        It's probably fine...
      </h1>
      <p className="text-muted-foreground mt-4 mb-8 max-w-md">
        Our servers are currently debugging in production. We're working on it and things should be back to normal shortly. Thanks for your patience!
      </p>
      <Button onClick={handleRetry} size="lg">
        Try Again
      </Button>
    </div>
  );
}

