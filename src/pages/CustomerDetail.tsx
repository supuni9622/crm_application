import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ArrowLeft, CalendarIcon, Edit, MailIcon, PhoneIcon, Tag, Trash } from 'lucide-react';

import { getCustomerById, getTransactions } from '@/api';
import { formatCurrency, formatDate, getStatusColor } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';

export default function CustomerDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [date, setDate] = useState<Date | undefined>(new Date());
  
  const { data: customer, isLoading: isLoadingCustomer } = useQuery({
    queryKey: ['customer', id],
    queryFn: () => getCustomerById(id!),
    enabled: !!id,
  });
  
  const { data: transactions, isLoading: isLoadingTransactions } = useQuery({
    queryKey: ['transactions'],
    queryFn: getTransactions,
  });
  
  // Filter transactions for this customer
  const customerTransactions = transactions?.filter(
    (transaction) => transaction.customer_id === id
  ) || [];
  
  const getInitials = (name: string) => {
    if (!name) return '??';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };
  
  // Monthly purchase data
  const monthlyData = [
    { name: 'Jan', amount: 0 },
    { name: 'Feb', amount: 120 },
    { name: 'Mar', amount: 200 },
    { name: 'Apr', amount: 150 },
    { name: 'May', amount: 300 },
    { name: 'Jun', amount: 400 },
  ];

  if (isLoadingCustomer) {
    return <div className="flex h-96 items-center justify-center">Loading customer details...</div>;
  }

  if (!customer) {
    return (
      <div className="flex h-96 flex-col items-center justify-center gap-4">
        <h2 className="text-2xl font-bold">Customer not found</h2>
        <Button onClick={() => navigate('/customers')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Customers
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" onClick={() => navigate('/customers')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-3xl font-bold tracking-tight">Customer Profile</h2>
      </div>
      
      <div className="grid gap-6 md:grid-cols-3">
        <div className="space-y-6 md:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarFallback className="text-lg">{getInitials(customer.name)}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl">{customer.name}</CardTitle>
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon">
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="flex gap-4 mt-2">
                  <Badge variant={customer.opt_in_status ? "success" : "secondary"}>
                    {customer.opt_in_status ? 'Subscribed' : 'Unsubscribed'}
                  </Badge>
                  <CardDescription>Customer since {formatDate(customer.created_at, 'MMMM yyyy')}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="flex flex-col gap-1">
                  <span className="text-sm text-muted-foreground">Email</span>
                  <div className="flex items-center gap-2">
                    <MailIcon className="h-4 w-4 text-muted-foreground" />
                    <span>{customer.email}</span>
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-sm text-muted-foreground">Phone</span>
                  <div className="flex items-center gap-2">
                    <PhoneIcon className="h-4 w-4 text-muted-foreground" />
                    <span>{customer.phone}</span>
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-sm text-muted-foreground">Last Activity</span>
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                    <span>{formatDate(customer.last_activity || '', 'PPP')}</span>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <h3 className="font-semibold">Segments</h3>
                <div className="flex flex-wrap gap-2">
                  {customer.segment_ids.length > 0 ? (
                    customer.segment_ids.map((segmentId) => (
                      <Badge key={segmentId} variant="outline" className="flex items-center gap-1">
                        <Tag className="h-3 w-3" />
                        {segmentId === 'seg1' ? 'Active Customers' : 
                         segmentId === 'seg2' ? 'SMS Subscribers' : 
                         segmentId === 'seg3' ? 'High-Value Customers' : 
                         segmentId === 'seg4' ? 'New Customers' : segmentId}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-sm text-muted-foreground">No segments assigned</span>
                  )}
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <h3 className="font-semibold">Channel Preferences</h3>
                <div className="flex flex-wrap gap-2">
                  {customer.channel_preference.length > 0 ? (
                    customer.channel_preference.map((channel) => (
                      <Badge key={channel} className="capitalize">
                        {channel}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-sm text-muted-foreground">No channel preferences set</span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Purchase History</CardTitle>
              <CardDescription>Transaction history and spending patterns</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis tickFormatter={(value) => `$${value}`} />
                    <Tooltip formatter={(value) => [`$${value}`, 'Amount']} />
                    <Bar dataKey="amount" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              
              <div className="mt-6 space-y-4">
                <h4 className="font-medium">Recent Transactions</h4>
                {isLoadingTransactions ? (
                  <div className="space-y-2">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-12 animate-pulse rounded-md bg-muted" />
                    ))}
                  </div>
                ) : customerTransactions.length > 0 ? (
                  <div className="space-y-2">
                    {customerTransactions.map((transaction) => (
                      <div 
                        key={transaction.id} 
                        className="flex items-center justify-between rounded-lg border p-3"
                      >
                        <div>
                          <p className="font-medium">{transaction.product_name}</p>
                          <p className="text-sm text-muted-foreground">
                            {formatDate(transaction.date, 'PPP')}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold">{formatCurrency(transaction.amount)}</p>
                          <Badge variant={transaction.status === 'completed' ? 'success' : transaction.status === 'refunded' ? 'destructive' : 'secondary'}>
                            {transaction.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex h-32 items-center justify-center rounded-lg border border-dashed">
                    <p className="text-muted-foreground">No transaction history</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Customer Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg bg-muted p-3">
                  <p className="text-sm text-muted-foreground">Total Spent</p>
                  <p className="text-xl font-bold">{formatCurrency(customer.total_spent)}</p>
                </div>
                <div className="rounded-lg bg-muted p-3">
                  <p className="text-sm text-muted-foreground">Orders</p>
                  <p className="text-xl font-bold">{customer.orders_count}</p>
                </div>
                <div className="rounded-lg bg-muted p-3">
                  <p className="text-sm text-muted-foreground">Avg. Order</p>
                  <p className="text-xl font-bold">
                    {formatCurrency(customer.orders_count ? customer.total_spent / customer.orders_count : 0)}
                  </p>
                </div>
                <div className="rounded-lg bg-muted p-3">
                  <p className="text-sm text-muted-foreground">Last Purchase</p>
                  <p className="text-xl font-bold">
                    {customerTransactions.length > 0 
                      ? formatDate(customerTransactions[0].date, 'MM/dd/yyyy')
                      : 'N/A'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full justify-start">
                <MailIcon className="mr-2 h-4 w-4" />
                Send Message
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Edit className="mr-2 h-4 w-4" />
                Edit Customer
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Tag className="mr-2 h-4 w-4" />
                Manage Segments
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Campaign Interactions</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="calendar">
                <TabsList className="w-full">
                  <TabsTrigger value="calendar" className="flex-1">Calendar</TabsTrigger>
                  <TabsTrigger value="list" className="flex-1">List View</TabsTrigger>
                </TabsList>
                <TabsContent value="calendar" className="mt-4">
                  <div className="flex justify-center">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {date ? format(date, 'PPP') : 'Pick a date'}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={date}
                          onSelect={setDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="mt-4 flex h-40 items-center justify-center rounded-lg border border-dashed text-center">
                    <p className="text-sm text-muted-foreground px-4">
                      No campaign interactions on the selected date
                    </p>
                  </div>
                </TabsContent>
                <TabsContent value="list">
                  <div className="flex h-40 items-center justify-center rounded-lg border border-dashed text-center">
                    <p className="text-sm text-muted-foreground px-4">
                      No campaign interaction history available
                    </p>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}