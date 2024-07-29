"use client";

import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { CartesianGrid, XAxis, YAxis, Line, LineChart } from "recharts";
import {
  ChartTooltipContent,
  ChartTooltip,
  ChartContainer,
} from "@/components/ui/chart";

function BarChartDashboard({ budgetList }) {
  console.log({ budgetList });

  return (
    <div className="border rounded-2xl p-5">
      <h2 className="font-bold text-lg">Activity</h2>
      <Card className="h-full w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Total Spend vs Amount</CardTitle>
        </CardHeader>
        <CardContent>
          <LinechartChart data={budgetList} className="aspect-[9/4]" />
        </CardContent>
        <CardFooter className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-primary" />
            <span className="text-sm text-muted-foreground">Total Spend</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-secondary" />
            <span className="text-sm text-muted-foreground">Amount</span>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

// totalSpend: number;
//     totalItem: number;
//     id: number;
//     name: string;
//     amount: string;
//     icon: string;
//     createdBy: string;

function LinechartChart({ data, ...props }) {
  return (
    <div {...props}>
      <ChartContainer
        config={{
          totalSpend: {
            label: "Total Spend",
            color: "hsl(var(--chart-1))",
          },
          amount: {
            label: "Amount",
            color: "hsl(var(--chart-2))",
          },
        }}
      >
        <LineChart
          accessibilityLayer
          data={data}
          margin={{
            left: 12,
            right: 12,
            top: 12,
            bottom: 12,
          }}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="name"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={(value) => value.slice(0, 3)}
          />
          <YAxis tickLine={false} axisLine={false} tickMargin={8} />
          <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
          <Line
            dataKey="totalSpend"
            type="monotone"
            stroke="var(--color-totalSpend)"
            strokeWidth={2}
            dot={false}
          />
          <Line
            dataKey="amount"
            type="monotone"
            stroke="var(--color-amount)"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ChartContainer>
    </div>
  );
}

export default BarChartDashboard;
