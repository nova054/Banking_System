import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { adminAccountService, adminUserService, Account, User } from '@/lib/api';
import { formatCurrency, formatDate } from '@/lib/formatters';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Building2, Loader2, Search, Eye, Users } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DataPagination } from '@/components/ui/DataPagination';

export default function AdminAccountsPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [selectedUserEmail, setSelectedUserEmail] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingAccounts, setIsLoadingAccounts] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [pageSize] = useState(20);

  // Users pagination state (separate from accounts)
  const [usersPage, setUsersPage] = useState(0);
  const [usersPageSize] = useState(100); // Get more users for dropdown

  // Fetch all accounts by default
  useEffect(() => {
    const fetchAllAccounts = async () => {
      try {
        setIsLoadingAccounts(true);
        const data = await adminAccountService.getAllAccounts(currentPage, pageSize);
        setAccounts(data.content || []);
        setTotalPages(data.totalPages || 0);
        setTotalElements(data.totalElements || 0);
      } catch (error) {
        toast({ title: "Error", description: "Failed to load accounts", variant: "destructive" });
      } finally {
        setIsLoadingAccounts(false);
      }
    };
    fetchAllAccounts();
  }, [currentPage, pageSize]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await adminUserService.getAllUsers(usersPage, usersPageSize);
        setUsers(data.content || []);
      } catch (error) {
        toast({ title: "Error", description: "Failed to load users", variant: "destructive" });
      } finally {
        setIsLoading(false);
      }
    };
    fetchUsers();
  }, [usersPage, usersPageSize]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    if (selectedUserEmail) {
      const fetchUserAccounts = async () => {
        setIsLoadingAccounts(true);
        try {
          const data = await adminAccountService.getAccountsByUserEmail(selectedUserEmail);
          setAccounts(data);
          setTotalPages(1); // User accounts are not paginated
          setTotalElements(data.length);
        } catch (error: unknown) {
          toast({ 
            title: "Error", 
            description: (error as any)?.response?.data?.message || "Failed to load user accounts", 
            variant: "destructive" 
          });
          setAccounts([]);
        } finally {
          setIsLoadingAccounts(false);
        }
      };
      fetchUserAccounts();
    } else {
      // Load all accounts when no user is selected
      const fetchAllAccounts = async () => {
        try {
          setIsLoadingAccounts(true);
          const data = await adminAccountService.getAllAccounts(currentPage, pageSize);
          setAccounts(data.content || []);
          setTotalPages(data.totalPages || 0);
          setTotalElements(data.totalElements || 0);
        } catch (error) {
          toast({ title: "Error", description: "Failed to load accounts", variant: "destructive" });
        } finally {
          setIsLoadingAccounts(false);
        }
      };
      fetchAllAccounts();
    }
  }, [selectedUserEmail, currentPage, pageSize]);

  const filteredAccounts = accounts.filter(account =>
    account.accountNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    account.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedUser = users.find(u => u.email === selectedUserEmail);

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="page-title">All Accounts</h1>
            <p className="page-subtitle">View bank accounts by user</p>
          </div>
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search accounts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        {/* User Selection */}
        <div className="bg-card rounded-xl border border-border p-6">
          <div className="flex items-center gap-3 mb-4">
            <Users className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">Filter by User (Optional)</h3>
          </div>
          <Select value={selectedUserEmail} onValueChange={setSelectedUserEmail}>
            <SelectTrigger className="w-full sm:w-96">
              <SelectValue placeholder="Choose a user to filter their accounts" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">
                <div className="flex items-center gap-2">
                  <span>All Users (Show All Accounts)</span>
                </div>
              </SelectItem>
              {users.map((user) => (
                <SelectItem key={user.email} value={user.email}>
                  <div className="flex items-center gap-2">
                    <span>{user.fullName}</span>
                    <span className="text-muted-foreground">({user.email})</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {selectedUser && (
            <div className="mt-4 p-4 bg-muted/30 rounded-lg">
              <p className="text-sm text-muted-foreground">
                Viewing accounts for: <span className="font-medium text-foreground">{selectedUser.fullName}</span>
              </p>
            </div>
          )}
        </div>

        {/* Accounts Display */}
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : isLoadingAccounts ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : filteredAccounts.length === 0 ? (
          <div className="bg-card rounded-xl border border-border p-8 text-center">
            <Building2 className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No accounts found</h3>
            <p className="text-muted-foreground">
              {searchTerm ? 'Try a different search term' : (selectedUserEmail ? 'This user has no bank accounts' : 'No accounts found in the system')}
            </p>
          </div>
        ) : (
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-border bg-muted/30">
                  <tr>
                    <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Account Number</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Type</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Balance</th>
                    {!selectedUserEmail && <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">User</th>}
                    <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Created</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAccounts.map((account) => (
                    <tr key={account.id} className="border-b border-border last:border-0 hover:bg-muted/20">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm">{account.accountNumber}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`badge-account ${account.type.toLowerCase()}`}>
                          {account.type.charAt(0).toUpperCase() + account.type.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-medium">
                        {formatCurrency(account.balance)}
                      </td>
                      {!selectedUserEmail && (
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="font-medium">{account.email || 'N/A'}</span>
                            <span className="text-xs text-muted-foreground">ID: {account.userId || 'N/A'}</span>
                          </div>
                        </td>
                      )}
                      <td className="px-6 py-4 text-muted-foreground">
                        {formatDate(account.createdAt)}
                      </td>
                      <td className="px-6 py-4">
                        <Button variant="ghost" size="sm">
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
        
        {/* Pagination */}
        {!isLoading && totalPages > 1 && (
          <DataPagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalElements={totalElements}
            pageSize={pageSize}
            onPageChange={handlePageChange}
            isLoading={isLoading}
          />
        )}
      </div>
    </DashboardLayout>
  );
}
