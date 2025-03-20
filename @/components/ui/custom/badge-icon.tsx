"use client";

import React from "react";
import { Bell } from "lucide-react";
import { cn } from "@/lib/utils";

export interface BadgeIconProps {
  /** Number of notifications to display */
  count?: number;
  /** Maximum count to display before showing +X format */
  maxCount?: number;
  /** Whether to show the badge when count is zero */
  showZero?: boolean;
  /** Size of the icon in pixels */
  size?: number;
  /** Color variant for the badge */
  variant?: "default" | "primary" | "secondary" | "destructive" | "success";
  /** Icon to display */
  icon?: React.ReactNode;
  /** Additional class names for the container */
  className?: string;
  /** Click handler */
  onClick?: () => void;
}

export function BadgeIcon({
  count = 0,
  maxCount = 99,
  showZero = false,
  size = 24,
  variant = "destructive",
  icon = <Bell />,
  className,
  onClick,
}: BadgeIconProps) {
  // Determine if badge should be visible
  const showBadge = count > 0 || showZero;

  // Format the count display
  const displayCount = count > maxCount ? `${maxCount}+` : count.toString();

  // Determine badge size based on content length
  const badgeSize = displayCount.length > 2 ? "text-[10px]" : "text-xs";

  // Map variant to color classes
  const variantClasses = {
    default: "bg-muted text-muted-foreground",
    primary: "bg-primary text-primary-foreground",
    secondary: "bg-secondary text-secondary-foreground",
    destructive: "bg-destructive text-destructive-foreground",
    success: "bg-green-500 text-white",
  };

  return (
    <div
      className={cn(
        "relative inline-flex items-center justify-center",
        className
      )}
      style={{ width: size, height: size }}
      onClick={onClick}
    >
      {/* Icon */}
      <div className="w-full h-full flex items-center justify-center">
        {icon}
      </div>

      {/* Badge */}
      {showBadge && (
        <div
          className={cn(
            "absolute -top-2 -right-2 flex items-center justify-center rounded-full min-w-[18px] h-[18px] px-1",
            variantClasses[variant],
            badgeSize
          )}
        >
          <span className="font-medium  text-xs leading-none">{displayCount}</span>
        </div>
      )}
    </div>
  );
}
