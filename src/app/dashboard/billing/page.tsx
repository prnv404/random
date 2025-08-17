
'use client';
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
import { invoices } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { IndianRupee, PlusCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import dynamic from 'next/dynamic';

const BillingPageComponent = () => {
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-10">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Billing & Invoices</CardTitle>
            <CardDescription>
              View and manage all your invoices.
            </CardDescription>
          </div>
          <Button size="sm" className="gap-1">
            <PlusCircle className="h-4 w-4" />
            Generate Invoice
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="hidden md:table-cell text-right">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell className="font-medium">{invoice.id}</TableCell>
                  <TableCell>{invoice.customerName}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={cn('font-semibold', {
                        'text-green-600 border-green-200 bg-green-50': invoice.status === 'Paid',
                        'text-yellow-600 border-yellow-200 bg-yellow-50': invoice.status === 'Pending',
                        'text-red-600 border-red-200 bg-red-50': invoice.status === 'Overdue',
                      })}
                    >
                      {invoice.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end">
                      <IndianRupee className="h-4 w-4 mr-1" />
                      {invoice.amount.toLocaleString('en-IN')}
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-right">
                    {invoice.date}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </main>
  );
};

const BillingPage = dynamic(() => Promise.resolve(BillingPageComponent), { ssr: false });

export default BillingPage;
