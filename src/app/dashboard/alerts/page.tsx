
'use client';
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
import type { AlertLog, PaginatedAlertLog } from '@/lib/types';
import { Mail, Phone, CheckCircle2, XCircle, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import dynamic from 'next/dynamic';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useState, useEffect, useCallback } from 'react';
import { useAuthContext } from '@/contexts/auth-context';
import { getNotificationHistory } from '@/services/notifications';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { format, parseISO } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';

const WhatsAppIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M12.04 2C6.58 2 2.15 6.53 2.15 12.11c0 1.85.5 3.6 1.39 5.14L2.5 22l5.02-1.34a9.921 9.921 0 0 0 4.52 1.18h.01c5.56 0 10.01-4.53 10.01-10.11S17.6 2 12.04 2zM9.51 17.43c-.24.13-.53.2-1.12.35-.59.15-1.18.16-1.63.1-.45-.06-1.12-.22-1.63-.73-.51-.51-.87-1.13-.98-1.34-.11-.21-.77-1.34-.77-2.58s.8-2.25 1.1-2.52c.3-.27.65-.35.88-.35.22 0 .41.02.58.03.22.02.36.03.5.25.13.21.48.9.53 1 .05.1.08.21.03.34-.05.13-.08.21-.15.3-.08.08-.15.18-.27.3s-.22.25-.33.39c-.1.14-.2.27-.08.52.13.25.61 1.05 1.25 1.63.85.8 1.55 1.1 1.78 1.23.23.13.36.1.51.05.15-.05.65-.3 1.25-.61s1.02-1.01 1.18-1.34c.16-.34.33-.52.55-.52.22,0,.41-.02.59.08.18.1.41.48.48.56s.25.21.28.34c.03.13.03.73-.21 1.34-.24.61-1.55 1.83-1.8 2.06-.25.22-.48.33-.75.33-.27.01-1.72-3-1.72-3z"/>
    </svg>
);

const MessageSquare = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    </svg>
);

const channelIcons: Record<AlertLog['channel'], React.ReactNode> = {
    'sms': <MessageSquare className="h-4 w-4" />,
    'whatsapp': <WhatsAppIcon className="h-4 w-4" />,
    'email': <Mail className="h-4 w-4" />,
    'call': <Phone className="h-4 w-4" />,
};

const ITEMS_PER_PAGE = 20;

const AlertsLogPageComponent = () => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const { authToken } = useAuthContext();
    const { toast } = useToast();
    const [alertData, setAlertData] = useState<PaginatedAlertLog | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const page = searchParams.get('page') ? parseInt(searchParams.get('page') as string, 10) : 1;
    const searchTerm = searchParams.get('search') || '';
    const filterChannel = searchParams.get('channel') || 'all';

    const fetchHistory = useCallback(async () => {
        if (!authToken) return;
        setIsLoading(true);

        const params: any = { page, limit: ITEMS_PER_PAGE };
        if (searchTerm) {
            if (searchTerm.includes('@')) {
                params.email = searchTerm;
            } else {
                params.phone = searchTerm;
            }
        }
        if (filterChannel !== 'all') {
            params.channel = filterChannel;
        }

        try {
            const history = await getNotificationHistory(params, authToken);
            setAlertData(history);
        } catch (error) {
            toast({
                variant: 'destructive',
                title: 'Failed to fetch history',
                description: error instanceof Error ? error.message : 'Unknown error',
            });
        } finally {
            setIsLoading(false);
        }
    }, [authToken, toast, searchTerm, filterChannel, page]);

    useEffect(() => {
        fetchHistory();
    }, [fetchHistory]);
    
    const handleFilterChange = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value && value !== 'all') {
            params.set(key, value);
        } else {
            params.delete(key);
        }
        params.set('page', '1');
        router.replace(`${pathname}?${params.toString()}`);
    }
    
    const handlePageChange = (newPage: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('page', newPage.toString());
        router.push(`${pathname}?${params.toString()}`);
    };


  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-10">
      <Card>
        <CardHeader>
          <CardTitle>Alerts Log</CardTitle>
          <CardDescription>
            A historical record of all notifications sent to customers.
          </CardDescription>
        </CardHeader>
        <CardContent>
            <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
                <div className="relative w-full md:flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                     <Input 
                        placeholder="Search by phone or email..."
                        defaultValue={searchTerm}
                        onChange={(e) => handleFilterChange('search', e.target.value)}
                        className="pl-10"
                    />
                </div>
                 <Select value={filterChannel} onValueChange={(value) => handleFilterChange('channel', value)}>
                    <SelectTrigger className="w-full md:w-[180px]">
                        <SelectValue placeholder="Filter by Channel" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Channels</SelectItem>
                        <SelectItem value="sms">SMS</SelectItem>
                        <SelectItem value="whatsapp">WhatsApp</SelectItem>
                        <SelectItem value="email">Email</SelectItem>
                        <SelectItem value="call">Call</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <TooltipProvider>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Recipient</TableHead>
                      <TableHead>Channel</TableHead>
                      <TableHead>Message</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Sent By</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                       Array.from({ length: 5 }).map((_, i) => (
                          <TableRow key={i}>
                              <TableCell colSpan={6}><Skeleton className="h-8 w-full" /></TableCell>
                          </TableRow>
                      ))
                    ) : alertData && alertData.alertLogs.length > 0 ? (
                      alertData.alertLogs.map((log) => (
                          <TableRow key={log.id}>
                          <TableCell>
                              <div className="font-medium">{log.customer_phone || log.customer_email}</div>
                          </TableCell>
                          <TableCell>
                              <div className="flex items-center gap-2 capitalize">
                              {channelIcons[log.channel]}
                              <span>{log.channel}</span>
                              </div>
                          </TableCell>
                          <TableCell>
                              <Tooltip>
                                  <TooltipTrigger asChild>
                                  <p className="truncate max-w-xs">{log.message}</p>
                                  </TooltipTrigger>
                                  <TooltipContent side="top" align="start">
                                      <p className="max-w-md p-2">{log.message}</p>
                                  </TooltipContent>
                              </Tooltip>
                          </TableCell>
                          <TableCell>
                              <Badge
                              variant="outline"
                              className={cn('font-semibold', {
                                  'text-green-600 border-green-200 bg-green-50': log.success,
                                  'text-red-600 border-red-200 bg-red-50': !log.success,
                              })}
                              >
                              <div className="flex items-center gap-1">
                                  {log.success ? <CheckCircle2 className="h-3.5 w-3.5" /> : <XCircle className="h-3.5 w-3.5" />}
                                  {log.success ? 'Sent' : 'Failed'}
                              </div>
                              </Badge>
                          </TableCell>
                          <TableCell>{format(parseISO(log.created_at), 'PPP p')}</TableCell>
                          <TableCell>
                              <div className="flex items-center gap-2">
                                  <Avatar className="h-7 w-7">
                                      <AvatarImage src={log.employee.avatar} alt={log.employee.name} />
                                      <AvatarFallback>{log.employee.name.charAt(0)}</AvatarFallback>
                                  </Avatar>
                                  <span className="font-medium">{log.employee.name}</span>
                              </div>
                          </TableCell>
                          </TableRow>
                      ))
                    ) : (
                       <TableRow>
                          <TableCell colSpan={6} className="text-center h-24">No alerts found.</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </TooltipProvider>
        </CardContent>
         {alertData && alertData.pagination && alertData.pagination.totalLogs > 0 && (
          <CardFooter className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
               Showing {(alertData.pagination.currentPage - 1) * ITEMS_PER_PAGE + 1} to {Math.min(alertData.pagination.currentPage * ITEMS_PER_PAGE, alertData.pagination.totalLogs)} of {alertData.pagination.totalLogs} alerts
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(alertData.pagination.currentPage - 1)}
                disabled={alertData.pagination.currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>
               <span className="text-sm font-medium">
                Page {alertData.pagination.currentPage} of {alertData.pagination.totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(alertData.pagination.currentPage + 1)}
                disabled={alertData.pagination.currentPage === alertData.pagination.totalPages}
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

const AlertsLogPage = dynamic(() => Promise.resolve(AlertsLogPageComponent), { ssr: false });

export default AlertsLogPage;

    