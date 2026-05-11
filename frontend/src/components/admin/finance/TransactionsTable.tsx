import { useState } from "react";
import {
  useGetAccountTransactions,
  useCreateTransaction,
  useDeleteTransaction,
} from "@/hooks/useFinance";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Plus,
  Trash2,
  ArrowLeft,
  ArrowDownCircle,
  ArrowUpCircle,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Filter,
} from "lucide-react";

interface TransactionsTableProps {
  accountId: number;
  accountName: string;
  onBack: () => void;
}

export function TransactionsTable({
  accountId,
  accountName,
  onBack,
}: TransactionsTableProps) {
  const [page, setPage] = useState(1);
  const [filterType, setFilterType] = useState<"in" | "out" | undefined>(
    undefined
  );
  const [dialogOpen, setDialogOpen] = useState(false);

  // Form state
  const [txType, setTxType] = useState<"in" | "out">("in");
  const [txAmount, setTxAmount] = useState("");
  const [txDescription, setTxDescription] = useState("");

  const { transactions, pagination, isGettingTransactions } =
    useGetAccountTransactions(accountId, page, 15, filterType);
  const { createTransactionMutation, isCreatingTransaction } =
    useCreateTransaction();
  const { deleteTransactionMutation, isDeletingTransaction } =
    useDeleteTransaction();

  const handleCreate = () => {
    const amount = parseFloat(txAmount);
    if (!amount || amount <= 0) return;

    createTransactionMutation(
      {
        account_id: accountId,
        type: txType,
        amount,
        description: txDescription.trim() || undefined,
      },
      {
        onSuccess: () => {
          setTxAmount("");
          setTxDescription("");
          setTxType("in");
          setDialogOpen(false);
        },
      }
    );
  };

  const handleDelete = (id: number) => {
    deleteTransactionMutation({ id });
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <CardTitle className="text-lg">{accountName} — Transactions</CardTitle>
        </div>
        <div className="flex items-center gap-2">
          {/* Filter */}
          <div className="flex items-center gap-1">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select
              value={filterType || "all"}
              onValueChange={(val) => {
                setFilterType(
                  val === "all" ? undefined : (val as "in" | "out")
                );
                setPage(1);
              }}
            >
              <SelectTrigger className="w-[100px] h-8">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="in">Income</SelectItem>
                <SelectItem value="out">Expense</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Add Transaction */}
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" id="add-transaction-btn">
                <Plus className="h-4 w-4 mr-1" />
                Add Transaction
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>New Transaction — {accountName}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Type</label>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant={txType === "in" ? "default" : "outline"}
                      className={`flex-1 ${
                        txType === "in"
                          ? "bg-green-600 hover:bg-green-700 text-white"
                          : ""
                      }`}
                      onClick={() => setTxType("in")}
                    >
                      <ArrowDownCircle className="h-4 w-4 mr-2" />
                      Income (In)
                    </Button>
                    <Button
                      type="button"
                      variant={txType === "out" ? "default" : "outline"}
                      className={`flex-1 ${
                        txType === "out"
                          ? "bg-red-600 hover:bg-red-700 text-white"
                          : ""
                      }`}
                      onClick={() => setTxType("out")}
                    >
                      <ArrowUpCircle className="h-4 w-4 mr-2" />
                      Expense (Out)
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Amount</label>
                  <Input
                    id="transaction-amount-input"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    value={txAmount}
                    onChange={(e) => setTxAmount(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Description (optional)
                  </label>
                  <Textarea
                    id="transaction-description-input"
                    placeholder="What is this transaction for?"
                    value={txDescription}
                    onChange={(e) => setTxDescription(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button
                  onClick={handleCreate}
                  disabled={
                    !txAmount || parseFloat(txAmount) <= 0 || isCreatingTransaction
                  }
                  id="submit-create-transaction"
                  className={
                    txType === "in"
                      ? "bg-green-600 hover:bg-green-700"
                      : "bg-red-600 hover:bg-red-700"
                  }
                >
                  {isCreatingTransaction ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-1" />
                  ) : null}
                  Add {txType === "in" ? "Income" : "Expense"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {isGettingTransactions ? (
          <div className="flex justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Ticket</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center text-muted-foreground py-8"
                    >
                      No transactions found.
                    </TableCell>
                  </TableRow>
                ) : (
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  transactions.map((tx: any) => (
                    <TableRow key={tx.id}>
                      <TableCell className="text-sm">
                        {formatDate(tx.created_at)}
                      </TableCell>
                      <TableCell>
                        {tx.type === "in" ? (
                          <Badge className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 hover:bg-green-100">
                            <ArrowDownCircle className="h-3 w-3 mr-1" />
                            IN
                          </Badge>
                        ) : (
                          <Badge className="bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300 hover:bg-red-100">
                            <ArrowUpCircle className="h-3 w-3 mr-1" />
                            OUT
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell
                        className={`text-right font-medium ${
                          tx.type === "in" ? "text-green-500" : "text-red-500"
                        }`}
                      >
                        {tx.type === "in" ? "+" : "-"}
                        {parseFloat(tx.amount).toFixed(2)}
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate text-sm text-muted-foreground">
                        {tx.description || "—"}
                      </TableCell>
                      <TableCell>
                        {tx.ticket ? (
                          <Badge variant="outline" className="text-xs">
                            #{tx.ticket.id}
                          </Badge>
                        ) : (
                          "—"
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-destructive hover:text-destructive"
                              disabled={isDeletingTransaction}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Delete this transaction?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                This will permanently delete this{" "}
                                {tx.type === "in" ? "income" : "expense"}{" "}
                                transaction of {parseFloat(tx.amount).toFixed(2)}
                                . This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(tx.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="flex items-center justify-between mt-4">
                <p className="text-sm text-muted-foreground">
                  Page {pagination.currentPage} of {pagination.totalPages} (
                  {pagination.totalItems} total)
                </p>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={page <= 1}
                    onClick={() => setPage(page - 1)}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={page >= pagination.totalPages}
                    onClick={() => setPage(page + 1)}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
