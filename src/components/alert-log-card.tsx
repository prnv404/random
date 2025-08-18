
'use client';

import type { AlertLog } from '@/lib/types';
import { Card, CardContent, CardHeader } from './ui/card';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { format, parseISO } from 'date-fns';
import { cn } from '@/lib/utils';
import { CheckCircle2, XCircle } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface AlertLogCardProps {
    log: AlertLog;
    channelIcons: Record<AlertLog['channel'], React.ReactNode>;
}

export const AlertLogCard = ({ log, channelIcons }: AlertLogCardProps) => {
    return (
        <Card>
            <CardHeader className="p-4 pb-2">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="font-semibold">{log.customer_phone || log.customer_email}</p>
                         <p className="text-xs text-muted-foreground">{format(parseISO(log.created_at), 'PPP p')}</p>
                    </div>
                     <div className="flex items-center gap-2 capitalize">
                        {channelIcons[log.channel]}
                        <Badge variant="outline">{log.channel}</Badge>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-4 pt-2 space-y-3">
                 <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <p className="text-sm text-muted-foreground italic line-clamp-3">"{log.message}"</p>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p className="max-w-xs">{log.message}</p>
                        </TooltipContent>
                    </Tooltip>
                 </TooltipProvider>

                 <div className="text-xs text-muted-foreground space-y-2 pt-2 border-t">
                     <div className="flex justify-between items-center">
                        <span>Sent by:</span>
                         <div className="flex items-center gap-2 font-medium text-foreground">
                            <Avatar className="h-5 w-5">
                                <AvatarImage src={log.employee.avatar} alt={log.employee.name} />
                                <AvatarFallback>{log.employee.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span>{log.employee.name}</span>
                        </div>
                    </div>
                    <div className="flex justify-between items-center">
                        <span>Status:</span>
                        <Badge
                            variant="outline"
                            className={cn('font-semibold', {
                                'text-green-600 border-green-200 bg-green-50': log.success,
                                'text-red-600 border-red-200 bg-red-50': !log.success,
                            })}
                            >
                            <div className="flex items-center gap-1">
                                {log.success ? <CheckCircle2 className="h-3.5 w-3.5" /> : <XCircle className="h-3.5 w-3.5" />}
                                {log.success ? 'Sent' : 'Failed'}
                            </div>
                        </Badge>
                    </div>
                 </div>
            </CardContent>
        </Card>
    );
};

    