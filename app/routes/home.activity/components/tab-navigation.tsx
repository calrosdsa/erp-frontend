import { CalendarIcon, ChevronDown, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import ActivityDeadlineTab from "../tab/activity-deadline-tab";

export default function TabNavigation({
  partyID
}:{
  partyID:number;
}) {
  return (
    <div className="py-2 w-full">
      <Tabs defaultValue="activity">
        <TabsList className="h-auto p-0 bg-transparent
         gap-1 overflow-auto items-start justify-start ">
          <TabsTrigger
            value="activity"
            className={cn(`data-[state=active]:border-primary border-b-2 border-secondary  
              rounded-none shadow-none px-3 py-2`,
              
            )}
          >
            Actividad
          </TabsTrigger>

          <TabsTrigger
            value="comment"
           className={cn(`data-[state=active]:border-primary border-b-2 border-secondary  
              rounded-none shadow-none px-3 py-2`,
            )}
          >
            Commentario
          </TabsTrigger>
        </TabsList>

        <TabsContent value="activity" className="w-full flex flex-grow">
          
          <ActivityDeadlineTab partyID={partyID}/>
        </TabsContent>
        <TabsContent value="comment">Commentario</TabsContent>
      </Tabs>
    </div>
  );
}
