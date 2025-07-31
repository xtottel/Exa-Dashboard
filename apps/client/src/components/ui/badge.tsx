import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { Clock, AlertCircle, XCircle, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Slot } from "@radix-ui/react-slot";

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        success:
          "border-transparent bg-success text-success-foreground hover:bg-success/80",
        warning:
          "border-transparent bg-warning text-warning-foreground hover:bg-warning/80",
        info: "border-transparent bg-info text-info-foreground hover:bg-info/80",
        pending:
          "border-transparent bg-pending text-pending-foreground hover:bg-pending/80",
        approved:
          "border-transparent bg-approved text-approved-foreground hover:bg-approved/80",
        rejected:
          "border-transparent bg-rejected text-rejected-foreground hover:bg-rejected/80",
        outline: "text-foreground",
        status: "",
      },
      status: {
        paid: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800",
         approved: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800",
        delivered:
          "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800",
        processed:
          "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800",
        success:
          "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800",
        pending:
          "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800",
        failed:
          "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800",
          rejected:
          "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800",
        canceled:
          "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800",
      },
    },
    compoundVariants: [
      {
        variant: "status",
        status: "paid",
        className: "[&>svg]:text-green-500 dark:[&>svg]:text-green-400",
      },
      {
        variant: "status",
        status: "approved",
        className: "[&>svg]:text-green-500 dark:[&>svg]:text-green-400",
      },
      {
        variant: "status",
        status: "success",
        className: "[&>svg]:text-green-500 dark:[&>svg]:text-green-400",
      },
      {
        variant: "status",
        status: "delivered",
        className: "[&>svg]:text-green-500 dark:[&>svg]:text-green-400",
      },
      {
        variant: "status",
        status: "processed",
        className: "[&>svg]:text-green-500 dark:[&>svg]:text-green-400",
      },
      {
        variant: "status",
        status: "pending",
        className: "[&>svg]:text-yellow-500 dark:[&>svg]:text-yellow-400",
      },
      {
        variant: "status",
        status: "failed",
        className: "[&>svg]:text-red-500 dark:[&>svg]:text-red-400",
      },
      {
        variant: "status",
        status: "rejected",
        className: "[&>svg]:text-red-500 dark:[&>svg]:text-red-400",
      },
      {
        variant: "status",
        status: "canceled",
        className: "[&>svg]:text-red-500 dark:[&>svg]:text-red-400",
      },
    ],
    defaultVariants: {
      variant: "default",
    },
  }
);

const statusIcons = {
  paid: <CheckCircle size={14} />,
   approved: <CheckCircle size={14} />,
  delivered: <CheckCircle size={14} />,
  processed: <CheckCircle size={14} />,
  pending: <Clock size={14} />,
  failed: <AlertCircle size={14} />,
  canceled: <XCircle size={14} />,
  rejected: <XCircle size={14} />,
};

interface BadgeProps
  extends React.ComponentProps<"span">,
    VariantProps<typeof badgeVariants> {
  asChild?: boolean;
  status?: keyof typeof statusIcons;
}

function Badge({
  className,
  variant,
  status,
  asChild = false,
  children,
  ...props
}: BadgeProps) {
  const Comp = asChild ? Slot : "span";

  return (
    <Comp
      data-slot="badge"
      className={cn(
        badgeVariants({ variant, status, className }),
        variant === "status" && status && "border"
      )}
      {...props}
    >
      {variant === "status" && status && statusIcons[status]}
      {children}
    </Comp>
  );
}

export { Badge, badgeVariants };
