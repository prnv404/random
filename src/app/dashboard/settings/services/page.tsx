
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Edit, Trash2, X, PlusCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuthContext } from '@/contexts/auth-context';
import { listServices, createService, updateService, deleteService } from '@/services/services';
import { getCurrentOrg } from '@/services/user';
import type { Service } from '@/lib/types';
import dynamic from 'next/dynamic';

const ServicesPageComponent = () => {
    const { authToken } = useAuthContext();
    const { toast } = useToast();
    const [name, setName] = useState('');
    const [url, setUrl] = useState('');
    const [amount, setAmount] = useState('');
    const [documents, setDocuments] = useState<string[]>([]);
    const [currentDoc, setCurrentDoc] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [services, setServices] = useState<Service[]>([]);
    const [orgId, setOrgId] = useState<string | null>(null);
    const [editingServiceId, setEditingServiceId] = useState<string | null>(null);

    const fetchServicesAndOrg = useCallback(async () => {
        setIsLoading(true);
        if (!authToken) return;
        try {
            const [servicesData, orgData] = await Promise.all([
                listServices(authToken),
                getCurrentOrg(authToken)
            ]);
            setServices(servicesData);
            setOrgId(orgData?.id || null);
        } catch (error) {
            toast({ variant: "destructive", title: "Failed to fetch data", description: error instanceof Error ? error.message : 'Could not fetch services or organization info.' });
        } finally {
            setIsLoading(false);
        }
    }, [authToken, toast]);
    
    useEffect(() => {
       fetchServicesAndOrg();
    }, [fetchServicesAndOrg]);

    const handleAddDocument = () => {
        if (currentDoc && !documents.includes(currentDoc)) {
            setDocuments([...documents, currentDoc]);
            setCurrentDoc('');
        }
    };

    const handleRemoveDocument = (docToRemove: string) => {
        setDocuments(documents.filter(doc => doc !== docToRemove));
    };
    
    const resetForm = () => {
        setName('');
        setUrl('');
        setAmount('');
        setDocuments([]);
        setCurrentDoc('');
        setEditingServiceId(null);
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const payload = {
                name,
                url,
                amount: amount ? parseFloat(amount) : undefined,
                meta_data: { documents }
            };
            
            if(editingServiceId) {
                const result = await updateService(editingServiceId, payload, authToken);
                toast({ title: "Success", description: `Service "${result.name}" updated successfully.` });
            } else {
                const result = await createService(payload, authToken);
                toast({ title: "Success", description: result.message });
            }
            resetForm();
            await fetchServicesAndOrg(); // Refetch after submitting
        } catch (error) {
            toast({ variant: "destructive", title: `Failed to ${editingServiceId ? 'update' : 'create'} service`, description: error instanceof Error ? error.message : 'Unknown error' });
        } finally {
            setIsSubmitting(false);
        }
    };
    
    const handleEditClick = (service: Service) => {
        setEditingServiceId(service.id!);
        setName(service.name);
        setUrl(service.url);
        setAmount(service.amount ? String(service.amount) : '');
        setDocuments(service.meta_data?.documents || []);
    }
    
    const handleDeleteClick = async (serviceId: string) => {
        if(!confirm('Are you sure you want to delete this service? This action cannot be undone.')) return;
        try {
            await deleteService(serviceId, authToken);
            toast({ title: "Service Deleted", description: "The service has been successfully deleted." });
            await fetchServicesAndOrg(); // Refetch
        } catch (error) {
            toast({ variant: "destructive", title: "Failed to delete service", description: error instanceof Error ? error.message : 'Unknown error' });
        }
    };

    const customServices = services.filter(s => s && s.org_id === orgId);
    const commonServices = services.filter(s => s && !s.org_id);

    return (
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-10">
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-5">
                <div className="lg:col-span-2">
                     <form onSubmit={handleSubmit}>
                        <Card className="shadow-sm sticky top-20">
                            <CardHeader>
                                <CardTitle className="text-xl">{editingServiceId ? 'Edit Service' : 'Create New Service'}</CardTitle>
                                 <CardDescription>
                                    {editingServiceId ? 'Modify the details of the existing service.' : 'Add a new custom service for your center.'}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="service-name">Service Name</Label>
                                    <Input id="service-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., PAN Card Application" required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="service-url">Service URL (Optional)</Label>
                                    <Input id="service-url" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://example.com" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="service-amount">Default Amount (Optional)</Label>
                                    <Input id="service-amount" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="e.g., 100" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Required Documents (for expiry tracking)</Label>
                                    <div className="flex gap-2">
                                        <Input value={currentDoc} onChange={(e) => setCurrentDoc(e.target.value)} placeholder="e.g., Aadhaar Card" onKeyDown={(e) => { if(e.key === 'Enter') { e.preventDefault(); handleAddDocument(); }}} />
                                        <Button type="button" variant="outline" size="sm" onClick={handleAddDocument}>Add</Button>
                                    </div>
                                    <div className="flex flex-wrap gap-2 pt-2 min-h-[24px]">
                                        {documents.map(doc => (
                                            <Badge key={doc} variant="secondary" className="flex items-center gap-1">
                                                {doc}
                                                <button type="button" onClick={() => handleRemoveDocument(doc)} className="ml-1 rounded-full p-0.5 hover:bg-destructive/20 text-destructive">
                                                    <X className="h-3 w-3" />
                                                </button>
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="flex justify-end gap-2">
                                {editingServiceId && <Button type="button" variant="ghost" onClick={resetForm}>Cancel Edit</Button>}
                                <Button type="submit" disabled={isSubmitting}>
                                    <PlusCircle className="mr-2 h-4 w-4" />
                                    {isSubmitting ? (editingServiceId ? 'Saving...' : 'Creating...') : (editingServiceId ? 'Save Changes' : 'Create Service')}
                                </Button>
                            </CardFooter>
                        </Card>
                    </form>
                </div>
                <div className="lg:col-span-3">
                     <Card>
                        <CardHeader>
                            <CardTitle>Existing Services</CardTitle>
                            <CardDescription>View and manage all available services.</CardDescription>
                        </CardHeader>
                        <CardContent>
                             <div className="space-y-6">
                                <div>
                                    <h3 className="font-semibold text-lg mb-2">Custom Services</h3>
                                    <div className="border rounded-lg">
                                        {isLoading ? <Skeleton className="h-40 w-full" /> : (
                                            customServices.length > 0 ? (
                                                <Table>
                                                    <TableHeader>
                                                        <TableRow>
                                                            <TableHead>Name</TableHead>
                                                            <TableHead>Amount</TableHead>
                                                            <TableHead className="text-right">Actions</TableHead>
                                                        </TableRow>
                                                    </TableHeader>
                                                    <TableBody>
                                                        {customServices.map(service => (
                                                            <TableRow key={`custom-${service.name}`}>
                                                                <TableCell className="font-medium">{service.name}</TableCell>
                                                                <TableCell>{service.amount ? `₹${service.amount}`: 'N/A'}</TableCell>
                                                                <TableCell className="text-right">
                                                                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEditClick(service)} disabled={!service.id}>
                                                                        <Edit className="h-4 w-4" />
                                                                    </Button>
                                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDeleteClick(service.id!)} disabled={!service.id}>
                                                                        <Trash2 className="h-4 w-4" />
                                                                    </Button>
                                                                </TableCell>
                                                            </TableRow>
                                                        ))}
                                                    </TableBody>
                                                </Table>
                                            ) : (
                                                <div className="px-4 py-8 text-center text-sm text-muted-foreground">
                                                    You haven't created any custom services yet.
                                                </div>
                                            )
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <h3 className="font-semibold text-lg mb-2">Common Services</h3>
                                     <div className="border rounded-lg">
                                        {isLoading ? <Skeleton className="h-40 w-full" /> : (
                                            commonServices.length > 0 ? (
                                            <Table>
                                                    <TableHeader>
                                                        <TableRow>
                                                            <TableHead>Name</TableHead>
                                                            <TableHead>Amount</TableHead>
                                                        </TableRow>
                                                    </TableHeader>
                                                    <TableBody>
                                                        {commonServices.map(service => (
                                                            <TableRow key={`common-${service.name}`}>
                                                                <TableCell className="font-medium">{service.name}</TableCell>
                                                                <TableCell>{service.amount ? `₹${service.amount}`: 'N/A'}</TableCell>
                                                            </TableRow>
                                                        ))}
                                                    </TableBody>
                                                </Table>
                                            ) : (
                                                <div className="px-4 py-8 text-center text-sm text-muted-foreground">
                                                    No common services available.
                                                </div>
                                            )
                                        )}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </main>
    );
};

const ServicesPage = dynamic(() => Promise.resolve(ServicesPageComponent), { ssr: false });

export default ServicesPage;
