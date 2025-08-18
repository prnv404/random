
'use client';
import { useState, useEffect, useCallback } from 'react';
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
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Send, IndianRupee, MessageSquare, Loader2 } from 'lucide-react';
import type { Ticket as TicketType, Service } from '@/lib/types';
import { addDocument, listCustomers } from '@/services/customer';
import { useAuthContext } from '@/contexts/auth-context';
import { format } from 'date-fns';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Separator } from './ui/separator';

const WhatsAppIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="currentColor" {...props}>
        <path d="M12.04 2C6.58 2 2.15 6.53 2.15 12.11c0 1.85.5 3.6 1.39 5.14L2.5 22l5.02-1.34a9.921 9.921 0 0 0 4.52 1.18h.01c5.56 0 10.01-4.53 10.01-10.11S17.6 2 12.04 2zM9.51 17.43c-.24.13-.53.2-1.12.35-.59.15-1.18.16-1.63.1-.45-.06-1.12-.22-1.63-.73-.51-.51-.87-1.13-.98-1.34-.11-.21-.77-1.34-.77-2.58s.8-2.25 1.1-2.52c.3-.27.65-.35.88-.35.22 0 .41.02.58.03.22.02.36.03.5.25.13.21.48.9.53 1 .05.1.08.21.03.34-.05.13-.08.21-.15.3-.08.08-.15.18-.27.3s-.22.25-.33.39c-.1.14-.2.27-.08.52.13.25.61 1.05 1.25 1.63.85.8 1.55 1.1 1.78 1.23.23.13.36.1.51.05.15-.05.65-.3 1.25-.61s1.02-1.01 1.18-1.34c.16-.34.33-.52.55-.52.22,0,.41-.02.59.08.18.1.41.48.48.56s.25.21.28.34c.03.13.03.73-.21 1.34-.24.61-1.55 1.83-1.8 2.06-.25.22-.48.33-.75.33-.27.01-1.72-3-1.72-3z"/>
    </svg>
);


interface FinalizeTicketDialogProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    ticket: TicketType;
    service: Service;
    onConfirm: (ticketId: string, amount: number, sendInvoice: boolean, invoiceMethod: 'whatsapp' | 'sms') => void;
}

export const FinalizeTicketDialog = ({ isOpen, setIsOpen, ticket, service, onConfirm }: FinalizeTicketDialogProps) => {
    const { authToken } = useAuthContext();
    const { toast } = useToast();
    
    // State for amount and invoice
    const [amount, setAmount] = useState('');
    const [sendInvoice, setSendInvoice] = useState(false);
    const [invoiceMethod, setInvoiceMethod] = useState<'whatsapp' | 'sms'>('whatsapp');
    
    // State for document expiry
    const [trackExpiry, setTrackExpiry] = useState(false);
    const [docType, setDocType] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    
    // General state
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [customerId, setCustomerId] = useState<string | null>(null);

    const isTbd = ticket.amount <= 0;
    
    const resetState = useCallback(() => {
        setAmount(isTbd ? '' : String(ticket.amount ?? ''));
        setSendInvoice(false);
        setInvoiceMethod('whatsapp');
        setTrackExpiry(false);
        setDocType(ticket.serviceType); // Default doc type to service name
        setExpiryDate('');
        setIsSubmitting(false);
    }, [isTbd, ticket.amount, ticket.serviceType]);

    useEffect(() => {
        if(isOpen) {
            resetState();
            const findCustomer = async () => {
                if (!authToken) return;
                try {
                    const data = await listCustomers({ search: ticket.customerPhone, limit: 1 }, authToken);
                    setCustomerId(data?.customers[0]?.id || null);
                } catch (error) {
                    setCustomerId(null);
                }
            };
            findCustomer();
        }
    }, [isOpen, resetState, ticket.customerPhone, authToken]);


    const handleConfirm = async () => {
        const numericAmount = parseFloat(amount);
        if (isNaN(numericAmount) || numericAmount <= 0) {
            toast({ variant: 'destructive', title: 'Invalid Amount', description: 'Please enter a valid amount > 0.' });
            return;
        }

        if (trackExpiry && (!docType || !expiryDate)) {
             toast({ variant: 'destructive', title: 'Missing Expiry Info', description: 'Please fill all document expiry fields.' });
            return;
        }

        setIsSubmitting(true);

        try {
            // Step 1: Add document expiry if requested
            if (trackExpiry && customerId) {
                await addDocument(customerId, {
                    docType,
                    docNumber: ticket.customerPhone, // Use phone as default doc number
                    issueDate: format(new Date(), 'yyyy-MM-dd'),
                    expiryDate,
                }, authToken);
                toast({ title: 'Success', description: 'Document expiry has been added.' });
            }

            // Step 2: Call the onConfirm prop to update ticket status, amount, and send invoice
            onConfirm(ticket.id, numericAmount, sendInvoice, invoiceMethod);
            
            setIsOpen(false);

        } catch (error) {
             toast({ variant: 'destructive', title: 'Failed to save document', description: error instanceof Error ? error.message : 'Unknown error' });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Complete Ticket for "{ticket.serviceType}"</DialogTitle>
                    <DialogDescription>
                        Confirm the final details to complete this service ticket.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-6 py-4 max-h-[70vh] overflow-y-auto pr-2">
                    {/* Amount Section */}
                    {isTbd && (
                         <div>
                            <Label htmlFor="amount" className="font-semibold">Final Service Amount</Label>
                            <div className="relative mt-1">
                                <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="amount" type="number" value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    placeholder="Enter final amount..." className="pl-8" required
                                />
                            </div>
                        </div>
                    )}
                   
                    {/* Expiry Section */}
                    <div>
                        <Separator className="my-4" />
                        <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                            <div className="space-y-0.5">
                                <Label htmlFor="track-expiry" className="font-semibold">Track Document Expiry</Label>
                                <p className="text-xs text-muted-foreground">
                                    Record renewal date for this document.
                                </p>
                            </div>
                            <Switch id="track-expiry" checked={trackExpiry} onCheckedChange={setTrackExpiry} disabled={!customerId} />
                        </div>
                            {!customerId && <p className="text-xs text-destructive mt-1">Customer record not found, cannot track expiry.</p>}

                        {trackExpiry && customerId && (
                            <div className="space-y-4 pt-4 pl-3 border-l-2 ml-3">
                                <div>
                                    <Label htmlFor="docType">Document Type</Label>
                                    <Input 
                                        id="docType"
                                        value={docType}
                                        onChange={(e) => setDocType(e.target.value)}
                                        placeholder="e.g., Driving License"
                                        className="mt-1"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="expiryDate">Expiry Date</Label>
                                    <Input id="expiryDate" type="date" value={expiryDate} onChange={(e) => setExpiryDate(e.target.value)} className="mt-1" />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Invoice Section */}
                    <div>
                        <Separator className="my-4" />
                        <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                            <div className="space-y-0.5">
                                <Label htmlFor="send-invoice" className="font-semibold">Send Invoice to Customer</Label>
                                <p className="text-xs text-muted-foreground">
                                    Send a receipt via WhatsApp or SMS.
                                </p>
                            </div>
                            <Switch id="send-invoice" checked={sendInvoice} onCheckedChange={setSendInvoice} />
                        </div>
                    </div>

                    {sendInvoice && (
                        <div className="pt-4 pl-3 border-l-2 ml-3">
                            <Label>Send Invoice via</Label>
                            <RadioGroup value={invoiceMethod} onValueChange={(value) => setInvoiceMethod(value as 'whatsapp' | 'sms')} className="mt-2 grid grid-cols-2 gap-4">
                                <Label className="flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary cursor-pointer">
                                    <RadioGroupItem value="whatsapp" className="sr-only" />
                                    <WhatsAppIcon className="mb-3 h-6 w-6" />
                                    WhatsApp
                                </Label>
                                <Label className="flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary cursor-pointer">
                                    <RadioGroupItem value="sms" className="sr-only" />
                                    <MessageSquare className="mb-3 h-6 w-6" />
                                    SMS
                                </Label>
                            </RadioGroup>
                        </div>
                    )}
                </div>
                <DialogFooter>
                    <Button onClick={handleConfirm} disabled={isSubmitting || !amount} className="w-full">
                         {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                        {isSubmitting ? 'Processing...' : 'Confirm & Complete'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
