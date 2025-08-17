
'use client';

import { fetcher } from '@/lib/api';
import type { CallLog, PaginatedCallLog } from '@/lib/types';

type ListCallsParams = {
    search?: string;
    callType?: 'incoming' | 'outgoing' | 'missed';
    status?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
};

export const listCalls = (params: ListCallsParams, token: string | null): Promise<PaginatedCallLog> => {
    const query = new URLSearchParams();
    if (params.search) query.set('search', params.search);
    if (params.callType) query.set('callType', params.callType);
    if (params.status) query.set('status', params.status);
    if (params.startDate) query.set('startDate', params.startDate);
    if (params.endDate) query.set('endDate', params.endDate);
    if (params.page) query.set('page', params.page.toString());
    if (params.limit) query.set('limit', params.limit.toString());

    return fetcher<PaginatedCallLog>(`/calls?${query.toString()}`, { token });
};

type CreateCallPayload = {
    customerPhone: string;
    customerId?: string;
};

export const createCall = (data: CreateCallPayload, token: string | null): Promise<CallLog> => {
    return fetcher<CallLog>('/calls', {
        method: 'POST',
        body: data,
        token,
    });
};

export const getCall = (callId: string, token: string | null): Promise<CallLog> => {
    return fetcher<CallLog>(`/calls/${callId}`, { token });
};
