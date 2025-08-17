
'use client';

import { fetcher } from '@/lib/api';
import type { Service } from '@/lib/types';

// The API response for list is nested, so we define a type for the full response
type ListServicesApiResponse = {
    services: Service[];
};


export const listServices = async (token: string | null): Promise<Service[]> => {
    // The response is { data: { services: [...] } }, and fetcher returns the `data` object.
    const response = await fetcher<ListServicesApiResponse>(`/services`, { token });
    return response.services || [];
};


type CreateServicePayload = {
    name: string;
    url: string;
    amount?: number;
    meta_data?: any;
};

// The API response is nested, so we define a type for the full response
type CreateServiceApiResponse = {
    success: boolean;
    message: string;
    service: Service;
};

export const createService = (data: CreateServicePayload, token: string | null): Promise<CreateServiceApiResponse> => {
    return fetcher(`/services`, {
        method: 'POST',
        body: data,
        token,
    });
};

type UpdateServicePayload = Partial<CreateServicePayload>;

export const updateService = (serviceId: string, data: UpdateServicePayload, token: string | null): Promise<Service> => {
    return fetcher(`/services/${serviceId}`, {
        method: 'PATCH',
        body: data,
        token,
    });
};

export const deleteService = (serviceId: string, token: string | null): Promise<void> => {
    return fetcher(`/services/${serviceId}`, {
        method: 'DELETE',
        token,
    });
};
