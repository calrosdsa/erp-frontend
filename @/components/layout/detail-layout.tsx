import { ReactNode } from "react";
import { useMediaQuery } from "usehooks-ts";
import { NavItem } from "~/types";
import ResponsiveSidebar from "./nav/responsive-sidebar";
import { Separator } from "../ui/separator";
import { components } from "~/sdk";
import ActivityFeed from "../../../app/routes/home.activity/components/activity-feed";
import { useOutletContext } from "@remix-run/react";
import { GlobalState } from "~/types/app-types";

export default function DetailLayout({
  children,
  navItems,
  activities = [],
  partyID,
  partyName,
  entityID,
}: {
  children: ReactNode;
  navItems: NavItem[];
  activities?: components["schemas"]["ActivityDto"][];
  partyID?: number;
  partyName?:string
  entityID:number
}) {
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const appContext = useOutletContext<GlobalState>();
  return (
    // <div className={`h-full   ${!isDesktop ? "flex flex-col" : "flex"}`}>
    <div className={`h-full grid xl:grid-cols-2 gap-2`}>
      <div className="border rounded-xl p-2">
        <ResponsiveSidebar navItems={navItems} />
        <Separator />

        <div className="px-1 sm:px-2 py-2 w-full">{children}</div>
      </div>

      {partyID && (
        <div >
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
  );
}
