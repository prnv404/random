
'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';
import { CreateTicketDialog } from '@/components/create-ticket-dialog';
import type { User, Service } from '@/lib/types';

interface TicketHeaderProps {
    isCreateDialogOpen: boolean;
    setIsCreateDialogOpen: (isOpen: boolean) => void;
    users: User[];
    services: Service[];
    uniqueServiceTypes: string[];
    onTicketCreated: () => void;
}

export const TicketHeader = ({
    isCreateDialogOpen,
    setIsCreateDialogOpen,
    users,
    services,
    uniqueServiceTypes,
    onTicketCreated,
}: TicketHeaderProps) => {
    return (
        <div className="p-4 md:p-10 md:pb-4">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold">Service Tickets</h1>
                    <p className="text-muted-foreground">
                        Track and manage all customer service requests.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <CreateTicketDialog
                        isOpen={isCreateDialogOpen}
                        setIsOpen={setIsCreateDialogOpen}
                        users={users}
                        services={services}
                        uniqueServiceTypes={uniqueServiceTypes}
                        onTicketCreated={onTicketCreated}
                    />
                     <Button asChild variant="outline" size="sm" className="gap-1">
                        <Link href="/dashboard/settings/services">
                            <Settings className="h-4 w-4" />
                            Manage Services
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    );
};
