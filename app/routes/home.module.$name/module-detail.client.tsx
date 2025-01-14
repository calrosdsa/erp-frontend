import { useLoaderData, useSearchParams } from "@remix-run/react";
import { loader } from "./route";
import DetailLayout from "@/components/layout/detail-layout";
import { route } from "~/util/route";
import { party } from "~/util/party";
import { useTranslation } from "react-i18next";
import { NavItem } from "~/types";
import ModuleInfo from "./tab/module-info";
import { setUpToolbarDetailPage } from "~/util/hooks/ui/useSetUpToolbar";
import { stateFromJSON } from "~/gen/common";

export default function ModuleDetailClient() {
  const { module, sections, activities } = useLoaderData<typeof loader>();
  const { t } = useTranslation("common");
  const [searchParams] = useSearchParams();
  const tab = searchParams.get("tab");
  const r = route;
  const p = party;
  const state = stateFromJSON(module?.status)
  const toRoute = (tab: string) => {
    return r.toRoute({
      main: p.module,
      routePrefix: [r.accountingM],
      routeSufix: [module?.label || ""],
      q: {
        tab: tab,
        id: module?.uuid || "",
      },
    });
  };

  const navItems: NavItem[] = [
    {
      title: t("info"),
      href: toRoute("info"),
    },
  ];

  setUpToolbarDetailPage((opts)=>{
    return {
      ...opts,
      status:state,
      
    }
  },[module])

  return (
    <DetailLayout
      activities={activities}
      partyID={module?.id}
      navItems={navItems}
    >
      {tab == "info" && <ModuleInfo />}
    </DetailLayout>
  );
}
