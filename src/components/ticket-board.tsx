
'use client';

import React from 'react';
import { TicketColumn } from './ticket-column';
import type { Ticket, Service } from '@/lib/types';

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
    return (
        <div className="grid flex-1 gap-4 md:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 p-4 md:p-10">
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
