"use client";

import React, { useEffect, useState, useMemo } from "react";
import {
  Wallet,
  TrendingDown,
  PiggyBank,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import formatNumber from "@/utils/index";
import Chat from "./ChatInterface";

/**
 * CardInfo - Dieter Rams Inspired Dashboard Metrics
 * "Good design makes a product useful"
 *
 * Clear financial overview with purposeful data visualization
 */

function MetricCard({ label, value, icon: Icon, trend, trendValue, className }) {
  const isPositive = trend === "up";
  const isNegative = trend === "down";

  return (
    <Card className={cn("p-6", className)}>
      <div className="flex items-start justify-between">
        <div className="space-y-3">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {label}
          </p>
          <p className="text-2xl font-semibold tracking-tight tabular-nums">
            {value}
          </p>
          {trendValue && (
            <div
              className={cn(
                "flex items-center gap-1 text-sm font-medium",
                isPositive && "text-income",
                isNegative && "text-expense",
                !isPositive && !isNegative && "text-muted-foreground"
              )}
            >
              {isPositive && <ArrowUpRight className="h-3.5 w-3.5" />}
              {isNegative && <ArrowDownRight className="h-3.5 w-3.5" />}
              <span>{trendValue}</span>
            </div>
          )}
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-md bg-muted">
          <Icon className="h-5 w-5 text-muted-foreground" strokeWidth={1.5} />
        </div>
      </div>
    </Card>
  );
}

function SkeletonCard() {
  return (
    <Card className="p-6">
      <div className="flex items-start justify-between">
        <div className="space-y-3 flex-1">
          <div className="h-3 w-20 rounded bg-muted animate-pulse" />
          <div className="h-8 w-28 rounded bg-muted animate-pulse" />
          <div className="h-4 w-16 rounded bg-muted animate-pulse" />
        </div>
        <div className="h-10 w-10 rounded-md bg-muted animate-pulse" />
      </div>
    </Card>
  );
}

function CardInfo({ budgetList, incomeList }) {
  const [isLoaded, setIsLoaded] = useState(false);

  // Calculate metrics using useMemo for performance
  const metrics = useMemo(() => {
    let totalBudget = 0;
    let totalSpend = 0;
    let totalIncome = 0;

    budgetList.forEach((item) => {
      totalBudget += Number(item.amount) || 0;
      totalSpend += item.totalSpend || 0;
    });

    incomeList.forEach((item) => {
      totalIncome += item.totalAmount || 0;
    });

    const remaining = totalBudget - totalSpend;
    const savingsRate = totalIncome > 0
      ? ((totalIncome - totalSpend) / totalIncome * 100).toFixed(1)
      : 0;

    return {
      totalBudget,
      totalSpend,
      totalIncome,
      remaining,
      savingsRate,
      budgetCount: budgetList.length,
    };
  }, [budgetList, incomeList]);

  useEffect(() => {
    if (budgetList.length > 0 || incomeList.length > 0) {
      setIsLoaded(true);
    }
  }, [budgetList, incomeList]);

  if (!isLoaded && budgetList.length === 0) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* AI Assistant Card */}
      <Card className="overflow-hidden">
        <Chat
          totalBudget={metrics.totalBudget}
          totalIncome={metrics.totalIncome}
          totalSpend={metrics.totalSpend}
        />
      </Card>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Total Income"
          value={`$${formatNumber(metrics.totalIncome)}`}
          icon={TrendingUp}
          trend="up"
          trendValue="This month"
        />
        <MetricCard
          label="Total Expenses"
          value={`$${formatNumber(metrics.totalSpend)}`}
          icon={TrendingDown}
          trend={metrics.totalSpend > metrics.totalBudget ? "down" : undefined}
          trendValue={
            metrics.totalBudget > 0
              ? `${((metrics.totalSpend / metrics.totalBudget) * 100).toFixed(0)}% of budget`
              : undefined
          }
        />
        <MetricCard
          label="Budget Allocated"
          value={`$${formatNumber(metrics.totalBudget)}`}
          icon={Wallet}
          trendValue={`${metrics.budgetCount} categories`}
        />
        <MetricCard
          label="Remaining"
          value={`$${formatNumber(metrics.remaining)}`}
          icon={PiggyBank}
          trend={metrics.remaining >= 0 ? "up" : "down"}
          trendValue={
            metrics.savingsRate > 0 ? `${metrics.savingsRate}% savings rate` : undefined
          }
        />
      </div>
    </div>
  );
}

export default CardInfo;
