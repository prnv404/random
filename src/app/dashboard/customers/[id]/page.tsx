
'use client';
import { useState, useRef, useEffect, useCallback } from 'react';
import { notFound, useParams } from 'next/navigation';
import { getCustomer, addDocument, deleteDocument } from '@/services/customer';
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
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { getCustomerInsights } from '@/app/actions';
import type { GenerateCustomerInsightsOutput } from '@/ai/flows/generate-customer-insights';
import { Bot, Lightbulb, ShieldAlert, Smile, Plus, Trash2, CalendarDays } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
    Dialog, 
    DialogContent, 
    DialogDescription, 
    DialogFooter, 
    DialogHeader, 
    DialogTitle, 
    DialogTrigger 
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import dynamic from 'next/dynamic';
import { cn } from '@/lib/utils';
import { format, differenceInDays, parseISO } from 'date-fns';
import type { Customer, CustomerDocument } from '@/lib/types';
import { useAuthContext } from '@/contexts/auth-context';

const CustomerDetailComponent = () => {
  const params = useParams();
  const customerId = params.id as string;
  const { authToken } = useAuthContext();
  const { toast } = useToast();

  const [customerData, setCustomerData] = useState<Customer | null>(null);
  const [isLoadingCustomer, setIsLoadingCustomer] = useState(true);
  const [insights, setInsights] = useState<GenerateCustomerInsightsOutput | null>(null);
  const [isLoadingInsights, setIsLoadingInsights] = useState(false);
  
  const [isDocumentDialogOpen, setIsDocumentDialogOpen] = useState(false);
  const [newDocument, setNewDocument] = useState({ docType: '', expiryDate: ''});
  
  const fetchCustomerData = useCallback(async () => {
    if (!customerId || !authToken) return;
    setIsLoadingCustomer(true);
    try {
        const data = await getCustomer(customerId, authToken);
        setCustomerData(data);
    } catch (error) {
        toast({
            variant: 'destructive',
            title: 'Failed to fetch customer details',
            description: error instanceof Error ? error.message : 'Customer not found'
        });
        notFound();
    } finally {
        setIsLoadingCustomer(false);
    }
  }, [customerId, authToken, toast]);

  useEffect(() => {
    fetchCustomerData();
  }, [fetchCustomerData]);
  
  if (isLoadingCustomer) {
    return (
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-10">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-64 w-full" />
        </main>
    )
  }

  if (!customerData) {
    return notFound();
  }

  const handleGenerateInsights = async (customer: Customer) => {
    setIsLoadingInsights(true);
    setInsights(null);
    const result = await getCustomerInsights({
      history: 'N/A',
      preferences: 'N/A',
      recentInteractions: 'N/A',
    });
    if (result.success && result.data) {
      setInsights(result.data);
    } else {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: result.error,
      });
    }
    setIsLoadingInsights(false);
  };
  
  const handleAddDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    if (customerData && newDocument.docType && newDocument.expiryDate) {
        try {
            await addDocument(customerId, {
                docType: newDocument.docType,
                docNumber: customerData.phone,
                expiryDate: newDocument.expiryDate,
                issueDate: format(new Date(), 'yyyy-MM-dd')
            }, authToken);
            toast({ title: "Success", description: "Document added successfully." });
            setIsDocumentDialogOpen(false);
            setNewDocument({ docType: '', expiryDate: '' });
            fetchCustomerData();
        } catch (error) {
            toast({
                variant: 'destructive',
                title: 'Failed to add document',
                description: error instanceof Error ? error.message : 'Unknown error',
            });
        }
    }
  }

  const handleDeleteDocument = async (documentId: string) => {
    if (!confirm('Are you sure you want to delete this document?')) return;
    try {
        await deleteDocument(customerId, documentId, authToken);
        toast({ title: "Success", description: "Document deleted successfully." });
        fetchCustomerData();
    } catch (error) {
        toast({
            variant: 'destructive',
            title: 'Failed to delete document',
            description: error instanceof Error ? error.message : 'Unknown error',
        });
    }
  }

  const getExpiryBadge = (expiryDate: string) => {
    const today = new Date();
    const date = parseISO(expiryDate);
    const daysLeft = differenceInDays(date, today);

    if (daysLeft < 0) {
        return <Badge variant="destructive">Expired</Badge>;
    } if (daysLeft <= 30) {
        return <Badge className="bg-orange-500 text-white">Expires in {daysLeft} days</Badge>;
    } if (daysLeft <= 90) {
        return <Badge className="bg-yellow-500 text-white">Expires in {daysLeft} days</Badge>;
    } 
    return <Badge variant="secondary">Expires in {daysLeft} days</Badge>;
  }

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-10">
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 grid auto-rows-max gap-6">
            <Card>
                <CardHeader>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div>
                            <CardTitle className="text-2xl">{customerData.name}</CardTitle>
                            <CardDescription>{customerData.email} &bull; {customerData.phone}</CardDescription>
                        </div>
                         <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <CalendarDays className="h-4 w-4" />
                            <span>Member since: {format(parseISO(customerData.joinDate), 'PPP')}</span>
                        </div>
                    </div>
                </CardHeader>
            </Card>

            <Card>
                <CardHeader className='flex-row items-center justify-between'>
                    <div>
                        <CardTitle>Documents</CardTitle>
                        <CardDescription>Manage documents and expiry dates.</CardDescription>
                    </div>
                    <Dialog open={isDocumentDialogOpen} onOpenChange={setIsDocumentDialogOpen}>
                        <DialogTrigger asChild>
                             <Button size="sm"><Plus className="mr-2 h-4 w-4" /> Add Document</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Add New Document</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleAddDocument}>
                                <div className="grid gap-4 py-4">
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="docType" className="text-right">Type</Label>
                                        <Input id="docType" value={newDocument.docType} onChange={(e) => setNewDocument({...newDocument, docType: e.target.value})} className="col-span-3" placeholder="e.g., Passport" required />
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="expiryDate" className="text-right">Expiry Date</Label>
                                        <Input id="expiryDate" type="date" value={newDocument.expiryDate} onChange={(e) => setNewDocument({...newDocument, expiryDate: e.target.value})} className="col-span-3" required />
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button type="submit">Save Document</Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Type</TableHead>
                                <TableHead>Number</TableHead>
                                <TableHead>Expires On</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead><span className="sr-only">Actions</span></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {customerData.documents && customerData.documents.length > 0 ? (
                                customerData.documents.map((doc) => (
                                    <TableRow key={doc.id}>
                                        <TableCell className="font-medium">{doc.docType}</TableCell>
                                        <TableCell>{doc.docNumber}</TableCell>
                                        <TableCell>{format(parseISO(doc.expiryDate), 'PPP')}</TableCell>
                                        <TableCell>{getExpiryBadge(doc.expiryDate)}</TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="icon" onClick={() => handleDeleteDocument(doc.id)}>
                                                <Trash2 className="h-4 w-4 text-destructive" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow key="no-documents-row">
                                    <TableCell colSpan={5} className="text-center h-24">
                                        No documents are being tracked for this customer.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
             </Card>
        </div>

        <div>
            <Card>
                <CardHeader>
                    <div className='flex items-center gap-2'>
                        <Bot className='h-6 w-6 text-primary' />
                        <CardTitle>AI-Powered Insights</CardTitle>
                    </div>
                    <CardDescription>
                        Generate smart suggestions and identify potential issues for this customer.
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                    {isLoadingInsights && (
                        <div className="space-y-4">
                             <Skeleton className="h-24 w-full" />
                             <Skeleton className="h-24 w-full" />
                             <Skeleton className="h-24 w-full" />
                        </div>
                    )}
                    {insights && (
                        <div className="space-y-4">
                            <Card>
                                <CardHeader className="flex flex-row items-center gap-2 space-y-0 pb-2">
                                    <Lightbulb className="h-4 w-4 text-muted-foreground" />
                                    <h3 className="font-semibold">Suggested Services</h3>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground">{insights.suggestedServices}</p>
                                </CardContent>
                            </Card>
                             <Card>
                                <CardHeader className="flex flex-row items-center gap-2 space-y-0 pb-2">
                                    <ShieldAlert className="h-4 w-4 text-muted-foreground" />
                                    <h3 className="font-semibold">Potential Issues</h3>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground">{insights.potentialIssues}</p>
                                </CardContent>
                            </Card>
                             <Card>
                                <CardHeader className="flex flex-row items-center gap-2 space-y-0 pb-2">
                                    <Smile className="h-4 w-4 text-muted-foreground" />
                                    <h3 className="font-semibold">Overall Sentiment</h3>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground">{insights.overallSentiment}</p>
                                </CardContent>
                            </Card>
                        </div>
                    )}
                </CardContent>
                <CardFooter>
                    <Button onClick={() => handleGenerateInsights(customerData)} disabled={isLoadingInsights} className="w-full">
                        {isLoadingInsights ? 'Generating...' : 'Generate Insights'}
                    </Button>
                </CardFooter>
            </Card>
        </div>
      </div>
    </main>
  );
};

const CustomerDetailPage = dynamic(() => Promise.resolve(CustomerDetailComponent), { ssr: false });

export default CustomerDetailPage;
