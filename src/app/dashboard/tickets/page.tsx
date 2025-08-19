
'use client';
import * as React from 'react';
import type { User, Service, Ticket } from '@/lib/types';
import { listTickets, updateTicketStatus } from '@/services/tickets';
import { listUsers } from '@/services/user';
import { listServices } from '@/services/services';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { format } from 'date-fns';
import dynamic from 'next/dynamic';
import { useState, useMemo, useEffect, useCallback } from 'react';
import { SendAlertDialog } from '@/components/send-alert-dialog';
import { FinalizeTicketDialog } from '@/components/finalize-ticket-dialog';
import { useToast } from '@/hooks/use-toast';
import { useAuthContext } from '@/contexts/auth-context';
import { Skeleton } from '@/components/ui/skeleton';
import { EditTicketDialog } from '@/components/edit-ticket-dialog';
import { TicketFilters } from '@/components/ticket-filters';
import { TicketHeader } from '@/components/ticket-header';
import { TicketBoard } from '@/components/ticket-board';

const statusOrderForBoard: Ticket['status'][] = ['pending', 'in_progress', 'completed'];

const TicketsPageComponent = () => {
  const { authToken } = useAuthContext();
  const { toast } = useToast();

  const [ticketData, setTicketData] = useState<Ticket[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [filters, setFilters] = useState({
    searchTerm: '',
    employeeId: 'all',
    serviceType: 'all',
    date: undefined as Date | undefined
  });
  
  const [draggedTicketId, setDraggedTicketId] = useState<string | null>(null);
  const [dragOverStatus, setDragOverStatus] = useState<Ticket['status'] | null>(null);
  
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [ticketToFinalize, setTicketToFinalize] = useState<Ticket | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingTicket, setEditingTicket] = useState<Ticket | null>(null);
  
  const [confirmationState, setConfirmationState] = useState<{ isOpen: boolean; ticketId: string | null; targetStatus: Ticket['status'] | null }>({ isOpen: false, ticketId: null, targetStatus: null });

  const { searchTerm, employeeId, serviceType, date } = filters;

  const fetchInitialData = useCallback(async (showLoading = true) => {
    if (!authToken) return;
    if(showLoading) setIsLoading(true);

    try {
        const [tickets, usersData, servicesData] = await Promise.all([
            listTickets({
                search: searchTerm,
                employeeId: employeeId !== 'all' ? employeeId : undefined,
                serviceType: serviceType !== 'all' ? serviceType : undefined,
                createdAt: date ? format(date, 'yyyy-MM-dd') : undefined,
            }, authToken),
            listUsers(authToken),
            listServices(authToken)
        ]);
        setTicketData(tickets);
        setUsers(usersData);
        setServices(servicesData);
    } catch (error) {
        toast({ variant: 'destructive', title: 'Error fetching data', description: error instanceof Error ? error.message : 'Could not fetch initial data.' });
    } finally {
        if(showLoading) setIsLoading(false);
    }
  }, [authToken, searchTerm, employeeId, serviceType, date, toast]);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  const proceedWithStatusChange = async (ticketId: string, newStatus: Ticket['status'], amount?: number) => {
    const originalTickets = [...ticketData];
    // Optimistically update UI
    setTicketData(currentTickets =>
        currentTickets.map(ticket => ticket.id === ticketId ? { ...ticket, status: newStatus, amount: amount ?? ticket.amount } : ticket)
    );

    try {
        await updateTicketStatus(ticketId, { status: newStatus, amount }, authToken);
        toast({ title: "Status Updated", description: `Ticket ${ticketId} moved to ${newStatus}.`});
        await fetchInitialData(false); // Re-fetch to get latest state, without global loading
    } catch (error) {
        setTicketData(originalTickets); // Revert on error
        toast({ variant: 'destructive', title: 'Update Failed', description: error instanceof Error ? error.message : 'Could not update status.' });
    }
  };

  const handleStatusChange = (ticketId: string, newStatus: Ticket['status']) => {
      const ticket = ticketData.find(t => t.id === ticketId);
      if (!ticket) return;

      if (newStatus === 'completed' || newStatus === 'cancelled') {
        setConfirmationState({ isOpen: true, ticketId, targetStatus: newStatus });
      } else {
          proceedWithStatusChange(ticketId, newStatus);
      }
  };

  const handleConfirmAction = () => {
      const { ticketId, targetStatus } = confirmationState;
      if (!ticketId || !targetStatus) return;

      const ticket = ticketData.find(t => t.id === ticketId);
      if(!ticket) return;
      
      setConfirmationState({ isOpen: false, ticketId: null, targetStatus: null });

      if (targetStatus === 'completed') {
        setTicketToFinalize(ticket);
      } else { // For 'cancelled' or other statuses if needed
          proceedWithStatusChange(ticketId, targetStatus);
      }
  };

  const handleFinalizeTicketConfirm = (ticketId: string, amount: number, sendInvoice: boolean, invoiceMethod: 'whatsapp' | 'sms') => {
    if (sendInvoice) {
        const ticket = ticketData.find(t => t.id === ticketId);
         toast({
            title: 'Invoice Sent!',
            description: `Sent a ${invoiceMethod} invoice to ${ticket?.customerName} for ₹${amount}.`,
        });
    }
    proceedWithStatusChange(ticketId, 'completed', amount);
    setTicketToFinalize(null);
  };
  
  const handleAlertClick = (ticket: Ticket) => {
      setSelectedTicket(ticket);
      setIsAlertOpen(true);
  }

  const handleEditClick = (ticket: Ticket) => {
    setEditingTicket(ticket);
    setIsEditDialogOpen(true);
  };

  const ticketsByStatus = useMemo(() => {
    return statusOrderForBoard.reduce((acc, status) => {
        acc[status] = ticketData.filter(t => t.status === status);
        return acc;
    }, {} as Record<Ticket['status'], Ticket[]>);
  }, [ticketData]);
  
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, ticketId: string) => {
      e.dataTransfer.setData("ticketId", ticketId);
      setDraggedTicketId(ticketId);
  }
  
  const handleDragEnd = () => {
      setDraggedTicketId(null);
      setDragOverStatus(null);
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault(); 
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, newStatus: Ticket['status']) => {
      e.preventDefault();
      const ticketId = e.dataTransfer.getData("ticketId");
      if(ticketId) {
          const ticket = ticketData.find(t => t.id === ticketId);
          if (ticket && ticket.status !== newStatus) {
            handleStatusChange(ticketId, newStatus);
          }
      }
      handleDragEnd();
  }
  
  const handleDragEnter = (status: Ticket['status']) => {
      setDragOverStatus(status);
  }
  
  const servicePortals = useMemo(() => {
    return services.reduce((acc, service) => {
        acc[service.name] = service.url;
        return acc;
    }, {} as Record<string, string>)
  }, [services]);

  const uniqueServiceTypes = useMemo(() => {
    const allServiceTypes = new Set(services.map(s => s.name.toUpperCase()));
    return [...allServiceTypes];
  }, [services]);

  if (isLoading) {
    return (
        <main className="flex flex-col flex-1 gap-4 p-4 md:gap-8 md:p-10">
            <div className="flex items-center justify-between">
                <Skeleton className="h-10 w-64" />
                <Skeleton className="h-10 w-48" />
            </div>
             <div className="py-4">
                <TicketFilters 
                    filters={filters}
                    setFilters={setFilters}
                    users={users}
                    uniqueServiceTypes={uniqueServiceTypes}
                />
            </div>
            <div className="grid flex-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="space-y-4">
                        <Skeleton className="h-8 w-40" />
                        <Skeleton className="h-48 w-full" />
                        <Skeleton className="h-48 w-full" />
                    </div>
                ))}
            </div>
        </main>
    );
  }

  return (
    <>
    <div className="h-full flex flex-col" onDragEnd={handleDragEnd}>
       <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <TicketHeader 
                isCreateDialogOpen={isCreateDialogOpen}
                setIsCreateDialogOpen={setIsCreateDialogOpen}
                users={users}
                services={services}
                uniqueServiceTypes={uniqueServiceTypes}
                onTicketCreated={() => fetchInitialData(true)}
            />
            <TicketFilters 
                filters={filters}
                setFilters={setFilters}
                users={users}
                uniqueServiceTypes={uniqueServiceTypes}
            />
       </div>


       <div className="flex-1 overflow-y-auto">
            <TicketBoard 
                ticketsByStatus={ticketsByStatus}
                statusOrder={statusOrderForBoard}
                dragOverStatus={dragOverStatus}
                isLoading={isLoading}
                handleDragStart={handleDragStart}
                handleDrop={handleDrop}
                handleDragOver={handleDragOver}
                handleDragEnter={handleDragEnter}
                setDragOverStatus={setDragOverStatus}
                onStatusChange={handleStatusChange}
                onAlertClick={handleAlertClick}
                onEditClick={handleEditClick}
                servicePortals={servicePortals}
            />
       </div>
    </div>
    {selectedTicket && (
        <SendAlertDialog 
            isOpen={isAlertOpen}
            setIsOpen={setIsAlertOpen}
            customerName={selectedTicket.customerName}
            customerPhone={selectedTicket.customerPhone}
            defaultMessage={`Hi ${selectedTicket.customerName}, this is an update regarding your service request for ${selectedTicket.serviceType}.`}
        />
    )}
    {ticketToFinalize && (
        <FinalizeTicketDialog
            isOpen={!!ticketToFinalize}
            setIsOpen={() => setTicketToFinalize(null)}
            ticket={ticketToFinalize}
            service={services.find(s => s.name === ticketToFinalize.serviceType)!}
            onConfirm={handleFinalizeTicketConfirm}
        />
    )}
    {editingTicket && (
        <EditTicketDialog
            isOpen={isEditDialogOpen}
            setIsOpen={setIsEditDialogOpen}
            editingTicket={editingTicket}
            setEditingTicket={setEditingTicket}
            users={users}
            onTicketUpdated={() => fetchInitialData(true)}
        />
    )}
      <AlertDialog open={confirmationState.isOpen} onOpenChange={(open) => !open && setConfirmationState({ isOpen: false, ticketId: null, targetStatus: null })}>
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                    This will move the ticket to the '{confirmationState.targetStatus}' status. This action can be changed later if needed.
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setConfirmationState({ isOpen: false, ticketId: null, targetStatus: null })}>
                    Cancel
                </AlertDialogCancel>
                <AlertDialogAction onClick={handleConfirmAction}>Continue</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

const TicketsPage = dynamic(() => Promise.resolve(TicketsPageComponent), { ssr: false });

export default TicketsPage;


    