import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { transactionService, Transaction, PaginatedResponse } from '@/lib/api';
import { formatCurrency, formatDateTime, getTransactionTypeDisplay } from '@/lib/formatters';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowUpRight, ArrowDownLeft, Loader2, FileText, Search, X, ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export default function AdminStatementPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [accountNumber, setAccountNumber] = useState('');
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(20);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  
  // Filter states
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [minAmount, setMinAmount] = useState('');
  const [maxAmount, setMaxAmount] = useState('');

  useEffect(() => {
    if (hasSearched && accountNumber) {
      fetchStatement();
    }
  }, [currentPage]);

  const fetchStatement = async () => {
    if (!accountNumber.trim()) return;
    
    setIsSearching(true);
    try {
      const response: PaginatedResponse<Transaction> = await transactionService.getStatement(
        accountNumber.trim(),
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
      toast({ 
        title: "Error", 
        description: error.response?.data?.message || "Failed to fetch statement", 
        variant: "destructive" 
      });
      setTransactions([]);
      setTotalPages(0);
      setTotalElements(0);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearch = () => {
    if (!accountNumber.trim()) {
      toast({ title: "Error", description: "Please enter an account number", variant: "destructive" });
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
    setAccountNumber('');
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

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="page-title">Account Statement</h1>
            <p className="page-subtitle">View transaction statements for any account</p>
          </div>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Search Account</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Account Number *</Label>
                <Input
                  placeholder="Enter account number..."
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="font-mono"
                />
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
                  Search
                </Button>
                <Button variant="outline" onClick={clearFilters}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results Summary */}
        {hasSearched && (
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Account Number</p>
                  <p className="font-mono text-lg font-medium">{accountNumber}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Total Transactions</p>
                  <p className="text-2xl font-bold">{totalElements}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Transactions */}
        {hasSearched && (
          <>
            {isSearching ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : transactions.length === 0 ? (
              <div className="text-center py-16 bg-card rounded-xl border border-border">
                <AlertCircle className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">No transactions found</h3>
                <p className="text-muted-foreground">
                  No transactions found for account <span className="font-mono bg-muted px-2 py-1 rounded">{accountNumber}</span> with the specified filters
                </p>
              </div>
            ) : (
              <Card>
                <CardContent className="p-0">
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
                            <tr key={transaction.id} className="border-b border-border last:border-0 hover:bg-muted/20">
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
                  
                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-between p-4 border-t border-border">
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
                </CardContent>
              </Card>
            )}
          </>
        )}

        {/* Initial State */}
        {!hasSearched && (
          <div className="text-center py-16 bg-card rounded-xl border border-border">
            <FileText className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">Account Statement Search</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Enter an account number above to view transaction statements. Admins can access any account's transaction history.
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
