import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

interface AdminStats {
  totalSales: number;
  totalOrders: number;
  totalVendors: number;
  salesData: Array<{ month: string; sales: number; orders: number }>;
  vendorStats: Array<{ status: string; count: number }>;
}

interface AdminStatsChartProps {
  stats: AdminStats;
}

const AdminStatsChart = ({ stats }: AdminStatsChartProps) => {
  const lineChartConfig = {
    sales: {
      label: "Sales ($)",
      color: "hsl(var(--chart-1))",
    },
    orders: {
      label: "Orders",
      color: "hsl(var(--chart-2))",
    },
  };

  const pieChartConfig = {
    count: {
      label: "Count",
    },
    verified: {
      label: "Verified",
      color: "hsl(var(--chart-1))",
    },
    pending: {
      label: "Pending",
      color: "hsl(var(--chart-2))",
    },
    rejected: {
      label: "Rejected",
      color: "hsl(var(--chart-3))",
    },
  };

  const COLORS = ["#10b981", "#f59e0b", "#ef4444"];

  return (
    <div className="grid gap-6 grid-cols-1 md:grid-cols-2 mb-6">
      <Card className="overflow-x-auto">
        <CardHeader>
          <CardTitle>Sales & Orders Trend (Last 6 Months)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-full min-w-[320px]">
            <ChartContainer config={lineChartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={stats.salesData}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line
                    type="monotone"
                    dataKey="sales"
                    stroke="var(--color-sales)"
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="orders"
                    stroke="var(--color-orders)"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="overflow-x-auto">
        <CardHeader>
          <CardTitle>Vendor Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-full min-w-[320px]">
            <ChartContainer config={pieChartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.vendorStats}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ status, count }) => `${status}: ${count}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {stats.vendorStats.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={["#10b981", "#f59e0b", "#ef4444"][index % 3]}
                      />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminStatsChart;
