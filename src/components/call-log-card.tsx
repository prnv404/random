
'use client';

import type { CallLog } from '@/lib/types';
import { Card, CardContent, CardFooter, CardHeader } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Play } from 'lucide-react';

interface CallLogCardProps {
    log: CallLog;
    callTypeIcons: Record<string, React.ReactNode>;
    activeRecording: string | null;
    onPlayRecording: (url: string) => void;
}

export const CallLogCard = ({ log, callTypeIcons, activeRecording, onPlayRecording }: CallLogCardProps) => {
    return (
        <Card>
            <CardHeader className="p-4 pb-2">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="font-semibold">{log.customerName}</p>
                        <p className="text-sm text-muted-foreground">{log.customerPhone}</p>
                    </div>
                     <div className="flex items-center gap-2">
                        {callTypeIcons[log.callType as keyof typeof callTypeIcons]}
                        <Badge variant="outline">{log.callType}</Badge>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-4 pt-2 space-y-3">
                 <div className="text-xs text-muted-foreground space-y-1">
                    <div className="flex justify-between">
                        <span>Agent:</span>
                         <div className="flex items-center gap-2 font-medium text-foreground">
                            <Avatar className="h-5 w-5">
                                <AvatarImage src={log.employeeAvatar} alt={log.employeeName} />
                                <AvatarFallback>{log.employeeName.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span>{log.employeeName}</span>
                        </div>
                    </div>
                    <div className="flex justify-between">
                        <span>Date:</span>
                        <span className="font-medium text-foreground">{log.date}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Duration:</span>
                         <span className="font-medium text-foreground">{log.duration}</span>
                    </div>
                </div>
            </CardContent>
             {log.recordingUrl && (
                <CardFooter className="p-4 pt-0">
                    <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={() => onPlayRecording(log.recordingUrl!)}
                    >
                        <Play className="mr-2 h-4 w-4" />
                        {activeRecording === log.recordingUrl ? 'Pause Recording' : 'Play Recording'}
                    </Button>
                </CardFooter>
            )}
        </Card>
    );
};

    