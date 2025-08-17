'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import type { EmployeePerformance, ServicePerformance } from '@/lib/types';
import { IndianRupee, Award } from 'lucide-react';
import { ScrollArea } from '../ui/scroll-area';

interface PerformanceTablesProps {
    employeePerformance: EmployeePerformance[];
    servicePerformance: ServicePerformance[];
    isPerformanceLoading: boolean;
}

export const PerformanceTables = ({ employeePerformance, servicePerformance, isPerformanceLoading }: PerformanceTablesProps) => {
    return (
        <div className="grid gap-6 md:gap-8 lg:grid-cols-2">
            <Card>
                <CardHeader>
                    <CardTitle>Employee Performance</CardTitle>
                    <CardDescription>
                        Summary of services delivered and revenue by employee.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Employee</TableHead>
                                <TableHead className="text-center">Services Delivered</TableHead>
                                <TableHead className="text-right">Revenue Generated</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isPerformanceLoading ? (
                                Array.from({ length: 3 }).map((_, i) => (
                                    <TableRow key={i}>
                                        <TableCell><Skeleton className="h-10 w-full" /></TableCell>
                                        <TableCell><Skeleton className="h-10 w-full" /></TableCell>
                                        <TableCell><Skeleton className="h-10 w-full" /></TableCell>
                                    </TableRow>
                                ))
                            ) : employeePerformance.map((emp, index) => (
                                <TableRow key={emp.employeeId}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            {index === 0 && <Award className="h-5 w-5 text-yellow-500" />}
                                            <Avatar className="h-9 w-9">
                                                <AvatarImage src={emp.avatarUrl} alt={emp.employeeName} data-ai-hint="person avatar" />
                                                <AvatarFallback>{emp.employeeName.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <div className="font-medium">{emp.employeeName}</div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-center font-medium">{emp.servicesCompleted}</TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end font-semibold">
                                            <IndianRupee className="h-4 w-4 mr-1" />
                                            {emp.revenueGenerated.toLocaleString('en-IN')}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Service Performance</CardTitle>
                    <CardDescription>
                        Breakdown of volume and revenue for each service.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <ScrollArea className="h-[300px]">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Service Name</TableHead>
                                    <TableHead className="text-center">Volume</TableHead>
                                    <TableHead className="text-right">Total Revenue</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isPerformanceLoading ? (
                                    Array.from({ length: 7 }).map((_, i) => (
                                        <TableRow key={i}>
                                            <TableCell><Skeleton className="h-8 w-full" /></TableCell>
                                            <TableCell><Skeleton className="h-8 w-full" /></TableCell>
                                            <TableCell><Skeleton className="h-8 w-full" /></TableCell>
                                        </TableRow>
                                    ))
                                ) : servicePerformance.map((service, index) => (
                                    <TableRow key={service.serviceName}>
                                        <TableCell>
                                            <div className="flex items-center font-medium">
                                                {index === 0 && <Badge variant="secondary" className="mr-2 border-primary/50 text-primary">Top Earner</Badge>}
                                                {service.serviceName}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-center font-medium">{service.volume}</TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end font-semibold">
                                                <IndianRupee className="h-4 w-4 mr-1" />
                                                {service.totalRevenue.toLocaleString('en-IN')}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </ScrollArea>
                </CardContent>
            </Card>
        </div>
    );
};
