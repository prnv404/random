
'use client';

import { fetcher } from '@/lib/api';

type HealthStatus = {
    status: string;
    timestamp: string;
    uptime: number;
    // Add other fields from your detailed health response if needed
};

export const checkHealth = (): Promise<HealthStatus> => {
    return fetcher<HealthStatus>(`/health/detailed`);
};
