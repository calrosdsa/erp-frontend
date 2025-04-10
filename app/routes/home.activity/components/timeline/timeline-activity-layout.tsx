"use client";

import React, { useCallback } from "react";
import { Timeline, TimelineItemActivity } from "./timeline-activity";
import { components } from "~/sdk";
import { format, parse } from "date-fns";
import { ActivityType, activityTypeToJSON } from "~/gen/common";
import { CircleCheck, LucideIcon } from "lucide-react";
import { GlobalState } from "~/types/app-types";

interface TimelineLayoutProps {
  activities: components["schemas"]["ActivityDto"][];
  size?: "sm" | "md" | "lg";
  iconColor?: "primary" | "secondary" | "muted" | "accent";
  customIcon?: React.ReactNode;
  connectorColor?: "primary" | "secondary" | "muted" | "accent";
  className?: string;
  appContext: GlobalState;
}

export const TimelineActivityLayout = ({
  activities,
  size = "md",
  iconColor,
  customIcon,
  connectorColor,
  className,
  appContext,
}: TimelineLayoutProps) => {
  const getIcon = useCallback((type: string): LucideIcon => {
    switch (type) {
      case activityTypeToJSON(ActivityType.ACTIVITY):
        return CircleCheck;
      default:
        return CircleCheck;
    }
  }, []);
  return (
    <Timeline size={size} className={className}>
      {[...activities].map((item, index) => (
        <div key={index}>
          <TimelineItemActivity
            appContext={appContext}
            getIcon={getIcon}
            activity={item}
            showConnector={index !== activities.length - 1}
          />
        </div>
      ))}
    </Timeline>
  );
};
