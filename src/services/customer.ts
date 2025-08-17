
'use client';

import { fetcher } from '@/lib/api';
import type { Customer, CustomerDocument, ExpirationsResponse, PaginatedCustomers } from '@/lib/types';

type ListCustomersParams = {
    search?: string;
    date?: string;
    page?: number;
    limit?: number;
};

export const listCustomers = (params: ListCustomersParams, token: string | null): Promise<PaginatedCustomers> => {
    const query = new URLSearchParams();
    if (params.search) query.set('search', params.search);
    if (params.date) query.set('date', params.date);
    if (params.page) query.set('page', params.page.toString());
    if (params.limit) query.set('limit', params.limit.toString());
    return fetcher<PaginatedCustomers>(`/customers?${query.toString()}`, { token });
};

type CreateCustomerPayload = {
    name: string;
    email: string;
    phone: string;
};

export const createCustomer = (data: CreateCustomerPayload, token: string | null): Promise<Customer> => {
    return fetcher<Customer>('/customers', {
        method: 'POST',
        body: data,
        token,
    });
};

export const getCustomer = (customerId: string, token: string | null): Promise<Customer> => {
    return fetcher<Customer>(`/customers/${customerId}`, { token });
};

type AddDocumentPayload = {
    docType: string;
    docNumber: string;
    issueDate: string;
    expiryDate: string;
};

export const addDocument = (customerId: string, data: AddDocumentPayload, token: string | null): Promise<CustomerDocument> => {
    return fetcher<CustomerDocument>(`/customers/${customerId}/documents`, {
        method: 'POST',
        body: data,
        token,
    });
};

export const deleteDocument = (customerId: string, documentId: string, token: string | null): Promise<void> => {
    return fetcher<void>(`/customers/${customerId}/documents/${documentId}`, {
        method: 'DELETE',
        token,
    });
};

export const updateCustomerMetadata = (customerId: string, metadata: any, token: string | null): Promise<Customer> => {
    return fetcher<Customer>(`/customers/${customerId}/metadata`, {
        method: 'PATCH',
        body: metadata,
        token,
    });
};

type GetExpirationsParams = {
    range?: string;
    search?: string;
    sort?: 'asc' | 'desc';
};

export const getExpirations = (params: GetExpirationsParams, token: string | null): Promise<ExpirationsResponse> => {
    const query = new URLSearchParams();
    if (params.range) query.set('range', params.range.replace('d', ''));
    if (params.search) query.set('search', params.search);
    if (params.sort) query.set('sort', params.sort);
    return fetcher<ExpirationsResponse>(`/customers/expirations?${query.toString()}`, { token });
};
