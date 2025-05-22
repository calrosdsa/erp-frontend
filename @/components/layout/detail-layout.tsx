import { ReactNode } from "react";
import { useMediaQuery } from "usehooks-ts";
import { NavItem } from "~/types";
import ResponsiveSidebar from "./nav/responsive-sidebar";
import { Separator } from "../ui/separator";
import { components } from "~/sdk";
import ActivityFeed from "../../../app/routes/home.activity/components/activity-feed";
import { useOutletContext } from "@remix-run/react";
import { GlobalState } from "~/types/app-types";
import ToolBar from "./toolbar/Toolbar";
import { cn } from "@/lib/utils";

export default function DetailLayout({
  children,
  navItems,
  activities = [],
  partyID,
  partyName,
  entityID,
  fullWidth = false,
}: {
  children: ReactNode;
  navItems: NavItem[];
  activities?: components["schemas"]["ActivityDto"][];
  partyID?: number;
  partyName?: string;
  entityID: number;
  fullWidth?: boolean;
}) {
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const appContext = useOutletContext<GlobalState>();
  return (
    // <div className={`h-full   ${!isDesktop ? "flex flex-col" : "flex"}`}>
    <div>
      <ToolBar />
      <ResponsiveSidebar navItems={navItems} />
      <div
        className={cn(`h-full grid pt-2 gap-2`, !fullWidth && "xl:grid-cols-6")}
      >
        <div className={cn("border rounded-xl p-2 col-span-1",
          !fullWidth && "xl:col-span-3"
        )}>
          <div className="px-1 sm:px-2 py-2 w-full">{children}</div>
        </div>

        {partyID && (
          <div className={cn("col-span-1",!fullWidth && "xl: col-span-3")}>
            <ActivityFeed
              activities={activities}
              partyID={partyID}
              partyName={partyName}
              entityID={entityID}
              appContext={appContext}
            />
          </div>
        )}
      </div>
    </div>
  );
}
