import React, { useState } from "react";
import { Card, CardHeader } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";

const periods = ["Today", "This Week", "This Month", "This Year"];

const dailyData = [
  { day: "Mon", revenue: 2840, orders: 98 },
  { day: "Tue", revenue: 3120, orders: 112 },
  { day: "Wed", revenue: 2650, orders: 89 },
  { day: "Thu", revenue: 3580, orders: 127 },
  { day: "Fri", revenue: 4200, orders: 156 },
  { day: "Sat", revenue: 5100, orders: 189 },
  { day: "Sun", revenue: 3842, orders: 134 },
];

const categoryBreakdown = [
  {
    category: "Mains",
    revenue: 12840,
    percentage: 48,
    color: "bg-primary-500",
  },
  { category: "Drinks", revenue: 5360, percentage: 20, color: "bg-info" },
  {
    category: "Starters",
    revenue: 4020,
    percentage: 15,
    color: "bg-secondary-500",
  },
  { category: "Desserts", revenue: 2680, percentage: 10, color: "bg-warning" },
  {
    category: "Specials",
    revenue: 1876,
    percentage: 7,
    color: "bg-accent-500",
  },
];

const topTransactions = [
  {
    id: "#TXN-8821",
    table: "Table 6",
    items: 8,
    amount: 245.0,
    method: "Card",
    time: "19:42",
  },
  {
    id: "#TXN-8820",
    table: "Table 3",
    items: 5,
    amount: 178.5,
    method: "Cash",
    time: "19:15",
  },
  {
    id: "#TXN-8819",
    table: "Table 9",
    items: 6,
    amount: 156.0,
    method: "Card",
    time: "18:58",
  },
  {
    id: "#TXN-8818",
    table: "Table 1",
    items: 4,
    amount: 124.5,
    method: "Card",
    time: "18:30",
  },
  {
    id: "#TXN-8817",
    table: "Table 7",
    items: 7,
    amount: 198.0,
    method: "Digital",
    time: "18:05",
  },
];

const maxRevenue = Math.max(...dailyData.map((d) => d.revenue));

export const SalesReport: React.FC = () => {
  const [activePeriod, setActivePeriod] = useState("This Week");

  const totalRevenue = dailyData.reduce((a, d) => a + d.revenue, 0);
  const totalOrders = dailyData.reduce((a, d) => a + d.orders, 0);

  return (
    <div className="space-y-5">
      {/* Period Selector + Export */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex gap-2 bg-surface border border-neutral-200 rounded-xl p-1">
          {periods.map((p) => (
            <button
              key={p}
              onClick={() => setActivePeriod(p)}
              className={[
                "px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 whitespace-nowrap",
                activePeriod === p
                  ? "bg-primary-500 text-white shadow-sm"
                  : "text-neutral-500 hover:text-neutral-800",
              ].join(" ")}
            >
              {p}
            </button>
          ))}
        </div>
        <Button
          variant="secondary"
          size="sm"
          icon={
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
          }
        >
          Export Report
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Total Revenue",
            value: `$${totalRevenue.toLocaleString()}`,
            change: "+12.5%",
            positive: true,
          },
          {
            label: "Total Orders",
            value: totalOrders,
            change: "+8.2%",
            positive: true,
          },
          {
            label: "Avg Order Value",
            value: `$${(totalRevenue / totalOrders).toFixed(2)}`,
            change: "+3.8%",
            positive: true,
          },
          {
            label: "Cancelled Orders",
            value: 7,
            change: "-2.1%",
            positive: false,
          },
        ].map((s) => (
          <Card key={s.label}>
            <p className="text-xs text-neutral-500 font-medium">{s.label}</p>
            <p className="text-2xl font-display font-bold text-neutral-900 mt-1">
              {s.value}
            </p>
            <span
              className={[
                "text-xs font-medium mt-1 inline-block",
                s.positive ? "text-success-dark" : "text-error-dark",
              ].join(" ")}
            >
              {s.change}
            </span>
          </Card>
        ))}
      </div>

      {/* Chart + Breakdown */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Bar Chart */}
        <Card className="xl:col-span-2" padding="none">
          <div className="p-5 border-b border-neutral-100 flex items-center justify-between">
            <CardHeader
              title="Revenue Overview"
              subtitle="Daily revenue for this week"
            />
          </div>
          <div className="p-5">
            {/* Chart */}
            <div className="flex items-end gap-3 h-48">
              {dailyData.map((d) => {
                const heightPct = (d.revenue / maxRevenue) * 100;
                return (
                  <div
                    key={d.day}
                    className="flex-1 flex flex-col items-center gap-2 group"
                  >
                    <div className="relative w-full flex flex-col items-center">
                      {/* Tooltip */}
                      <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-neutral-900 text-white text-2xs px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                        ${d.revenue.toLocaleString()}
                      </div>
                      <div
                        className="w-full rounded-t-lg bg-gradient-warm transition-all duration-500 group-hover:opacity-90"
                        style={{ height: `${heightPct * 1.6}px` }}
                      />
                    </div>
                    <span className="text-xs text-neutral-500 font-medium">
                      {d.day}
                    </span>
                  </div>
                );
              })}
            </div>
            {/* Y-axis labels */}
            <div className="flex justify-between mt-2 px-1">
              <span className="text-2xs text-neutral-400">$0</span>
              <span className="text-2xs text-neutral-400">
                ${(maxRevenue / 2).toLocaleString()}
              </span>
              <span className="text-2xs text-neutral-400">
                ${maxRevenue.toLocaleString()}
              </span>
            </div>
          </div>
        </Card>

        {/* Category Breakdown */}
        <Card>
          <CardHeader title="By Category" subtitle="Revenue distribution" />
          <div className="space-y-4">
            {categoryBreakdown.map((cat) => (
              <div key={cat.category}>
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-sm font-medium text-neutral-700">
                    {cat.category}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-neutral-500">
                      ${cat.revenue.toLocaleString()}
                    </span>
                    <span className="text-xs font-semibold text-neutral-800">
                      {cat.percentage}%
                    </span>
                  </div>
                </div>
                <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
                  <div
                    className={[
                      "h-full rounded-full transition-all duration-700",
                      cat.color,
                    ].join(" ")}
                    style={{ width: `${cat.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Payment Methods */}
          <div className="mt-6 pt-4 border-t border-neutral-100">
            <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-3">
              Payment Methods
            </p>
            <div className="grid grid-cols-3 gap-2">
              {[
                { method: "Card", pct: 68, icon: "💳" },
                { method: "Cash", pct: 22, icon: "💵" },
                { method: "Digital", pct: 10, icon: "📱" },
              ].map((pm) => (
                <div
                  key={pm.method}
                  className="text-center p-2 bg-neutral-50 rounded-lg"
                >
                  <div className="text-lg">{pm.icon}</div>
                  <div className="text-sm font-bold text-neutral-900 mt-0.5">
                    {pm.pct}%
                  </div>
                  <div className="text-2xs text-neutral-500">{pm.method}</div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Transactions Table */}
      <Card padding="none">
        <div className="p-5 border-b border-neutral-100 flex items-center justify-between">
          <div>
            <h3 className="font-display font-semibold text-neutral-900">
              Top Transactions
            </h3>
            <p className="text-xs text-neutral-400 mt-0.5">
              Highest value orders today
            </p>
          </div>
          <Button variant="ghost" size="sm">
            View All
          </Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-neutral-100 bg-neutral-50/50">
                {[
                  "Transaction",
                  "Table",
                  "Items",
                  "Amount",
                  "Method",
                  "Time",
                ].map((h) => (
                  <th
                    key={h}
                    className="px-5 py-3 text-left text-2xs font-semibold text-neutral-500 uppercase tracking-wide"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-50">
              {topTransactions.map((txn) => (
                <tr
                  key={txn.id}
                  className="hover:bg-neutral-50/50 transition-colors"
                >
                  <td className="px-5 py-3.5">
                    <span className="text-sm font-semibold text-neutral-900 font-mono">
                      {txn.id}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-sm text-neutral-600">
                    {txn.table}
                  </td>
                  <td className="px-5 py-3.5 text-sm text-neutral-600">
                    {txn.items} items
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="text-sm font-bold text-neutral-900">
                      ${txn.amount.toFixed(2)}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <Badge
                      variant={
                        txn.method === "Card"
                          ? "info"
                          : txn.method === "Cash"
                            ? "success"
                            : "secondary"
                      }
                    >
                      {txn.method}
                    </Badge>
                  </td>
                  <td className="px-5 py-3.5 text-sm text-neutral-500 font-mono">
                    {txn.time}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
