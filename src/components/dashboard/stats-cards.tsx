'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { IndianRupee, Users, Briefcase, Activity, TrendingUp, Star, TrendingDown, Minus } from 'lucide-react';
import type { DashboardSummary, ServicePerformance } from '@/lib/types';
import { cn } from '@/lib/utils';

const ChangeIndicator = ({ change, changeType }: { change: string, changeType: 'increase' | 'decrease' | 'no_change' }) => {
    const icon = {
        'increase': <TrendingUp className="h-4 w-4 text-green-600" />,
        'decrease': <TrendingDown className="h-4 w-4 text-red-600" />,
        'no_change': <Minus className="h-4 w-4 text-muted-foreground" />,
    }[changeType];

    const color = {
        'increase': 'text-green-600',
        'decrease': 'text-red-600',
        'no_change': 'text-muted-foreground',
    }[changeType];

    return (
        <p className={cn("text-xs font-semibold flex items-center gap-1", color)}>
            {icon}
            <span>{change}</span>
        </p>
    )
}

interface StatsCardsProps {
    summaryData: DashboardSummary | null;
    isSummaryLoading: boolean;
    servicePerformance: ServicePerformance[];
    isPerformanceLoading: boolean;
}

export const StatsCards = ({ summaryData, isSummaryLoading, servicePerformance, isPerformanceLoading }: StatsCardsProps) => {
    
    const topServiceByRevenue = servicePerformance.length > 0 ? servicePerformance.reduce((prev, current) => (prev.totalRevenue > current.totalRevenue) ? prev : current) : null;
    const topServiceByVolume = servicePerformance.length > 0 ? servicePerformance.reduce((prev, current) => (prev.volume > current.volume) ? prev : current) : null;

    return (
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                    <IndianRupee className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    {isSummaryLoading ? (
                        <Skeleton className="h-10 w-3/4" />
                    ) : (
                        <>
                            <div className="text-2xl font-bold flex items-center">
                                <IndianRupee className="h-6 w-6 mr-1" />
                                {summaryData?.totalRevenue.current.toLocaleString('en-IN') ?? '0'}
                            </div>
                            <ChangeIndicator {...summaryData!.totalRevenue} />
                        </>
                    )}
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    {isSummaryLoading ? (
                        <Skeleton className="h-10 w-3/4" />
                    ) : (
                        <>
                            <div className="text-2xl font-bold">+{summaryData?.totalCustomers.current ?? '0'}</div>
                            <ChangeIndicator {...summaryData!.totalCustomers} />
                        </>
                    )}
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Services Delivered</CardTitle>
                    <Briefcase className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    {isSummaryLoading ? (
                        <Skeleton className="h-10 w-3/4" />
                    ) : (
                        <>
                            <div className="text-2xl font-bold">+{summaryData?.servicesDelivered.current ?? '0'}</div>
                            <ChangeIndicator {...summaryData!.servicesDelivered} />
                        </>
                    )}
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Open Tickets</CardTitle>
                    <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    {isSummaryLoading ? (
                        <Skeleton className="h-10 w-3/4" />
                    ) : (
                        <>
                            <div className="text-2xl font-bold">
                                {summaryData?.openTickets.current ?? '0'}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                {summaryData?.openTickets.pendingApproval ?? '0'} pending approval
                            </p>
                        </>
                    )}
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Top Service (Revenue)</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    {isPerformanceLoading ? <Skeleton className="h-10 w-3/4" /> : (
                        <>
                            <div className="text-xl font-bold">{topServiceByRevenue?.serviceName || 'N/A'}</div>
                            <p className="text-xs text-muted-foreground flex items-center">
                                <IndianRupee className="h-3 w-3 mr-1" />
                                {topServiceByRevenue?.totalRevenue.toLocaleString('en-IN') || '0'} in total
                            </p>
                        </>
                    )}
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Top Service (Volume)</CardTitle>
                    <Star className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    {isPerformanceLoading ? <Skeleton className="h-10 w-3/4" /> : (
                        <>
                            <div className="text-xl font-bold">{topServiceByVolume?.serviceName || 'N/A'}</div>
                            <p className="text-xs text-muted-foreground">
                                {topServiceByVolume?.volume || '0'} times delivered
                            </p>
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};
