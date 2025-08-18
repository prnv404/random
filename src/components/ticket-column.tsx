
'use client';

import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { TicketCard } from '@/components/ticket-card';
import { cn } from '@/lib/utils';
import type { Ticket } from '@/lib/types';

const statusConfig: Record<Ticket['status'], { label: string }> = {
    'pending': { label: 'Pending' },
    'in_progress': { label: 'In Progress' },
    'completed': { label: 'Completed' },
    'cancelled': { label: 'Cancelled' },
};

interface TicketColumnProps {
    status: Ticket['status'];
    tickets: Ticket[];
    dragOverStatus: Ticket['status'] | null;
    isLoading: boolean;
    onDragStart: (e: React.DragEvent<HTMLDivElement>, ticketId: string) => void;
    onDrop: (e: React.DragEvent<HTMLDivElement>, newStatus: Ticket['status']) => void;
    onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
    onDragEnter: (status: Ticket['status']) => void;
    setDragOverStatus: (status: Ticket['status'] | null) => void;
    onStatusChange: (ticketId: string, status: Ticket['status']) => void;
    onAlertClick: (ticket: Ticket) => void;
    onEditClick: (ticket: Ticket) => void;
    servicePortals: Record<string, string>;
    isMobileView?: boolean;
}

export const TicketColumn = ({
    status,
    tickets,
    dragOverStatus,
    isLoading,
    onDragStart,
    onDrop,
    onDragOver,
    onDragEnter,
    setDragOverStatus,
    onStatusChange,
    onAlertClick,
    onEditClick,
    servicePortals,
    isMobileView = false
}: TicketColumnProps) => {

    const TicketList = () => (
         <>
            {isLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-48 w-full mb-4" />
                ))
            ) : tickets && tickets.length > 0 ? (
                tickets.map(ticket => (
                    <TicketCard 
                        key={ticket.id} 
                        ticket={ticket} 
                        onStatusChange={onStatusChange} 
                        onDragStart={onDragStart}
                        onAlertClick={onAlertClick}
                        onEditClick={onEditClick}
                        servicePortals={servicePortals}
                    />
                ))
            ) : (
                <div className="flex items-center justify-center h-full text-sm text-muted-foreground p-4">
                    <Card className="w-full border-dashed">
                        <CardContent className="p-6 text-center">
                            No tickets in this stage.
                        </CardContent>
                    </Card>
                </div>
            )}
        </>
    )

    if (isMobileView) {
        return (
            <div className="p-3 pt-0">
                <TicketList />
            </div>
        )
    }


    return (
        <div 
            className={cn("flex flex-col h-full bg-muted/40 rounded-lg p-1 transition-colors duration-200", {
                "bg-primary/10": dragOverStatus === status
            })}
            onDragOver={onDragOver}
            onDrop={(e) => onDrop(e, status)}
            onDragEnter={() => onDragEnter(status)}
            onDragLeave={() => setDragOverStatus(null)}
        >
            <div className="p-3">
                <h2 className="font-semibold text-lg capitalize">{statusConfig[status].label}</h2>
            </div>
            <ScrollArea className="flex-1 -mr-1 pr-1">
                <div className="p-3 pt-0">
                   <TicketList />
                </div>
            </ScrollArea>
        </div>
    );
}
