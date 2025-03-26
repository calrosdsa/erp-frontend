import {
  ActivityType,
  activityTypeFromJSON,
  activityTypeToJSON,
} from "~/gen/common";
import { components } from "~/sdk";
import {
  TimelineContent,
  TimelineDescription,
  TimelineHeader,
  TimelineIcon,
  TimelineTitle,
} from "./timeline/timeline-activity";
import { cn } from "@/lib/utils";
import {
  CalendarIcon,
  InfoIcon,
  MessageSquareIcon,
  MessageSquareTextIcon,
  MoveRight,
  MoveRightIcon,
  PencilIcon,
  RectangleHorizontalIcon,
} from "lucide-react";
import { formatLongDate } from "~/util/format/formatDate";
import { useTranslation } from "react-i18next";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { i18n } from "i18next";
import { RenderMentionText } from "./activity-comment";
import { parseActivityInfoData, parseActivityStageData } from ".";
import { GlobalState } from "~/types/app-types";

export default function Activity({
  activity,
  appContext,
}: {
  activity: components["schemas"]["ActivityDto"];
  appContext: GlobalState;
}) {
  const { i18n } = useTranslation();
  const activityType = activityTypeFromJSON(activity.type);

  switch (activityType) {
    case ActivityType.STAGE: {
      const data = parseActivityStageData(activity.data);
      return (
        <>
          <div className="flex flex-col items-center">
            <div className="relative ">
              <TimelineIcon Icon={RectangleHorizontalIcon} color="#4F46E5" />
            </div>
          </div>
          {/* Content */}
          <TimelineContent
            className={cn(
              activity.color && `bg-[${activity.color}] bg-opacity-15`
            )}
          >
            <AcitivityHeader
              activity={activity}
              i18n={i18n}
              title="Cambio de Estado"
            />
            <TimelineDescription>
              {data && (
                <div className="flex space-x-3 m-2 items-center">
                  <div className="px-2 py-1 bg-accent rounded-md ">
                    {data.source}
                  </div>
                  <MoveRightIcon />
                  <div className="px-2 py-1 bg-accent rounded-md">
                    {data.destination}
                  </div>
                </div>
              )}
            </TimelineDescription>
          </TimelineContent>
        </>
      );
    }
    case ActivityType.COMMENT:
      return (
        <>
          <div className="flex flex-col items-center">
            <div className="relative ">
              <TimelineIcon Icon={MessageSquareTextIcon} color="#10B981" />
            </div>
          </div>

          {/* Content */}
          <TimelineContent className={cn()}>
            <AcitivityHeader
              activity={activity}
              i18n={i18n}
              title="Comentario"
            />
            <TimelineDescription>
              <div className="flex items-center w-full space-x-2 p-2">
                <div
                  className={cn(
                    " relative w-16 h-16 flex justify-center items-start  rounded-xl bg-accent "
                  )}
                >
                  <MessageSquareTextIcon size={64} strokeWidth={1} />
                </div>
                <div className="border p-2  rounded-md flex w-full h-full">
                  <RenderMentionText
                    mentionText={activity.comment || ""}
                    mentions={activity.mentions || []}
                  />
                </div>
              </div>
            </TimelineDescription>
          </TimelineContent>
        </>
      );
    case ActivityType.ACTIVITY:
      return (
        <>
          <div className="flex flex-col items-center">
            <div className="relative ">
              <TimelineIcon
                Icon={CalendarIcon}
                color={activity.color || "#2563EB"}
              />
            </div>
          </div>

          {/* Content */}
          <TimelineContent
            className={cn(
              activity.color && `bg-[${activity.color}] bg-opacity-15`
            )}
          >
            <AcitivityHeader activity={activity} i18n={i18n} />

            <TimelineDescription>
              <div className="flex items-center w-full px-2 space-x-2 p-2">
                <div
                  className={cn(
                    " relative w-16 h-16  rounded-xl",
                    activity.color && `bg-[${activity.color}] bg-opacity-25 `
                  )}
                >
                  <CalendarIcon size={64} strokeWidth={0.5} className="" />
                  <span
                    style={{
                      position: "absolute",
                      top: "55%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      fontSize: "12px",
                      fontWeight: 500,
                    }}
                  >
                    {activity.deadline && format(activity.deadline, "d")}
                  </span>
                  <span
                    style={{
                      position: "absolute",
                      top: "75%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      fontSize: "12px",
                      color: activity.color || "",
                      fontWeight: 500,
                    }}
                  >
                    {activity.deadline &&
                      format(activity.deadline, "MMM", { locale: es })}
                  </span>
                </div>

                <div className="flex flex-col space-y-2">
                  <div className="p-1 bg-accent">
                    Fecha límite:{" "}
                    {formatLongDate(activity?.deadline, i18n.language)}
                  </div>
                  {activity.content && (
                    <div className="border p-2  rounded-md flex w-full h-full">
                      {activity.content}
                    </div>
                  )}
                </div>
              </div>
            </TimelineDescription>
          </TimelineContent>
        </>
      );
    case ActivityType.CREATE:
      return (
        <>
          <div className="flex flex-col items-center">
            <div className="relative ">
              <TimelineIcon Icon={InfoIcon} color="#A3A8C8" />
            </div>
          </div>

          {/* Content */}
          <TimelineContent className={cn()}>
            <AcitivityHeader i18n={i18n} activity={activity} title="Creado" />
          </TimelineContent>
        </>
      );
      case ActivityType.EDIT:
        return (
          <>
            <div className="flex flex-col items-center">
              <div className="relative ">
                <TimelineIcon Icon={InfoIcon} color="#A3A8C8" />
              </div>
            </div>
  
            {/* Content */}
            <TimelineContent className={cn()}>
              <AcitivityHeader i18n={i18n} activity={activity} title="Editado" />
            </TimelineContent>
          </>
        );
    case ActivityType.INFO:
      const data = parseActivityInfoData(activity.data);
      return (
        <>
          <div className="flex flex-col items-center">
            <div className="relative ">
              <TimelineIcon Icon={InfoIcon} color="#A3A8C8" />
            </div>
          </div>

          {/* Content */}
          <TimelineContent className={cn()}>
            <AcitivityHeader i18n={i18n} activity={activity} title={data?.title} />
            <TimelineDescription>
              {data?.description}
            </TimelineDescription>
          </TimelineContent>
        </>
      );
    default:
      return <div>-</div>;
  }
}

const AcitivityHeader = ({
  activity,
  title,
  i18n,
}: {
  activity?: components["schemas"]["ActivityDto"];
  title?: string;
  i18n: i18n;
}) => {
  return (
    <TimelineHeader className="inset-x-0 py-1">
      <TimelineTitle className="flex space-x-2 font-medium text-sm items-center">
        <span>{title || activity?.title}</span>
        <span className="text-xs">
          {formatLongDate(activity?.created_at, i18n.language)}
        </span>
      </TimelineTitle>
    </TimelineHeader>
  );
};
