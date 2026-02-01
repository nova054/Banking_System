import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useInterfaceMode } from '@/contexts/InterfaceModeContext';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  Wallet,
  ArrowUpDown,
  FileText,
  User,
  Users,
  Building2,
  Receipt,
  UserPlus,
  LogOut,
  Menu,
  X,
  Shield,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ThemeToggle } from '@/components/ThemeToggle';
import { InterfaceModeToggle } from '@/components/InterfaceModeToggle';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const userNavItems = [
  { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/accounts', icon: Wallet, label: 'My Accounts' },
  { path: '/transactions', icon: ArrowUpDown, label: 'Transactions' },
  { path: '/statement', icon: FileText, label: 'Statement' },
  { path: '/profile', icon: User, label: 'Profile' },
];

const adminNavItems = [
  { path: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/admin/users', icon: Users, label: 'All Users' },
  { path: '/admin/accounts', icon: Building2, label: 'All Accounts' },
  { path: '/admin/transactions', icon: Receipt, label: 'All Transactions' },
  { path: '/admin/statement', icon: FileText, label: 'Statement' },
  { path: '/admin/audits', icon: Shield, label: 'Audit Logs' },
  { path: '/admin/register-user', icon: UserPlus, label: 'Register User' },
  { path: '/dashboard', icon: Wallet, label: 'Personal Banking' },
];

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, logout, isAdmin } = useAuth();
  const { isAdminMode } = useInterfaceMode();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Show admin toggle only for admin users
  const showAdminToggle = isAdmin;
  
  console.log('DashboardLayout - Admin toggle debug:', {
    user,
    isAdmin,
    showAdminToggle,
    userRole: user?.role
  });

  // Dynamic navigation based on both user role and interface mode
  const navItems = isAdmin && isAdminMode ? adminNavItems : userNavItems;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="h-screen bg-background flex overflow-hidden">
      {/* Sidebar - Desktop */}
      <aside
        className={cn(
          "hidden lg:flex flex-col bg-sidebar text-sidebar-foreground transition-all duration-300 relative",
          sidebarOpen ? "w-64" : "w-20"
        )}
      >
        {/* Logo & Toggle */}
        <div className="p-6 flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-sidebar-accent rounded-lg transition-colors text-sidebar-foreground"
            aria-label="Toggle sidebar"
          >
            <Menu className="h-5 w-5" />
          </button>
          <Link to={isAdmin && isAdminMode ? '/admin/dashboard' : '/dashboard'} className="flex items-center gap-3 flex-1">
            <div className="h-10 w-10 rounded-xl bg-sidebar-accent flex items-center justify-center">
              <Building2 className="h-5 w-5 text-sidebar-foreground" />
            </div>
            {sidebarOpen && (
              <span className="font-display font-bold text-xl">NovaBank</span>
            )}
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "nav-link",
                location.pathname === item.path && "active"
              )}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              {sidebarOpen && <span>{item.label}</span>}
            </Link>
          ))}
        </nav>

        {/* User Info & Logout */}
        <div className="p-4 border-t border-sidebar-border">
          {sidebarOpen ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-sidebar-accent flex items-center justify-center">
                  <span className="font-semibold text-sm text-sidebar-foreground">
                    {user?.fullName?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate text-sidebar-foreground">{user?.fullName}</p>
                  <p className="text-xs text-sidebar-foreground/60 truncate">{user?.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <ThemeToggle className="text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent" />
                <Button
                  variant="ghost"
                  className="flex-1 justify-start text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <ThemeToggle className="w-full text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent" />
              <Button
                variant="ghost"
                size="icon"
                className="w-full text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent"
                onClick={handleLogout}
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          )}
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-card border-b border-border px-4 py-3">
        <div className="flex items-center justify-between">
          <Link to={isAdmin && isAdminMode ? '/admin/dashboard' : '/dashboard'} className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <Building2 className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-foreground">NovaBank</span>
          </Link>
          <div className="flex items-center gap-2">
            {showAdminToggle && <InterfaceModeToggle />}
            <ThemeToggle />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 hover:bg-muted rounded-lg text-foreground"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-background pt-16">
          <nav className="p-4 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                  location.pathname === item.path
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted"
                )}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            ))}
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                handleLogout();
              }}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-destructive hover:bg-destructive/10 w-full"
            >
              <LogOut className="h-5 w-5" />
              <span>Logout</span>
            </button>
          </nav>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto lg:relative">
        {/* Desktop Header */}
        <div className="hidden lg:block fixed top-0 right-0 z-40 bg-card border-b border-border px-6 py-3">
          <div className="flex items-center justify-end gap-3">
            {showAdminToggle && <InterfaceModeToggle />}
            <ThemeToggle />
          </div>
        </div>
        
        <div className="pt-16 lg:pt-16 h-full">
          <div className="p-6 lg:p-8 max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
