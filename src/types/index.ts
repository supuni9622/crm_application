export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
  avatar?: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  created_at: string;
  last_activity?: string;
  opt_in_status: boolean;
  channel_preference: string[];
  segment_ids: string[];
  total_spent: number;
  orders_count: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  inventory: number;
  image_url?: string;
  total_sales: number;
  total_revenue: number;
}

export interface Transaction {
  id: string;
  customer_id: string;
  customer_name: string;
  product_id: string;
  product_name: string;
  amount: number;
  date: string;
  status: 'completed' | 'refunded' | 'processing';
}

export interface Campaign {
  id: string;
  title: string;
  type: 'sms' | 'automated';
  status: 'draft' | 'scheduled' | 'running' | 'completed';
  created_at: string;
  scheduled_at?: string;
  sent_count: number;
  delivered_count: number;
  failed_count: number;
  opt_out_count: number;
  message: string;
  segment_ids: string[];
  trigger?: 'birthday' | 'first_purchase' | null;
}

export interface Segment {
  id: string;
  name: string;
  description: string;
  customer_count: number;
  created_at: string;
  filters: SegmentFilter[];
}

export interface SegmentFilter {
  field: string;
  operator: 'equals' | 'contains' | 'greater_than' | 'less_than' | 'in';
  value: string | string[] | number;
}

export interface Subscription {
  id: string;
  plan: 'free' | 'basic' | 'pro';
  status: 'active' | 'canceled' | 'past_due';
  start_date: string;
  end_date: string;
  amount: number;
  contacts_limit: number;
  campaigns_limit: number;
  credits_used: number;
  credits_total: number;
}

export interface DashboardStats {
  total_customers: number;
  new_customers: number;
  active_campaigns: number;
  total_revenue: number;
  campaign_performance: {
    open_rate: number;
    click_rate: number;
    opt_out_rate: number;
  };
  recent_transactions: Transaction[];
  revenue_by_period: {
    period: string;
    amount: number;
  }[];
}

export interface ChartData {
  name: string;
  value: number;
  [key: string]: string | number;
}