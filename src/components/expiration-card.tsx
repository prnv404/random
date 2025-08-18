
'use client';

import type { ExpirationItem } from '@/lib/types';
import { Card, CardContent, CardFooter, CardHeader } from './ui/card';
import { Button } from './ui/button';
import Link from 'next/link';
import { format, parseISO } from 'date-fns';
import { Bell, ArrowUpRight } from 'lucide-react';

interface ExpirationCardProps {
    item: ExpirationItem;
    getExpiryBadge: (daysLeft: number) => React.ReactNode;
    onAlertClick: (item: ExpirationItem) => void;
}

export const ExpirationCard = ({ item, getExpiryBadge, onAlertClick }: ExpirationCardProps) => {
    return (
        <Card>
            <CardHeader className="p-4 pb-2">
                 <div>
                    <p className="font-semibold">{item.customer.name}</p>
                    <p className="text-sm text-muted-foreground">{item.document.type}</p>
                </div>
            </CardHeader>
            <CardContent className="p-4 pt-2 space-y-3">
                 <div className="text-xs text-muted-foreground space-y-2">
                    <div className="flex justify-between items-center">
                        <span>Expires On:</span>
                        <span className="font-medium text-foreground">{format(parseISO(item.expiryDate), 'PPP')}</span>
                    </div>
                     <div className="flex justify-between items-center">
                        <span>Status:</span>
                        {getExpiryBadge(item.daysLeft)}
                    </div>
                 </div>
            </CardContent>
            <CardFooter className="p-4 pt-0 border-t flex gap-2">
                <Button variant="outline" size="sm" className="w-full" onClick={() => onAlertClick(item)}>
                    <Bell className="mr-2 h-4 w-4" />
                    Send Alert
                </Button>
                <Button variant="outline" size="sm" className="w-full" asChild>
                    <Link href={`/dashboard/customers/${item.customer.id}`}>
                         <ArrowUpRight className="mr-2 h-4 w-4" />
                        View Customer
                    </Link>
                </Button>
            </CardFooter>
        </Card>
    );
};
