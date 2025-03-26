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
import { Card, CardContent, CardHeader } from "../ui/card";

export default function CreateLayout({ children }: { children: ReactNode }) {
  return (
    <div>
          <ToolBar />
      <Card className="p-2">
        {children}
      </Card>
    </div>
  );
}
