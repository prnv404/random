

export type Invoice = {
  id: string;
  customerId: string;
  customerName: string;
  date: string;
  amount: number;
  status: 'Paid' | 'Pending' | 'Overdue';
};

export type Campaign = {
  id:string;
  name: string;
  target: string;
  channel: 'SMS' | 'Email' | 'Call' | 'WhatsApp';
  status: 'Sent' | 'Draft' | 'Scheduled';
  sentDate: string;
  recipientCount: number;
};

export type Employee = {
    id: string;
    name: string;
    avatar: string;
};

export type AlertLog = {
    id: string;
    customer_phone: string;
    customer_email: string | null;
    channel: 'sms' | 'whatsapp' | 'email' | 'call';
    message: string;
    delivery_id: string;
    success: boolean;
    error_message: string | null;
    created_at: string;
    updated_at: string;
};

export const employees: Employee[] = [
    { id: 'EMP-01', name: 'Suresh Menon', avatar: 'https://i.pravatar.cc/150?u=emp01' },
    { id: 'EMP-02', name: 'Anjali Nair', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d' },
    { id: 'EMP-03', name: 'Bipin George', avatar: 'https://i.pravatar.cc/150?u=emp03' },
];

export const campaigns: Campaign[] = [];

export const invoices: Invoice[] = [];
