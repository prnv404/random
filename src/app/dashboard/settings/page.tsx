
'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Plug, SlidersHorizontal, ArrowRight } from 'lucide-react';
import dynamic from 'next/dynamic';

const WhatsAppIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M12.04 2C6.58 2 2.15 6.53 2.15 12.11c0 1.85.5 3.6 1.39 5.14L2.5 22l5.02-1.34a9.921 9.921 0 0 0 4.52 1.18h.01c5.56 0 10.01-4.53 10.01-10.11S17.6 2 12.04 2zM9.51 17.43c-.24.13-.53.2-1.12.35-.59.15-1.18.16-1.63.1-.45-.06-1.12-.22-1.63-.73-.51-.51-.87-1.13-.98-1.34-.11-.21-.77-1.34-.77-2.58s.8-2.25 1.1-2.52c.3-.27.65-.35.88-.35.22 0 .41.02.58.03.22.02.36.03.5.25.13.21.48.9.53 1 .05.1.08.21.03.34-.05.13-.08.21-.15.3-.08.08-.15.18-.27.3s-.22.25-.33.39c-.1.14-.2.27-.08.52.13.25.61 1.05 1.25 1.63.85.8 1.55 1.1 1.78 1.23.23.13.36.1.51.05.15-.05.65-.3 1.25-.61s1.02-1.01 1.18-1.34c.16-.34.33-.52.55-.52.22,0,.41-.02.59.08.18.1.41.48.48.56s.25.21.28.34c.03.13.03.73-.21 1.34-.24.61-1.55 1.83-1.8 2.06-.25.22-.48.33-.75.33-.27.01-1.72-3-1.72-3z"/>
    </svg>
);

const GoogleDriveIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M7.71 5l-4.86 8.42l1.63 2.82h14.97l1.63-2.82L16.29 5H7.71zM8.5 17.5l-3.3-5.71l-1.63 2.82L8.5 20.32l3.29-5.71h-6.6zM15.5 17.5l3.3-5.71l1.63 2.82L15.5 20.32l-3.29-5.71h6.6z"/>
    </svg>
);


const SettingsPageComponent = () => {
    const { toast } = useToast();

    const handleSaveChanges = () => {
        toast({
            title: 'Settings Saved',
            description: 'Your changes have been saved successfully.',
        });
    };

    return (
         <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-10">
            <div className="max-w-4xl mx-auto w-full space-y-12">
                 <header>
                    <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
                    <p className="text-muted-foreground mt-1">Manage your integrations, notifications, and preferences.</p>
                </header>

                <section className="space-y-6">
                    <div className="space-y-2">
                        <h2 className="text-xl font-semibold flex items-center gap-2">
                           <Plug className="h-5 w-5" /> Integrations
                        </h2>
                        <p className="text-muted-foreground">Connect third-party services to enhance your workflow.</p>
                    </div>
                    <Card className="hover:border-primary/40 transition-colors">
                        <CardHeader className="flex flex-row items-center justify-between">
                             <div className="flex items-center gap-4">
                                <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg border">
                                   <GoogleDriveIcon className="h-8 w-8 text-gray-700 dark:text-gray-200" />
                                </div>
                                <div>
                                    <CardTitle className="text-lg">Google Drive</CardTitle>
                                    <CardDescription>Store customer documents securely in your own Google Drive.</CardDescription>
                                </div>
                            </div>
                            <Button variant="outline">
                                Connect <ArrowRight className="ml-2 h-4 w-4"/>
                            </Button>
                        </CardHeader>
                    </Card>
                    <Card className="hover:border-primary/40 transition-colors">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-green-100 dark:bg-green-900/50 rounded-lg border">
                                    <WhatsAppIcon className="h-8 w-8 text-green-600 dark:text-green-400" />
                                </div>
                                <div>
                                    <CardTitle className="text-lg">WhatsApp Business</CardTitle>
                                    <CardDescription>Serve customer through whatsapp</CardDescription>
                                </div>
                            </div>
                            <Button variant="outline">
                                Connect <ArrowRight className="ml-2 h-4 w-4"/>
                            </Button>
                        </CardHeader>
                    </Card>
                </section>
                
                 <section className="space-y-6">
                    <div className="space-y-2">
                        <h2 className="text-xl font-semibold flex items-center gap-2">
                           <SlidersHorizontal className="h-5 w-5" /> General Settings
                        </h2>
                        <p className="text-muted-foreground">Customize notifications and appearance for your workspace.</p>
                    </div>
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Notification Settings</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                                <Label htmlFor="email-notifications" className="font-normal">Email Notifications</Label>
                                <Switch id="email-notifications" defaultChecked />
                            </div>
                            <div className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                                <Label htmlFor="sms-alerts" className="font-normal">SMS Alerts for Critical Events</Label>
                                <Switch id="sms-alerts" />
                            </div>
                        </CardContent>
                    </Card>
                </section>
                
                <div className="flex justify-end pt-4 border-t">
                    <Button size="lg" onClick={handleSaveChanges}>
                        Save Changes
                    </Button>
                </div>
            </div>
        </main>
    );
};


const SettingsPage = dynamic(() => Promise.resolve(SettingsPageComponent), { ssr: false });

export default SettingsPage;
