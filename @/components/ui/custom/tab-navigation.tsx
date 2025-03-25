import { CalendarIcon, ChevronDown, Lock } from "lucide-react";
import { ReactNode } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../tabs";
import { cn } from "@/lib/utils";

export type TabItem = {
  label: string;
  value: string;
  children: ReactNode;  
};

export default function TabNavigation({
  items,
  onValueChange,
  defaultValue,
}: {
  items: TabItem[];
  onValueChange?: (tab: string) => void;
  defaultValue?:string
}) {
  return (
    <div className="w-full">
      <Tabs defaultValue={defaultValue} onValueChange={onValueChange}>
        <TabsList
          className="h-auto w-full p-0 border rounded-xl bg-transparent px-4
         gap-1 overflow-auto items-start justify-start "
        >
          {items.map((item) => {
            return (
              <TabsTrigger
                key={item.value}
                value={item.value}
                className={cn(`data-[state=active]:border-primary border-b-2 border-secondary
              rounded-none shadow-none data-[state=active]:shadow-none p-3`)}
              >
                {item.label}
              </TabsTrigger>
            );
          })}
        </TabsList>
        {items.map((item) => {
          return (
            <TabsContent  
              key={item.value}
              value={item.value}
              className=""
            >
              {item.children}
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
}
