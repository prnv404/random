
'use client';

import { fetcher } from '@/lib/api';
import type { PaginatedAlertLog } from '@/lib/types';

type SmsPayload = {
    type: 'sms';
    phone: string;
    message: string;
};

type WhatsAppPayload = {
    type: 'whatsapp';
    phone: string;
    message: string;
    templateId?: string;
};

type EmailPayload = {
    type: 'email';
    email: string;
    subject: string;
    message: string;
    isHtml?: boolean;
};

type NotificationPayload = SmsPayload | WhatsAppPayload | EmailPayload;

export const sendNotification = (payload: NotificationPayload, token: string | null): Promise<any> => {
    return fetcher('/notifications/send', {
        method: 'POST',
        body: payload,
        token,
    });
};


type HistoryParams = {
    phone?: string;
    email?: string;
    channel?: 'sms' | 'whatsapp' | 'email' | 'call';
    page?: number;
    limit?: number;
};


export const getNotificationHistory = async (params: HistoryParams, token: string | null): Promise<PaginatedAlertLog> => {
    const query = new URLSearchParams();
    if(params.phone) query.set('phone', params.phone);
    if(params.email) query.set('email', params.email);
    if(params.channel) query.set('channel', params.channel);
    if(params.page) query.set('page', String(params.page));
    if(params.limit) query.set('limit', String(params.limit));

    // The API response is nested, so we define a type for the full response
    type ApiResponse = {
        data: PaginatedAlertLog['alertLogs'];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        }
    };
    
    const response = await fetcher<ApiResponse>(`/notifications/history?${query.toString()}`, { token });
    
    // Map the nested response to the expected structure
    return {
        alertLogs: response.data,
        pagination: {
            currentPage: response.pagination.page,
            totalPages: response.pagination.totalPages,
            totalLogs: response.pagination.total,
            limit: response.pagination.limit,
        }
    };
};

export const getDeliveryStatus = (messageId: string, channel: string, token: string | null): Promise<any> => {
    return fetcher(`/notifications/status/${messageId}/${channel}`, { token });
};

    
