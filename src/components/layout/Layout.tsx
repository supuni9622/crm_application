import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { useLocation } from 'react-router-dom';

export function Layout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const location = useLocation();
  
  // Generate page title based on current route
  const getPageTitle = () => {
    const path = location.pathname;
    
    if (path === '/dashboard') return 'Dashboard';
    if (path === '/customers') return 'Customers';
    if (path === '/products') return 'Products';
    if (path === '/transactions') return 'Transactions';
    if (path.startsWith('/campaigns/sms')) return 'SMS Campaigns';
    if (path.startsWith('/campaigns/automated')) return 'Automated Campaigns';
    if (path.startsWith('/reports/sales')) return 'Sales Reports';
    if (path.startsWith('/reports/customers')) return 'Customer Reports';
    if (path === '/settings') return 'Settings';
    
    return 'CRM Dashboard';
  };
  
  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };
  
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar 
        collapsed={sidebarCollapsed} 
        setCollapsed={setSidebarCollapsed} 
      />
      
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header 
          title={getPageTitle()} 
          onSidebarToggle={toggleSidebar} 
        />
        
        <main className="flex-1 overflow-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}