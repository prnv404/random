

export type DashboardMetric = {
  current: number;
  change: string;
  changeType: 'increase' | 'decrease' | 'no_change';
};

export type OpenTicketsMetric = {
    current: number;
    pendingApproval: number;
}

export type DashboardSummary = {
  totalRevenue: DashboardMetric;
  totalCustomers: DashboardMetric;
  servicesDelivered: DashboardMetric;
  openTickets: OpenTicketsMetric;
};

export type ChartDataPoint = {
  date: string;
  revenue: number;
};

export type ChartApiResponse = {
  name: string;
  data: ChartDataPoint[];
  config: {
    [key: string]: {
      label: string;
      color: string;
    };
  };
};

export type ServicePerformance = {
  serviceName: string;
  volume: number;
  totalRevenue: number;
  rank: string;
};

export type EmployeePerformance = {
  employeeId: string;
  employeeName: string;
  avatarUrl: string;
  servicesCompleted: number;
  revenueGenerated: number;
  rank: string;
};

export type PerformanceData = {
  servicePerformance: ServicePerformance[];
  employeePerformance: EmployeePerformance[];
};

export type CustomerDocument = {
  id: string;
  docType: string;
  docNumber: string;
  issueDate: string;
  expiryDate: string;
  createdAt?: string;
  updatedAt?: string;
};

export type Customer = {
  id: string;
  name: string;
  email: string | null;
  phone: string;
  joinDate: string;
  lastVisit: string | null;
  documents?: CustomerDocument[];
  metadata?: {
    [key: string]: any;
  };
};

export type PaginatedCustomers = {
  customers: Customer[];
  pagination: {
    totalCustomers: number;
    currentPage: number;
    limit: number;
    totalPages: number;
  };
};

export type ExpirationItem = {
    customer: {
        id: string;
        name: string;
        phone: string;
    };
    document: {
        type: string;
        number: string;
    };
    expiryDate: string;
    daysLeft: number;
};

export type ExpirationsResponse = {
    expirations: ExpirationItem[];
    meta?: {
        total: number;
        expiringSoon: number;
    };
}

export type Ticket = {
  id: string;
  customerName: string;
  customerPhone: string;
  serviceType: string;
  amount: number;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  employeeId: string;
  createdAt: string;
  updatedAt: string;
  employeeName?: string;
  employeeAvatar?: string;
};

export type Service = {
  id: string;
  name: string;
  url: string;
  amount?: number;
  org_id?: string | null;
  meta_data?: {
      documents?: string[];
  }
};

export type User = {
    id: string;
    name: string;
    avatar: string;
    phone?: string | null;
    role?: string;
    created_at?: string;
    updated_at?: string;
};

export type CallLog = {
    id: string;
    customerName: string;
    customerPhone: string;
    callType: 'Incoming' | 'Outgoing' | 'Missed';
    duration: string;
    date: string;
    recordingUrl: string | null;
    employeeName: string;
    employeeAvatar: string;
};

export type PaginatedCallLog = {
    callLogs: CallLog[];
    pagination: {
        currentPage: number;
        totalPages: number;
        totalLogs: number;
        limit: number;
    };
};


export type AlertLog = {
    id: string;
    customer_phone: string;
    customer_email: string | null;
    channel: 'sms' | 'whatsapp' | 'email' | 'call';
    message: string;
    success: boolean;
    error_message: string | null;
    created_at: string;
    updated_at: string;
    employee: {
      name: string;
      email: string;
      avatar?: string;
    };
};

export type PaginatedAlertLog = {
    alertLogs: AlertLog[];
    pagination: {
        currentPage: number;
        totalPages: number;
        totalLogs: number;
        limit: number;
    };
};
