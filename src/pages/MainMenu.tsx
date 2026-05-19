import React from "react";
import { StatCard } from "../components/ui/statcard";
import { Card, CardHeader } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";

const recentOrders = [
  {
    id: "#ORD-001",
    table: "Table 4",
    items: 3,
    total: 42.5,
    status: "preparing" as const,
    time: "2m ago",
  },
  {
    id: "#ORD-002",
    table: "Table 7",
    items: 5,
    total: 78.0,
    status: "ready" as const,
    time: "5m ago",
  },
  {
    id: "#ORD-003",
    table: "Table 2",
    items: 2,
    total: 28.5,
    status: "pending" as const,
    time: "8m ago",
  },
  {
    id: "#ORD-004",
    table: "Table 9",
    items: 4,
    total: 55.0,
    status: "served" as const,
    time: "12m ago",
  },
  {
    id: "#ORD-005",
    table: "Table 1",
    items: 6,
    total: 92.0,
    status: "paid" as const,
    time: "18m ago",
  },
];

const topItems = [
  { name: "Grilled Salmon", orders: 48, revenue: 864, trend: 12 },
  { name: "Truffle Pasta", orders: 36, revenue: 612, trend: 8 },
  { name: "Wagyu Burger", orders: 31, revenue: 527, trend: -3 },
  { name: "Caesar Salad", orders: 29, revenue: 348, trend: 5 },
  { name: "Tiramisu", orders: 24, revenue: 216, trend: 15 },
];

const statusBadgeMap: Record<
  string,
  React.ComponentProps<typeof Badge>["variant"]
> = {
  pending: "pending",
  preparing: "preparing",
  ready: "ready",
  served: "served",
  paid: "paid",
  cancelled: "cancelled",
};

export const MainMenu: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          title="Today's Revenue"
          value="3,842"
          prefix="$"
          change={12.5}
          icon={
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.8}
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          }
          iconBg="bg-primary-50"
          iconColor="text-primary-600"
        />
        <StatCard
          title="Total Orders"
          value={127}
          change={8.2}
          icon={
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.8}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
          }
          iconBg="bg-info-light"
          iconColor="text-info-dark"
        />
        <StatCard
          title="Active Tables"
          value="8/14"
          change={-2.1}
          icon={
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.8}
                d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
          }
          iconBg="bg-secondary-100"
          iconColor="text-secondary-700"
        />
        <StatCard
          title="Avg. Order Value"
          value="30.25"
          prefix="$"
          change={4.7}
          icon={
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.8}
                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
              />
            </svg>
          }
          iconBg="bg-warning-light"
          iconColor="text-warning-dark"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="xl:col-span-2">
          <Card padding="none">
            <div className="p-5 border-b border-neutral-100 flex items-center justify-between">
              <div>
                <h3 className="font-display font-semibold text-neutral-900">
                  Recent Orders
                </h3>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Last 30 minutes activity
                </p>
              </div>
              <Button variant="ghost" size="sm">
                View All
              </Button>
            </div>
            <div className="divide-y divide-neutral-50">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center gap-4 px-5 py-3.5 hover:bg-neutral-50/50 transition-colors"
                >
                  <div className="w-9 h-9 rounded-lg bg-neutral-100 flex items-center justify-center shrink-0">
                    <svg
                      className="w-4 h-4 text-neutral-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-neutral-900">
                        {order.id}
                      </span>
                      <span className="text-xs text-neutral-400">·</span>
                      <span className="text-xs text-neutral-500">
                        {order.table}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-400 mt-0.5">
                      {order.items} items · {order.time}
                    </p>
                  </div>
                  <Badge variant={statusBadgeMap[order.status]} dot>
                    {order.status.charAt(0).toUpperCase() +
                      order.status.slice(1)}
                  </Badge>
                  <span className="text-sm font-semibold text-neutral-900 shrink-0">
                    ${order.total.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Top Items */}
        <div>
          <Card padding="none">
            <div className="p-5 border-b border-neutral-100">
              <h3 className="font-display font-semibold text-neutral-900">
                Top Items Today
              </h3>
              <p className="text-xs text-neutral-400 mt-0.5">
                Best performing menu items
              </p>
            </div>
            <div className="p-5 space-y-4">
              {topItems.map((item, index) => (
                <div key={item.name} className="flex items-center gap-3">
                  <span
                    className={[
                      "w-6 h-6 rounded-md flex items-center justify-center text-2xs font-bold shrink-0",
                      index === 0
                        ? "bg-primary-100 text-primary-700"
                        : index === 1
                          ? "bg-neutral-100 text-neutral-600"
                          : "bg-neutral-50 text-neutral-400",
                    ].join(" ")}
                  >
                    {index + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-neutral-800 truncate">
                      {item.name}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <div className="flex-1 h-1 bg-neutral-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-warm rounded-full"
                          style={{ width: `${(item.orders / 48) * 100}%` }}
                        />
                      </div>
                      <span className="text-2xs text-neutral-400 shrink-0">
                        {item.orders} orders
                      </span>
                    </div>
                  </div>
                  <span
                    className={[
                      "text-xs font-medium shrink-0",
                      item.trend >= 0 ? "text-success-dark" : "text-error-dark",
                    ].join(" ")}
                  >
                    {item.trend >= 0 ? "+" : ""}
                    {item.trend}%
                  </span>
                </div>
              ))}
            </div>
          </Card>

          {/* Quick Actions */}
          <Card className="mt-4">
            <CardHeader title="Quick Actions" />
            <div className="grid grid-cols-2 gap-2">
              {[
                {
                  label: "New Order",
                  icon: "➕",
                  color: "bg-primary-50 text-primary-700 hover:bg-primary-100",
                },
                {
                  label: "Add Item",
                  icon: "🍽️",
                  color:
                    "bg-secondary-50 text-secondary-700 hover:bg-secondary-100",
                },
                {
                  label: "Print QR",
                  icon: "📱",
                  color: "bg-info-light text-info-dark hover:bg-blue-100",
                },
                {
                  label: "Daily Report",
                  icon: "📊",
                  color:
                    "bg-warning-light text-warning-dark hover:bg-yellow-100",
                },
              ].map((action) => (
                <button
                  key={action.label}
                  className={[
                    "flex flex-col items-center gap-1.5 p-3 rounded-lg text-xs font-medium transition-colors",
                    action.color,
                  ].join(" ")}
                >
                  <span className="text-lg">{action.icon}</span>
                  {action.label}
                </button>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
