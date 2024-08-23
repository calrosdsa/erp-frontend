import {
    Outlet,
  useActionData,
  useLoaderData,
  useNavigate,
  useOutletContext,
} from "@remix-run/react";
import { action, loader } from "./route";
import { SessionDefaultDrawer } from "../home/components/SessionDefaults";
import { GlobalState } from "~/types/app";
import { Separator } from "@/components/ui/separator";
import { SideNav } from "@/components/layout/side-nav";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMediaQuery } from "usehooks-ts";
import ResponsiveSidebar from "@/components/layout/nav/responsive-sidebar";
import { routes } from "~/util/route";
import { useTranslation } from "react-i18next";

export default function SettingClient() {
    const isDesktop = useMediaQuery("(min-width: 768px)")
    const r = routes 
    const {t} = useTranslation("common")
    const globalState = useOutletContext<GlobalState>()
    const sidebarNavItems = [
      {
        title: t("profile"),
        href: r.profile,
      },
      {
        title: t("account"),
        href: r.account,
      },
    ];
  return (
    <>
      <div className={`h-full p-2 ${!isDesktop ? "flex flex-col":"flex"}`}>
      <ResponsiveSidebar navItems={sidebarNavItems}/>
      <Separator orientation="vertical" className="h-auto"/>

      <div className="px-4 py-2 w-full">
      <Outlet
      context={globalState}
      />
      </div>
      </div>
    </>
  );
}
