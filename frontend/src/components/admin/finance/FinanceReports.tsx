import { useState } from "react";
import { useGetFinanceReports, useGetAccounts } from "@/hooks/useFinance";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Loader2, BarChart3, TrendingUp, TrendingDown, Wallet } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";

const COLORS = [
  "#22c55e",
  "#ef4444",
  "#3b82f6",
  "#f59e0b",
  "#8b5cf6",
  "#ec4899",
  "#06b6d4",
  "#84cc16",
];

interface AccountSummary {
  id: number;
  name: string;
  totalIn: number;
  totalOut: number;
  balance: number;
}

interface MonthlyData {
  month: string;
  totalIn: number;
  totalOut: number;
}

export function FinanceReports() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedAccountIds, setSelectedAccountIds] = useState<number[]>([]);

  const { accounts } = useGetAccounts();
  const { reports, isGettingReports } = useGetFinanceReports(
    startDate || undefined,
    endDate || undefined,
    selectedAccountIds.length > 0 ? selectedAccountIds : undefined
  );

  const toggleAccount = (id: number) => {
    setSelectedAccountIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    if (selectedAccountIds.length === accounts.length) {
      setSelectedAccountIds([]);
    } else {
      setSelectedAccountIds(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        accounts.map((a: any) => a.id)
      );
    }
  };

  if (isGettingReports) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const accountSummaries: AccountSummary[] = reports?.accountSummaries || [];
  const monthlyData: MonthlyData[] = reports?.monthlyData || [];
  const totals = reports?.totals || { totalIn: 0, totalOut: 0, balance: 0 };

  // Prepare bar chart data (per-account comparison)
  const barData = accountSummaries
    .filter((a) => a.totalIn > 0 || a.totalOut > 0)
    .map((a) => ({
      name: a.name,
      Income: a.totalIn,
      Expenses: a.totalOut,
    }));

  // Prepare pie chart data (balance distribution)
  const pieData = accountSummaries
    .filter((a) => Math.abs(a.balance) > 0)
    .map((a) => ({
      name: a.name,
      value: Math.abs(a.balance),
      isPositive: a.balance >= 0,
    }));

  // Prepare line chart data (monthly trend)
  const lineData = monthlyData.map((m) => ({
    month: m.month,
    Income: m.totalIn,
    Expenses: m.totalOut,
    Net: m.totalIn - m.totalOut,
  }));

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <BarChart3 className="h-4 w-4" />
            Report Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 items-end">
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">
                Start Date
              </label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-[160px] h-9"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">
                End Date
              </label>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-[160px] h-9"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">
                Accounts
              </label>
              <div className="flex flex-wrap gap-1">
                <Button
                  size="sm"
                  variant={
                    selectedAccountIds.length === accounts.length ||
                    selectedAccountIds.length === 0
                      ? "default"
                      : "outline"
                  }
                  className="h-8 text-xs"
                  onClick={selectAll}
                >
                  All
                </Button>
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                {accounts.map((acc: any) => (
                  <Button
                    key={acc.id}
                    size="sm"
                    variant={
                      selectedAccountIds.includes(acc.id)
                        ? "default"
                        : "outline"
                    }
                    className="h-8 text-xs"
                    onClick={() => toggleAccount(acc.id)}
                  >
                    {acc.name}
                  </Button>
                ))}
              </div>
            </div>
            {(startDate || endDate || selectedAccountIds.length > 0) && (
              <Button
                size="sm"
                variant="ghost"
                className="h-9"
                onClick={() => {
                  setStartDate("");
                  setEndDate("");
                  setSelectedAccountIds([]);
                }}
              >
                Clear Filters
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card
          className="border-t-4 overflow-hidden relative"
          style={{ borderTopColor: "#22c55e" }}
        >
          <div
            className="absolute inset-0 opacity-5"
            style={{
              background:
                "linear-gradient(135deg, #22c55e 0%, transparent 60%)",
            }}
          />
          <CardContent className="pt-6 relative">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-medium">
                  Total Income
                </p>
                <p className="text-3xl font-bold text-green-500">
                  {totals.totalIn.toFixed(2)}
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card
          className="border-t-4 overflow-hidden relative"
          style={{ borderTopColor: "#ef4444" }}
        >
          <div
            className="absolute inset-0 opacity-5"
            style={{
              background:
                "linear-gradient(135deg, #ef4444 0%, transparent 60%)",
            }}
          />
          <CardContent className="pt-6 relative">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-medium">
                  Total Expenses
                </p>
                <p className="text-3xl font-bold text-red-500">
                  {totals.totalOut.toFixed(2)}
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                <TrendingDown className="h-6 w-6 text-red-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card
          className="border-t-4 overflow-hidden relative"
          style={{
            borderTopColor: totals.balance >= 0 ? "#3b82f6" : "#f59e0b",
          }}
        >
          <div
            className="absolute inset-0 opacity-5"
            style={{
              background: `linear-gradient(135deg, ${
                totals.balance >= 0 ? "#3b82f6" : "#f59e0b"
              } 0%, transparent 60%)`,
            }}
          />
          <CardContent className="pt-6 relative">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-medium">
                  Net Balance
                </p>
                <p
                  className={`text-3xl font-bold ${
                    totals.balance >= 0 ? "text-blue-500" : "text-amber-500"
                  }`}
                >
                  {totals.balance.toFixed(2)}
                </p>
              </div>
              <div
                className={`h-12 w-12 rounded-full flex items-center justify-center ${
                  totals.balance >= 0
                    ? "bg-blue-100 dark:bg-blue-900/30"
                    : "bg-amber-100 dark:bg-amber-900/30"
                }`}
              >
                <Wallet
                  className={`h-6 w-6 ${
                    totals.balance >= 0 ? "text-blue-500" : "text-amber-500"
                  }`}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart — Per Account In vs Out */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">
              Income vs Expenses by Account
            </CardTitle>
          </CardHeader>
          <CardContent>
            {barData.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No data to display
              </p>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="name" fontSize={12} />
                  <YAxis fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "8px",
                      border: "1px solid hsl(var(--border))",
                      background: "hsl(var(--card))",
                      color: "hsl(var(--card-foreground))",
                    }}
                  />
                  <Legend />
                  <Bar
                    dataKey="Income"
                    fill="#22c55e"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="Expenses"
                    fill="#ef4444"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Pie Chart — Balance Distribution */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">
              Balance Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            {pieData.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No data to display
              </p>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name} (${(percent * 100).toFixed(0)}%)`
                    }
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((_entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      borderRadius: "8px",
                      border: "1px solid hsl(var(--border))",
                      background: "hsl(var(--card))",
                      color: "hsl(var(--card-foreground))",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Line Chart — Monthly Trend (full width) */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Monthly Trend</CardTitle>
          </CardHeader>
          <CardContent>
            {lineData.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No monthly data to display
              </p>
            ) : (
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={lineData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="month" fontSize={12} />
                  <YAxis fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "8px",
                      border: "1px solid hsl(var(--border))",
                      background: "hsl(var(--card))",
                      color: "hsl(var(--card-foreground))",
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="Income"
                    stroke="#22c55e"
                    strokeWidth={2}
                    dot={{ fill: "#22c55e", r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="Expenses"
                    stroke="#ef4444"
                    strokeWidth={2}
                    dot={{ fill: "#ef4444", r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="Net"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={{ fill: "#3b82f6", r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Account Breakdown Table */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Account Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-3 font-medium">Account</th>
                  <th className="text-right py-2 px-3 font-medium text-green-500">
                    Income
                  </th>
                  <th className="text-right py-2 px-3 font-medium text-red-500">
                    Expenses
                  </th>
                  <th className="text-right py-2 px-3 font-medium">Balance</th>
                  <th className="py-2 px-3 font-medium">Ratio</th>
                </tr>
              </thead>
              <tbody>
                {accountSummaries.map((acc) => {
                  const total = acc.totalIn + acc.totalOut;
                  const inPercent = total > 0 ? (acc.totalIn / total) * 100 : 0;
                  return (
                    <tr key={acc.id} className="border-b last:border-0">
                      <td className="py-2 px-3 font-medium">{acc.name}</td>
                      <td className="text-right py-2 px-3 text-green-500">
                        +{acc.totalIn.toFixed(2)}
                      </td>
                      <td className="text-right py-2 px-3 text-red-500">
                        -{acc.totalOut.toFixed(2)}
                      </td>
                      <td
                        className={`text-right py-2 px-3 font-bold ${
                          acc.balance >= 0 ? "text-blue-500" : "text-amber-500"
                        }`}
                      >
                        {acc.balance.toFixed(2)}
                      </td>
                      <td className="py-2 px-3">
                        {total > 0 ? (
                          <div className="flex items-center gap-2">
                            <div className="w-24 h-2 bg-red-200 dark:bg-red-900/30 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-green-500 rounded-full transition-all"
                                style={{ width: `${inPercent}%` }}
                              />
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {inPercent.toFixed(0)}%
                            </span>
                          </div>
                        ) : (
                          <Badge variant="outline" className="text-xs">
                            No activity
                          </Badge>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
