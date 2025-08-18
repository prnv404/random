
'use client';

import React, { useState, useRef, useCallback } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { PlusCircle, ChevronsUpDown, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuthContext } from '@/contexts/auth-context';
import { listCustomers } from '@/services/customer';
import { createTicket } from '@/services/tickets';
import { cn } from '@/lib/utils';
import type { User, Service, Customer } from '@/lib/types';

interface CreateTicketDialogProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    users: User[];
    services: Service[];
    uniqueServiceTypes: string[];
    onTicketCreated: () => void;
}

export const CreateTicketDialog = ({ isOpen, setIsOpen, users, services, uniqueServiceTypes, onTicketCreated }: CreateTicketDialogProps) => {
    const { authToken } = useAuthContext();
    const { toast } = useToast();

    const [newTicket, setNewTicket] = useState({
        customerName: '',
        customerPhone: '',
        serviceType: '',
        amount: '',
        userId: '',
    });

    const [isSearchingCustomer, setIsSearchingCustomer] = useState(false);
    const [customerSearchResults, setCustomerSearchResults] = useState<Customer[]>([]);
    const [isCustomerSearchOpen, setIsCustomerSearchOpen] = useState(false);
    const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const phoneInputRef = useRef<HTMLInputElement>(null);
    const nameInputRef = useRef<HTMLInputElement>(null);
    const assignToTriggerRef = useRef<HTMLButtonElement>(null);
    const servicePopoverTriggerRef = useRef<HTMLButtonElement>(null);
    const serviceInputRef = useRef<HTMLInputElement>(null);
    const amountInputRef = useRef<HTMLInputElement>(null);
    const submitButtonRef = useRef<HTMLButtonElement>(null);
    const commandRef = useRef<HTMLDivElement>(null);

    const handleInputChange = (field: keyof typeof newTicket, value: string) => {
        setNewTicket(prev => ({ ...prev, [field]: value }));
    }

    const handlePhoneSearch = useCallback((phone: string) => {
        handleInputChange('customerPhone', phone);
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }
        if (phone.length < 3) {
            setIsSearchingCustomer(false);
            setCustomerSearchResults([]);
            return;
        }
        setIsSearchingCustomer(true);
        setIsCustomerSearchOpen(true);

        searchTimeoutRef.current = setTimeout(async () => {
            try {
                const data = await listCustomers({ search: phone, limit: 5 }, authToken);
                if (data && data.customers.length > 0) {
                    setCustomerSearchResults(data.customers);
                } else {
                    setCustomerSearchResults([]);
                }
            } catch (error) {
                setCustomerSearchResults([]);
            } finally {
                setIsSearchingCustomer(false);
            }
        }, 300);
    }, [authToken, handleInputChange]);

    const handleCustomerSelect = (customer: Customer) => {
        setNewTicket(prev => ({
            ...prev,
            customerName: customer.name,
            customerPhone: customer.phone,
        }));
        setCustomerSearchResults([]);
        setIsCustomerSearchOpen(false);
        nameInputRef.current?.focus();
    }

    const handleCreateTicket = async (e: React.FormEvent) => {
        e.preventDefault();
        const { customerName, customerPhone, serviceType, amount, userId } = newTicket;
        
        if(!customerName || !customerPhone || !serviceType || !userId) {
            toast({ variant: 'destructive', title: 'Error', description: 'Please fill out all required fields.'});
            return;
        }
        try {
          await createTicket({ customerName, customerPhone, serviceType: serviceType.toUpperCase(), amount: amount ? parseFloat(amount) : undefined, userId }, authToken);
          toast({ title: 'Success!', description: `Ticket for ${serviceType.toUpperCase()} has been created.`});
          setIsOpen(false);
          setNewTicket({ customerName: '', customerPhone: '', serviceType: '', amount: '', userId: '' });
          onTicketCreated();
        } catch (error) {
          toast({ variant: 'destructive', title: 'Creation Failed', description: error instanceof Error ? error.message : 'Could not create ticket.' });
        }
    }
    
    const handleKeyDown = (e: React.KeyboardEvent, nextFieldRef?: React.RefObject<HTMLElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const activeElement = document.activeElement as HTMLElement;

            if (activeElement?.getAttribute('role') === 'combobox') {
                 const selectedItem = commandRef.current?.querySelector('[aria-selected="true"]') as HTMLElement;
                 if (selectedItem) {
                     selectedItem.click();
                 }
            }
            
            nextFieldRef?.current?.focus();
        }
    };


    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button size="sm" className="gap-1">
                    <PlusCircle className="h-4 w-4" />
                    Create Ticket
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create New Service Ticket</DialogTitle>
                    <DialogDescription>
                        Fill in the details below to log a new service for a customer.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleCreateTicket}>
                    <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="phone">
                                Phone
                            </Label>
                            <div className="relative">
                                <Command shouldFilter={false} className="overflow-visible bg-transparent" ref={commandRef}>
                                    <CommandInput
                                        id="phone"
                                        ref={phoneInputRef}
                                        placeholder="Search customer by phone..."
                                        value={newTicket.customerPhone}
                                        onValueChange={handlePhoneSearch}
                                        onBlur={() => setTimeout(() => setIsCustomerSearchOpen(false), 150)}
                                        onFocus={() => setIsCustomerSearchOpen(true)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                const selectedItem = commandRef.current?.querySelector('[aria-selected="true"]') as HTMLElement;
                                                if (selectedItem) {
                                                    selectedItem.click();
                                                } else {
                                                    nameInputRef.current?.focus();
                                                }
                                            }
                                        }}
                                    />
                                    {isCustomerSearchOpen && (
                                        <div className="absolute top-full z-10 mt-1 w-full rounded-md border bg-popover text-popover-foreground shadow-md">
                                            <CommandList>
                                                {isSearchingCustomer ? (
                                                    <div className="p-2 text-center text-sm text-muted-foreground">Searching...</div>
                                                ) : customerSearchResults.length > 0 ? (
                                                    customerSearchResults.map(customer => (
                                                        <CommandItem
                                                            key={customer.id}
                                                            value={customer.phone}
                                                            onSelect={() => handleCustomerSelect(customer)}
                                                            className="cursor-pointer"
                                                        >
                                                            <div>
                                                                <p className="font-medium">{customer.name}</p>
                                                                <p className="text-xs text-muted-foreground">{customer.phone}</p>
                                                            </div>
                                                        </CommandItem>
                                                    ))
                                                ) : newTicket.customerPhone.length > 2 && (
                                                    <CommandEmpty>No customer found.</CommandEmpty>
                                                )}
                                            </CommandList>
                                        </div>
                                    )}
                                </Command>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="name">
                                Name
                            </Label>
                            <Input
                                id="name"
                                ref={nameInputRef}
                                value={newTicket.customerName}
                                onChange={e => handleInputChange('customerName', e.target.value)}
                                placeholder="Customer's Name"
                                onKeyDown={(e) => handleKeyDown(e, assignToTriggerRef)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="assign-to">
                                Assign To
                            </Label>
                            <Select
                                onValueChange={(value) => {
                                    handleInputChange('userId', value);
                                }}
                                value={newTicket.userId}
                            >
                                <SelectTrigger
                                    id="assign-to"
                                    ref={assignToTriggerRef}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            servicePopoverTriggerRef.current?.focus();
                                        }
                                    }}
                                >
                                    <SelectValue placeholder="Select a team member..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {users.map(user => (
                                        <SelectItem key={user.id} value={user.id}>{user.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="service-type">
                                Service
                            </Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        id="service-type"
                                        ref={servicePopoverTriggerRef}
                                        variant="outline"
                                        role="combobox"
                                        className="w-full justify-between font-normal"
                                    >
                                        {newTicket.serviceType
                                            ? uniqueServiceTypes.find((type) => type.toLowerCase() === newTicket.serviceType.toLowerCase()) || 'Custom: ' + newTicket.serviceType
                                            : "Select service..."}
                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                                    <Command>
                                        <CommandInput
                                            ref={serviceInputRef}
                                            placeholder="Search service or type custom..."
                                            value={newTicket.serviceType}
                                            onValueChange={(value) => {
                                                handleInputChange('serviceType', value);
                                                const selected = services.find(s => s.name.toLowerCase() === value.toLowerCase());
                                                if (selected?.amount) {
                                                    handleInputChange('amount', String(selected.amount));
                                                }
                                            }}
                                            onKeyDown={(e) => handleKeyDown(e, amountInputRef)}
                                        />
                                        <CommandList>
                                            <CommandEmpty>No service found. Type to add custom.</CommandEmpty>
                                            <CommandGroup>
                                                {uniqueServiceTypes.map((type) => (
                                                    <CommandItem
                                                        key={type}
                                                        value={type}
                                                        onSelect={(currentValue) => {
                                                            const finalValue = currentValue.toUpperCase() === newTicket.serviceType.toUpperCase() ? "" : currentValue.toUpperCase()
                                                            handleInputChange('serviceType', finalValue);
                                                            // Programmatically close and move focus
                                                            servicePopoverTriggerRef.current?.click();
                                                            amountInputRef.current?.focus();
                                                        }}
                                                    >
                                                        <Check
                                                            className={cn(
                                                                "mr-2 h-4 w-4",
                                                                newTicket.serviceType.toUpperCase() === type.toUpperCase() ? "opacity-100" : "opacity-0"
                                                            )}
                                                        />
                                                        {type}
                                                    </CommandItem>
                                                ))}
                                            </CommandGroup>
                                        </CommandList>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="amount">
                                Amount
                            </Label>
                            <Input
                                id="amount"
                                ref={amountInputRef}
                                value={newTicket.amount}
                                onChange={e => handleInputChange('amount', e.target.value)}
                                type="number"
                                placeholder="Optional"
                                onKeyDown={(e) => handleKeyDown(e, submitButtonRef)}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button ref={submitButtonRef} type="submit">Create Ticket</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};
