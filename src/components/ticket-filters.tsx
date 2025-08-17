
'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Calendar as CalendarIcon, X } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import type { User } from '@/lib/types';

interface TicketFiltersProps {
    filters: {
        searchTerm: string;
        employeeId: string;
        serviceType: string;
        date: Date | undefined;
    };
    setFilters: React.Dispatch<React.SetStateAction<TicketFiltersProps['filters']>>;
    users: User[];
    uniqueServiceTypes: string[];
}

export const TicketFilters = ({ filters, setFilters, users, uniqueServiceTypes }: TicketFiltersProps) => {
    
    const handleFilterChange = (key: keyof typeof filters, value: any) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const clearFilters = () => {
        setFilters({
            searchTerm: '',
            employeeId: 'all',
            serviceType: 'all',
            date: undefined
        });
    }

    const hasFilters = filters.searchTerm || filters.employeeId !== 'all' || filters.serviceType !== 'all' || filters.date;

    return (
        <Card>
            <CardContent className="p-4">
                <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4">
                     <Input 
                        placeholder="Search by name or Ticket ID..."
                        value={filters.searchTerm}
                        onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
                        className="w-full md:max-w-xs"
                    />
                     <Select value={filters.employeeId} onValueChange={(val) => handleFilterChange('employeeId', val)}>
                        <SelectTrigger className="w-full md:w-[180px]">
                            <SelectValue placeholder="Filter by Employee" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Employees</SelectItem>
                            {users.map(emp => (
                                <SelectItem key={emp.id} value={emp.id}>{emp.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Select value={filters.serviceType} onValueChange={(val) => handleFilterChange('serviceType', val)}>
                        <SelectTrigger className="w-full md:w-[200px]">
                            <SelectValue placeholder="Filter by Service" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Services</SelectItem>
                            {uniqueServiceTypes.map(type => (
                                <SelectItem key={type} value={type}>{type}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Popover>
                        <PopoverTrigger asChild>
                        <Button
                            variant={'outline'}
                            className={cn(
                            'w-full md:w-[240px] justify-start text-left font-normal',
                            !filters.date && 'text-muted-foreground'
                            )}
                        >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {filters.date ? format(filters.date, 'PPP') : <span>Filter by date</span>}
                        </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                            mode="single"
                            selected={filters.date}
                            onSelect={(val) => handleFilterChange('date', val)}
                            initialFocus
                        />
                        </PopoverContent>
                    </Popover>
                    {hasFilters && (
                        <Button variant="ghost" onClick={clearFilters} className="text-muted-foreground">
                            <X className="mr-2 h-4 w-4" />
                            Clear
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
