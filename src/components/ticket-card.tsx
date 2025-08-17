
'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { IndianRupee, Pencil, ExternalLink, Bell, Phone } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Ticket } from '@/lib/types';

const allStatuses: Ticket['status'][] = ['pending', 'in_progress', 'completed', 'cancelled'];

export const TicketCard = ({ ticket, onStatusChange, onDragStart, onAlertClick, onEditClick, servicePortals }: { ticket: Ticket, onStatusChange: (ticketId: string, status: Ticket['status']) => void, onDragStart: (e: React.DragEvent<HTMLDivElement>, ticketId: string) => void, onAlertClick: (ticket: Ticket) => void, onEditClick: (ticket: Ticket) => void, servicePortals: Record<string, string> }) => {
    const router = useRouter();
    const portalUrl = servicePortals[ticket.serviceType];

    const handleCallClick = () => {
        router.push(`/dashboard/calls?phone=${ticket.customerPhone}`);
    };
    
    const handlePortalClick = () => {
        if (portalUrl) {
            window.open(portalUrl, '_blank', 'noopener,noreferrer');
            if (ticket.status === 'pending') {
                onStatusChange(ticket.id, 'in_progress');
            }
        }
    }

    return (
        <Card 
            draggable
            onDragStart={(e) => onDragStart(e, ticket.id)}
            className="flex flex-col mb-2 cursor-grab active:cursor-grabbing"
        >
            <CardHeader className="p-2 pb-1">
                <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => onEditClick(ticket)}>
                            <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
                        </Button>
                        <div>
                            <CardTitle className="text-sm font-semibold">{ticket.serviceType}</CardTitle>
                            <CardDescription className="text-xs">ID: {ticket.id}</CardDescription>
                        </div>
                    </div>
                <Select 
                    value={ticket.status}
                    onValueChange={(value) => onStatusChange(ticket.id, value as Ticket['status'])}
                    >
                    <SelectTrigger className={cn("w-auto h-auto text-xs px-2 py-0.5 border-dashed capitalize", {
                            'border-yellow-500 text-yellow-600': ticket.status === 'pending',
                            'border-blue-500 text-blue-600': ticket.status === 'in_progress',
                            'border-green-500 text-green-600': ticket.status === 'completed',
                            'border-red-500 text-red-600': ticket.status === 'cancelled',
                        })}>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        {allStatuses.map((status) => (
                            <SelectItem key={status} value={status} className="capitalize">
                                {status.replace('_', ' ')}
                            </SelectItem>
                        ))}
                    </SelectContent>
                    </Select>
                </div>
            </CardHeader>
            <CardContent className="flex-grow space-y-2 p-2 pt-1">
                <div className="text-xs space-y-1.5">
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Customer:</span>
                        <span className="font-medium">{ticket.customerName}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Phone:</span>
                        <span className="font-medium">{ticket.customerPhone}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Handled By:</span>
                        <div className="flex items-center gap-2 font-medium">
                            <Avatar className="h-5 w-5">
                                <AvatarImage src={ticket.employeeAvatar} alt={ticket.employeeName} />
                                <AvatarFallback>{ticket.employeeName?.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span>{ticket.employeeName}</span>
                        </div>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Service Fee:</span>
                        {ticket.amount > 0 ? (
                            <div className="flex items-center font-medium">
                                <IndianRupee className="h-3 w-3 mr-1" />
                                {ticket.amount.toLocaleString('en-IN')}
                            </div>
                        ): (
                            <Badge variant="secondary">TBD</Badge>
                        )}
                    </div>
                </div>
            </CardContent>
            <CardFooter className="flex-col items-start gap-1 p-2 pt-0">
                <div className="text-xs text-muted-foreground w-full pt-1">
                    Created: {format(new Date(ticket.createdAt), 'PP')}
                </div>
                <Separator />
                <div className="w-full pt-1">
                    <div className="flex gap-2">
                         {portalUrl && (
                            <Button variant="outline" size="sm" className="w-full gap-1.5 h-6 text-xs" onClick={handlePortalClick}>
                                <ExternalLink className="h-3 w-3" /> Portal
                            </Button>
                         )}
                        <Button variant="outline" size="sm" className="w-full gap-1.5 h-6 text-xs" onClick={() => onAlertClick(ticket)}>
                            <Bell className="h-3 w-3" /> Alert
                        </Button>
                        <Button variant="outline" size="sm" className="w-full gap-1.5 h-6 text-xs" onClick={handleCallClick}>
                            <Phone className="h-3 w-3" /> Call
                        </Button>
                    </div>
                </div>
            </CardFooter>
        </Card>
    );
}
