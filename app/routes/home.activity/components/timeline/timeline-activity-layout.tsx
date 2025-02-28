'use client';

import React, { useCallback } from 'react';
import { Timeline, TimelineItemActivity } from './timeline-activity';
import { components } from '~/sdk';
import { format, parse } from 'date-fns';
import { ActivityType, activityTypeToJSON } from '~/gen/common';
import { CircleCheck, LucideIcon } from 'lucide-react';

interface TimelineLayoutProps {
  activities: components["schemas"]["ActivityDto"][];
  size?: 'sm' | 'md' | 'lg';
  iconColor?: 'primary' | 'secondary' | 'muted' | 'accent';
  customIcon?: React.ReactNode;
  connectorColor?: 'primary' | 'secondary' | 'muted' | 'accent';
  className?: string;
}

export const TimelineActivityLayout = ({
  activities,
  size = 'md',
  iconColor,
  customIcon,
  connectorColor,
  className,
}: TimelineLayoutProps) => {
  const getIcon = useCallback((type:string):LucideIcon=>{
    switch(type){
      case activityTypeToJSON(ActivityType.ACTIVITY):
        return CircleCheck
      default:
        return CircleCheck
    }
  },[])
  return (
    <Timeline size={size} className={className}>
      {[...activities].reverse().map((item, index) => (
          <div
            key={index}
          >
          <TimelineItemActivity
            getIcon={getIcon}
            activity={item}
            showConnector={index !== activities.length - 1}
          />
        </div>
      ))}
    </Timeline>
  );
};