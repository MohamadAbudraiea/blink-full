import { useState } from "react";
import {
  useGetAccounts,
  useCreateAccount,
  useDeleteAccount,
} from "@/hooks/useFinance";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Trash2,
  Wallet,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  Loader2,
} from "lucide-react";

interface Account {
  id: number;
  name: string;
  description: string | null;
  is_default: boolean;
  totalIn: number;
  totalOut: number;
  balance: number;
  transactionCount: number;
  created_at: string;
}

interface AccountsManagerProps {
  onSelectAccount: (account: Account) => void;
  selectedAccountId: number | null;
}

export function AccountsManager({
  onSelectAccount,
  selectedAccountId,
}: AccountsManagerProps) {
  const { accounts, isGettingAccounts } = useGetAccounts();
  const { createAccountMutation, isCreatingAccount } = useCreateAccount();
  const { deleteAccountMutation, isDeletingAccount } = useDeleteAccount();

  const [newAccountName, setNewAccountName] = useState("");
  const [newAccountDescription, setNewAccountDescription] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleCreate = () => {
    if (!newAccountName.trim()) return;
    createAccountMutation(
      {
        name: newAccountName.trim(),
        description: newAccountDescription.trim() || undefined,
      },
      {
        onSuccess: () => {
          setNewAccountName("");
          setNewAccountDescription("");
          setDialogOpen(false);
        },
      }
    );
  };

  const handleDelete = (id: number) => {
    deleteAccountMutation({ id });
  };

  // Summary cards
  const totalIn = (accounts as Account[]).reduce(
    (sum: number, a: Account) => sum + a.totalIn,
    0
  );
  const totalOut = (accounts as Account[]).reduce(
    (sum: number, a: Account) => sum + a.totalOut,
    0
  );
  const totalBalance = totalIn - totalOut;

  if (isGettingAccounts) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-l-4" style={{ borderLeftColor: "#22c55e" }}>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Income</p>
                <p className="text-2xl font-bold text-green-500">
                  {totalIn.toFixed(2)}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500 opacity-60" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4" style={{ borderLeftColor: "#ef4444" }}>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Expenses</p>
                <p className="text-2xl font-bold text-red-500">
                  {totalOut.toFixed(2)}
                </p>
              </div>
              <TrendingDown className="h-8 w-8 text-red-500 opacity-60" />
            </div>
          </CardContent>
        </Card>
        <Card
          className="border-l-4"
          style={{
            borderLeftColor: totalBalance >= 0 ? "#3b82f6" : "#f59e0b",
          }}
        >
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Net Balance</p>
                <p
                  className={`text-2xl font-bold ${
                    totalBalance >= 0 ? "text-blue-500" : "text-amber-500"
                  }`}
                >
                  {totalBalance.toFixed(2)}
                </p>
              </div>
              <Wallet
                className={`h-8 w-8 opacity-60 ${
                  totalBalance >= 0 ? "text-blue-500" : "text-amber-500"
                }`}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Accounts Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Accounts
          </CardTitle>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" id="create-account-btn">
                <Plus className="h-4 w-4 mr-1" />
                New Account
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Account</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Account Name</label>
                  <Input
                    id="account-name-input"
                    placeholder="e.g. Solar Spending"
                    value={newAccountName}
                    onChange={(e) => setNewAccountName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Description (optional)
                  </label>
                  <Textarea
                    id="account-description-input"
                    placeholder="What is this account for?"
                    value={newAccountDescription}
                    onChange={(e) => setNewAccountDescription(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button
                  onClick={handleCreate}
                  disabled={!newAccountName.trim() || isCreatingAccount}
                  id="submit-create-account"
                >
                  {isCreatingAccount ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-1" />
                  ) : null}
                  Create
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Account</TableHead>
                <TableHead className="text-right">Income</TableHead>
                <TableHead className="text-right">Expenses</TableHead>
                <TableHead className="text-right">Balance</TableHead>
                <TableHead className="text-center">Transactions</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(accounts as Account[]).length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center text-muted-foreground py-8"
                  >
                    No accounts yet. Create one to get started.
                  </TableCell>
                </TableRow>
              ) : (
                (accounts as Account[]).map((acc: Account) => (
                  <TableRow
                    key={acc.id}
                    className={`cursor-pointer transition-colors hover:bg-muted/50 ${
                      selectedAccountId === acc.id ? "bg-muted" : ""
                    }`}
                    onClick={() => onSelectAccount(acc)}
                  >
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{acc.name}</span>
                        {acc.is_default && (
                          <Badge variant="secondary" className="text-xs">
                            Default
                          </Badge>
                        )}
                      </div>
                      {acc.description && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {acc.description}
                        </p>
                      )}
                    </TableCell>
                    <TableCell className="text-right text-green-500 font-medium">
                      +{acc.totalIn.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right text-red-500 font-medium">
                      -{acc.totalOut.toFixed(2)}
                    </TableCell>
                    <TableCell
                      className={`text-right font-bold ${
                        acc.balance >= 0 ? "text-blue-500" : "text-amber-500"
                      }`}
                    >
                      {acc.balance.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline">{acc.transactionCount}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectAccount(acc);
                          }}
                        >
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                        {!acc.is_default && (
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-destructive hover:text-destructive"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Delete "{acc.name}"?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. The account must
                                  have no transactions before it can be deleted.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(acc.id)}
                                  disabled={isDeletingAccount}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
