
'use client';
import { useState, useMemo } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { campaigns } from '@/lib/data';
import type { Campaign } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Send, Phone, Mail, MessageSquare, PlusCircle, Filter, Users } from 'lucide-react';
import dynamic from 'next/dynamic';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';

const WhatsAppIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M12.04 2C6.58 2 2.15 6.53 2.15 12.11c0 1.85.5 3.6 1.39 5.14L2.5 22l5.02-1.34a9.921 9.921 0 0 0 4.52 1.18h.01c5.56 0 10.01-4.53 10.01-10.11S17.6 2 12.04 2zM9.51 17.43c-.24.13-.53.2-1.12.35-.59.15-1.18.16-1.63.1-.45-.06-1.12-.22-1.63-.73-.51-.51-.87-1.13-.98-1.34-.11-.21-.77-1.34-.77-2.58s.8-2.25 1.1-2.52c.3-.27.65-.35.88-.35.22 0 .41.02.58.03.22.02.36.03.5.25.13.21.48.9.53 1 .05.1.08.21.03.34-.05.13-.08.21-.15.3-.08.08-.15.18-.27.3s-.22.25-.33.39c-.1.14-.2.27-.08.52.13.25.61 1.05 1.25 1.63.85.8 1.55 1.1 1.78 1.23.23.13.36.1.51.05.15-.05.65-.3 1.25-.61s1.02-1.01 1.18-1.34c.16-.34.33-.52.55-.52.22,0,.41-.02.59.08.18.1.41.48.48.56s.25.21.28.34c.03.13.03.73-.21 1.34-.24.61-1.55 1.83-1.8 2.06-.25.22-.48.33-.75.33-.27.01-1.72-3-1.72-3z"/>
    </svg>
);

const CampaignsPageComponent = () => {
    const [campaignList, setCampaignList] = useState<Campaign[]>(campaigns);
    const [newCampaignName, setNewCampaignName] = useState('');
    const [newCampaignChannel, setNewCampaignChannel] = useState<'SMS' | 'Email' | 'Call' | 'WhatsApp'>('Email');
    const [newCampaignMessage, setNewCampaignMessage] = useState('');

    const [filterService, setFilterService] = useState('all');
    
    const [isCreating, setIsCreating] = useState(false);
    const { toast } = useToast();

    // This logic needs to be updated to use the new customer API.
    // For now, it will not function correctly as `customers` data is removed.
    const filteredCustomerCount = 0; 
    const uniqueServiceTypes: string[] = [];


    const handleCreateCampaign = () => {
        if (!newCampaignName || !newCampaignMessage || filteredCustomerCount === 0) {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Please fill out the campaign name, message, and select a valid audience.',
            });
            return;
        }

        setIsCreating(true);
        // Simulate API call to create campaign
        setTimeout(() => {
            const newCampaign: Campaign = {
                id: `CAMP-${Date.now()}`,
                name: newCampaignName,
                target: `Filtered Audience (${filteredCustomerCount})`,
                channel: newCampaignChannel,
                status: 'Sent', // Or 'Scheduled' depending on logic
                sentDate: new Date().toISOString().split('T')[0],
                recipientCount: filteredCustomerCount, 
            };
            setCampaignList(prev => [newCampaign, ...prev]);
            // Reset form
            setNewCampaignName('');
            setNewCampaignChannel('Email');
            setNewCampaignMessage('');
            setIsCreating(false);
            toast({
                title: 'Campaign Created!',
                description: `The "${newCampaign.name}" campaign has been sent.`,
            });
        }, 1500);
    };

    return (
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-10">
            <div className="grid gap-8 lg:grid-cols-5">
                <div className="lg:col-span-3 space-y-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Marketing Campaigns</CardTitle>
                            <CardDescription>
                                Review and track the performance of your past campaigns.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Campaign Name</TableHead>
                                        <TableHead className="hidden sm:table-cell">Target</TableHead>
                                        <TableHead className="hidden md:table-cell">Channel</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Recipients</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {campaignList.map((campaign) => (
                                        <TableRow key={campaign.id}>
                                            <TableCell className="font-medium">{campaign.name}</TableCell>
                                            <TableCell className="hidden sm:table-cell">{campaign.target}</TableCell>
                                            <TableCell className="hidden md:table-cell">{campaign.channel}</TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant="outline"
                                                    className={cn({
                                                        'text-green-600 border-green-200 bg-green-50': campaign.status === 'Sent',
                                                        'text-gray-600 border-gray-200 bg-gray-50': campaign.status === 'Draft',
                                                        'text-blue-600 border-blue-200 bg-blue-50': campaign.status === 'Scheduled',
                                                    })}
                                                >
                                                    {campaign.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">{campaign.recipientCount}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
                <div className="lg:col-span-2 space-y-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Create Campaign</CardTitle>
                            <CardDescription>
                                Launch a new campaign to engage your customers.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="campaign-name">Campaign Name</Label>
                                <Input 
                                  id="campaign-name" 
                                  placeholder="e.g., PAN Card Camp" 
                                  value={newCampaignName}
                                  onChange={(e) => setNewCampaignName(e.target.value)}
                                />
                            </div>

                            <Card className="bg-muted/30">
                                <CardHeader className="pb-4">
                                     <CardTitle className="text-base flex items-center gap-2">
                                        <Filter className="h-4 w-4" />
                                        Target Audience
                                    </CardTitle>
                                    <CardDescription className="text-xs">
                                        Audience filtering will be enabled once customer API is fully integrated.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="filter-service" className="text-xs">Previous Service</Label>
                                             <Select onValueChange={setFilterService} defaultValue="all" disabled>
                                                <SelectTrigger id="filter-service" className="mt-1">
                                                    <SelectValue placeholder="Select service..." />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="all">All Services</SelectItem>
                                                    {uniqueServiceTypes.map(type => (
                                                        <SelectItem key={type} value={type}>{type}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div>
                                            <Label htmlFor="filter-age" className="text-xs">Age Group</Label>
                                            <Select defaultValue="all" disabled>
                                                <SelectTrigger id="filter-age" className="mt-1">
                                                    <SelectValue placeholder="Select age group..." />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="all">All Ages</SelectItem>
                                                    <SelectItem value="18-30">18 - 30</SelectItem>
                                                    <SelectItem value="31-45">31 - 45</SelectItem>
                                                    <SelectItem value="46-60">46 - 60</SelectItem>
                                                    <SelectItem value="61-100">61+</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    <Separator />
                                     <div className="flex items-center justify-between text-sm font-medium">
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <Users className="h-4 w-4" />
                                            <span>Potential Recipients</span>
                                        </div>
                                        <span className="text-primary font-bold text-lg">{filteredCustomerCount}</span>
                                    </div>
                                </CardContent>
                            </Card>
                            
                            <div className="space-y-2">
                                <Label>Channel</Label>
                                <RadioGroup
                                    value={newCampaignChannel}
                                    onValueChange={(value) => setNewCampaignChannel(value as 'SMS' | 'Email' | 'Call' | 'WhatsApp')}
                                    className="mt-2 grid grid-cols-2 gap-4"
                                >
                                    <Label className="flex items-center space-x-2 rounded-md border border-muted bg-popover p-3 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary cursor-pointer">
                                        <RadioGroupItem value="SMS" />
                                        <MessageSquare className="h-4 w-4" />
                                        <span>SMS</span>
                                    </Label>
                                    <Label className="flex items-center space-x-2 rounded-md border border-muted bg-popover p-3 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary cursor-pointer">
                                        <RadioGroupItem value="Email" />
                                        <Mail className="h-4 w-4" />
                                        <span>Email</span>
                                    </Label>
                                    <Label className="flex items-center space-x-2 rounded-md border border-muted bg-popover p-3 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary cursor-pointer">
                                        <RadioGroupItem value="Call" />
                                        <Phone className="h-4 w-4" />
                                        <span>Call</span>
                                    </Label>
                                     <Label className="flex items-center space-x-2 rounded-md border border-muted bg-popover p-3 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary cursor-pointer">
                                        <RadioGroupItem value="WhatsApp" />
                                        <WhatsAppIcon className="h-4 w-4" />
                                        <span>WhatsApp</span>
                                    </Label>
                                </RadioGroup>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="campaign-message">Message</Label>
                                <Textarea
                                    id="campaign-message"
                                    value={newCampaignMessage}
                                    onChange={(e) => setNewCampaignMessage(e.target.value)}
                                    placeholder="Compose your message..."
                                    className="min-h-[120px]"
                                />
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button onClick={handleCreateCampaign} disabled={isCreating || filteredCustomerCount === 0} className="w-full">
                                <Send className="mr-2 h-4 w-4" />
                                {isCreating ? 'Sending Campaign...' : `Send Campaign to ${filteredCustomerCount} recipients`}
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </main>
    );
};


const CampaignsPage = dynamic(() => Promise.resolve(CampaignsPageComponent), { ssr: false });

export default CampaignsPage;

    