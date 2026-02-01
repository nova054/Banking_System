import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { adminDashboardService, SystemOverviewResponse } from '@/lib/api';
import { formatCurrency } from '@/lib/formatters';
import { Button } from '@/components/ui/button';
import {
  Users,
  Building2,
  Receipt,
  TrendingUp,
  Loader2,
  Search,
  UserPlus,
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export default function AdminDashboard() {
  const [systemOverview, setSystemOverview] = useState<SystemOverviewResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    try {
      const overviewData = await adminDashboardService.getSystemOverview();
      setSystemOverview(overviewData);
    } catch (error) {
      console.error('Failed to load system overview:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);


  // Personal banking functions removed - use UserDashboard for banking operations

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground mt-1">System overview and management</p>
            <p className="text-sm text-primary mt-2">
              <Link to="/dashboard" className="hover:underline">Go to User Dashboard</Link> for personal banking
            </p>
          </div>
          <Link to="/admin/register-user">
            <Button className="btn-gradient">
              <UserPlus className="h-4 w-4 mr-2" />
              Register User
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="stat-card">
            <div className="flex items-center justify-between mb-4">
              <span className="text-muted-foreground text-sm font-medium">Total Users</span>
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Users className="h-5 w-5 text-primary" />
              </div>
            </div>
            <p className="text-3xl font-display font-bold">{systemOverview?.totalUsers || 0}</p>
            <p className="text-sm text-muted-foreground mt-1">Registered users</p>
          </div>

          <div className="stat-card">
            <div className="flex items-center justify-between mb-4">
              <span className="text-muted-foreground text-sm font-medium">Active Users</span>
              <div className="h-10 w-10 rounded-xl bg-success/10 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-success" />
              </div>
            </div>
            <p className="text-3xl font-display font-bold">{systemOverview?.activeUsers || 0}</p>
            <p className="text-sm text-muted-foreground mt-1">Currently active</p>
          </div>

          <div className="stat-card">
            <div className="flex items-center justify-between mb-4">
              <span className="text-muted-foreground text-sm font-medium">Total Accounts</span>
              <div className="h-10 w-10 rounded-xl bg-warning/10 flex items-center justify-center">
                <Building2 className="h-5 w-5 text-warning" />
              </div>
            </div>
            <p className="text-3xl font-display font-bold">{systemOverview?.totalAccounts || 0}</p>
            <p className="text-sm text-muted-foreground mt-1">Bank accounts</p>
          </div>

          <div className="stat-card">
            <div className="flex items-center justify-between mb-4">
              <span className="text-muted-foreground text-sm font-medium">Active Accounts</span>
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
            </div>
            <p className="text-3xl font-display font-bold">{systemOverview?.activeAccounts || 0}</p>
            <p className="text-sm text-muted-foreground mt-1">Currently active</p>
          </div>

          <div className="stat-card">
            <div className="flex items-center justify-between mb-4">
              <span className="text-muted-foreground text-sm font-medium">Today's Transactions</span>
              <div className="h-10 w-10 rounded-xl bg-success/10 flex items-center justify-center">
                <Receipt className="h-5 w-5 text-success" />
              </div>
            </div>
            <p className="text-3xl font-display font-bold">{systemOverview?.todayTransactionCount || 0}</p>
            <p className="text-sm text-muted-foreground mt-1">Transactions today</p>
          </div>

          <div className="stat-card">
            <div className="flex items-center justify-between mb-4">
              <span className="text-muted-foreground text-sm font-medium">Today's Volume</span>
              <div className="h-10 w-10 rounded-xl bg-warning/10 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-warning" />
              </div>
            </div>
            <p className="text-3xl font-display font-bold">{formatCurrency(systemOverview?.todayTransactionAmount || 0)}</p>
            <p className="text-sm text-muted-foreground mt-1">Transaction amount today</p>
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link to="/admin/users" className="stat-card hover:border-primary/50">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Manage Users</h3>
                <p className="text-sm text-muted-foreground">View and manage all users</p>
              </div>
            </div>
          </Link>

          <Link to="/admin/accounts" className="stat-card hover:border-primary/50">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-success/10 flex items-center justify-center">
                <Building2 className="h-6 w-6 text-success" />
              </div>
              <div>
                <h3 className="font-semibold">All Accounts</h3>
                <p className="text-sm text-muted-foreground">View all bank accounts</p>
              </div>
            </div>
          </Link>

          <Link to="/admin/transactions" className="stat-card hover:border-primary/50">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-warning/10 flex items-center justify-center">
                <Receipt className="h-6 w-6 text-warning" />
              </div>
              <div>
                <h3 className="font-semibold">All Transactions</h3>
                <p className="text-sm text-muted-foreground">View transaction history</p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </DashboardLayout>
  );
}
