import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  ShoppingBag, 
  MessageSquare,
  BarChart3, 
  CreditCard,
  Settings,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  Bell,
  History,
  FileText
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

export function Sidebar({ collapsed, setCollapsed }: SidebarProps) {
  const { user } = useAuth();
  const [campaignsOpen, setCampaignsOpen] = useState(false);
  const [reportsOpen, setReportsOpen] = useState(false);

  const toggleCampaigns = () => setCampaignsOpen(!campaignsOpen);
  const toggleReports = () => setReportsOpen(!reportsOpen);

  return (
    <aside 
      className={cn(
        "fixed left-0 top-0 z-40 h-screen border-r border-border bg-card transition-all duration-300 md:relative",
        collapsed ? "w-0 md:w-20 overflow-hidden" : "w-64"
      )}
    >
      <div className="flex h-16 items-center justify-between px-4">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="rounded-md bg-primary p-1">
              <Bell className="h-5 w-5 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-bold">CRM App</h1>
          </div>
        )}
        <Button 
          variant="ghost" 
          size="icon" 
          className="md:hidden" 
          onClick={() => setCollapsed(true)}
        >
          <X className="h-5 w-5" />
        </Button>
      </div>
      
      <Separator />
      
      <div className="space-y-1 px-2 py-4">
        <NavLink 
          to="/dashboard" 
          className={({ isActive }) => 
            cn("sidebar-item", isActive && "active", collapsed && "justify-center px-2")
          }
        >
          <LayoutDashboard className={cn("h-5 w-5", collapsed ? "mx-auto" : "")} />
          {!collapsed && <span>Dashboard</span>}
        </NavLink>

        <NavLink 
          to="/customers"
          className={({ isActive }) => 
            cn("sidebar-item", isActive && "active", collapsed && "justify-center px-2")
          }
        >
          <Users className={cn("h-5 w-5", collapsed ? "mx-auto" : "")} />
          {!collapsed && <span>Customers</span>}
        </NavLink>

        <NavLink 
          to="/products"
          className={({ isActive }) => 
            cn("sidebar-item", isActive && "active", collapsed && "justify-center px-2")
          }
        >
          <ShoppingBag className={cn("h-5 w-5", collapsed ? "mx-auto" : "")} />
          {!collapsed && <span>Products</span>}
        </NavLink>

        <NavLink 
          to="/transactions"
          className={({ isActive }) => 
            cn("sidebar-item", isActive && "active", collapsed && "justify-center px-2")
          }
        >
          <CreditCard className={cn("h-5 w-5", collapsed ? "mx-auto" : "")} />
          {!collapsed && <span>Transactions</span>}
        </NavLink>

        {!collapsed ? (
          <div>
            <button
              className="sidebar-item w-full justify-between"
              onClick={toggleCampaigns}
            >
              <div className="flex items-center gap-3">
                <MessageSquare className="h-5 w-5" />
                <span>Campaigns</span>
              </div>
              {campaignsOpen ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </button>
            
            {campaignsOpen && (
              <div className="ml-8 mt-1 space-y-1">
                <NavLink
                  to="/campaigns/sms"
                  className={({ isActive }) => 
                    cn("sidebar-item", isActive && "active")
                  }
                >
                  <span>SMS</span>
                </NavLink>
                <NavLink
                  to="/campaigns/automated"
                  className={({ isActive }) => 
                    cn("sidebar-item", isActive && "active")
                  }
                >
                  <span>Automated</span>
                </NavLink>
              </div>
            )}
          </div>
        ) : (
          <NavLink
            to="/campaigns"
            className={({ isActive }) => 
              cn("sidebar-item justify-center px-2", isActive && "active")
            }
          >
            <MessageSquare className="mx-auto h-5 w-5" />
          </NavLink>
        )}

        {!collapsed ? (
          <div>
            <button
              className="sidebar-item w-full justify-between"
              onClick={toggleReports}
            >
              <div className="flex items-center gap-3">
                <BarChart3 className="h-5 w-5" />
                <span>Reports</span>
              </div>
              {reportsOpen ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </button>
            
            {reportsOpen && (
              <div className="ml-8 mt-1 space-y-1">
                <NavLink
                  to="/reports/sales"
                  className={({ isActive }) => 
                    cn("sidebar-item", isActive && "active")
                  }
                >
                  <span>Sales</span>
                </NavLink>
                <NavLink
                  to="/reports/customers"
                  className={({ isActive }) => 
                    cn("sidebar-item", isActive && "active")
                  }
                >
                  <span>Customers</span>
                </NavLink>
              </div>
            )}
          </div>
        ) : (
          <NavLink
            to="/reports"
            className={({ isActive }) => 
              cn("sidebar-item justify-center px-2", isActive && "active")
            }
          >
            <BarChart3 className="mx-auto h-5 w-5" />
          </NavLink>
        )}

        {user?.role === 'admin' && (
          <NavLink
            to="/settings"
            className={({ isActive }) => 
              cn("sidebar-item", isActive && "active", collapsed && "justify-center px-2")
            }
          >
            <Settings className={cn("h-5 w-5", collapsed ? "mx-auto" : "")} />
            {!collapsed && <span>Settings</span>}
          </NavLink>
        )}
      </div>
    </aside>
  );
}

export function MobileSidebarToggle({ onClick }: { onClick: () => void }) {
  return (
    <Button variant="ghost" size="icon" onClick={onClick} className="md:hidden">
      <Menu className="h-5 w-5" />
    </Button>
  );
}