import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { adminUserService, userService, User } from '@/lib/api';
import { formatDate } from '@/lib/formatters';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Users, Loader2, Search, Eye, Mail, Calendar, Shield, User as UserIcon, ArrowLeftRight, Building2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { DataPagination } from '@/components/ui/DataPagination';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isViewingUser, setIsViewingUser] = useState(false);
  const [isLoadingUserDetails, setIsLoadingUserDetails] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [pageSize] = useState(20);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await adminUserService.getAllUsers(currentPage, pageSize);
        setUsers(data.content || []);
        setTotalPages(data.totalPages || 0);
        setTotalElements(data.totalElements || 0);
      } catch (error) {
        toast({ title: "Error", description: "Failed to load users", variant: "destructive" });
      } finally {
        setIsLoading(false);
      }
    };
    fetchUsers();
  }, [currentPage, pageSize]);

  const filteredUsers = users.filter(u =>
    u.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleViewUser = async (user: User) => {
    if (!user.id) return;
    
    setIsLoadingUserDetails(true);
    setIsViewingUser(true);
    try {
      const userDetails = await userService.getUserById(user.id);
      setSelectedUser(userDetails);
    } catch (error: unknown) {
      toast({
        title: "Error",
        description: (error as any)?.response?.data?.message || "Failed to load user details",
        variant: "destructive",
      });
      setSelectedUser(user); // Fallback to basic user info
    } finally {
      setIsLoadingUserDetails(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="page-title">All Users</h1>
            <p className="page-subtitle">Manage system users</p>
          </div>
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        {/* Users Table */}
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="text-center py-16 bg-card rounded-xl border border-border">
            <Users className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No users found</h3>
            <p className="text-muted-foreground">
              {searchTerm ? 'Try a different search term' : 'No users in the system'}
            </p>
          </div>
        ) : (
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-border bg-muted/30">
                  <tr>
                    <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">ID</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Name</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Email</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Role</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Joined</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="border-b border-border last:border-0 hover:bg-muted/20">
                      <td className="px-6 py-4 font-mono text-sm text-muted-foreground">#{user.id}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="text-sm font-medium text-primary">
                              {user.fullName.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <span className="font-medium">{user.fullName}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">{user.email}</td>
                      <td className="px-6 py-4">
                        <span className={`badge-role ${user.role === 'ROLE_ADMIN' ? 'admin' : 'user'}`}>
                          {user.role === 'ROLE_ADMIN' ? 'Admin' : 'User'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">
                        {user.createdAt ? formatDate(user.createdAt) : 'N/A'}
                      </td>
                      <td className="px-6 py-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewUser(user)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* User Details Dialog */}
        <Dialog open={isViewingUser} onOpenChange={setIsViewingUser}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>User Details</DialogTitle>
            </DialogHeader>
            
            {isLoadingUserDetails ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : selectedUser ? (
              <div className="space-y-6">
                {/* User Header */}
                <div className="flex items-center gap-4 pb-4 border-b border-border">
                  <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-2xl font-bold text-primary">
                      {selectedUser.fullName?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">{selectedUser.fullName}</h3>
                    <span className={`badge-role ${selectedUser.role === 'ROLE_ADMIN' ? 'admin' : 'user'}`}>
                      {selectedUser.role === 'ROLE_ADMIN' ? 'Administrator' : 'Customer'}
                    </span>
                  </div>
                </div>

                {/* User Information Grid */}
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                    <UserIcon className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-xs text-muted-foreground">User ID</p>
                      <p className="font-medium font-mono">#{selectedUser.id}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                    <Mail className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-xs text-muted-foreground">Email Address</p>
                      <p className="font-medium text-sm">{selectedUser.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                    <Shield className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-xs text-muted-foreground">Account Role</p>
                      <p className="font-medium capitalize">
                        {selectedUser.role === 'ROLE_ADMIN' ? 'Administrator' : 'Customer'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                    <Calendar className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-xs text-muted-foreground">Member Since</p>
                      <p className="font-medium text-sm">
                        {selectedUser.createdAt ? formatDate(selectedUser.createdAt) : 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Additional Actions */}
                <div className="flex gap-3 pt-4 border-t border-border">
                  <Button variant="outline" size="sm">
                    View Accounts
                  </Button>
                  <Button variant="outline" size="sm">
                    View Transactions
                  </Button>
                </div>
              </div>
            ) : null}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>);}