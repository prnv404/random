
'use client';

import React from 'react';
import { TicketColumn } from './ticket-column';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { useIsMobile } from '@/hooks/use-mobile';
import type { Ticket } from '@/lib/types';

interface TicketBoardProps {
    ticketsByStatus: Record<Ticket['status'], Ticket[]>;
    statusOrder: Ticket['status'][];
    dragOverStatus: Ticket['status'] | null;
    isLoading: boolean;
    handleDragStart: (e: React.DragEvent<HTMLDivElement>, ticketId: string) => void;
    handleDrop: (e: React.DragEvent<HTMLDivElement>, newStatus: Ticket['status']) => void;
    handleDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
    handleDragEnter: (status: Ticket['status']) => void;
    setDragOverStatus: (status: Ticket['status'] | null) => void;
    onStatusChange: (ticketId: string, status: Ticket['status']) => void;
    onAlertClick: (ticket: Ticket) => void;
    onEditClick: (ticket: Ticket) => void;
    servicePortals: Record<string, string>;
}

const statusLabels: Record<Ticket['status'], string> = {
  pending: 'Pending',
  in_progress: 'In Progress',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

export const TicketBoard = ({
    ticketsByStatus,
    statusOrder,
    dragOverStatus,
    isLoading,
    handleDragStart,
    handleDrop,
    handleDragOver,
    handleDragEnter,
    setDragOverStatus,
    onStatusChange,
    onAlertClick,
    onEditClick,
    servicePortals,
}: TicketBoardProps) => {
    const isMobile = useIsMobile();
    const defaultOpen = isMobile ? statusOrder.filter(status => ticketsByStatus[status]?.length > 0) : undefined;
    
    if(isMobile) {
        return (
             <div className="p-4 md:p-10">
                <Accordion type="multiple" defaultValue={defaultOpen} className="w-full space-y-4">
                     {statusOrder.map(status => (
                        <AccordionItem value={status} key={status} className="border-none">
                             <Card className="bg-muted/40">
                                <AccordionTrigger className="p-4 text-lg font-semibold hover:no-underline">
                                    <div className="flex items-center gap-2">
                                        <span>{statusLabels[status]}</span>
                                        <Badge variant="secondary">{ticketsByStatus[status]?.length || 0}</Badge>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="p-0">
                                    <div 
                                        className="flex flex-col h-full rounded-lg transition-colors duration-200"
                                        onDragOver={handleDragOver}
                                        onDrop={(e) => handleDrop(e, status)}
                                        onDragEnter={() => handleDragEnter(status)}
                                        onDragLeave={() => setDragOverStatus(null)}
                                    >
                                        <TicketColumn
                                            isMobileView
                                            status={status}
                                            tickets={ticketsByStatus[status]}
                                            dragOverStatus={dragOverStatus}
                                            isLoading={isLoading}
                                            onDragStart={handleDragStart}
                                            onDrop={handleDrop}
                                            onDragOver={handleDragOver}
                                            onDragEnter={handleDragEnter}
                                            setDragOverStatus={setDragOverStatus}
                                            onStatusChange={onStatusChange}
                                            onAlertClick={onAlertClick}
                                            onEditClick={onEditClick}
                                            servicePortals={servicePortals}
                                        />
                                    </div>
                                </AccordionContent>
                            </Card>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>
        )
    }

    return (
        <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 p-4 md:p-10">
            {statusOrder.map(status => (
                <TicketColumn
                    key={status}
                    status={status}
                    tickets={ticketsByStatus[status]}
                    dragOverStatus={dragOverStatus}
                    isLoading={isLoading}
                    onDragStart={handleDragStart}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragEnter={handleDragEnter}
                    setDragOverStatus={setDragOverStatus}
                    onStatusChange={onStatusChange}
                    onAlertClick={onAlertClick}
                    onEditClick={onEditClick}
                    servicePortals={servicePortals}
                />
            ))}
        </div>
    );
}

// Add Card to imports to use it in mobile view
import { Card } from '@/components/ui/card';

    