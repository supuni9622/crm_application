import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, Download, Filter } from 'lucide-react';

import { getTransactions } from '@/api';
import { Transaction } from '@/types';
import { formatCurrency, formatDate } from '@/lib/utils';
import { DataTable } from '@/components/shared/DataTable';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function Transactions() {
  const [timeRange, setTimeRange] = useState('30');
  
  const { data: transactions, isLoading } = useQuery({
    queryKey: ['transactions'],
    queryFn: getTransactions,
  });
  
  const getFilteredTransactions = () => {
    if (!transactions) return [];
    
    // Filter transactions based on time range
    const days = parseInt(timeRange);
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    return transactions.filter(transaction => 
      new Date(transaction.date) >= cutoffDate
    );
  };
  
  const columns: ColumnDef<Transaction>[] = [
    {
      accessorKey: 'customer_name',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Customer
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue('customer_name')}</div>
      ),
    },
    {
      accessorKey: 'product_name',
      header: 'Product',
    },
    {
      accessorKey: 'amount',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Amount
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => formatCurrency(row.getValue('amount')),
    },
    {
      accessorKey: 'date',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => formatDate(row.getValue('date'), 'PPP'),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => (
        <StatusBadge status={row.getValue('status')} />
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Transactions</h2>
          <p className="text-muted-foreground">
            Monitor and analyze sales and payment data
          </p>
        </div>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
      </div>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle>Transaction History</CardTitle>
          <div className="flex items-center gap-2">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select time range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">Last 7 days</SelectItem>
                <SelectItem value="30">Last 30 days</SelectItem>
                <SelectItem value="90">Last 90 days</SelectItem>
                <SelectItem value="365">Last year</SelectItem>
                <SelectItem value="99999">All time</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="mb-4 w-full sm:w-auto">
              <TabsTrigger value="all" className="flex-1">All</TabsTrigger>
              <TabsTrigger value="completed" className="flex-1">Completed</TabsTrigger>
              <TabsTrigger value="processing" className="flex-1">Processing</TabsTrigger>
              <TabsTrigger value="refunded" className="flex-1">Refunded</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all">
              <DataTable
                columns={columns}
                data={getFilteredTransactions()}
                searchColumn="customer_name"
                loading={isLoading}
              />
            </TabsContent>
            
            <TabsContent value="completed">
              <DataTable
                columns={columns}
                data={getFilteredTransactions().filter(t => t.status === 'completed')}
                searchColumn="customer_name"
                loading={isLoading}
              />
            </TabsContent>
            
            <TabsContent value="processing">
              <DataTable
                columns={columns}
                data={getFilteredTransactions().filter(t => t.status === 'processing')}
                searchColumn="customer_name"
                loading={isLoading}
              />
            </TabsContent>
            
            <TabsContent value="refunded">
              <DataTable
                columns={columns}
                data={getFilteredTransactions().filter(t => t.status === 'refunded')}
                searchColumn="customer_name"
                loading={isLoading}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}