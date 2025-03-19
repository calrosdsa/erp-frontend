import * as React from "react";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { AlertCircle, CalendarIcon, Loader2, LucideIcon } from "lucide-react";
import { TimelineColor } from "~/types/ui-lyout";
import { components } from "~/sdk";
import { format } from "date-fns";
import { ActivityType, activityTypeToJSON } from "~/gen/common";
import Activity from "../activity";

const timelineVariants = cva("flex flex-col relative", {
  variants: {
    size: {
      sm: "gap-4",
      md: "gap-6",
      lg: "gap-8",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

interface TimelineProps
  extends React.HTMLAttributes<HTMLOListElement>,
    VariantProps<typeof timelineVariants> {
  /** Size of the timeline icons */
  iconsize?: "sm" | "md" | "lg";
}

/**
 * Timeline component for displaying a vertical list of events or items
 * @component
 */
const Timeline = React.forwardRef<HTMLOListElement, TimelineProps>(
  ({ className, iconsize, size, children, ...props }, ref) => {
    const items = React.Children.toArray(children);

    if (items.length === 0) {
      return <TimelineEmpty />;
    }

    return (
      <ol
        ref={ref}
        aria-label="Timeline"
        className={cn(
          timelineVariants({ size }),
          "relative min-h-[600px] w-full py-8",
          className
        )}
        {...props}
      >
        {React.Children.map(children, (child, index) => {
          if (
            React.isValidElement(child) &&
            typeof child.type !== "string" &&
            "displayName" in child.type &&
            child.type.displayName === "TimelineItemActivity"
          ) {
            return React.cloneElement(
              child,
              {} as React.ComponentProps<typeof TimelineItemActivity>
            );
          }
          return child;
        })}
      </ol>
    );
  }
);
Timeline.displayName = "Timeline";

interface TimelineItemProps {
  activity: components["schemas"]["ActivityDto"];
  /** Whether to show the connector line */
  getIcon: (type: string) => LucideIcon;
  showConnector: boolean;
  className?: string;
}

const TimelineItemActivity = React.forwardRef<HTMLLIElement, TimelineItemProps>(
  ({ className, activity, getIcon, showConnector }, ref) => {
    const commonClassName = cn("relative w-full mb-2 last:mb-0", className);
    const Icon = getIcon(activity.type);
    // Loading State
    const content = (
      <div className={cn("flex gap-4 items-start")}>
        {/* Date */}
        <div className="flex flex-col justify-start pt-1">
          <TimelineTime className="text-right text-xs whitespace-nowrap">
            {format(new Date(activity.created_at), "MMM, d")}
          </TimelineTime>
        </div>

          <Activity
          activity={activity}
          />
      </div>
    );

    // Filter out Framer Motion specific props

    return (
      <li ref={ref} className={commonClassName}>
        {content}
      </li>
    );
  }
);

const TimelineIcon = ({
  Icon,
  color,
}: {
  Icon: LucideIcon;
  color?: string;
}) => {
  return (
    <div
      className={cn(
        "relative flex items-center justify-center rounded-full ",
        "bg-secondary p-[5px]"
      )}
      style={{
        backgroundColor: color,
      }}
    >
      <div
        className={cn("flex items-center justify-center")}
        style={{
          color: color ? "white" : "",
        }}
      >
        <Icon className="h-6 w-6"/>
      </div>
    </div>
  );
};

TimelineItemActivity.displayName = "TimelineItemActivity";

interface TimelineTimeProps extends React.HTMLAttributes<HTMLTimeElement> {
  /** Date string, Date object, or timestamp */
  date?: string | Date | number;
  /** Optional format for displaying the date */
  format?: Intl.DateTimeFormatOptions;
}

const defaultDateFormat: Intl.DateTimeFormatOptions = {
  year: "numeric",
  month: "short",
  day: "2-digit",
};

const TimelineTime = React.forwardRef<HTMLTimeElement, TimelineTimeProps>(
  ({ className, date, format, children, ...props }, ref) => {
    const formattedDate = React.useMemo(() => {
      if (!date) return "";

      try {
        const dateObj = new Date(date);
        if (isNaN(dateObj.getTime())) return "";

        return new Intl.DateTimeFormat("en-US", {
          ...defaultDateFormat,
          ...format,
        }).format(dateObj);
      } catch (error) {
        console.error("Error formatting date:", error);
        return "";
      }
    }, [date, format]);

    return (
      <time
        ref={ref}
        dateTime={date ? new Date(date).toISOString() : undefined}
        className={cn(
          "text-sm font-medium tracking-tight text-muted-foreground",
          className
        )}
        {...props}
      >
        {children || formattedDate}
      </time>
    );
  }
);
TimelineTime.displayName = "TimelineTime";

const TimelineConnector = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    status?: "completed" | "in-progress" | "pending";
    color?: "primary" | "secondary" | "muted" | "accent";
  }
>(({ className, status = "completed", color, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "w-0.5",
      {
        "bg-primary": color === "primary" || (!color && status === "completed"),
        "bg-muted": color === "muted" || (!color && status === "pending"),
        "bg-secondary": color === "secondary",
        "bg-accent": color === "accent",
        "bg-gradient-to-b from-primary to-muted":
          !color && status === "in-progress",
      },
      className
    )}
    {...props}
  />
));
TimelineConnector.displayName = "TimelineConnector";

const TimelineHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center bg-accent gap", className)}
    {...props}
  />
));
TimelineHeader.displayName = "TimelineHeader";

const TimelineTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, children, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "font-semibold leading-none tracking-tight text-secondary-foreground m-1",
      className
    )}
    {...props}
  >
    {children}
  </h3>
));
TimelineTitle.displayName = "TimelineTitle";

const TimelineDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground ", className)}
    {...props}
  />
));
TimelineDescription.displayName = "TimelineDescription";

const TimelineContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex flex-col  border bg-card w-full rounded-lg",
      className
    )}
    {...props}
  />
));
TimelineContent.displayName = "TimelineContent";

const TimelineEmpty = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex flex-col items-center justify-center p-8 text-center",
      className
    )}
    {...props}
  >
    <p className="text-sm text-muted-foreground">
      {children || "No timeline items to display"}
    </p>
  </div>
));
TimelineEmpty.displayName = "TimelineEmpty";

export {
  Timeline,
  TimelineItemActivity,
  TimelineConnector,
  TimelineHeader,
  TimelineTitle,
  TimelineIcon,
  TimelineDescription,
  TimelineContent,
  TimelineTime,
  TimelineEmpty,
};
