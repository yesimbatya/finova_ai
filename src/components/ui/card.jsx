import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Card - Dieter Rams Inspired
 * "Good design makes a product understandable"
 *
 * Principles applied:
 * - Clean, unobtrusive containers
 * - Subtle elevation hierarchy
 * - Generous internal spacing
 * - Content-first approach
 */

const Card = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "bg-card text-card-foreground",
      "rounded-lg border border-border",
      "shadow-subtle",
      "transition-shadow duration-200",
      className
    )}
    {...props}
  />
));
Card.displayName = "Card";

const CardHeader = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6 pb-4", className)}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-lg font-semibold leading-tight tracking-tight",
      className
    )}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground leading-relaxed", className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
));
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-4 border-t border-border", className)}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";

// Metric Card - Finance specific variant
const MetricCard = React.forwardRef(
  ({ className, label, value, delta, deltaType = "neutral", icon, ...props }, ref) => (
    <Card ref={ref} className={cn("p-6", className)} {...props}>
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="metric-label">{label}</p>
          <p className="metric-value">{value}</p>
          {delta && (
            <p
              className={cn(
                "text-sm font-medium",
                deltaType === "positive" && "text-income",
                deltaType === "negative" && "text-expense",
                deltaType === "neutral" && "text-muted-foreground"
              )}
            >
              {delta}
            </p>
          )}
        </div>
        {icon && (
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-muted text-muted-foreground">
            {icon}
          </div>
        )}
      </div>
    </Card>
  )
);
MetricCard.displayName = "MetricCard";

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
  MetricCard,
};
