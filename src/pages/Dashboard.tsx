import { useQuery } from '@tanstack/react-query';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';
import { 
  Users, 
  ArrowUpRight, 
  DollarSign, 
  BarChart3,
  ArrowRight,
  MessageSquare
} from 'lucide-react';

import { getDashboardStats } from '@/api';
import { formatCurrency, formatDate } from '@/lib/utils';
import { StatCard, StatCardSkeleton } from '@/components/dashboard/StatCard';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/shared/StatusBadge';

export default function Dashboard() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboardStats'],
    queryFn: getDashboardStats,
  });

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {isLoading ? (
          <>
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
          </>
        ) : (
          <>
            <StatCard
              title="Total Customers"
              value={stats?.total_customers.toLocaleString() || '0'}
              icon={<Users className="h-4 w-4" />}
              description="Total customer base"
            />
            <StatCard
              title="New Customers"
              value={stats?.new_customers.toLocaleString() || '0'}
              icon={<ArrowUpRight className="h-4 w-4" />}
              description="Last 7 days"
              difference={12.5}
            />
            <StatCard
              title="Active Campaigns"
              value={stats?.active_campaigns.toLocaleString() || '0'}
              icon={<MessageSquare className="h-4 w-4" />}
              description="Running campaigns"
            />
            <StatCard
              title="Total Revenue"
              value={formatCurrency(stats?.total_revenue || 0)}
              icon={<DollarSign className="h-4 w-4" />}
              description="This month"
              difference={8.2}
            />
          </>
        )}
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="lg:col-span-4">
              <CardHeader>
                <CardTitle>Revenue Overview</CardTitle>
                <CardDescription>
                  Revenue trend over the last 6 months
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0 pl-2">
                <div className="h-[300px] w-full">
                  {isLoading ? (
                    <div className="flex h-full items-center justify-center">
                      <div className="h-[250px] w-full animate-pulse rounded-md bg-muted" />
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={stats?.revenue_by_period}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="period" />
                        <YAxis tickFormatter={(value) => `$${value}`} />
                        <Tooltip formatter={(value) => [`$${value}`, 'Revenue']} />
                        <Bar dataKey="amount" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </CardContent>
            </Card>
            
            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle>Campaign Performance</CardTitle>
                <CardDescription>
                  Key metrics for ongoing campaigns
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-4">
                    <div className="h-4 w-full animate-pulse rounded-md bg-muted" />
                    <div className="h-4 w-3/4 animate-pulse rounded-md bg-muted" />
                    <div className="h-4 w-1/2 animate-pulse rounded-md bg-muted" />
                  </div>
                ) : (
                  <div className="space-y-8">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-medium">Open Rate</div>
                        <div className="text-sm font-medium">{stats?.campaign_performance.open_rate}%</div>
                      </div>
                      <div className="h-2 rounded-full bg-secondary">
                        <div
                          className="h-full rounded-full bg-primary"
                          style={{ width: `${stats?.campaign_performance.open_rate}%` }}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-medium">Click Rate</div>
                        <div className="text-sm font-medium">{stats?.campaign_performance.click_rate}%</div>
                      </div>
                      <div className="h-2 rounded-full bg-secondary">
                        <div
                          className="h-full rounded-full bg-accent"
                          style={{ width: `${stats?.campaign_performance.click_rate}%` }}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-medium">Opt-out Rate</div>
                        <div className="text-sm font-medium">{stats?.campaign_performance.opt_out_rate}%</div>
                      </div>
                      <div className="h-2 rounded-full bg-secondary">
                        <div
                          className="h-full rounded-full bg-destructive"
                          style={{ width: `${stats?.campaign_performance.opt_out_rate}%` }}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="lg:col-span-4">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Recent Transactions</CardTitle>
                  <CardDescription>
                    Latest customer purchases
                  </CardDescription>
                </div>
                <Button variant="ghost" size="sm" className="gap-1">
                  View All
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center gap-4">
                        <div className="h-10 w-10 animate-pulse rounded-full bg-muted" />
                        <div className="space-y-2">
                          <div className="h-4 w-48 animate-pulse rounded-md bg-muted" />
                          <div className="h-3 w-24 animate-pulse rounded-md bg-muted" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Customer</TableHead>
                        <TableHead>Product</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {stats?.recent_transactions.map((transaction) => (
                        <TableRow key={transaction.id}>
                          <TableCell className="font-medium">
                            {transaction.customer_name}
                          </TableCell>
                          <TableCell>{transaction.product_name}</TableCell>
                          <TableCell>{formatCurrency(transaction.amount)}</TableCell>
                          <TableCell>
                            <StatusBadge status={transaction.status} />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
            
            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle>Customer Engagement</CardTitle>
                <CardDescription>
                  Activity trends and channel metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full">
                  {isLoading ? (
                    <div className="flex h-full items-center justify-center">
                      <div className="h-[250px] w-full animate-pulse rounded-md bg-muted" />
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={[
                          { name: 'Week 1', sms: 20, email: 40 },
                          { name: 'Week 2', sms: 30, email: 45 },
                          { name: 'Week 3', sms: 40, email: 50 },
                          { name: 'Week 4', sms: 35, email: 55 },
                        ]}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="sms" stroke="hsl(var(--primary))" />
                        <Line type="monotone" dataKey="email" stroke="hsl(var(--accent))" />
                      </LineChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Analytics Overview</CardTitle>
              <CardDescription>
                Detailed metrics and conversion data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center text-muted-foreground py-8">
                Analytics data will appear here. Select a specific date range to view detailed metrics.
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Generated Reports</CardTitle>
              <CardDescription>
                Access and download your reports
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center text-muted-foreground py-8">
                No reports generated yet. Create a custom report to see it here.
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}