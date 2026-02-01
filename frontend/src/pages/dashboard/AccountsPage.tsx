import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { accountService, Account } from '@/lib/api';
import { formatCurrency, formatDate } from '@/lib/formatters';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Wallet, Loader2, Copy, Check } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export default function AccountsPage() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [createAccountOpen, setCreateAccountOpen] = useState(false);
  const [accountType, setAccountType] = useState('savings');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedAccount, setCopiedAccount] = useState<string | null>(null);
  

  const fetchAccounts = async () => {
    try {
      const data = await accountService.getMyAccounts();
      setAccounts(data);
    } catch (error: any) {
      if (error.response?.status !== 404) {
        toast({
          title: "Error",
          description: "Failed to load accounts",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const handleCreateAccount = async () => {
    setIsSubmitting(true);
    try {
      await accountService.createAccount(accountType);
      toast({ title: "Success", description: "Account created successfully" });
      setCreateAccountOpen(false);
      setAccountType('savings');
      fetchAccounts();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to create account",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyAccountNumber = async (accountNumber: string) => {
    await navigator.clipboard.writeText(accountNumber);
    setCopiedAccount(accountNumber);
    toast({ title: "Copied", description: "Account number copied to clipboard" });
    setTimeout(() => setCopiedAccount(null), 2000);
  };


  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="page-title">My Accounts</h1>
            <p className="page-subtitle">Manage your bank accounts</p>
          </div>
          <div className="flex gap-3">
            
            <Dialog open={createAccountOpen} onOpenChange={setCreateAccountOpen}>
              <DialogTrigger asChild>
                <Button className="btn-gradient">
                  <Plus className="h-4 w-4 mr-2" />
                  New Account
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Account</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label>Account Type</Label>
                  <Select value={accountType} onValueChange={setAccountType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="savings">Savings Account</SelectItem>
                      <SelectItem value="current">Current Account</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button className="w-full btn-gradient" onClick={handleCreateAccount} disabled={isSubmitting}>
                  {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Create Account'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          </div>
        </div>

        {/* Summary */}
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Balance</p>
              <p className="text-3xl font-display font-bold mt-1">{formatCurrency(totalBalance)}</p>
            </div>
            <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Wallet className="h-7 w-7 text-primary" />
            </div>
          </div>
        </div>

        {/* Accounts List */}
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : accounts.length === 0 ? (
          <div className="text-center py-16 bg-card rounded-xl border border-border">
            <Wallet className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No accounts yet</h3>
            <p className="text-muted-foreground mb-6">Create your first bank account to get started</p>
            <Button onClick={() => setCreateAccountOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Account
            </Button>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {accounts.map((account) => (
              <div key={account.accountNumber} className="account-card">
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm opacity-90 uppercase tracking-wider text-primary-foreground">
                      {account.type} Account
                    </span>
                    <button
                      onClick={() => copyAccountNumber(account.accountNumber)}
                      className="p-2 rounded-lg bg-primary-foreground/10 hover:bg-primary-foreground/20 transition-colors text-primary-foreground"
                    >
                      {copiedAccount === account.accountNumber ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  <p className="font-mono text-lg mb-6 text-primary-foreground">{account.accountNumber}</p>
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-sm opacity-80 mb-1 text-primary-foreground/90">Available Balance</p>
                      <p className="text-3xl font-display font-bold text-primary-foreground">{formatCurrency(account.balance)}</p>
                    </div>
                    <p className="text-sm opacity-90 text-primary-foreground/90">Since {formatDate(account.createdAt)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
