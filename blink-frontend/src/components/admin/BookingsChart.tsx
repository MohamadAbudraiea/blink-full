import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  ReferenceLine,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useBookingStore } from "@/stores/useBookingStore";
import { months, serviceThemeColors, statusColors } from "@/shared/utils";
import { useTheme } from "@/context/theme-provider";
import {
  useGetChartsData,
  useGetCanceledTicketsForCharts,
} from "@/hooks/useTicket";
import { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { formatCurrency } from "@/shared/utils";
import Loader from "../ui/Loader";

interface LineData {
  day: number;
  bookings: number;
}

interface PieData {
  name: string;
  value: number;
}

interface ChartsData {
  lineData: LineData[];
  statusData: PieData[];
  serviceData: PieData[];
}

export function BookingsChart() {
  const {
    filterMonth,
    filterYear = String(new Date().getFullYear()),
    setFilterMonth,
    setFilterYear,
  } = useBookingStore();

  const { canceledTickets, isFetchingCanceledTickets } =
    useGetCanceledTicketsForCharts();

  const { chartsData, isFetchingTickets } = useGetChartsData(
    filterMonth ? Number(filterMonth) : undefined,
    filterYear ? Number(filterYear) : undefined,
  );

  const {
    lineData = [],
    statusData = [],
    serviceData = [],
  } = (chartsData as ChartsData) || {};

  const { theme } = useTheme();
  const now = new Date();
  const selectedMonth = filterMonth ? Number(filterMonth) - 1 : now.getMonth();

  // state for selected cancel reason
  const [selectedCancelReason, setSelectedCancelReason] = useState<
    string | null
  >(null);

  // group cancelData into "High Price", "Not Suitable Time", "Other"
  const cancelData = useMemo(() => {
    if (!canceledTickets) return [];
    const grouped: Record<string, number> = {
      "High Price": 0,
      "Not Suitable Time": 0,
      Other: 0,
    };
    canceledTickets.tickets.forEach((t) => {
      if (t.cancel_reason === "High Price") grouped["High Price"]++;
      else if (t.cancel_reason === "Not Suitable Time")
        grouped["Not Suitable Time"]++;
      else grouped["Other"]++;
    });
    return Object.entries(grouped)
      .filter(([, v]) => v > 0)
      .map(([name, value]) => ({ name, value }));
  }, [canceledTickets]);

  // tickets filtered by cancel reason
  const filteredTickets = useMemo(() => {
    if (!selectedCancelReason || !canceledTickets) return [];
    return canceledTickets.tickets.filter((t) => {
      if (selectedCancelReason === "Other") {
        return (
          t.cancel_reason !== "High Price" &&
          t.cancel_reason !== "Not Suitable Time"
        );
      }
      return t.cancel_reason === selectedCancelReason;
    });
  }, [selectedCancelReason, canceledTickets]);

  if (isFetchingTickets || isFetchingCanceledTickets) return <Loader />;

  if (!chartsData) {
    return (
      <div className="flex justify-center items-center p-8">
        <p>No bookings found.</p>
      </div>
    );
  }

  const totalBookings = lineData.reduce((sum, d) => sum + d.bookings, 0);
  const nonZeroLineData = lineData.filter((d) => d.bookings > 0);

  const peakDay = nonZeroLineData.length
    ? nonZeroLineData.reduce(
        (max, d) => (d.bookings > max.bookings ? d : max),
        nonZeroLineData[0],
      ).day
    : null;

  const serviceColors = serviceData.map(
    (_, i) => serviceThemeColors[i % serviceThemeColors.length],
  );

  const cancelColors: Record<string, string> = {
    "High Price": "#ef4444",
    "Not Suitable Time": "#f59e0b",
    Other: "#3b82f6",
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Line Chart + Cancel Tickets beside it */}
      {/* Total Bookings + Peak Day + Line Chart */}
      <Card className="shadow-md rounded-2xl">
        <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between">
          <CardTitle className="text-lg font-bold">Bookings per Day</CardTitle>
          <div className="flex gap-2 mt-2 md:mt-0">
            {/* Month Select */}
            <Select
              value={filterMonth ?? String(now.getMonth() + 1).padStart(2, "0")}
              onValueChange={(val) => {
                setFilterMonth(val === "all" ? null : val);
                setFilterYear(filterYear ?? String(now.getFullYear()));
              }}
            >
              <SelectTrigger className="w-35">
                <SelectValue placeholder="Select Month" />
              </SelectTrigger>
              <SelectContent>
                {months.map((m, i) => {
                  const val = String(i + 1).padStart(2, "0");
                  return (
                    <SelectItem key={i} value={val}>
                      {m}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>

            {/* Year Select */}
            <Select
              value={filterYear ?? String(now.getFullYear())}
              onValueChange={(val) => setFilterYear(val === "all" ? null : val)}
            >
              <SelectTrigger className="w-25">
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 5 }, (_, i) => now.getFullYear() - i).map(
                  (year) => (
                    <SelectItem key={year} value={String(year)}>
                      {year}
                    </SelectItem>
                  ),
                )}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>

        <div className="grid grid-cols-2 gap-4 mb-4 px-6">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Total Bookings</p>
            <p className="text-lg font-semibold">{totalBookings}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Peak Day</p>
            <p className="text-lg font-semibold">
              {peakDay ? `${peakDay}/${selectedMonth + 1}` : "-"}
            </p>
          </div>
        </div>

        <CardContent className="h-96 px-6">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={lineData}>
              <ReferenceLine y={0} stroke="#9ca3af" />
              <XAxis dataKey="day" tickLine={false} />
              <YAxis allowDecimals={false} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: theme === "dark" ? "#1f2937" : "#9ca3af",
                  color: theme === "dark" ? "#9ca3af" : "#1f2937",
                }}
              />
              <Line
                type="monotone"
                dataKey="bookings"
                stroke="#3b82f6"
                strokeWidth={3}
                dot={{ r: 4, fill: "#3b82f6" }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Canceled Tickets Pie Chart */}
      <Card className="shadow-md rounded-2xl">
        <CardHeader className="flex items-center justify-between">
          <CardTitle className="text-md font-semibold">
            Canceled Tickets
          </CardTitle>
          {selectedCancelReason && (
            <Button
              size="sm"
              variant="warning"
              onClick={() => setSelectedCancelReason(null)}
            >
              Clear Selection
            </Button>
          )}
        </CardHeader>

        <CardContent className="h-64">
          {cancelData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={cancelData}
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  innerRadius={50}
                  dataKey="value"
                  onClick={(data) => setSelectedCancelReason(data.name)}
                >
                  {cancelData.map((entry) => (
                    <Cell
                      key={entry.name}
                      fill={cancelColors[entry.name] || "#9ca3af"}
                      cursor="pointer"
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend
                  layout="horizontal"
                  verticalAlign="bottom"
                  align="center"
                  wrapperStyle={{
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "center",
                  }}
                  iconType="circle"
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-center text-muted-foreground">
              No canceled tickets.
            </p>
          )}
        </CardContent>

        {/* Tickets Table */}
        {selectedCancelReason && (
          <div className="mt-4 overflow-x-auto px-6 pb-4">
            {filteredTickets.length > 0 ? (
              <div className="max-h-64 overflow-y-auto rounded-md border">
                <Table>
                  <TableHeader className="sticky top-0 bg-background z-10">
                    <TableRow>
                      <TableHead className="text-primary">User</TableHead>
                      <TableHead className="text-primary">Service</TableHead>
                      <TableHead className="text-primary">Date</TableHead>
                      <TableHead className="text-primary">Price</TableHead>
                      <TableHead className="text-primary">Reason</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTickets.map((t) => (
                      <TableRow key={t.id} className="hover:bg-muted/50">
                        <TableCell className="font-medium">
                          {t.user?.name || "N/A"}
                        </TableCell>
                        <TableCell>{t.service}</TableCell>
                        <TableCell className="text-muted-foreground">
                          {t.date}
                        </TableCell>
                        <TableCell>
                          {t.price ? (
                            formatCurrency(t.price)
                          ) : (
                            <span className="text-muted-foreground">N/A</span>
                          )}
                        </TableCell>
                        <TableCell className="text-destructive">
                          {t.cancel_reason}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <p className="text-center text-muted-foreground">
                No tickets found for {selectedCancelReason}.
              </p>
            )}
          </div>
        )}
      </Card>

      {/* Status Pie Chart */}
      <Card className="shadow-md rounded-2xl">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-center">
            Bookings by Status
          </CardTitle>
        </CardHeader>
        <CardContent className="h-80">
          {statusData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  innerRadius={50}
                  dataKey="value"
                  label={({ name, value }) => `${name} (${value})`}
                >
                  {statusData.map((entry) => (
                    <Cell key={entry.name} fill={statusColors[entry.name]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex flex-col justify-center items-center h-full">
              <p className="text-lg font-semibold">
                No tickets found for this month.
              </p>
              <span className="ml-2 text-sm text-muted-foreground">
                Try changing the month or year.
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Service Pie Chart */}
      <Card className="shadow-md rounded-2xl">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-center">
            Bookings by Service
          </CardTitle>
        </CardHeader>
        <CardContent className="h-80">
          {serviceData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={serviceData}
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  innerRadius={50}
                  dataKey="value"
                  label={({ name, value }) => `${name} (${value})`}
                >
                  {serviceData.map((_, index) => (
                    <Cell key={index} fill={serviceColors[index]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex flex-col justify-center items-center h-full">
              <p className="text-lg font-semibold">
                No tickets found for this month.
              </p>
              <span className="ml-2 text-sm text-muted-foreground">
                Try changing the month or year.
              </span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
