import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { adminTransactionService, Transaction } from '@/lib/api';
import { formatCurrency, formatDateTime, getTransactionTypeDisplay } from '@/lib/formatters';
import { Receipt, Loader2, Search, Eye, Filter, Calendar, User } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import {


  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { DataPagination } from '@/components/ui/DataPagination';

export default function AdminTransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [showTransactionDetail, setShowTransactionDetail] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [pageSize] = useState(20);

  // Filter states
  const [transactionType, setTransactionType] = useState('');
  const [status, setStatus] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Fetch all transactions by default
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setIsLoading(true);
        const data = await adminTransactionService.getAllTransactions(currentPage, pageSize);
        setTransactions(data.content || []);
        setTotalPages(data.totalPages || 0);
        setTotalElements(data.totalElements || 0);
      } catch (error) {
        toast({ title: "Error", description: "Failed to load transactions", variant: "destructive" });
      } finally {
        setIsLoading(false);
      }
    };
    fetchTransactions();
  }, [currentPage, pageSize]);

  const handleFilter = async () => {
    const filters: any = {};
    if (transactionType) filters.type = transactionType;
    if (status) filters.status = status;
    if (fromDate) filters.fromDate = fromDate;
    if (toDate) filters.toDate = toDate;
    if (accountNumber) filters.accountNumber = accountNumber;
    
    setCurrentPage(0);
    try {
      setIsLoading(true);
      const response = Object.keys(filters).length > 0 
        ? await adminTransactionService.filterTransactions(filters, 0, pageSize)
        : await adminTransactionService.getAllTransactions(0, pageSize);
      
      setTransactions(response.content || []);
      setTotalPages(response.totalPages || 0);
      setTotalElements(response.totalElements || 0);
    } catch (error: any) {
      toast({ 
        title: "Error", 
        description: error?.response?.data?.message || "Failed to filter transactions", 
        variant: "destructive" 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearFilters = () => {
    setTransactionType('');
    setStatus('');
    setFromDate('');
    setToDate('');
    setAccountNumber('');
    setCurrentPage(0);
    setShowFilters(false);
    // Reset to all transactions
    const fetchAllTransactions = async () => {
      try {
        setIsLoading(true);
        const data = await adminTransactionService.getAllTransactions(0, pageSize);
        setTransactions(data.content || []);
        setTotalPages(data.totalPages || 0);
        setTotalElements(data.totalElements || 0);
      } catch (error) {
        toast({ title: "Error", description: "Failed to load transactions", variant: "destructive" });
      } finally {
        setIsLoading(false);
      }
    };
    fetchAllTransactions();
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleViewTransaction = async (transaction: Transaction) => {
    try {
      const data = await adminTransactionService.getTransactionById(transaction.id);
      setSelectedTransaction(data);
      setShowTransactionDetail(true);
    } catch (error: unknown) {
      toast({
        title: "Error",
        description: "Failed to load transaction details",
        variant: "destructive",
      });
    }
  };

  const filteredTransactions = transactions.filter(t =>
    t.referenceNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="page-title">All Transactions</h1>
            <p className="page-subtitle">View and filter all bank transactions</p>
          </div>
          <div className="flex gap-3">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              Filters
            </Button>
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="bg-card rounded-xl border border-border p-6">
            <div className="flex items-center gap-3 mb-4">
              <Filter className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">Filter Transactions</h3>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <div>
                <Label htmlFor="transaction-type">Transaction Type</Label>
                <Select value={transactionType} onValueChange={setTransactionType}>
                  <SelectTrigger>
                    <SelectValue placeholder="All types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All types</SelectItem>
                    <SelectItem value="DEPOSIT">Deposit</SelectItem>
                    <SelectItem value="WITHDRAW">Withdraw</SelectItem>
                    <SelectItem value="TRANSFER_DEBIT">Transfer (Debit)</SelectItem>
                    <SelectItem value="TRANSFER_CREDIT">Transfer (Credit)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="All statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All statuses</SelectItem>
                    <SelectItem value="COMPLETED">Completed</SelectItem>
                    <SelectItem value="PENDING">Pending</SelectItem>
                    <SelectItem value="FAILED">Failed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="account-number">Account Number</Label>
                <Input
                  id="account-number"
                  placeholder="Enter account number"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="from-date">From Date</Label>
                <Input
                  id="from-date"
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="to-date">To Date</Label>
                <Input
                  id="to-date"
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                />
              </div>
              <div className="flex items-end gap-2">
                <Button onClick={handleFilter} className="flex-1">
                  Apply Filters
                </Button>
                <Button variant="outline" onClick={handleClearFilters}>
                  Clear
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Transactions Display */}
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : filteredTransactions.length === 0 ? (
          <div className="bg-card rounded-xl border border-border p-8 text-center">
            <Receipt className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No transactions found</h3>
            <p className="text-muted-foreground">
              {searchTerm ? 'Try a different search term' : 'No transactions found in the system'}
            </p>
          </div>
        ) : (
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-border bg-muted/30">
                  <tr>
                    <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Reference</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Type</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Amount</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Account</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Status</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Date</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions.map((transaction) => (
                    <tr key={transaction.id} className="border-b border-border last:border-0 hover:bg-muted/20">
                      <td className="px-6 py-4">
                        <span className="font-mono text-sm">{transaction.referenceNumber}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`badge-transaction ${transaction.type.toLowerCase()}`}>
                          {getTransactionTypeDisplay(transaction.type).label}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-medium">
                        {formatCurrency(transaction.amount)}
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-mono text-sm">{transaction.accountNumber || 'N/A'}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`badge-status ${transaction.status.toLowerCase()}`}>
                          {transaction.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">
                        {formatDateTime(transaction.createdAt)}
                      </td>
                      <td className="px-6 py-4">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleViewTransaction(transaction)}
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

        {/* Transaction Detail Modal */}
        {selectedTransaction && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-card rounded-xl border border-border max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold">Transaction Details</h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowTransactionDetail(false)}
                  >
                    ×
                  </Button>
                </div>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Reference Number</p>
                      <p className="font-medium font-mono">{selectedTransaction.referenceNumber}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Transaction ID</p>
                      <p className="font-medium">#{selectedTransaction.id}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Type</p>
                      <span className={`badge-transaction ${selectedTransaction.type.toLowerCase()}`}>
                        {getTransactionTypeDisplay(selectedTransaction.type).label}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Status</p>
                      <span className={`badge-status ${selectedTransaction.status.toLowerCase()}`}>
                        {selectedTransaction.status}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Amount</p>
                      <p className="font-medium text-lg">{formatCurrency(selectedTransaction.amount)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Account Number</p>
                      <p className="font-medium font-mono">{selectedTransaction.accountNumber || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Date & Time</p>
                      <p className="font-medium">{formatDateTime(selectedTransaction.createdAt)}</p>
                    </div>
                    {selectedTransaction.description && (
                      <div className="col-span-2">
                        <p className="text-sm text-muted-foreground">Description</p>
                        <p className="font-medium">{selectedTransaction.description}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
