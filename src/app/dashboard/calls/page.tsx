
'use client';
import { useState, useRef, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Phone, PhoneIncoming, PhoneOutgoing, PhoneMissed, Play, PlusCircle, Trash2, Delete, ChevronLeft, ChevronRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import dynamic from 'next/dynamic';
import { useAuthContext } from '@/contexts/auth-context';
import type { CallLog, PaginatedCallLog } from '@/lib/types';
import { listCalls, createCall } from '@/services/calls';
import { Skeleton } from '@/components/ui/skeleton';
import { useIsMobile } from '@/hooks/use-mobile';
import { CallLogCard } from '@/components/call-log-card';

const DialPad = ({ initialNumber = '', onNumberChange, onCall, onHangUp }: { initialNumber?: string, onNumberChange: (number: string) => void, onCall: () => void, onHangUp: () => void }) => {
    const [number, setNumber] = useState(initialNumber);

    useEffect(() => {
        onNumberChange(number);
    }, [number, onNumberChange]);

    const handleButtonClick = (digit: string) => {
        const newNumber = number + digit;
        setNumber(newNumber);
    };
    
    const handleBackspace = () => {
        const newNumber = number.slice(0, -1);
        setNumber(newNumber);
    }

    return (
        <div className="flex flex-col items-center gap-4">
            <div className="relative w-full">
                <Input 
                    type="tel"
                    value={number}
                    onChange={(e) => {
                        const newNumber = e.target.value.replace(/[^0-9*#+]/g, '');
                        setNumber(newNumber);
                    }}
                    placeholder="Enter phone number"
                    className="text-center text-2xl h-14 pr-10"
                />
                 {number && (
                    <Button variant="ghost" size="icon" className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8" onClick={handleBackspace}>
                        <Delete className="h-5 w-5" />
                    </Button>
                )}
            </div>
            <div className="grid grid-cols-3 gap-2 w-full">
                {['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'].map((digit) => (
                    <Button 
                        key={digit} 
                        variant="outline" 
                        className="h-16 text-2xl font-bold"
                        onClick={() => handleButtonClick(digit)}
                    >
                        {digit}
                    </Button>
                ))}
            </div>
             <div className="flex justify-center gap-4 mt-4">
                <Button size="lg" className="bg-green-500 hover:bg-green-600 rounded-full w-20 h-20" onClick={onCall}>
                    <Phone className="h-8 w-8" />
                </Button>
            </div>
        </div>
    );
};


const CallsPageComponent = () => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const { authToken } = useAuthContext();
    const { toast } = useToast();
    const isMobile = useIsMobile();
    
    const [callData, setCallData] = useState<PaginatedCallLog | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    
    const [activeRecording, setActiveRecording] = useState<string | null>(null);
    const audioRef = useRef<HTMLAudioElement>(null);
    const [isDialerOpen, setIsDialerOpen] = useState(false);
    const [dialerNumber, setDialerNumber] = useState('');

    const page = searchParams.get('page') ? parseInt(searchParams.get('page') as string, 10) : 1;

    const fetchCallLogs = useCallback(async () => {
        if (!authToken) return;
        setIsLoading(true);
        try {
            const data = await listCalls({ page }, authToken);
            setCallData(data);
        } catch (error) {
            toast({
                variant: 'destructive',
                title: 'Failed to fetch call logs',
                description: error instanceof Error ? error.message : 'Unknown error',
            });
        } finally {
            setIsLoading(false);
        }
    }, [page, authToken, toast]);

    useEffect(() => {
        fetchCallLogs();
    }, [fetchCallLogs]);

    useEffect(() => {
        const phoneFromUrl = searchParams.get('phone');
        if (phoneFromUrl) {
            setDialerNumber(phoneFromUrl);
            setIsDialerOpen(true);
        }
    }, [searchParams]);

    const handlePlayRecording = (url: string) => {
        if (activeRecording === url) {
            audioRef.current?.pause();
            setActiveRecording(null);
        } else {
            setActiveRecording(url);
            if (audioRef.current) {
                audioRef.current.src = url;
                audioRef.current.play();
            }
        }
    };
    
    const handleMakeCall = async () => {
        if(!dialerNumber) {
             toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Please enter a number to call.',
            });
            return;
        }
        
        try {
            await createCall({ customerPhone: dialerNumber }, authToken);
            toast({
                title: 'Calling...',
                description: `Initiating call to ${dialerNumber}`,
            });
            setIsDialerOpen(false);
            setDialerNumber('');
            fetchCallLogs(); // Refresh logs after making a call
        } catch (error) {
            const description = error instanceof Error ? error.message.replace('API request failed: ', '') : 'An unknown error occurred.';
            toast({
                variant: 'destructive',
                title: 'Failed to initiate call',
                description: description,
            });
        }
    };
    
    const handlePageChange = (newPage: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('page', newPage.toString());
        router.push(`${pathname}?${params.toString()}`);
    };

    const callTypeIcons = {
        'Incoming': <PhoneIncoming className="h-4 w-4 text-green-500" />,
        'Outgoing': <PhoneOutgoing className="h-4 w-4 text-blue-500" />,
        'Missed': <PhoneMissed className="h-4 w-4 text-red-500" />,
    };

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-10">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Call Logs</CardTitle>
            <CardDescription>
              Review call history, listen to recordings, and make new calls.
            </CardDescription>
          </div>
          <Dialog open={isDialerOpen} onOpenChange={setIsDialerOpen}>
            <DialogTrigger asChild>
                <Button size="sm" className="gap-1" onClick={() => { setDialerNumber(''); setIsDialerOpen(true); }}>
                    <PlusCircle className="h-4 w-4" />
                    {isMobile ? 'New Call' : 'Make a Call'}
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-xs">
                 <DialogHeader>
                    <DialogTitle className="text-center">Dialer</DialogTitle>
                </DialogHeader>
                <DialPad 
                    initialNumber={dialerNumber}
                    onNumberChange={setDialerNumber}
                    onCall={handleMakeCall}
                    onHangUp={() => setIsDialerOpen(false)}
                />
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
        {isMobile ? (
            <div className="space-y-4">
                 {isLoading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                        <Skeleton key={i} className="h-40 w-full" />
                    ))
                ) : callData && callData.callLogs.length > 0 ? (
                    callData.callLogs.map((log) => (
                        <CallLogCard 
                            key={log.id} 
                            log={log} 
                            callTypeIcons={callTypeIcons}
                            activeRecording={activeRecording}
                            onPlayRecording={handlePlayRecording}
                        />
                    ))
                ) : (
                    <div className="text-center h-24 flex items-center justify-center text-muted-foreground">
                        No call logs found.
                    </div>
                )}
            </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Agent</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell colSpan={6}><Skeleton className="h-8 w-full" /></TableCell>
                  </TableRow>
                ))
              ) : callData && callData.callLogs.length > 0 ? (
                callData.callLogs.map((log) => (
                    <TableRow key={log.id}>
                    <TableCell>
                        <div className="font-medium">{log.customerName}</div>
                        <div className="text-sm text-muted-foreground">{log.customerPhone}</div>
                    </TableCell>
                    <TableCell>
                        <div className="flex items-center gap-2">
                        {callTypeIcons[log.callType as keyof typeof callTypeIcons]}
                        <Badge variant="outline">{log.callType}</Badge>
                        </div>
                    </TableCell>
                    <TableCell>{log.duration}</TableCell>
                    <TableCell>{log.date}</TableCell>
                    <TableCell>
                            <div className="flex items-center gap-2 font-medium">
                                <Avatar className="h-8 w-8">
                                    <AvatarImage src={log.employeeAvatar} alt={log.employeeName} />
                                    <AvatarFallback>{log.employeeName.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <span>{log.employeeName}</span>
                            </div>
                        </TableCell>
                    <TableCell className="text-right">
                        {log.recordingUrl ? (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePlayRecording(log.recordingUrl!)}
                        >
                            <Play className="mr-2 h-4 w-4" />
                            {activeRecording === log.recordingUrl ? 'Pause' : 'Play'}
                        </Button>
                        ) : (
                        <span className="text-xs text-muted-foreground">No Recording</span>
                        )}
                    </TableCell>
                    </TableRow>
                ))
              ) : (
                 <TableRow>
                    <TableCell colSpan={6} className="text-center h-24">No call logs found.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
           <audio ref={audioRef} onEnded={() => setActiveRecording(null)} className="hidden" />
        </CardContent>
         {callData && callData.pagination && callData.pagination.totalLogs > 0 && (
            <CardFooter className="flex items-center justify-between flex-wrap gap-4">
                <div className="text-sm text-muted-foreground">
                    Showing page {callData.pagination.currentPage} of {callData.pagination.totalPages}
                </div>
                <div className="flex items-center gap-2">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(callData.pagination.currentPage - 1)}
                    disabled={callData.pagination.currentPage === 1}
                >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Previous
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(callData.pagination.currentPage + 1)}
                    disabled={callData.pagination.currentPage === callData.pagination.totalPages}
                >
                    Next
                    <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
                </div>
            </CardFooter>
         )}
      </Card>
    </main>
  );
};


const CallsPage = dynamic(() => Promise.resolve(CallsPageComponent), { ssr: false });

export default CallsPage;
