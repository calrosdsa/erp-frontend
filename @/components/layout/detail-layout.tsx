  import { ReactNode } from "react";
  import { useMediaQuery } from "usehooks-ts";
  import { NavItem } from "~/types";
  import ResponsiveSidebar from "./nav/responsive-sidebar";
  import { Separator } from "../ui/separator";
  import { components } from "~/sdk";
  import ActivityFeed from "../custom-ui/activity-feed";

  export default function DetailLayout({
    children,
    navItems,
    activities,
    partyID
  }: {
    children: ReactNode;
    navItems: NavItem[];
    activities?: components["schemas"]["ActivityDto"][];
    partyID?:number
  }) {
    const isDesktop = useMediaQuery("(min-width: 1024px)");

    return (
      // <div className={`h-full   ${!isDesktop ? "flex flex-col" : "flex"}`}>
      <div className={`h-full flex flex-col`}>
        <div className="border rounded-xl p-2">
          <ResponsiveSidebar navItems={navItems} />
          <Separator />

          <div className="px-1 sm:px-2 py-2 w-full">{children}</div>
        </div>

        <div className="pt-4">
          <ActivityFeed activities={activities} partyID={partyID}/>
        </div>

      </div>
    );
  }
