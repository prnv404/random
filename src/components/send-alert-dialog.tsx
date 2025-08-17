
'use client';
import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { Send, Mail, MessageSquare, Loader2 } from 'lucide-react';
import { sendNotification } from '@/services/notifications';
import { useAuthContext } from '@/contexts/auth-context';

const WhatsAppIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="currentColor" {...props}>
        <path d="M12.04 2C6.58 2 2.15 6.53 2.15 12.11c0 1.85.5 3.6 1.39 5.14L2.5 22l5.02-1.34a9.921 9.921 0 0 0 4.52 1.18h.01c5.56 0 10.01-4.53 10.01-10.11S17.6 2 12.04 2zM9.51 17.43c-.24.13-.53.2-1.12.35-.59.15-1.18.16-1.63.1-.45-.06-1.12-.22-1.63-.73-.51-.51-.87-1.13-.98-1.34-.11-.21-.77-1.34-.77-2.58s.8-2.25 1.1-2.52c.3-.27.65-.35.88-.35.22 0 .41.02.58.03.22.02.36.03.5.25.13.21.48.9.53 1 .05.1.08.21.03.34-.05.13-.08.21-.15.3-.08.08-.15.18-.27.3s-.22.25-.33.39c-.1.14-.2.27-.08.52.13.25.61 1.05 1.25 1.63.85.8 1.55 1.1 1.78 1.23.23.13.36.1.51.05.15-.05.65-.3 1.25-.61s1.02-1.01 1.18-1.34c.16-.34.33-.52.55-.52.22,0,.41-.02.59.08.18.1.41.48.48.56s.25.21.28.34c.03.13.03.73-.21 1.34-.24.61-1.55 1.83-1.8 2.06-.25.22-.48.33-.75.33-.27.01-1.72-3-1.72-3z"/>
    </svg>
);

interface SendAlertDialogProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    customerName: string;
    customerPhone: string;
    customerEmail?: string | null;
    defaultMessage?: string;
}

export const SendAlertDialog = ({ isOpen, setIsOpen, customerName, customerPhone, customerEmail, defaultMessage = '' }: SendAlertDialogProps) => {
    const { authToken } = useAuthContext();
    const [alertType, setAlertType] = useState<'sms' | 'email' | 'whatsapp'>('whatsapp');
    const [message, setMessage] = useState(defaultMessage);
    const [subject, setSubject] = useState('Notification from SNAP GRID');
    const [isSending, setIsSending] = useState(false);
    
    const { toast } = useToast();

     useEffect(() => {
        if (isOpen) {
            setMessage(defaultMessage);
            setAlertType('whatsapp');
        }
    }, [isOpen, defaultMessage]);
    

    const handleSendAlert = async () => {
        if (!message) {
          toast({
            variant: 'destructive',
            title: 'Error',
            description: 'Please provide a message to send.',
          });
          return;
        }

        setIsSending(true);

        try {
            let payload: any;
            if (alertType === 'email') {
                if (!customerEmail) {
                    toast({ variant: 'destructive', title: 'Error', description: 'No email address available for this customer.'});
                    setIsSending(false);
                    return;
                }
                 payload = { type: 'email', email: customerEmail, subject, message };
            } else {
                 payload = { type: alertType, phone: customerPhone, message };
            }

            await sendNotification(payload, authToken);

            toast({
                title: 'Alert Sent!',
                description: `Sent a ${alertType} to ${customerName}.`,
            });
            setIsOpen(false);
        } catch (error) {
             toast({
                variant: 'destructive',
                title: 'Failed to send alert',
                description: error instanceof Error ? error.message : 'Unknown error',
            });
        } finally {
             setIsSending(false);
        }
      };


    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Send Alert to {customerName}</DialogTitle>
                    <DialogDescription>
                        Compose and send a notification to {customerPhone}.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-6 py-4">
                    <div>
                        <Label>Alert Method</Label>
                        <RadioGroup
                            value={alertType}
                            onValueChange={(value) => setAlertType(value as 'sms' | 'email' | 'whatsapp')}
                            className="mt-2 grid grid-cols-3 gap-4"
                        >
                             <Label className="flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary cursor-pointer">
                                <RadioGroupItem value="sms" className="sr-only" />
                                <MessageSquare className="mb-3 h-6 w-6" />
                                SMS
                            </Label>
                            <Label className="flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary cursor-pointer">
                                <RadioGroupItem value="whatsapp" className="sr-only" />
                                <WhatsAppIcon className="mb-3 h-6 w-6" />
                                WhatsApp
                            </Label>
                            <Label className="flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary cursor-pointer">
                                <RadioGroupItem value="email" className="sr-only" />
                                <Mail className="mb-3 h-6 w-6" />
                                Email
                            </Label>
                        </RadioGroup>
                    </div>

                    {alertType === 'email' && (
                         <div className="space-y-2">
                            <Label htmlFor="subject">Subject</Label>
                            <Textarea
                                id="subject"
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                placeholder="Email subject..."
                                className="mt-1"
                            />
                        </div>
                    )}
                     <div>
                        <Label htmlFor="message">Message</Label>
                        <Textarea
                            id="message"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Type your message here..."
                            className="mt-1 min-h-[120px]"
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button 
                        onClick={handleSendAlert} 
                        disabled={isSending || !message} 
                        className="w-full"
                    >
                        {isSending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                        {isSending ? 'Sending...' : `Send ${alertType.charAt(0).toUpperCase() + alertType.slice(1)}`}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
