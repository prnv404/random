
'use client';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, PieChart, Pie, Cell } from 'recharts';
import dynamic from 'next/dynamic';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';
import { Button } from '@/components/ui/button';
import { useState, useEffect, useCallback } from 'react';
import { getPerformanceReport } from '../actions';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { getDashboardSummary, getChartData, getPerformanceData } from '@/services/dashboard';
import type { DashboardSummary, ChartApiResponse, ChartDataPoint, ServicePerformance, EmployeePerformance } from '@/lib/types';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuthContext } from '@/contexts/auth-context';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { IndianRupee, Star, Wand2 } from 'lucide-react';
import { StatsCards } from '@/components/dashboard/stats-cards';
import { PerformanceTables } from '@/components/dashboard/performance-tables';
import { FeedbackAnalytics } from '@/components/dashboard/feedback-analytics';
import { Badge } from '@/components/ui/badge';
import { useIsMobile } from '@/hooks/use-mobile';
import { useRouter } from 'next/navigation';


const DashboardComponent =  () => {
  const [report, setReport] = useState<string | null>(null);
  const [isLoadingReport, setIsLoadingReport] = useState(false);
  const [summaryData, setSummaryData] = useState<DashboardSummary | null>(null);
  const [isSummaryLoading, setIsSummaryLoading] = useState(true);
  const [period, setPeriod] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [chartConfig, setChartConfig] = useState<ChartConfig>({});
  const [isChartLoading, setIsChartLoading] = useState(true);
  const [servicePerformance, setServicePerformance] = useState<ServicePerformance[]>([]);
  const [employeePerformance, setEmployeePerformance] = useState<EmployeePerformance[]>([]);
  const [isPerformanceLoading, setIsPerformanceLoading] = useState(true);


  const { toast } = useToast();
  const { authToken } = useAuthContext();
  const isMobile = useIsMobile();
  const router = useRouter();
  
  useEffect(() => {
    if (isMobile === true) {
      router.replace('/dashboard/mobile');
    }
  }, [isMobile, router]);

  const fetchDashboardData = useCallback(async () => {
    if (!authToken) return;

    setIsSummaryLoading(true);
    setIsChartLoading(true);
    setIsPerformanceLoading(true);

    try {
        const [summary, performance, chartResponse] = await Promise.all([
            getDashboardSummary(period, authToken),
            getPerformanceData(period, authToken),
            getChartData('weeklyRevenue', authToken),
        ]);

        // Process and set summary and performance data
        setSummaryData(summary);
        setServicePerformance(performance.servicePerformance);
        setEmployeePerformance(performance.employeePerformance);

        // Process and set chart data
        const formattedData = chartResponse.data.map(item => ({
            ...item,
            date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        }));
        setChartData(formattedData);

        const newChartConfig: ChartConfig = {};
        for (const key in chartResponse.config) {
            newChartConfig[key] = {
                label: chartResponse.config[key].label,
                color: chartResponse.config[key].color
            };
        }
        setChartConfig(newChartConfig);
        
    } catch (error) {
        console.error(error);
        toast({
            variant: 'destructive',
            title: 'Error Refreshing Data',
            description: 'Could not fetch the latest dashboard data.',
        });
    } finally {
        setIsSummaryLoading(false);
        setIsChartLoading(false);
        setIsPerformanceLoading(false);
    }
}, [authToken, period, toast]);

// Effect for initial data load and subsequent loads on dependency change
useEffect(() => {
    if(isMobile === false) {
      fetchDashboardData();
    }
}, [fetchDashboardData, period, isMobile]);


  const handleGenerateReport = async () => {
    setIsLoadingReport(true);
    setReport(null);
    const dashboardData = {
      totalCustomers: summaryData?.totalCustomers.current ?? 0,
      totalRevenue: summaryData?.totalRevenue.current ?? 0,
      weeklySummary: chartData,
      servicePerformance,
      employeePerformance,
    };
    const result = await getPerformanceReport(dashboardData);
    if (result.success && result.data) {
      setReport(result.data.summary);
    } else {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: result.error,
      });
    }
    setIsLoadingReport(false);
  };
  
  if (isMobile === true || isMobile === undefined) {
     return (
        <main className="flex flex-1 flex-col gap-6 p-4 md:gap-8 md:p-10">
             <div className="grid gap-6 md:grid-cols-2 md:gap-8 lg:grid-cols-4 xl:grid-cols-6">
                {Array.from({ length: 12 }).map((_, i) => (
                    <Skeleton key={i} className="h-24 w-full" />
                ))}
            </div>
        </main>
    );
  }

  return (
    <main className="flex flex-1 flex-col gap-6 p-4 md:gap-8 md:p-10">
       <div className="flex items-center justify-between">
            <div>
                <h1 className="text-2xl font-semibold">Dashboard</h1>
                <p className="text-muted-foreground">
                    An overview of your business performance.
                </p>
            </div>
            <Tabs defaultValue={period} onValueChange={(value) => setPeriod(value as any)} className="w-auto">
                <TabsList>
                    <TabsTrigger value="daily">Daily</TabsTrigger>
                    <TabsTrigger value="weekly">Weekly</TabsTrigger>
                    <TabsTrigger value="monthly">Monthly</TabsTrigger>
                </TabsList>
            </Tabs>
        </div>
      
      <StatsCards
        summaryData={summaryData}
        isSummaryLoading={isSummaryLoading}
        servicePerformance={servicePerformance}
        isPerformanceLoading={isPerformanceLoading}
      />

      <div className="grid gap-6 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>Weekly Summary</CardTitle>
            <CardDescription>
              A summary of revenue generated this week.
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
             {isChartLoading ? (
                <div className="flex items-center justify-center h-[300px]">
                    <Skeleton className="h-full w-full" />
                </div>
            ) : (
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <BarChart data={chartData} margin={{left: 12, right: 12}}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                />
                 <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(value) => `₹${Number(value).toLocaleString('en-IN')}`}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="dot" formatter={(value, name, item) => (
                    <div className="flex flex-col">
                      <span className="font-medium text-muted-foreground">{item.payload.date}</span>
                       <div className="flex items-center font-bold text-foreground">
                        <span className="mr-1">₹</span>
                        {Number(value).toLocaleString('en-IN')}
                      </div>
                    </div>
                  )} />}
                />
                <Bar dataKey="revenue" fill="var(--color-revenue)" radius={8} />
              </BarChart>
            </ChartContainer>
            )}
          </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle>AI Performance Report</CardTitle>
                    <Badge variant="outline" className="border-green-600/40 bg-transparent text-green-600">Coming Soon</Badge>
                </div>
                <CardDescription>
                  Generate a daily, weekly, or monthly performance summary using AI.
                </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
            {isLoadingReport && (
                <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                </div>
            )}
            {report && <p className="text-sm text-muted-foreground">{report}</p>}
            </CardContent>
            <CardFooter>
            <Button onClick={handleGenerateReport} disabled={isLoadingReport || true} className="w-full">
                <Wand2 className="mr-2 h-4 w-4" />
                {isLoadingReport ? 'Generating...' : 'Generate Weekly Report'}
            </Button>
            </CardFooter>
        </Card>
      </div>

      <PerformanceTables 
        employeePerformance={employeePerformance}
        servicePerformance={servicePerformance}
        isPerformanceLoading={isPerformanceLoading}
      />
      
      <FeedbackAnalytics />

    </main>
  );
};

const Dashboard = dynamic(() => Promise.resolve(DashboardComponent), { ssr: false });

export default Dashboard;
