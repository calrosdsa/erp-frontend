"use client";

import * as React from "react";
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { NavMain } from "./nav-main";
import { NavUser } from "./nav-user";
import { NavSecondary } from "./nav-secondary";
import { GlobalState } from "~/types/app-types";
import { NavItems } from "@/components/constant/side-nav";
import { Link } from "@remix-run/react";
import { route } from "~/util/route";
import { components } from "~/sdk";

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  // Add your custom props here
  data: GlobalState;
  modules?:components["schemas"]["ModuleDto"][]
}

export function AppSidebar({ ...props }: AppSidebarProps) {
  const r = route;
  // const navItems = React.useMemo(() => {
  //   return NavItems({ data:props.data });
  // }, [data]);
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link
                to={r.toRoute({
                  main: r.companiesM,
                  routeSufix: [props.data.activeCompany?.name || ""],
                  q: {
                    tab: "info",
                    id:props.data.activeCompany?.uuid
                  },
                })}
              >
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">
                    {props.data.activeCompany?.name}
                  </span>
                  {/* <span className="truncate text-xs">Enterprise</span> */}
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={props.modules || []} />
        {/* <NavProjects projects={data.projects} /> */}
        {/* <NavSecondary items={data.navMain} className="mt-auto" /> */}
      </SidebarContent>

      <SidebarFooter>
        {props.data?.profile && (
          <NavUser
            user={props.data.profile}
          />
        )}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
