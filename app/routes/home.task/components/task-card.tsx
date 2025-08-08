import { Typography } from "@/components/typography";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { formatDate } from "date-fns";
import { es } from "date-fns/locale";
import { CalendarDays, PlusIcon, Clock, AlertCircle } from "lucide-react";
import { components } from "~/sdk";
import { route } from "~/util/route";

interface TaskCardProps {
  task: components["schemas"]["TaskDto"];
  openModal: (key: string, value: string) => void;
  openActivity: (task: components["schemas"]["TaskDto"]) => void;
}

export default function TaskCard({ task, openModal, openActivity }: TaskCardProps) {
  
  const getPriorityColor = (priority: string | null) => {
    switch (priority?.toLowerCase()) {
      case 'high':
        return 'text-red-600';
      case 'medium':
        return 'text-yellow-600';
      case 'low':
        return 'text-green-600';
      default:
        return 'text-gray-500';
    }
  };

  const getPriorityIcon = (priority: string | null) => {
    switch (priority?.toLowerCase()) {
      case 'high':
        return <AlertCircle className="w-3 h-3" />;
      case 'medium':
        return <Clock className="w-3 h-3" />;
      case 'low':
        return <Clock className="w-3 h-3" />;
      default:
        return null;
    }
  };

  return (
    <div className="">
      <div className="flex flex-col">
        <span
          className="font-medium text-sm cursor-pointer hover:underline"
          onClick={() => openModal("task", task.id.toString())}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              openModal("task", task.id.toString());
            }
          }}
          role="button"
          tabIndex={0}
        >
          {task.title}
        </span>

        <div className="flex items-center space-x-2 mt-1">
          <span className="text-xs px-2 py-1 bg-gray-100 rounded-full">
            {task.status}
          </span>
          {task.priority && (
            <div className={`flex items-center space-x-1 ${getPriorityColor(task.priority)}`}>
              {getPriorityIcon(task.priority)}
              <span className="text-xs">{task.priority}</span>
            </div>
          )}
        </div>

        {task.description && (
          <div className="text-xs text-secondary-foreground mt-1 line-clamp-2">
            {task.description}
          </div>
        )}

        {task.due_date && (
          <div className="flex items-center space-x-1 text-xs text-orange-600 mt-1">
            <CalendarDays className="w-3 h-3" />
            <span>Due: {formatDate(task.due_date, "PP", { locale: es })}</span>
          </div>
        )}

        <div className="flex justify-between space-x-2 mt-2">
          <div 
            className="icon-button flex cursor-pointer items-center text-xs"
            onClick={() => openActivity(task)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                openActivity(task);
              }
            }}
            role="button"
            tabIndex={0}
          >
            <PlusIcon className="w-3 h-3" />
            <span>Activity</span>
          </div>
          
          <div className="text-gray-400 flex items-center text-xs space-x-1">
            <span>
              {formatDate(task.created_at, "PP", {
                locale: es,
              })}
            </span>
            {task.assignee && (
              <HoverCard>
                <HoverCardTrigger
                  onClick={() => openModal(route.user, task.assignee)}
                >
                  <Avatar className="w-6 h-6">
                    <AvatarFallback>
                      {/* TODO: Get assignee name from API */}
                      A
                    </AvatarFallback>
                  </Avatar>
                </HoverCardTrigger>
                <HoverCardContent>
                  <div className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarFallback>A</AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                      <Typography variant="label">
                        {/* TODO: Get assignee name from API */}
                        Assignee
                      </Typography>
                    </div>
                  </div>
                </HoverCardContent>
              </HoverCard>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}