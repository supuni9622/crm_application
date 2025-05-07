import { 
  Customer, 
  Product, 
  Transaction, 
  Campaign, 
  Segment, 
  DashboardStats,
  Subscription 
} from '@/types';
import { getToken } from '@/lib/auth';

// Base URL for API (would be environment variable in real app)
const API_URL = '/api';

// Delay for simulating API calls
const DELAY = 500;

// Helper function to simulate API delay
async function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Get default headers for API requests
function getHeaders(): Record<string, string> {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

// Generic fetch function with error handling
async function fetchData<T>(url: string, options?: RequestInit): Promise<T> {
  await delay(DELAY); // Simulate network delay
  
  // In a real app, this would be a fetch to your actual API
  // For demo, returning mock data
  
  // Get the endpoint from the URL
  const endpoint = url.split('/').pop();
  
  switch (endpoint) {
    case 'dashboard':
      return mockDashboardStats as T;
    case 'customers':
      return mockCustomers as T;
    case 'products':
      return mockProducts as T;
    case 'transactions':
      return mockTransactions as T;
    case 'campaigns':
      return mockCampaigns as T;
    case 'segments':
      return mockSegments as T;
    case 'subscription':
      return mockSubscription as T;
    default:
      throw new Error(`Unknown endpoint: ${endpoint}`);
  }
}

// API functions
export async function getDashboardStats(): Promise<DashboardStats> {
  return fetchData<DashboardStats>(`${API_URL}/dashboard`);
}

export async function getCustomers(): Promise<Customer[]> {
  return fetchData<Customer[]>(`${API_URL}/customers`);
}

export async function getCustomerById(id: string): Promise<Customer> {
  return fetchData<Customer>(`${API_URL}/customers/${id}`);
}

export async function getProducts(): Promise<Product[]> {
  return fetchData<Product[]>(`${API_URL}/products`);
}

export async function getTransactions(): Promise<Transaction[]> {
  return fetchData<Transaction[]>(`${API_URL}/transactions`);
}

export async function getCampaigns(): Promise<Campaign[]> {
  return fetchData<Campaign[]>(`${API_URL}/campaigns`);
}

export async function getSegments(): Promise<Segment[]> {
  return fetchData<Segment[]>(`${API_URL}/segments`);
}

export async function getSubscription(): Promise<Subscription> {
  return fetchData<Subscription>(`${API_URL}/subscription`);
}

// Mock data
const mockDashboardStats: DashboardStats = {
  total_customers: 1247,
  new_customers: 28,
  active_campaigns: 3,
  total_revenue: 42875.99,
  campaign_performance: {
    open_rate: 32.4,
    click_rate: 18.7,
    opt_out_rate: 0.8
  },
  recent_transactions: [
    {
      id: 'tx1',
      customer_id: 'cust1',
      customer_name: 'John Smith',
      product_id: 'prod1',
      product_name: 'Annual Subscription',
      amount: 199.99,
      date: '2025-06-10T10:30:00',
      status: 'completed'
    },
    {
      id: 'tx2',
      customer_id: 'cust2',
      customer_name: 'Jane Cooper',
      product_id: 'prod2',
      product_name: 'Premium Package',
      amount: 349.99,
      date: '2025-06-09T14:20:00',
      status: 'completed'
    },
    {
      id: 'tx3',
      customer_id: 'cust3',
      customer_name: 'Robert Johnson',
      product_id: 'prod3',
      product_name: 'Basic Plan',
      amount: 99.99,
      date: '2025-06-09T09:15:00',
      status: 'completed'
    }
  ],
  revenue_by_period: [
    { period: 'Jan', amount: 4200 },
    { period: 'Feb', amount: 4800 },
    { period: 'Mar', amount: 5500 },
    { period: 'Apr', amount: 4900 },
    { period: 'May', amount: 5700 },
    { period: 'Jun', amount: 6200 }
  ]
};

const mockCustomers: Customer[] = [
  {
    id: 'cust1',
    name: 'John Smith',
    email: 'john.smith@example.com',
    phone: '+1 (555) 123-4567',
    created_at: '2024-01-15T10:30:00',
    last_activity: '2025-06-10T14:25:00',
    opt_in_status: true,
    channel_preference: ['sms', 'email'],
    segment_ids: ['seg1', 'seg2'],
    total_spent: 1299.99,
    orders_count: 5
  },
  {
    id: 'cust2',
    name: 'Jane Cooper',
    email: 'jane.cooper@example.com',
    phone: '+1 (555) 987-6543',
    created_at: '2024-02-20T09:15:00',
    last_activity: '2025-06-09T11:10:00',
    opt_in_status: true,
    channel_preference: ['email'],
    segment_ids: ['seg2'],
    total_spent: 899.50,
    orders_count: 3
  },
  {
    id: 'cust3',
    name: 'Robert Johnson',
    email: 'robert.johnson@example.com',
    phone: '+1 (555) 333-2222',
    created_at: '2024-03-05T14:45:00',
    last_activity: '2025-06-08T16:30:00',
    opt_in_status: false,
    channel_preference: [],
    segment_ids: ['seg3'],
    total_spent: 499.99,
    orders_count: 2
  },
  {
    id: 'cust4',
    name: 'Emily Williams',
    email: 'emily.williams@example.com',
    phone: '+1 (555) 444-5555',
    created_at: '2024-03-10T11:20:00',
    last_activity: '2025-06-09T09:45:00',
    opt_in_status: true,
    channel_preference: ['sms', 'email'],
    segment_ids: ['seg1', 'seg4'],
    total_spent: 1599.99,
    orders_count: 7
  },
  {
    id: 'cust5',
    name: 'Michael Brown',
    email: 'michael.brown@example.com',
    phone: '+1 (555) 777-8888',
    created_at: '2024-04-15T10:10:00',
    last_activity: '2025-06-07T13:15:00',
    opt_in_status: true,
    channel_preference: ['email'],
    segment_ids: ['seg2'],
    total_spent: 799.99,
    orders_count: 4
  }
];

const mockProducts: Product[] = [
  {
    id: 'prod1',
    name: 'Annual Subscription',
    description: 'Full access to all features for 12 months',
    price: 199.99,
    category: 'Subscription',
    inventory: 999,
    image_url: 'https://images.pexels.com/photos/5082579/pexels-photo-5082579.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    total_sales: 87,
    total_revenue: 17399.13
  },
  {
    id: 'prod2',
    name: 'Premium Package',
    description: 'Advanced features for power users',
    price: 349.99,
    category: 'Package',
    inventory: 100,
    image_url: 'https://images.pexels.com/photos/5082576/pexels-photo-5082576.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    total_sales: 42,
    total_revenue: 14699.58
  },
  {
    id: 'prod3',
    name: 'Basic Plan',
    description: 'Essential features for beginners',
    price: 99.99,
    category: 'Subscription',
    inventory: 999,
    image_url: 'https://images.pexels.com/photos/5082577/pexels-photo-5082577.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    total_sales: 124,
    total_revenue: 12398.76
  },
  {
    id: 'prod4',
    name: 'SMS Credit Pack',
    description: '5000 SMS credits',
    price: 49.99,
    category: 'Add-on',
    inventory: 999,
    image_url: 'https://images.pexels.com/photos/5082578/pexels-photo-5082578.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    total_sales: 56,
    total_revenue: 2799.44
  }
];

const mockTransactions: Transaction[] = [
  {
    id: 'tx1',
    customer_id: 'cust1',
    customer_name: 'John Smith',
    product_id: 'prod1',
    product_name: 'Annual Subscription',
    amount: 199.99,
    date: '2025-06-10T10:30:00',
    status: 'completed'
  },
  {
    id: 'tx2',
    customer_id: 'cust2',
    customer_name: 'Jane Cooper',
    product_id: 'prod2',
    product_name: 'Premium Package',
    amount: 349.99,
    date: '2025-06-09T14:20:00',
    status: 'completed'
  },
  {
    id: 'tx3',
    customer_id: 'cust3',
    customer_name: 'Robert Johnson',
    product_id: 'prod3',
    product_name: 'Basic Plan',
    amount: 99.99,
    date: '2025-06-09T09:15:00',
    status: 'completed'
  },
  {
    id: 'tx4',
    customer_id: 'cust4',
    customer_name: 'Emily Williams',
    product_id: 'prod4',
    product_name: 'SMS Credit Pack',
    amount: 49.99,
    date: '2025-06-08T16:45:00',
    status: 'completed'
  },
  {
    id: 'tx5',
    customer_id: 'cust5',
    customer_name: 'Michael Brown',
    product_id: 'prod2',
    product_name: 'Premium Package',
    amount: 349.99,
    date: '2025-06-08T11:30:00',
    status: 'refunded'
  },
  {
    id: 'tx6',
    customer_id: 'cust1',
    customer_name: 'John Smith',
    product_id: 'prod4',
    product_name: 'SMS Credit Pack',
    amount: 49.99,
    date: '2025-06-07T13:15:00',
    status: 'completed'
  },
  {
    id: 'tx7',
    customer_id: 'cust2',
    customer_name: 'Jane Cooper',
    product_id: 'prod3',
    product_name: 'Basic Plan',
    amount: 99.99,
    date: '2025-06-07T10:10:00',
    status: 'processing'
  }
];

const mockCampaigns: Campaign[] = [
  {
    id: 'camp1',
    title: 'Summer Sale Announcement',
    type: 'sms',
    status: 'completed',
    created_at: '2025-06-01T09:00:00',
    scheduled_at: '2025-06-02T10:00:00',
    sent_count: 856,
    delivered_count: 842,
    failed_count: 14,
    opt_out_count: 3,
    message: 'Hot summer deals! 30% off all products this week. Shop now at example.com/summer',
    segment_ids: ['seg1', 'seg2']
  },
  {
    id: 'camp2',
    title: 'New Product Launch',
    type: 'sms',
    status: 'scheduled',
    created_at: '2025-06-08T14:30:00',
    scheduled_at: '2025-06-15T09:00:00',
    sent_count: 0,
    delivered_count: 0,
    failed_count: 0,
    opt_out_count: 0,
    message: 'Introducing our newest product! Be the first to try it out at example.com/new',
    segment_ids: ['seg1', 'seg4']
  },
  {
    id: 'camp3',
    title: 'Birthday Discount',
    type: 'automated',
    status: 'running',
    created_at: '2025-05-15T11:20:00',
    sent_count: 42,
    delivered_count: 41,
    failed_count: 1,
    opt_out_count: 0,
    message: 'Happy Birthday! Enjoy 15% off your next purchase with code BIRTHDAY15',
    segment_ids: [],
    trigger: 'birthday'
  },
  {
    id: 'camp4',
    title: 'First Purchase Thank You',
    type: 'automated',
    status: 'running',
    created_at: '2025-05-10T10:45:00',
    sent_count: 28,
    delivered_count: 28,
    failed_count: 0,
    opt_out_count: 0,
    message: 'Thank you for your first purchase! Use code THANKS10 for 10% off your next order',
    segment_ids: [],
    trigger: 'first_purchase'
  },
  {
    id: 'camp5',
    title: 'Flash Sale Notification',
    type: 'sms',
    status: 'draft',
    created_at: '2025-06-09T16:15:00',
    sent_count: 0,
    delivered_count: 0,
    failed_count: 0,
    opt_out_count: 0,
    message: 'Flash sale! 24 hours only - 40% off everything. Shop now: example.com/flash',
    segment_ids: ['seg1', 'seg2', 'seg3']
  }
];

const mockSegments: Segment[] = [
  {
    id: 'seg1',
    name: 'Active Customers',
    description: 'Customers who made a purchase in the last 30 days',
    customer_count: 425,
    created_at: '2025-01-15T10:30:00',
    filters: [
      {
        field: 'last_activity',
        operator: 'greater_than',
        value: '30 days ago'
      }
    ]
  },
  {
    id: 'seg2',
    name: 'SMS Subscribers',
    description: 'Customers who have opted-in to SMS communications',
    customer_count: 782,
    created_at: '2025-01-16T11:45:00',
    filters: [
      {
        field: 'opt_in_status',
        operator: 'equals',
        value: true
      },
      {
        field: 'channel_preference',
        operator: 'contains',
        value: 'sms'
      }
    ]
  },
  {
    id: 'seg3',
    name: 'High-Value Customers',
    description: 'Customers who have spent over $1000',
    customer_count: 164,
    created_at: '2025-02-20T14:15:00',
    filters: [
      {
        field: 'total_spent',
        operator: 'greater_than',
        value: 1000
      }
    ]
  },
  {
    id: 'seg4',
    name: 'New Customers',
    description: 'Customers who signed up in the last 7 days',
    customer_count: 28,
    created_at: '2025-06-01T09:30:00',
    filters: [
      {
        field: 'created_at',
        operator: 'greater_than',
        value: '7 days ago'
      }
    ]
  }
];

const mockSubscription: Subscription = {
  id: 'sub1',
  plan: 'pro',
  status: 'active',
  start_date: '2025-01-01T00:00:00',
  end_date: '2025-12-31T23:59:59',
  amount: 99.99,
  contacts_limit: 10000,
  campaigns_limit: 50,
  credits_used: 3500,
  credits_total: 10000
};