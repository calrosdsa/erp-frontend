import { CalendarIcon, ChevronDown, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import ActivityDeadlineTab from "../tab/activity-deadline-tab";
import CommentActivityTab from "../tab/activity-comment-tab";
import { GlobalState } from "~/types/app-types";

export default function TabNavigationActivity({
  partyID,
  partyName,
  entityID,
  appContext,
}: {
  partyID: number;
  partyName: string;
  entityID: number;
  appContext: GlobalState;
}) {
  return (
    <div className="py-2 w-full">
      <Tabs defaultValue="activity">
        <TabsList
          className="h-auto p-0 bg-transparent
         gap-1 overflow-auto items-start justify-start "
        >
          <TabsTrigger
            value="activity"
            className={cn(`data-[state=active]:border-primary border-b-2 border-secondary  
              rounded-none shadow-none px-3 py-2`)}
          >
            Actividad
          </TabsTrigger>

          <TabsTrigger
            value="comment"
            className={cn(`data-[state=active]:border-primary border-b-2 border-secondary  
              rounded-none shadow-none px-3 py-2`)}
          >
            Commentario
          </TabsTrigger>
        </TabsList>

        <TabsContent value="activity" className="w-full flex flex-grow">
          <ActivityDeadlineTab
            partyID={partyID}
            partyName={partyName}
            entityID={entityID}
            appContext={appContext}
          />
        </TabsContent>
        <TabsContent value="comment" className="w-full flex flex-grow mt-0">
          <CommentActivityTab
            partyID={partyID}
            partyName={partyName}
            entityID={entityID}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
