
'use client';

import { fetcher } from '@/lib/api';
import type { Ticket } from '@/lib/types';

type ListTicketsParams = {
    search?: string;
    employeeId?: string;
    serviceType?: string;
    createdAt?: string;
};

export const listTickets = async (params: ListTicketsParams, token: string | null): Promise<Ticket[]> => {
    const query = new URLSearchParams();
    if (params.search) query.set('search', params.search);
    if (params.employeeId) query.set('employeeId', params.employeeId);
    if (params.serviceType) query.set('serviceType', params.serviceType);
    if (params.createdAt) query.set('createdAt', params.createdAt);
    
    const tickets = await fetcher<Ticket[]>(`/tickets?${query.toString()}`, { token });

    // Normalize status to lowercase to match frontend enums
    return tickets.map(ticket => ({
        ...ticket,
        status: ticket.status.toLowerCase() as Ticket['status']
    }));
};

type CreateTicketPayload = {
    customerName: string;
    customerPhone: string;
    serviceType: string;
    amount?: number;
    userId: string;
};


export const createTicket = async (data: CreateTicketPayload, token: string | null): Promise<Ticket> => {
    const response = await fetcher<Ticket>('/tickets', {
        method: 'POST',
        body: data,
        token,
    });
    return response;
};

type UpdateTicketPayload = Partial<Omit<Ticket, 'id' | 'createdAt' | 'updatedAt' | 'status'>>;

export const updateTicket = async (ticketId: string, data: UpdateTicketPayload, token: string | null): Promise<Ticket> => {
    const response = await fetcher<Ticket>(`/tickets/${ticketId}`, {
        method: 'PATCH',
        body: data,
        token,
    });
    return response;
};

type UpdateTicketStatusPayload = {
    status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
    amount?: number;
};

export const updateTicketStatus = async (ticketId: string, data: UpdateTicketStatusPayload, token: string | null): Promise<Ticket> => {
    const response = await fetcher<Ticket>(`/tickets/${ticketId}/status`, {
        method: 'PUT',
        body: data,
        token,
    });
    return response;
};
