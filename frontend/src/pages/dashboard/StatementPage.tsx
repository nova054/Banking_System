import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { accountService, transactionService, Account, Transaction, PaginatedResponse } from '@/lib/api';
import { formatCurrency, formatDateTime, getTransactionTypeDisplay, formatDate } from '@/lib/formatters';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ArrowUpRight, ArrowDownLeft, Loader2, FileText, Search, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { TransactionDetailDialog } from '@/components/transactions/TransactionDetailDialog';

export default function StatementPage() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(20);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [hasSearched, setHasSearched] = useState(false);

  // Transaction detail dialog state
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [transactionDetailOpen, setTransactionDetailOpen] = useState(false);

  // Filter states
  const [selectedAccount, setSelectedAccount] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [minAmount, setMinAmount] = useState('');
  const [maxAmount, setMaxAmount] = useState('');

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const data = await accountService.getMyAccounts();
        setAccounts(data);
        if (data.length > 0) {
          setSelectedAccount(data[0].accountNumber);
        }
      } catch (error: any) {
        if (error.response?.status !== 404) {
          toast({ title: "Error", description: "Failed to load accounts", variant: "destructive" });
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchAccounts();
  }, []);

  useEffect(() => {
    if (hasSearched && selectedAccount) {
      fetchStatement();
    }
  }, [currentPage, hasSearched, selectedAccount]);

  const fetchStatement = async () => {
    if (!selectedAccount) return;
    
    setIsSearching(true);
    try {
      const response: PaginatedResponse<Transaction> = await transactionService.getStatement(
        selectedAccount,
        fromDate || undefined,
        toDate || undefined,
        minAmount ? parseFloat(minAmount) : undefined,
        maxAmount ? parseFloat(maxAmount) : undefined,
        currentPage,
        pageSize
      );
      
      setTransactions(response.content);
      setTotalPages(response.totalPages);
      setTotalElements(response.totalElements);
    } catch (error: any) {
      toast({ title: "Error", description: error.response?.data?.message || "Failed to fetch statement", variant: "destructive" });
      setTransactions([]);
      setTotalPages(0);
      setTotalElements(0);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearch = () => {
    if (!selectedAccount) {
      toast({ title: "Error", description: "Please select an account", variant: "destructive" });
      return;
    }

    // Validate dates
    if (fromDate && toDate && new Date(fromDate) > new Date(toDate)) {
      toast({ title: "Error", description: "From date cannot be after To date", variant: "destructive" });
      return;
    }

    setCurrentPage(0);
    setHasSearched(true);
    fetchStatement();
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 0 && newPage < totalPages) {
      setCurrentPage(newPage);
    }
  };

  const clearFilters = () => {
    setFromDate('');
    setToDate('');
    setMinAmount('');
    setMaxAmount('');
    setTransactions([]);
    setCurrentPage(0);
    setHasSearched(false);
    setTotalPages(0);
    setTotalElements(0);
  };

  const handleTransactionClick = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setTransactionDetailOpen(true);
  };

  const selectedAccountDetails = accounts.find(a => a.accountNumber === selectedAccount);

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-fade-in">
        {/* Header */}
        <div>
          <h1 className="page-title">Account Statement</h1>
          <p className="page-subtitle">Generate and view detailed account statements</p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : accounts.length === 0 ? (
          <div className="text-center py-16 bg-card rounded-xl border border-border">
            <FileText className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No accounts found</h3>
            <p className="text-muted-foreground">Create an account to view statements</p>
          </div>
        ) : (
          <>
            {/* Filters */}
            <div className="bg-card rounded-xl border border-border p-6">
              <h2 className="text-lg font-semibold mb-4">Filter Statement</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Account</Label>
                  <Select value={selectedAccount} onValueChange={setSelectedAccount}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select account" />
                    </SelectTrigger>
                    <SelectContent>
                      {accounts.map((acc) => (
                        <SelectItem key={acc.accountNumber} value={acc.accountNumber}>
                          {acc.accountNumber} ({acc.type})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>From Date</Label>
                  <Input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
                </div>

                <div className="space-y-2">
                  <Label>To Date</Label>
                  <Input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
                </div>

                <div className="space-y-2">
                  <Label>Min Amount (Rs.)</Label>
                  <Input type="number" min="0" step="0.01" placeholder="0.00" value={minAmount} onChange={(e) => setMinAmount(e.target.value)} />
                </div>

                <div className="space-y-2">
                  <Label>Max Amount (Rs.)</Label>
                  <Input type="number" min="0" step="0.01" placeholder="0.00" value={maxAmount} onChange={(e) => setMaxAmount(e.target.value)} />
                </div>

                <div className="flex items-end gap-2">
                  <Button className="btn-gradient flex-1" onClick={handleSearch} disabled={isSearching}>
                    {isSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4 mr-2" />}
                    Generate
                  </Button>
                  <Button variant="outline" onClick={clearFilters}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Account Summary */}
            {selectedAccountDetails && transactions.length > 0 && (
              <div className="bg-card rounded-xl border border-border p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Account</p>
                    <p className="font-mono text-lg font-medium">{selectedAccountDetails.accountNumber}</p>
                    <p className="text-sm text-muted-foreground capitalize">{selectedAccountDetails.type} Account</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Current Balance</p>
                    <p className="text-2xl font-display font-bold">{formatCurrency(selectedAccountDetails.balance)}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Transactions */}
            {transactions.length > 0 ? (
              <div className="bg-card rounded-xl border border-border overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b border-border bg-muted/30">
                      <tr>
                        <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Date</th>
                        <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Type</th>
                        <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Description</th>
                        <th className="text-right px-6 py-4 text-sm font-medium text-muted-foreground">Before</th>
                        <th className="text-right px-6 py-4 text-sm font-medium text-muted-foreground">Amount</th>
                        <th className="text-right px-6 py-4 text-sm font-medium text-muted-foreground">After</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.map((transaction) => {
                        const { label, isCredit } = getTransactionTypeDisplay(transaction.type);
                        return (
                          <tr 
                        key={transaction.id} 
                        className="border-b border-border last:border-0 hover:bg-muted/20 cursor-pointer"
                        onClick={() => handleTransactionClick(transaction)}
                      >
                            <td className="px-6 py-4 text-muted-foreground whitespace-nowrap">
                              {formatDateTime(transaction.createdAt)}
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <div className={cn(
                                  "h-6 w-6 rounded-full flex items-center justify-center",
                                  isCredit ? "bg-success/10" : "bg-destructive/10"
                                )}>
                                  {isCredit ? (
                                    <ArrowDownLeft className="h-3 w-3 text-success" />
                                  ) : (
                                    <ArrowUpRight className="h-3 w-3 text-destructive" />
                                  )}
                                </div>
                                <span className="font-medium">{label}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-muted-foreground">
                              {transaction.description || '-'}
                            </td>
                            <td className="px-6 py-4 text-right text-muted-foreground">
                              {formatCurrency(transaction.beforeBalance)}
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
            ) : (
              <div className="text-center py-16 bg-card rounded-xl border border-border">
                <FileText className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Statement Generated</h3>
                <p className="text-muted-foreground">Select an account and click "Generate" to view your statement</p>
              </div>
            )}
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-4">
                <p className="text-sm text-muted-foreground">
                  Showing {currentPage * pageSize + 1} to {Math.min((currentPage + 1) * pageSize, totalElements)} of {totalElements} transactions
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 0 || isSearching}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>
                  <span className="text-sm">
                    Page {currentPage + 1} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages - 1 || isSearching}
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
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
