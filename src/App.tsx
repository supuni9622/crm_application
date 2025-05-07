import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import { ThemeProvider } from '@/contexts/ThemeContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { Layout } from '@/components/layout/Layout';
import { PrivateRoute } from '@/components/auth/PrivateRoute';
import { Toaster } from '@/components/ui/toaster';

import Dashboard from '@/pages/Dashboard';
import Customers from '@/pages/Customers';
import CustomerDetail from '@/pages/CustomerDetail';
import Products from '@/pages/Products';
import Transactions from '@/pages/Transactions';
import SmsCampaigns from '@/pages/SmsCampaigns';
import AutomatedCampaigns from '@/pages/AutomatedCampaigns';
import SalesReports from '@/pages/SalesReports';
import CustomerReports from '@/pages/CustomerReports';
import Settings from '@/pages/Settings';
import Login from '@/pages/Login';
import NotFound from '@/pages/NotFound';

// Create a query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

function App() {
  // Update page title
  useEffect(() => {
    document.title = 'CRM Dashboard';
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light">
        <Router>
          <AuthProvider>
            <Routes>
              {/* Public routes */}
              <Route path="/login" element={<Login />} />
              
              {/* Protected routes */}
              <Route element={<PrivateRoute><Layout /></PrivateRoute>}>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/customers" element={<Customers />} />
                <Route path="/customers/:id" element={<CustomerDetail />} />
                <Route path="/products" element={<Products />} />
                <Route path="/transactions" element={<Transactions />} />
                <Route path="/campaigns/sms" element={<SmsCampaigns />} />
                <Route path="/campaigns/automated" element={<AutomatedCampaigns />} />
                <Route path="/reports/sales" element={<SalesReports />} />
                <Route path="/reports/customers" element={<CustomerReports />} />
                <Route path="/settings" element={<Settings />} />
              </Route>
              
              {/* Not found */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            
            <Toaster />
          </AuthProvider>
        </Router>
      </ThemeProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;