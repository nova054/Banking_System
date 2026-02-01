import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { accountService, transactionService, Account, Transaction } from '@/lib/api';
import { formatCurrency, formatDateTime, getTransactionTypeDisplay } from '@/lib/formatters';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  ArrowLeftRight,
  Plus,
  TrendingUp,
  Loader2,
  RefreshCw,
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export default function UserDashboard() {
  const { user } = useAuth();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Modal states
  const [depositOpen, setDepositOpen] = useState(false);
  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const [transferOpen, setTransferOpen] = useState(false);
  const [createAccountOpen, setCreateAccountOpen] = useState(false);

  // Form states
  const [selectedAccount, setSelectedAccount] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [toAccount, setToAccount] = useState('');
  const [accountType, setAccountType] = useState('savings');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);

  const fetchData = async () => {
    try {
      const accountsData = await accountService.getMyAccounts();
      setAccounts(accountsData);

      // Get transactions from all accounts
      if (accountsData.length > 0) {
        const allTransactions: Transaction[] = [];
        for (const account of accountsData.slice(0, 3)) {
          try {
            const transactions = await transactionService.getStatement(account.accountNumber);
            allTransactions.push(...transactions.content);
          } catch (e) {
            // No transactions for this account
          }
        }
        // Sort by date and take latest 5
        allTransactions.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setRecentTransactions(allTransactions.slice(0, 5));
      }
    } catch (error: any) {
      if (error.response?.status !== 404) {
        toast({
          title: "Error",
          description: "Failed to load dashboard data",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchData();
  };

  const resetForm = () => {
    setSelectedAccount('');
    setAmount('');
    setDescription('');
    setToAccount('');
    setAccountType('savings');
  };

  const handleDeposit = async () => {
    if (!selectedAccount || !amount) return;
    setIsSubmitting(true);
    try {
      await transactionService.deposit(selectedAccount, parseFloat(amount), description);
      toast({ title: "Success", description: `Deposited ${formatCurrency(parseFloat(amount))}` });
      setDepositOpen(false);
      resetForm();
      fetchData();
    } catch (error: any) {
      toast({ title: "Error", description: error.response?.data?.message || "Deposit failed", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWithdraw = async () => {
    if (!selectedAccount || !amount) return;
    setIsSubmitting(true);
    try {
      await transactionService.withdraw(selectedAccount, parseFloat(amount), description);
      toast({ title: "Success", description: `Withdrawn ${formatCurrency(parseFloat(amount))}` });
      setWithdrawOpen(false);
      resetForm();
      fetchData();
    } catch (error: any) {
      toast({ title: "Error", description: error.response?.data?.message || "Withdrawal failed", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTransfer = async () => {
    if (!selectedAccount || !toAccount || !amount) return;
    setIsSubmitting(true);
    try {
      await transactionService.transfer(selectedAccount, toAccount, parseFloat(amount), description);
      toast({ title: "Success", description: `Transferred ${formatCurrency(parseFloat(amount))}` });
      setTransferOpen(false);
      resetForm();
      fetchData();
    } catch (error: any) {
      toast({ title: "Error", description: error.response?.data?.message || "Transfer failed", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateAccount = async () => {
    setIsSubmitting(true);
    try {
      await accountService.createAccount(accountType);
      toast({ title: "Success", description: `${accountType.charAt(0).toUpperCase() + accountType.slice(1)} account created` });
      setCreateAccountOpen(false);
      resetForm();
      fetchData();
    } catch (error: any) {
      toast({ title: "Error", description: error.response?.data?.message || "Failed to create account", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold">
              Welcome, {user?.fullName?.split(' ')[0]}
            </h1>
            <p className="text-muted-foreground mt-1">Here's your financial overview</p>
          </div>
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing}>
            <RefreshCw className={cn("h-4 w-4 mr-2", isRefreshing && "animate-spin")} />
            Refresh
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="stat-card">
            <div className="flex items-center justify-between mb-4">
              <span className="text-muted-foreground text-sm font-medium">Total Balance</span>
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Wallet className="h-5 w-5 text-primary" />
              </div>
            </div>
            <p className="text-3xl font-display font-bold">{formatCurrency(totalBalance)}</p>
            <p className="text-sm text-muted-foreground mt-1">Across all accounts</p>
          </div>

          <div className="stat-card">
            <div className="flex items-center justify-between mb-4">
              <span className="text-muted-foreground text-sm font-medium">Accounts</span>
              <div className="h-10 w-10 rounded-xl bg-success/10 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-success" />
              </div>
            </div>
            <p className="text-3xl font-display font-bold">{accounts.length}</p>
            <p className="text-sm text-muted-foreground mt-1">Active accounts</p>
          </div>

          <div className="stat-card">
            <div className="flex items-center justify-between mb-4">
              <span className="text-muted-foreground text-sm font-medium">Transactions</span>
              <div className="h-10 w-10 rounded-xl bg-warning/10 flex items-center justify-center">
                <ArrowLeftRight className="h-5 w-5 text-warning" />
              </div>
            </div>
            <p className="text-3xl font-display font-bold">{recentTransactions.length}</p>
            <p className="text-sm text-muted-foreground mt-1">Recent activity</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Dialog open={createAccountOpen} onOpenChange={setCreateAccountOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="h-20 flex-col gap-2 border-2 hover:bg-accent hover:text-accent-foreground">
                <Plus className="h-5 w-5 text-foreground" />
                <span className="text-sm text-foreground">New Account</span>
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

          <Dialog open={depositOpen} onOpenChange={setDepositOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="h-20 flex-col gap-2 border-2 hover:bg-accent hover:text-accent-foreground">
                <ArrowDownLeft className="h-5 w-5 text-success" />
                <span className="text-sm text-foreground">Deposit</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Deposit Funds</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label>Select Account</Label>
                  <Select value={selectedAccount} onValueChange={setSelectedAccount}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose account" />
                    </SelectTrigger>
                    <SelectContent>
                      {accounts.map((acc) => (
                        <SelectItem key={acc.accountNumber} value={acc.accountNumber}>
                          {acc.accountNumber} ({acc.type}) - {formatCurrency(acc.balance)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Amount (Rs.)</Label>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Description (Optional)</Label>
                  <Textarea
                    placeholder="e.g., Salary deposit"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
                <Button className="w-full btn-gradient" onClick={handleDeposit} disabled={isSubmitting || !selectedAccount || !amount}>
                  {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Deposit'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={withdrawOpen} onOpenChange={setWithdrawOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="h-20 flex-col gap-2 border-2 hover:bg-accent hover:text-accent-foreground">
                <ArrowUpRight className="h-5 w-5 text-destructive" />
                <span className="text-sm text-foreground">Withdraw</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Withdraw Funds</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label>Select Account</Label>
                  <Select value={selectedAccount} onValueChange={setSelectedAccount}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose account" />
                    </SelectTrigger>
                    <SelectContent>
                      {accounts.map((acc) => (
                        <SelectItem key={acc.accountNumber} value={acc.accountNumber}>
                          {acc.accountNumber} ({acc.type}) - {formatCurrency(acc.balance)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Amount (Rs.)</Label>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Description (Optional)</Label>
                  <Textarea
                    placeholder="e.g., ATM withdrawal"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
                <Button className="w-full btn-gradient" onClick={handleWithdraw} disabled={isSubmitting || !selectedAccount || !amount}>
                  {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Withdraw'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={transferOpen} onOpenChange={setTransferOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="h-20 flex-col gap-2 border-2 hover:bg-accent hover:text-accent-foreground">
                <ArrowLeftRight className="h-5 w-5 text-foreground" />
                <span className="text-sm text-foreground">Transfer</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Transfer Funds</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label>From Account</Label>
                  <Select value={selectedAccount} onValueChange={setSelectedAccount}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose account" />
                    </SelectTrigger>
                    <SelectContent>
                      {accounts.map((acc) => (
                        <SelectItem key={acc.accountNumber} value={acc.accountNumber}>
                          {acc.accountNumber} ({acc.type}) - {formatCurrency(acc.balance)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>To Account Number</Label>
                  <Input
                    placeholder="e.g., ACC-2025-000002"
                    value={toAccount}
                    onChange={(e) => setToAccount(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Amount (Rs.)</Label>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Description (Optional)</Label>
                  <Textarea
                    placeholder="e.g., Payment for services"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
                <Button className="w-full btn-gradient" onClick={handleTransfer} disabled={isSubmitting || !selectedAccount || !toAccount || !amount}>
                  {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Transfer'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Accounts and Recent Transactions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Accounts */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-display font-semibold">My Accounts</h2>
              <Link to="/accounts" className="text-sm text-primary hover:underline">View all</Link>
            </div>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : accounts.length === 0 ? (
              <div className="text-center py-12 bg-card rounded-xl border border-border">
                <Wallet className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-4">No accounts yet</p>
                <Button onClick={() => setCreateAccountOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Account
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {accounts.slice(0, 3).map((account) => (
                  <div key={account.accountNumber} className="account-card">
                    <div className="relative z-10">
                      <p className="text-sm opacity-90 mb-1 text-primary-foreground/90">{account.type.toUpperCase()} ACCOUNT</p>
                      <p className="font-mono text-lg mb-4 text-primary-foreground">{account.accountNumber}</p>
                      <p className="text-2xl font-display font-bold text-primary-foreground">{formatCurrency(account.balance)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Transactions */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-display font-semibold">Recent Transactions</h2>
              <Link to="/transactions" className="text-sm text-primary hover:underline">View all</Link>
            </div>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : recentTransactions.length === 0 ? (
              <div className="text-center py-12 bg-card rounded-xl border border-border">
                <ArrowLeftRight className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No transactions yet</p>
              </div>
            ) : (
              <div className="bg-card rounded-xl border border-border overflow-hidden">
                {recentTransactions.map((transaction, i) => {
                  const { label, isCredit } = getTransactionTypeDisplay(transaction.type);
                  return (
                    <div
                      key={transaction.id}
                      className={cn("transaction-row", i !== recentTransactions.length - 1 && "border-b border-border")}
                    >
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "h-10 w-10 rounded-full flex items-center justify-center",
                          isCredit ? "bg-success/10" : "bg-destructive/10"
                        )}>
                          {isCredit ? (
                            <ArrowDownLeft className="h-5 w-5 text-success" />
                          ) : (
                            <ArrowUpRight className="h-5 w-5 text-destructive" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{label}</p>
                          <p className="text-sm text-muted-foreground">
                            {transaction.description || formatDateTime(transaction.createdAt)}
                          </p>
                        </div>
                      </div>
                      <p className={isCredit ? "amount-credit" : "amount-debit"}>
                        {isCredit ? '+' : '-'}{formatCurrency(transaction.amount)}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
