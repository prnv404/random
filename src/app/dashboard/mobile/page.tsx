
'use client';
import { useState, useEffect, useCallback, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { useAuthContext } from '@/contexts/auth-context';
import { useToast } from '@/hooks/use-toast';
import { getDashboardSummary, getPerformanceData } from '@/services/dashboard';
import type { DashboardSummary, ServicePerformance, EmployeePerformance, DashboardMetric } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { mockFeedback } from '@/components/dashboard/feedback-analytics';
import { cn } from '@/lib/utils';
import { 
    IndianRupee, 
    Users, 
    Briefcase, 
    Activity, 
    TrendingUp, 
    TrendingDown, 
    Minus,
    Award,
    Star
} from 'lucide-react';

const ChangeIndicator = ({ change, changeType }: { change: string; changeType: 'increase' | 'decrease' | 'no_change' }) => {
    const icon = {
        'increase': <TrendingUp className="h-4 w-4 text-green-500" />,
        'decrease': <TrendingDown className="h-4 w-4 text-red-500" />,
        'no_change': <Minus className="h-4 w-4 text-muted-foreground" />,
    }[changeType];

    const color = {
        'increase': 'text-green-500',
        'decrease': 'text-red-500',
        'no_change': 'text-muted-foreground',
    }[changeType];

    return (
        <p className={cn("text-xs font-semibold flex items-center gap-1", color)}>
            {icon}
            <span>{change}</span>
        </p>
    );
};

const StatCard = ({ title, metric, icon, isLoading }: { title: string, metric: DashboardMetric | undefined, icon: React.ReactNode, isLoading: boolean }) => (
    <Card className="flex-1">
        <CardHeader className="p-3 pb-0">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
                <span>{title}</span>
                {icon}
            </CardTitle>
        </CardHeader>
        <CardContent className="p-3">
            {isLoading ? (
                <Skeleton className="h-8 w-3/4" />
            ) : (
                <>
                    <p className="text-2xl font-bold">{metric?.current.toLocaleString('en-IN')}</p>
                    <ChangeIndicator {...metric!} />
                </>
            )}
        </CardContent>
    </Card>
);

const MobileDashboardComponent = () => {
    const [summaryData, setSummaryData] = useState<DashboardSummary | null>(null);
    const [servicePerformance, setServicePerformance] = useState<ServicePerformance[]>([]);
    const [employeePerformance, setEmployeePerformance] = useState<EmployeePerformance[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [period, setPeriod] = useState<'daily' | 'weekly' | 'monthly'>('daily');

    const { toast } = useToast();
    const { authToken } = useAuthContext();

    const fetchDashboardData = useCallback(async () => {
        if (!authToken) return;
        setIsLoading(true);

        try {
            const [summary, performance] = await Promise.all([
                getDashboardSummary(period, authToken),
                getPerformanceData(period, authToken),
            ]);

            setSummaryData(summary);
            setServicePerformance(performance.servicePerformance);
            setEmployeePerformance(performance.employeePerformance);
        } catch (error) {
            console.error(error);
            toast({
                variant: 'destructive',
                title: 'Error Refreshing Data',
                description: 'Could not fetch the latest dashboard data.',
            });
        } finally {
            setIsLoading(false);
        }
    }, [authToken, period, toast]);

    useEffect(() => {
        fetchDashboardData();
    }, [fetchDashboardData]);

    const feedbackSummary = useMemo(() => {
        const totalReviews = mockFeedback.length;
        if (totalReviews === 0) return { averageRating: 0, totalReviews: 0 };
        const totalRating = mockFeedback.reduce((acc, fb) => acc + fb.rating, 0);
        const averageRating = parseFloat((totalRating / totalReviews).toFixed(1));
        return { averageRating, totalReviews };
    }, []);

    return (
        <main className="p-4 space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
                <Tabs defaultValue={period} onValueChange={(value) => setPeriod(value as any)} className="w-full sm:w-auto">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="daily">Daily</TabsTrigger>
                        <TabsTrigger value="weekly">Weekly</TabsTrigger>
                        <TabsTrigger value="monthly">Monthly</TabsTrigger>
                    </TabsList>
                </Tabs>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Key Metrics</CardTitle>
                    <CardDescription>A snapshot of today's activity.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex gap-4">
                        <StatCard title="Revenue" metric={summaryData?.totalRevenue} icon={<IndianRupee className="h-4 w-4" />} isLoading={isLoading} />
                        <StatCard title="Customers" metric={summaryData?.totalCustomers} icon={<Users className="h-4 w-4" />} isLoading={isLoading} />
                    </div>
                    <div className="flex gap-4">
                        <StatCard title="Services" metric={summaryData?.servicesDelivered} icon={<Briefcase className="h-4 w-4" />} isLoading={isLoading} />
                        <Card className="flex-1">
                            <CardHeader className="p-3 pb-0">
                                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
                                    <span>Open Tickets</span>
                                    <Activity className="h-4 w-4" />
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-3">
                                {isLoading ? <Skeleton className="h-8 w-3/4" /> : <p className="text-2xl font-bold">{summaryData?.openTickets.current}</p>}
                            </CardContent>
                        </Card>
                    </div>
                </CardContent>
            </Card>
            
            <Card>
                <CardHeader>
                    <CardTitle>Employee Performance</CardTitle>
                </CardHeader>
                <CardContent>
                    <ScrollArea className="h-[250px]">
                        <div className="space-y-4">
                            {isLoading ? Array.from({length: 3}).map((_,i) => <Skeleton key={i} className="h-12 w-full" />) :
                            employeePerformance.map((emp, index) => (
                                <div key={emp.employeeId} className="flex items-center gap-4">
                                    {index === 0 ? <Award className="h-6 w-6 text-yellow-500" /> : <span className="text-sm font-bold w-6 text-center">{index + 1}</span>}
                                    <Avatar>
                                        <AvatarImage src={emp.avatarUrl} />
                                        <AvatarFallback>{emp.employeeName.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1">
                                        <p className="font-semibold">{emp.employeeName}</p>
                                        <p className="text-xs text-muted-foreground">{emp.servicesCompleted} services completed</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold flex items-center"><IndianRupee className="h-3 w-3" />{emp.revenueGenerated.toLocaleString('en-IN')}</p>
                                        <p className="text-xs text-muted-foreground">Revenue</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Service Performance</CardTitle>
                </CardHeader>
                <CardContent>
                    <ScrollArea className="h-[250px]">
                            <div className="space-y-4">
                                {isLoading ? Array.from({length: 3}).map((_,i) => <Skeleton key={i} className="h-12 w-full" />) :
                                servicePerformance.map(service => (
                                    <div key={service.serviceName} className="flex items-center gap-4">
                                    <div className="flex-1">
                                        <p className="font-semibold">{service.serviceName}</p>
                                        <p className="text-xs text-muted-foreground">{service.volume} times delivered</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold flex items-center"><IndianRupee className="h-3 w-3" />{service.totalRevenue.toLocaleString('en-IN')}</p>
                                        <p className="text-xs text-muted-foreground">Total Revenue</p>
                                    </div>
                                </div>
                                ))}
                            </div>
                    </ScrollArea>
                </CardContent>
            </Card>
            
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>Customer Feedback</CardTitle>
                        <CardDescription>Latest reviews from customers.</CardDescription>
                    </div>
                    <div className="text-right">
                        <div className="flex items-baseline gap-1">
                            <p className="text-2xl font-bold">{feedbackSummary.averageRating}</p>
                            <p className="text-sm text-muted-foreground">/ 5</p>
                        </div>
                        <p className="text-xs text-muted-foreground">{feedbackSummary.totalReviews} reviews</p>
                    </div>
                </CardHeader>
                <CardContent>
                    <ScrollArea className="h-[400px]">
                        {mockFeedback.map(fb => (
                            <div key={fb.id} className="p-3 border-b last:border-0">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                            <Avatar className="h-8 w-8">
                                            <AvatarImage src={fb.customerAvatar} />
                                            <AvatarFallback>{fb.customerName.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="text-sm font-semibold">{fb.customerName}</p>
                                                <p className="text-xs text-muted-foreground">{fb.serviceName}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-0.5">
                                        {Array.from({ length: 5 }).map((_, i) => (
                                            <Star key={i} className={cn("h-4 w-4", i < fb.rating ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground/30')} />
                                        ))}
                                    </div>
                                </div>
                                <p className="text-sm text-muted-foreground italic">"{fb.comment}"</p>
                            </div>
                        ))}
                    </ScrollArea>
                </CardContent>
            </Card>
        </main>
    );
};

const MobileDashboardPage = dynamic(() => Promise.resolve(MobileDashboardComponent), { ssr: false });

export default MobileDashboardPage;
