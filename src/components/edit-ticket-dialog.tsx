
'use client';

import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useAuthContext } from '@/contexts/auth-context';
import { updateTicket } from '@/services/tickets';
import type { Ticket, User } from '@/lib/types';

interface EditTicketDialogProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    editingTicket: Ticket | null;
    setEditingTicket: React.Dispatch<React.SetStateAction<Ticket | null>>;
    users: User[];
    onTicketUpdated: () => void;
}

export const EditTicketDialog = ({ isOpen, setIsOpen, editingTicket, setEditingTicket, users, onTicketUpdated }: EditTicketDialogProps) => {
    const { authToken } = useAuthContext();
    const { toast } = useToast();
    
    const handleEditInputChange = (field: keyof Ticket, value: string | number) => {
        if (editingTicket) {
            setEditingTicket(prev => ({ ...prev!, [field]: value }));
        }
    };

    const handleUpdateTicket = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingTicket) return;
        try {
            await updateTicket(editingTicket.id, {
                customerName: editingTicket.customerName,
                customerPhone: editingTicket.customerPhone,
                serviceType: editingTicket.serviceType.toUpperCase(),
                amount: editingTicket.amount,
                employeeId: editingTicket.employeeId,
            }, authToken);
            toast({ title: 'Success!', description: `Ticket ${editingTicket.id} has been updated.` });
            setIsOpen(false);
            setEditingTicket(null);
            onTicketUpdated();
        } catch (error) {
            toast({ variant: 'destructive', title: 'Update Failed', description: error instanceof Error ? error.message : 'Could not update ticket.' });
        }
    };

    if (!editingTicket) return null;

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit Ticket {editingTicket.id}</DialogTitle>
                    <DialogDescription>
                        Update the details for this service ticket.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleUpdateTicket}>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="edit-name" className="text-right">
                                Name
                            </Label>
                            <Input
                                id="edit-name"
                                value={editingTicket.customerName}
                                onChange={e => handleEditInputChange('customerName', e.target.value)}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="edit-phone" className="text-right">
                                Phone
                            </Label>
                            <Input
                                id="edit-phone"
                                value={editingTicket.customerPhone}
                                onChange={e => handleEditInputChange('customerPhone', e.target.value)}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="edit-service" className="text-right">
                                Service
                            </Label>
                            <Input
                                id="edit-service"
                                value={editingTicket.serviceType}
                                onChange={e => handleEditInputChange('serviceType', e.target.value)}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="edit-amount" className="text-right">
                                Amount
                            </Label>
                            <Input
                                id="edit-amount"
                                type="number"
                                value={editingTicket.amount}
                                onChange={e => handleEditInputChange('amount', parseFloat(e.target.value))}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="edit-assignee" className="text-right">
                                Assignee
                            </Label>
                            <Select
                                value={editingTicket.employeeId}
                                onValueChange={value => handleEditInputChange('employeeId', value)}
                            >
                                <SelectTrigger className="col-span-3">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {users.map(employee => (
                                        <SelectItem key={employee.id} value={employee.id}>{employee.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit">Save Changes</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};
