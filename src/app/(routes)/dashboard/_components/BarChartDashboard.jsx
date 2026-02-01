"use client";

import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { CartesianGrid, XAxis, YAxis, Line, LineChart, ResponsiveContainer } from "recharts";
import {
  ChartTooltipContent,
  ChartTooltip,
  ChartContainer,
} from "@/components/ui/chart";

/**
 * BarChartDashboard - Dieter Rams Inspired
 * "Good design is aesthetic"
 *
 * Clean, functional data visualization
 */

function BarChartDashboard({ budgetList }) {
  // Prepare chart data
  const chartData = budgetList.map((item) => ({
    name: item.name,
    totalSpend: item.totalSpend || 0,
    amount: Number(item.amount) || 0,
  }));

  if (!budgetList || budgetList.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-medium">Spending Activity</CardTitle>
          <CardDescription>Budget vs actual spending</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center mb-3">
              <svg
                className="h-5 w-5 text-muted-foreground"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"
                />
              </svg>
            </div>
            <p className="text-sm text-muted-foreground">
              Create budgets to see spending activity
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base font-medium">Spending Activity</CardTitle>
            <CardDescription>Budget vs actual spending</CardDescription>
          </div>
          {/* Legend */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-[hsl(var(--chart-1))]" />
              <span className="text-xs text-muted-foreground">Spent</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-[hsl(var(--chart-2))]" />
              <span className="text-xs text-muted-foreground">Budget</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <ChartContainer
          config={{
            totalSpend: {
              label: "Spent",
              color: "hsl(var(--chart-1))",
            },
            amount: {
              label: "Budget",
              color: "hsl(var(--chart-2))",
            },
          }}
          className="h-[240px] w-full"
        >
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 0,
              right: 8,
              top: 8,
              bottom: 0,
            }}
          >
            <CartesianGrid
              vertical={false}
              strokeDasharray="3 3"
              stroke="hsl(var(--border))"
            />
            <XAxis
              dataKey="name"
              tickLine={false}
              axisLine={false}
              tickMargin={12}
              tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
              tickFormatter={(value) =>
                value.length > 8 ? value.slice(0, 8) + "…" : value
              }
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
              tickFormatter={(value) => `$${value}`}
            />
            <ChartTooltip
              cursor={{ stroke: "hsl(var(--border))" }}
              content={<ChartTooltipContent />}
            />
            <Line
              dataKey="totalSpend"
              type="monotone"
              stroke="var(--color-totalSpend)"
              strokeWidth={2}
              dot={{ r: 3, fill: "var(--color-totalSpend)" }}
              activeDot={{ r: 5 }}
            />
            <Line
              dataKey="amount"
              type="monotone"
              stroke="var(--color-amount)"
              strokeWidth={2}
              dot={{ r: 3, fill: "var(--color-amount)" }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

export default BarChartDashboard;
