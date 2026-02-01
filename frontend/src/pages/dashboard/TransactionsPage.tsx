import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { accountService, transactionService, Account, Transaction } from '@/lib/api';
import { formatCurrency, formatDateTime, getTransactionTypeDisplay } from '@/lib/formatters';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  ArrowUpRight,
  ArrowDownLeft,
  ArrowLeftRight,
  Loader2,
  Filter,
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { TransactionDetailDialog } from '@/components/transactions/TransactionDetailDialog';

export default function TransactionsPage() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [transactions, setTransactions] = useState<(Transaction & { accountNumber: string })[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAccount, setSelectedAccount] = useState<string>('all');

  // Transaction modal states
  const [depositOpen, setDepositOpen] = useState(false);
  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const [transferOpen, setTransferOpen] = useState(false);

  // Form states
  const [formAccount, setFormAccount] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [toAccount, setToAccount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Transaction detail dialog state
  const [selectedTransaction, setSelectedTransaction] = useState<(Transaction & { accountNumber: string }) | null>(null);
  const [transactionDetailOpen, setTransactionDetailOpen] = useState(false);

  const fetchData = async () => {
    try {
      const accountsData = await accountService.getMyAccounts();
      setAccounts(accountsData);

      // Fetch transactions from all accounts
      const allTransactions: (Transaction & { accountNumber: string })[] = [];
      for (const account of accountsData) {
        try {
          const txns = await transactionService.getStatement(account.accountNumber);
          
          // Add accountNumber to each transaction for filtering
          const transactionsWithAccount = txns.content.map(txn => ({
            ...txn,
            accountNumber: account.accountNumber
          }));
          
          allTransactions.push(...transactionsWithAccount);
        } catch (e) {
          // No transactions
        }
      }
      allTransactions.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setTransactions(allTransactions);
    } catch (error: any) {
      if (error.response?.status !== 404) {
        toast({ title: "Error", description: "Failed to load data", variant: "destructive" });
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const resetForm = () => {
    setFormAccount('');
    setAmount('');
    setDescription('');
    setToAccount('');
  };

  const handleDeposit = async () => {
    if (!formAccount || !amount) return;
    setIsSubmitting(true);
    try {
      const transaction = await transactionService.deposit(formAccount, parseFloat(amount), description);
      toast({ title: "Success", description: `Deposited ${formatCurrency(parseFloat(amount))}` });
      setDepositOpen(false);
      resetForm();
      fetchData();
      
      // Show transaction details
      setSelectedTransaction(transaction);
      setTransactionDetailOpen(true);
    } catch (error: any) {
      toast({ title: "Error", description: error.response?.data?.message || "Deposit failed", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWithdraw = async () => {
    if (!formAccount || !amount) return;
    setIsSubmitting(true);
    try {
      const transaction = await transactionService.withdraw(formAccount, parseFloat(amount), description);
      toast({ title: "Success", description: `Withdrawn ${formatCurrency(parseFloat(amount))}` });
      setWithdrawOpen(false);
      resetForm();
      fetchData();
      
      // Show transaction details
      setSelectedTransaction(transaction);
      setTransactionDetailOpen(true);
    } catch (error: any) {
      toast({ title: "Error", description: error.response?.data?.message || "Withdrawal failed", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTransfer = async () => {
    if (!formAccount || !toAccount || !amount) return;
    setIsSubmitting(true);
    try {
      const transferResponse = await transactionService.transfer(formAccount, toAccount, parseFloat(amount), description);
      toast({ 
        title: "Transfer Successful", 
        description: `Transferred ${formatCurrency(parseFloat(amount))} to ${toAccount}` 
      });
      setTransferOpen(false);
      resetForm();
      fetchData();
      
      // For transfers, we could show a custom transfer detail dialog in the future
      // For now, just refresh the data
    } catch (error: any) {
      toast({ title: "Error", description: error.response?.data?.message || "Transfer failed", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTransactionClick = (transaction: Transaction & { accountNumber: string }) => {
    setSelectedTransaction(transaction);
    setTransactionDetailOpen(true);
  };

  const filteredTransactions = selectedAccount === 'all'
    ? transactions
    : transactions.filter(t => t.accountNumber === selectedAccount);

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="page-title">Transactions</h1>
            <p className="page-subtitle">View and manage your transaction history</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Dialog open={depositOpen} onOpenChange={setDepositOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <ArrowDownLeft className="h-4 w-4 mr-2 text-success" />
                  Deposit
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Deposit Funds</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label>Select Account</Label>
                    <Select value={formAccount} onValueChange={setFormAccount}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose account" />
                      </SelectTrigger>
                      <SelectContent>
                        {accounts.map((acc) => (
                          <SelectItem key={acc.accountNumber} value={acc.accountNumber}>
                            {acc.accountNumber} - {formatCurrency(acc.balance)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Amount (Rs.)</Label>
                    <Input type="number" min="0" step="0.01" placeholder="0.00" value={amount} onChange={(e) => setAmount(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Description (Optional)</Label>
                    <Textarea placeholder="e.g., Salary deposit" value={description} onChange={(e) => setDescription(e.target.value)} />
                  </div>
                  <Button className="w-full btn-gradient" onClick={handleDeposit} disabled={isSubmitting || !formAccount || !amount}>
                    {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Deposit'}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog open={withdrawOpen} onOpenChange={setWithdrawOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <ArrowUpRight className="h-4 w-4 mr-2 text-destructive" />
                  Withdraw
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Withdraw Funds</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label>Select Account</Label>
                    <Select value={formAccount} onValueChange={setFormAccount}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose account" />
                      </SelectTrigger>
                      <SelectContent>
                        {accounts.map((acc) => (
                          <SelectItem key={acc.accountNumber} value={acc.accountNumber}>
                            {acc.accountNumber} - {formatCurrency(acc.balance)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Amount (Rs.)</Label>
                    <Input type="number" min="0" step="0.01" placeholder="0.00" value={amount} onChange={(e) => setAmount(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Description (Optional)</Label>
                    <Textarea placeholder="e.g., ATM withdrawal" value={description} onChange={(e) => setDescription(e.target.value)} />
                  </div>
                  <Button className="w-full btn-gradient" onClick={handleWithdraw} disabled={isSubmitting || !formAccount || !amount}>
                    {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Withdraw'}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog open={transferOpen} onOpenChange={setTransferOpen}>
              <DialogTrigger asChild>
                <Button className="btn-gradient">
                  <ArrowLeftRight className="h-4 w-4 mr-2" />
                  Transfer
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Transfer Funds</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label>From Account</Label>
                    <Select value={formAccount} onValueChange={setFormAccount}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose account" />
                      </SelectTrigger>
                      <SelectContent>
                        {accounts.map((acc) => (
                          <SelectItem key={acc.accountNumber} value={acc.accountNumber}>
                            {acc.accountNumber} - {formatCurrency(acc.balance)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>To Account Number</Label>
                    <Input placeholder="e.g., ACC-2025-000002" value={toAccount} onChange={(e) => setToAccount(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Amount (Rs.)</Label>
                    <Input type="number" min="0" step="0.01" placeholder="0.00" value={amount} onChange={(e) => setAmount(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Description (Optional)</Label>
                    <Textarea placeholder="e.g., Payment for services" value={description} onChange={(e) => setDescription(e.target.value)} />
                  </div>
                  <Button className="w-full btn-gradient" onClick={handleTransfer} disabled={isSubmitting || !formAccount || !toAccount || !amount}>
                    {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Transfer'}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Filter */}
        <div className="flex items-center gap-4">
          <Filter className="h-5 w-5 text-muted-foreground" />
          <Select value={selectedAccount} onValueChange={setSelectedAccount}>
            <SelectTrigger className="w-[280px]">
              <SelectValue placeholder="Filter by account" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Accounts</SelectItem>
              {accounts.map((acc) => (
                <SelectItem key={acc.accountNumber} value={acc.accountNumber}>
                  {acc.accountNumber}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Transactions List */}
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : filteredTransactions.length === 0 ? (
          <div className="text-center py-16 bg-card rounded-xl border border-border">
            <ArrowLeftRight className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No transactions yet</h3>
            <p className="text-muted-foreground">Make a deposit, withdrawal, or transfer to see your transaction history</p>
          </div>
        ) : (
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-border bg-muted/30">
                  <tr>
                    <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Type</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Description</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Reference</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Date</th>
                    <th className="text-right px-6 py-4 text-sm font-medium text-muted-foreground">Amount</th>
                    <th className="text-right px-6 py-4 text-sm font-medium text-muted-foreground">Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions.map((transaction) => {
                    const { label, isCredit } = getTransactionTypeDisplay(transaction.type);
                    return (
                      <tr 
                        key={transaction.id} 
                        className="border-b border-border last:border-0 hover:bg-muted/20 cursor-pointer"
                        onClick={() => handleTransactionClick(transaction)}
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className={cn(
                              "h-8 w-8 rounded-full flex items-center justify-center",
                              isCredit ? "bg-success/10" : "bg-destructive/10"
                            )}>
                              {isCredit ? (
                                <ArrowDownLeft className="h-4 w-4 text-success" />
                              ) : (
                                <ArrowUpRight className="h-4 w-4 text-destructive" />
                              )}
                            </div>
                            <span className="font-medium">{label}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-muted-foreground">
                          {transaction.description || '-'}
                        </td>
                        <td className="px-6 py-4 font-mono text-sm text-muted-foreground">
                          {transaction.referenceNumber.slice(0, 8)}...
                        </td>
                        <td className="px-6 py-4 text-muted-foreground">
                          {formatDateTime(transaction.createdAt)}
                        </td>
                        <td className={cn("px-6 py-4 text-right font-semibold", isCredit ? "text-success" : "text-destructive")}>
                          {isCredit ? '+' : '-'}{formatCurrency(transaction.amount)}
                        </td>
                        <td className="px-6 py-4 text-right font-medium">
                          {formatCurrency(transaction.afterBalance)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
      
      <TransactionDetailDialog
        transaction={selectedTransaction}
        open={transactionDetailOpen}
        onOpenChange={setTransactionDetailOpen}
      />
    </DashboardLayout>
  );
}
