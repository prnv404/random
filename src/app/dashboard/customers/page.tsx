
'use client';
import { useState, useMemo, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { format, parseISO } from 'date-fns';
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
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { ArrowUpRight, ChevronLeft, ChevronRight, Calendar as CalendarIcon, X, PlusCircle } from 'lucide-react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useAuthContext } from '@/contexts/auth-context';
import { Skeleton } from '@/components/ui/skeleton';
import type { Customer, PaginatedCustomers } from '@/lib/types';
import { listCustomers, createCustomer } from '@/services/customer';

const ITEMS_PER_PAGE = 10;

const CustomersPageComponent = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { authToken } = useAuthContext();
  const { toast } = useToast();

  const [customerData, setCustomerData] = useState<PaginatedCustomers | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const page = searchParams.get('page') ? parseInt(searchParams.get('page') as string, 10) : 1;
  const searchTerm = searchParams.get('search') || '';
  const joinDate = searchParams.get('date');

  const fetchCustomers = useCallback(async () => {
    if (!authToken) return;
    setIsLoading(true);
    try {
        const data = await listCustomers({
        page,
        limit: ITEMS_PER_PAGE,
        search: searchTerm,
        date: joinDate || undefined,
        }, authToken);
        setCustomerData(data);
    } catch (error) {
        toast({
        variant: 'destructive',
        title: 'Failed to fetch customers',
        description: error instanceof Error ? error.message : 'Unknown error',
        });
        setCustomerData(null);
    } finally {
        setIsLoading(false);
    }
  }, [page, searchTerm, joinDate, authToken, toast]);
  
  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const handleFilterChange = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== 'all') {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.set('page', '1'); // Reset to first page on filter change
    router.replace(`${pathname}?${params.toString()}`);
  };

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', newPage.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  const clearFilters = () => {
    router.replace(pathname);
  };

  const handleCreateCustomer = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const newCustomerPayload = {
      name: formData.get('name') as string,
      phone: formData.get('phone') as string,
      email: null,
    };
    try {
      await createCustomer(newCustomerPayload, authToken);
      toast({
        title: 'Customer Created',
        description: `${newCustomerPayload.name} has been added successfully.`,
      });
      setIsDialogOpen(false);
      // Refetch customers on the current page
      fetchCustomers();
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Failed to create customer',
        description: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  };

  const hasFilters = searchTerm || joinDate;

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-10">
      <Card>
        <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <CardTitle>Customers</CardTitle>
            <CardDescription>
              Manage your customers and view their service history.
            </CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-1 w-full md:w-auto">
                <PlusCircle className="h-4 w-4" />
                Create Customer
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Customer</DialogTitle>
                <DialogDescription>
                  Fill in the details below to add a new customer.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreateCustomer} className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">
                    Name
                  </Label>
                  <Input id="name" name="name" placeholder="Customer's Name" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">
                    Phone
                  </Label>
                  <Input id="phone" name="phone" placeholder="Customer's Phone" required/>
                </div>
                 <DialogFooter>
                    <Button type="submit">Create Customer</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <div className="flex flex-col md:flex-row items-center gap-4 border-b px-6 pb-4">
            <Input
                placeholder="Search by name, email..."
                defaultValue={searchTerm}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="w-full md:max-w-sm"
            />
            <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={'outline'}
                className={cn(
                  'w-full md:w-auto justify-start text-left font-normal',
                  !joinDate && 'text-muted-foreground'
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {joinDate ? format(joinDate, 'PPP') : <span>Filter by join date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={joinDate ? new Date(joinDate) : undefined}
                onSelect={(date) => handleFilterChange('date', date ? format(date, 'yyyy-MM-dd') : null)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          {hasFilters && (
            <Button variant="ghost" onClick={clearFilters} className="text-muted-foreground">
                <X className="mr-2 h-4 w-4" />
                Clear Filters
            </Button>
            )}
        </div>
        <CardContent className="pt-6">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead className="hidden sm:table-cell">Phone Number</TableHead>
                  <TableHead className="hidden md:table-cell">Join Date</TableHead>
                  <TableHead className="hidden lg:table-cell">Last Visit</TableHead>
                  <TableHead>
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell colSpan={5}><Skeleton className="h-8 w-full" /></TableCell>
                    </TableRow>
                  ))
                ) : customerData && customerData.customers.length > 0 ? (
                  customerData.customers.map((customer) => (
                    <TableRow key={customer.id}>
                      <TableCell>
                        <div className="font-medium">{customer.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {customer.email || customer.phone}
                        </div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">{customer.phone}</TableCell>
                      <TableCell className="hidden md:table-cell">{customer.joinDate ? format(parseISO(customer.joinDate), 'PPP') : 'N/A'}</TableCell>
                      <TableCell className="hidden lg:table-cell">{customer.lastVisit ? format(parseISO(customer.lastVisit), 'PPP') : 'N/A'}</TableCell>
                      <TableCell>
                        <div className="flex justify-end">
                          <Button asChild variant="ghost" size="icon">
                            <Link href={`/dashboard/customers/${customer.id}`}>
                              <ArrowUpRight className="h-4 w-4" />
                              <span className="sr-only">View customer</span>
                            </Link>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center h-24">No customers found.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        {customerData && customerData.pagination && customerData.pagination.totalCustomers > 0 && (
          <CardFooter className="flex items-center justify-between flex-wrap gap-y-4">
            <div className="text-sm text-muted-foreground">
              Showing {(customerData.pagination.currentPage - 1) * ITEMS_PER_PAGE + 1} to {Math.min(customerData.pagination.currentPage * ITEMS_PER_PAGE, customerData.pagination.totalCustomers)} of {customerData.pagination.totalCustomers} customers
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(customerData.pagination.currentPage - 1)}
                disabled={customerData.pagination.currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>
              <span className="text-sm font-medium">
                Page {customerData.pagination.currentPage} of {customerData.pagination.totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(customerData.pagination.currentPage + 1)}
                disabled={customerData.pagination.currentPage === customerData.pagination.totalPages}
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

const CustomersPage = dynamic(() => Promise.resolve(CustomersPageComponent), { ssr: false });

export default CustomersPage;
