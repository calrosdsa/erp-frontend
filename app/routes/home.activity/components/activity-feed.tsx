import React, { useEffect, useState } from "react";
import { CalendarIcon, MoreHorizontal, Paperclip } from "lucide-react";
import { components } from "~/sdk";
import { Card, CardContent } from "@/components/ui/card";

import TabNavigationActivity from "./tab-navigation";
import { TimelineActivityLayout } from "~/routes/home.activity/components/timeline/timeline-activity-layout";
import { GlobalState } from "~/types/app-types";
import { useActivityStore } from "../activity-store";

interface ActivityFeedProps {
  activities: components["schemas"]["ActivityDto"][] | undefined;
  partyID: number;
  partyName?: string;
  entityID?: number;
  appContext: GlobalState;
}

export default function ActivityFeed({
  activities = [],
  partyID,
  partyName,
  entityID,
  appContext,
}: ActivityFeedProps) {
  const { setPayload, payload } = useActivityStore();

  useEffect(() => {
    setPayload({
      activities,
    });
  }, [activities]);

  return (
    <>
      <div className="px-0 w-full">
        <Card className="w-full mx-auto">
          <CardContent>
            <div className="flex justify-between items-center mb-4">
              <TabNavigationActivity
                appContext={appContext}
                partyID={partyID}
                partyName={partyName || ""}
                entityID={entityID || 0}
              />
            </div>
            <div className="space-y-4">
              {/* {JSON.stringify(activities)} */}
              <TimelineActivityLayout
                appContext={appContext}
                activities={payload.activities || []}
                size="sm"
                iconColor="primary"
                customIcon={<CalendarIcon />}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

// const EditCommentDrawer = ({
//   activity,
//   open,
//   onOpenChange,
// }: {
//   open: boolean;
//   onOpenChange: (e: boolean) => void;
//   activity: components["schemas"]["ActivityDto"];
// }) => {
//   const fetcher = useFetcher<typeof action>();
//   const { toast } = useToast();
//   const { t } = useTranslation("common");
//   const r = route;

//   const onSubmit = (values: z.infer<typeof editCommentSchema>) => {
//     fetcher.submit(
//       {
//         action: "edit-comment",
//         editComment: values,
//       },
//       {
//         method: "POST",
//         action: r.apiCore,
//         encType: "application/json",
//       }
//     );
//   };

//   useEffect(() => {
//     if (fetcher.data?.error) {
//       toast({
//         title: fetcher.data.error,
//       });
//       onOpenChange(false);
//     }
//     if (fetcher.data?.message) {
//       toast({
//         title: fetcher.data.message,
//       });
//       onOpenChange(false);
//     }
//   }, [fetcher.data]);
//   return (
//     <DrawerLayout
//       open={open}
//       onOpenChange={onOpenChange}
//       title={t("f.edit", { o: t("form.comment") })}
//     >
//       <CustomForm
//         schema={editCommentSchema}
//         fetcher={fetcher}
//         onSubmit={onSubmit}
//         defaultValues={
//           {
//             id: activity.id,
//             comment: activity.comment,
//           } as z.infer<typeof editCommentSchema>
//         }
//         formItemsData={[
//           {
//             typeForm: "textarea",
//             name: "comment",
//             label: t("form.comment"),
//           },
//         ]}
//       />
//     </DrawerLayout>
//   );
// };
