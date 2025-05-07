import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, Eye, MoreHorizontal, Plus, Trash, UserCog } from 'lucide-react';

import { getCustomers } from '@/api';
import { Customer } from '@/types';
import { formatDate, formatCurrency } from '@/lib/utils';
import { DataTable } from '@/components/shared/DataTable';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function Customers() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');
  
  const { data: customers, isLoading } = useQuery({
    queryKey: ['customers'],
    queryFn: getCustomers,
  });
  
  const getFilteredCustomers = () => {
    if (!customers) return [];
    
    switch (activeTab) {
      case 'active':
        return customers.filter(customer => 
          new Date(customer.last_activity || 0) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        );
      case 'new':
        return customers.filter(customer => 
          new Date(customer.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        );
      case 'opted-in':
        return customers.filter(customer => customer.opt_in_status);
      case 'opted-out':
        return customers.filter(customer => !customer.opt_in_status);
      default:
        return customers;
    }
  };
  
  const columns: ColumnDef<Customer>[] = [
    {
      accessorKey: 'name',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue('name')}</div>
      ),
    },
    {
      accessorKey: 'email',
      header: 'Email',
    },
    {
      accessorKey: 'phone',
      header: 'Phone',
    },
    {
      accessorKey: 'last_activity',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Last Active
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => formatDate(row.getValue('last_activity') || '', 'PP'),
    },
    {
      accessorKey: 'opt_in_status',
      header: 'Status',
      cell: ({ row }) => (
        <Badge variant={row.getValue('opt_in_status') ? "success" : "secondary"}>
          {row.getValue('opt_in_status') ? 'Subscribed' : 'Unsubscribed'}
        </Badge>
      ),
    },
    {
      accessorKey: 'total_spent',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Total Spent
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => formatCurrency(row.getValue('total_spent')),
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const customer = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => navigate(`/customers/${customer.id}`)}>
                <Eye className="mr-2 h-4 w-4" />
                View details
              </DropdownMenuItem>
              <DropdownMenuItem>
                <UserCog className="mr-2 h-4 w-4" />
                Edit customer
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">
                <Trash className="mr-2 h-4 w-4" />
                Delete customer
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Customers</h2>
          <p className="text-muted-foreground">
            Manage and analyze your customer base
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Customer
        </Button>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
            <TabsList className="w-full sm:w-auto">
              <TabsTrigger value="all" className="flex-1">All Customers</TabsTrigger>
              <TabsTrigger value="active" className="flex-1">Active</TabsTrigger>
              <TabsTrigger value="new" className="flex-1">New</TabsTrigger>
              <TabsTrigger value="opted-in" className="flex-1">Opted-in</TabsTrigger>
              <TabsTrigger value="opted-out" className="flex-1">Opted-out</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={getFilteredCustomers()}
            searchColumn="name"
            loading={isLoading}
          />
        </CardContent>
      </Card>
    </div>
  );
}