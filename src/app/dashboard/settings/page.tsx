
'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Mail, MessageSquare, Phone, Wallet, Sun, Moon, Bell } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useToast } from '@/hooks/use-toast';

const WhatsAppIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M12.04 2C6.58 2 2.15 6.53 2.15 12.11c0 1.85.5 3.6 1.39 5.14L2.5 22l5.02-1.34a9.921 9.921 0 0 0 4.52 1.18h.01c5.56 0 10.01-4.53 10.01-10.11S17.6 2 12.04 2zM9.51 17.43c-.24.13-.53.2-1.12.35-.59.15-1.18.16-1.63.1-.45-.06-1.12-.22-1.63-.73-.51-.51-.87-1.13-.98-1.34-.11-.21-.77-1.34-.77-2.58s.8-2.25 1.1-2.52c.3-.27.65-.35.88-.35.22 0 .41.02.58.03.22.02.36.03.5.25.13.21.48.9.53 1 .05.1.08.21.03.34-.05.13-.08.21-.15.3-.08.08-.15.18-.27.3s-.22.25-.33.39c-.1.14-.2.27-.08.52.13.25.61 1.05 1.25 1.63.85.8 1.55 1.1 1.78 1.23.23.13.36.1.51.05.15-.05.65-.3 1.25-.61s1.02-1.01 1.18-1.34c.16-.34.33-.52.55-.52.22,0,.41-.02.59.08.18.1.41.48.48.56s.25.21.28.34c.03.13.03.73-.21 1.34-.24.61-1.55 1.83-1.8 2.06-.25.22-.48.33-.75.33-.27.01-1.72-3-1.72-3z"/>
    </svg>
);

const SettingsPageComponent = () => {
    const { toast } = useToast();
    const usageData = {
        'SMS': { used: 1250, limit: 5000, unit: 'messages' },
        'WhatsApp': { used: 340, limit: 1000, unit: 'messages' },
        'Email': { used: 8000, limit: 10000, unit: 'emails' },
        'Call': { used: 120, limit: 500, unit: 'minutes' }
    };

    const channelIcons = {
        SMS: <MessageSquare className="h-5 w-5 text-sky-500" />,
        WhatsApp: <WhatsAppIcon className="h-5 w-5 text-green-500" />,
        Email: <Mail className="h-5 w-5 text-blue-500" />,
        Call: <Phone className="h-5 w-5 text-gray-600" />,
    };

    const handleSaveChanges = () => {
        toast({
            title: 'Settings Saved',
            description: 'Your changes have been saved successfully.',
        });
    };

    return (
         <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-10">
            <div className="max-w-4xl mx-auto w-full space-y-8">
                 <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Bell className="h-5 w-5" />
                            Notification Settings
                        </CardTitle>
                        <CardDescription>Manage how you receive notifications from the platform.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                            <div className="space-y-0.5">
                                <Label>Email Notifications</Label>
                                <p className="text-xs text-muted-foreground">
                                    Receive updates about ticket status and weekly summaries.
                                </p>
                            </div>
                            <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                            <div className="space-y-0.5">
                                <Label>SMS Alerts</Label>
                                <p className="text-xs text-muted-foreground">
                                   Get critical alerts for system updates or billing issues.
                                </p>
                            </div>
                            <Switch />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Wallet className="h-6 w-6" />
                            Communication Usage
                        </CardTitle>
                        <CardDescription>
                            Your remaining monthly quota for each channel.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {Object.entries(usageData).map(([channel, data]) => (
                            <div key={channel}>
                                <div className="flex items-center justify-between mb-1">
                                    <div className="flex items-center gap-3">
                                        {channelIcons[channel as keyof typeof channelIcons]}
                                        <Label className="font-semibold text-lg">{channel}</Label>
                                    </div>
                                    <span className="text-sm text-muted-foreground">
                                        <span className="font-bold text-lg text-foreground">{data.limit - data.used}</span> / {data.limit} {data.unit} left
                                    </span>
                                </div>
                                <Progress value={(data.used / data.limit) * 100} className="h-3" />
                                <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                                    <span>Used: {data.used}</span>
                                    <span>Limit: {data.limit}</span>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                    <CardFooter className="border-t pt-4">
                         <p className="text-xs text-muted-foreground">
                            Your usage quotas reset on the 1st of every month. To upgrade your plan, please contact support.
                        </p>
                    </CardFooter>
                </Card>

                <div className="flex justify-end">
                    <Button onClick={handleSaveChanges}>Save Changes</Button>
                </div>
            </div>
        </main>
    );
};


const SettingsPage = dynamic(() => Promise.resolve(SettingsPageComponent), { ssr: false });

export default SettingsPage;
