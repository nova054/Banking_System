import { useAuth } from '@/contexts/AuthContext';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { formatDate } from '@/lib/formatters';
import { User, Mail, Calendar, Shield } from 'lucide-react';

export default function ProfilePage() {
  const { user } = useAuth();

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-fade-in">
        {/* Header */}
        <div>
          <h1 className="page-title">Profile</h1>
          <p className="page-subtitle">View your account information</p>
        </div>

        {/* Profile Card */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          {/* Banner */}
          <div className="h-32 bg-gradient-to-r from-primary to-primary/60" />
          
          {/* Avatar and Name */}
          <div className="px-6 pb-6">
            <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-12">
              <div className="h-24 w-24 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center text-3xl font-bold border-4 border-card">
                {user?.fullName?.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 pb-2">
                <h2 className="text-2xl font-display font-bold">{user?.fullName}</h2>
                <span className={`badge-role ${user?.role === 'ROLE_ADMIN' ? 'admin' : 'user'}`}>
                  {user?.role === 'ROLE_ADMIN' ? 'Administrator' : 'Customer'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="grid gap-6 md:grid-cols-2">
          <div className="bg-card rounded-xl border border-border p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <User className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Full Name</p>
                <p className="font-medium text-lg">{user?.fullName}</p>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-xl border border-border p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Mail className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email Address</p>
                <p className="font-medium text-lg">{user?.email}</p>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-xl border border-border p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Account Role</p>
                <p className="font-medium text-lg capitalize">
                  {user?.role === 'ROLE_ADMIN' ? 'Administrator' : 'Customer'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-xl border border-border p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Member Since</p>
                <p className="font-medium text-lg">
                  {user?.createdAt ? formatDate(user.createdAt) : 'N/A'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
