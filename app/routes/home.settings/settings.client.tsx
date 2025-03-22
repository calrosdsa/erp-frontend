import {
    Outlet,
  useActionData,
  useLoaderData,
  useNavigate,
  useOutletContext,
} from "@remix-run/react";
import { action, loader } from "./route";
import { SessionDefaultDrawer } from "../home/components/SessionDefaults";
import { GlobalState } from "~/types/app-types";
import { Separator } from "@/components/ui/separator";
import { SideNav } from "@/components/layout/side-nav";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMediaQuery } from "usehooks-ts";
import ResponsiveSidebar from "@/components/layout/nav/responsive-sidebar";
import { route } from "~/util/route";
import { useTranslation } from "react-i18next";
import DetailLayout from "@/components/layout/detail-layout";

export default function SettingClient() {
    const r = route 
    const {t} = useTranslation("common")
    const globalState = useOutletContext<GlobalState>()
    const navItems = [
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
      <DetailLayout 
      navItems={navItems}>
      <Outlet
      context={globalState}
      />
      </DetailLayout>
    </>
  );
}
