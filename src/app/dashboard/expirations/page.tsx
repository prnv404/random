
'use client';
import { useState, useMemo, useEffect, useCallback } from 'react';
import type { Customer, ExpirationItem } from '@/lib/types';
import { getExpirations } from '@/services/customer';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Bell, Phone, ArrowUpRight } from 'lucide-react';
import { format, parseISO, differenceInDays } from 'date-fns';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { SendAlertDialog } from '@/components/send-alert-dialog';
import { useAuthContext } from '@/contexts/auth-context';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

const ExpirationsPageComponent = () => {
    const router = useRouter();
    const { authToken } = useAuthContext();
    const { toast } = useToast();

    const [expirations, setExpirations] = useState<ExpirationItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRange, setFilterRange] = useState('90d');
    
    const [selectedCustomer, setSelectedCustomer] = useState<{name: string, phone: string, docType: string} | null>(null);
    const [isAlertOpen, setIsAlertOpen] = useState(false);

    const fetchExpirations = useCallback(async () => {
        if (!authToken) return;
        setIsLoading(true);
        try {
            const response = await getExpirations({
                range: filterRange,
                search: searchTerm,
            }, authToken);
            setExpirations(response.expirations);
        } catch (error) {
            toast({
                variant: 'destructive',
                title: 'Failed to fetch expirations',
                description: error instanceof Error ? error.message : 'Unknown error',
            });
        } finally {
            setIsLoading(false);
        }
    }, [filterRange, searchTerm, authToken, toast]);

    useEffect(() => {
        const handler = setTimeout(() => {
            fetchExpirations();
        }, 300);
        return () => clearTimeout(handler);
    }, [fetchExpirations]);

    const getExpiryBadge = (daysLeft: number) => {
        if (daysLeft < 0) {
            return <Badge variant="destructive">Expired</Badge>;
        }
        if (daysLeft <= 30) {
            return <Badge className="bg-orange-500 text-white">Expires in {daysLeft} days</Badge>;
        }
        if (daysLeft <= 90) {
            return <Badge className="bg-yellow-500 text-white">Expires in {daysLeft} days</Badge>;
        }
        return <Badge variant="secondary">Expires in {daysLeft} days</Badge>;
    };

    const handleAlertClick = (item: ExpirationItem) => {
        setSelectedCustomer({
            name: item.customer.name,
            phone: item.customer.phone,
            docType: item.document.type,
        });
        setIsAlertOpen(true);
    };

    return (
        <>
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-10">
            <Card>
                <CardHeader>
                    <CardTitle>Document Expirations</CardTitle>
                    <CardDescription>
                        Track and manage upcoming document renewals for your customers.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center gap-4 mb-6">
                        <Input
                            placeholder="Search by customer name..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="max-w-sm"
                        />
                        <Select value={filterRange} onValueChange={setFilterRange}>
                            <SelectTrigger className="w-[220px]">
                                <SelectValue placeholder="Filter by expiry range" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="30d">Expiring in 30 days</SelectItem>
                                <SelectItem value="60d">Expiring in 60 days</SelectItem>
                                <SelectItem value="90d">Expiring in 90 days</SelectItem>
                                <SelectItem value="365d">Expiring in 1 year</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Customer</TableHead>
                                <TableHead>Document Type</TableHead>
                                <TableHead>Expires On</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <TableRow key={i}>
                                        <TableCell colSpan={5}><Skeleton className="h-8 w-full" /></TableCell>
                                    </TableRow>
                                ))
                            ) : expirations && expirations.length > 0 ? (
                                expirations.map((item) => (
                                    <TableRow key={`${item.customer.id}-${item.document.number}`}>
                                        <TableCell>
                                            <div className="font-medium">{item.customer.name}</div>
                                        </TableCell>
                                        <TableCell>{item.document.type}</TableCell>
                                        <TableCell>{format(parseISO(item.expiryDate), 'PPP')}</TableCell>
                                        <TableCell>{getExpiryBadge(item.daysLeft)}</TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="icon" onClick={() => handleAlertClick(item)}>
                                                <Bell className="h-4 w-4" />
                                                <span className="sr-only">Send Alert</span>
                                            </Button>
                                            <Button variant="ghost" size="icon" asChild>
                                                <Link href={`/dashboard/customers/${item.customer.id}`}>
                                                    <ArrowUpRight className="h-4 w-4" />
                                                    <span className="sr-only">View Customer</span>
                                                </Link>
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center h-24">
                                        No documents expiring in the selected range.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </main>
        {selectedCustomer && (
            <SendAlertDialog 
                isOpen={isAlertOpen}
                setIsOpen={setIsAlertOpen}
                customerName={selectedCustomer.name}
                customerPhone={selectedCustomer.phone}
                defaultMessage={`Reminder: Your ${selectedCustomer.docType} is expiring soon. Please visit our center for renewal.`}
            />
        )}
        </>
    );
};

const ExpirationsPage = dynamic(() => Promise.resolve(ExpirationsPageComponent), { ssr: false });

export default ExpirationsPage;
