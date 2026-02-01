import { Transaction } from '@/lib/api';
import { formatCurrency, formatDateTime, getTransactionTypeDisplay } from '@/lib/formatters';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ArrowUpRight, ArrowDownLeft, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface TransactionDetailDialogProps {
  transaction: (Transaction & { accountNumber?: string }) | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TransactionDetailDialog({ transaction, open, onOpenChange }: TransactionDetailDialogProps) {
  const [copiedReference, setCopiedReference] = useState(false);

  if (!transaction) return null;

  const { label, isCredit } = getTransactionTypeDisplay(transaction.type);

  const copyReferenceNumber = async () => {
    await navigator.clipboard.writeText(transaction.referenceNumber);
    setCopiedReference(true);
    toast({ title: "Copied", description: "Reference number copied to clipboard" });
    setTimeout(() => setCopiedReference(false), 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
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
            <span>{label}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Amount */}
          <div className="text-center py-4 bg-muted/30 rounded-lg">
            <p className={cn(
              "text-3xl font-display font-bold",
              isCredit ? "text-success" : "text-destructive"
            )}>
              {isCredit ? '+' : '-'}{formatCurrency(transaction.amount)}
            </p>
            <p className="text-sm text-muted-foreground mt-1">Transaction Amount</p>
          </div>

          {/* Transaction Details */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Reference Number</span>
              <button
                onClick={copyReferenceNumber}
                className="flex items-center gap-2 text-sm font-mono hover:bg-muted/50 px-2 py-1 rounded transition-colors"
              >
                {transaction.referenceNumber.slice(0, 12)}...
                {copiedReference ? (
                  <Check className="h-3 w-3" />
                ) : (
                  <Copy className="h-3 w-3" />
                )}
              </button>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Status</span>
              <span className={cn(
                "px-2 py-1 rounded-full text-xs font-medium",
                transaction.status === 'COMPLETED' ? "bg-success/10 text-success" :
                transaction.status === 'PENDING' ? "bg-warning/10 text-warning" :
                "bg-destructive/10 text-destructive"
              )}>
                {transaction.status}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Date & Time</span>
              <span className="text-sm">{formatDateTime(transaction.createdAt)}</span>
            </div>

            {transaction.description && (
              <div className="flex justify-between items-start">
                <span className="text-sm text-muted-foreground">Description</span>
                <span className="text-sm text-right max-w-[60%]">{transaction.description}</span>
              </div>
            )}

            {transaction.transferId && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Transfer ID</span>
                <span className="text-sm font-mono">{transaction.transferId}</span>
              </div>
            )}

            {transaction.accountNumber && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Account</span>
                <span className="text-sm font-mono">{transaction.accountNumber}</span>
              </div>
            )}
          </div>

          {/* Balance Changes */}
          <div className="border-t pt-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Before Balance</span>
              <span className="text-sm">{formatCurrency(transaction.beforeBalance)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">After Balance</span>
              <span className="text-sm font-medium">{formatCurrency(transaction.afterBalance)}</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
