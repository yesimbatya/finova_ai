import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * Button - Dieter Rams Inspired
 * "Good design is as little design as possible"
 *
 * Principles applied:
 * - Precise, functional appearance
 * - Clear visual hierarchy through subtle contrast
 * - Minimal decoration, maximum clarity
 * - Consistent spacing and proportions
 */
const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-2",
    "text-sm font-medium",
    "transition-all duration-200 ease-out",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
    "disabled:pointer-events-none disabled:opacity-40",
    "select-none",
  ].join(" "),
  {
    variants: {
      variant: {
        // Primary - Solid, confident
        default: [
          "bg-primary text-primary-foreground",
          "hover:bg-primary/90",
          "active:bg-primary/95",
          "shadow-subtle hover:shadow-elevated",
        ].join(" "),

        // Destructive - Warning actions
        destructive: [
          "bg-destructive text-destructive-foreground",
          "hover:bg-destructive/90",
          "active:bg-destructive/95",
        ].join(" "),

        // Outline - Secondary emphasis
        outline: [
          "border border-border bg-transparent",
          "hover:bg-accent hover:border-accent-foreground/20",
          "active:bg-accent/80",
        ].join(" "),

        // Secondary - Muted actions
        secondary: [
          "bg-secondary text-secondary-foreground",
          "hover:bg-secondary/80",
          "active:bg-secondary/90",
        ].join(" "),

        // Ghost - Minimal footprint
        ghost: [
          "bg-transparent",
          "hover:bg-accent hover:text-accent-foreground",
          "active:bg-accent/80",
        ].join(" "),

        // Link - Text-like
        link: [
          "text-foreground underline-offset-4",
          "hover:underline",
          "p-0 h-auto",
        ].join(" "),

        // Success - Positive actions
        success: [
          "bg-success text-success-foreground",
          "hover:bg-success/90",
          "active:bg-success/95",
        ].join(" "),
      },
      size: {
        default: "h-10 px-4 py-2 rounded-md",
        sm: "h-8 px-3 text-xs rounded-md",
        lg: "h-12 px-6 text-base rounded-md",
        xl: "h-14 px-8 text-base rounded-md",
        icon: "h-10 w-10 rounded-md",
        "icon-sm": "h-8 w-8 rounded-md",
        "icon-lg": "h-12 w-12 rounded-md",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

const Button = React.forwardRef(
  ({ className, variant, size, asChild = false, loading = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={loading || props.disabled}
        {...props}
      >
        {loading ? (
          <>
            <svg
              className="animate-spin h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span>{props.children}</span>
          </>
        ) : (
          props.children
        )}
      </Comp>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
