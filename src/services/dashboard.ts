
'use client';

import { fetcher } from '@/lib/api';
import type { DashboardSummary, ChartApiResponse, PerformanceData } from '@/lib/types';

type Period = 'daily' | 'weekly' | 'monthly' | 'all_time';

export const getDashboardSummary = (period: Period, token: string | null): Promise<DashboardSummary> => {
  const params = new URLSearchParams({
    period,
    compare: 'true',
  });
  return fetcher<DashboardSummary>(`/dashboard/summary?${params.toString()}`, { token });
};

export const getChartData = (name: 'weeklyRevenue' | 'monthlyRevenue', token: string | null): Promise<ChartApiResponse> => {
    const params = new URLSearchParams({ name });
    return fetcher<ChartApiResponse>(`/dashboard/charts?${params.toString()}`, { token });
}

export const getPerformanceData = (period: Period, token: string | null): Promise<PerformanceData> => {
    const params = new URLSearchParams({ period });
    return fetcher<PerformanceData>(`/dashboard/performance?${params.toString()}`, { token });
}
