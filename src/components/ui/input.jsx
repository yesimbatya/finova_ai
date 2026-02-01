import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Input - Dieter Rams Inspired
 * "Good design is honest"
 *
 * Principles applied:
 * - Clear, unambiguous appearance
 * - Precise focus states
 * - Functional without decoration
 * - Consistent with overall system
 */

const Input = React.forwardRef(({ className, type, error, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        // Base styles
        "flex h-10 w-full rounded-md",
        "bg-background text-foreground",
        "border border-input",
        "px-3 py-2",
        "text-sm leading-tight",
        // Placeholder
        "placeholder:text-muted-foreground",
        // Focus state
        "focus-visible:outline-none",
        "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        // Disabled state
        "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-muted",
        // File input
        "file:border-0 file:bg-transparent file:text-sm file:font-medium",
        // Error state
        error && "border-destructive focus-visible:ring-destructive",
        // Transition
        "transition-colors duration-200",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Input.displayName = "Input";

// Textarea variant
const Textarea = React.forwardRef(({ className, error, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "flex min-h-[100px] w-full rounded-md",
        "bg-background text-foreground",
        "border border-input",
        "px-3 py-2",
        "text-sm leading-relaxed",
        "placeholder:text-muted-foreground",
        "focus-visible:outline-none",
        "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-muted",
        "resize-none",
        error && "border-destructive focus-visible:ring-destructive",
        "transition-colors duration-200",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Textarea.displayName = "Textarea";

// Input with label and error message
const InputField = React.forwardRef(
  ({ className, label, error, hint, required, ...props }, ref) => {
    const id = props.id || props.name;

    return (
      <div className={cn("space-y-2", className)}>
        {label && (
          <label
            htmlFor={id}
            className="text-sm font-medium text-foreground leading-none"
          >
            {label}
            {required && <span className="text-destructive ml-1">*</span>}
          </label>
        )}
        <Input ref={ref} id={id} error={!!error} {...props} />
        {hint && !error && (
          <p className="text-xs text-muted-foreground">{hint}</p>
        )}
        {error && <p className="text-xs text-destructive">{error}</p>}
      </div>
    );
  }
);
InputField.displayName = "InputField";

export { Input, Textarea, InputField };
