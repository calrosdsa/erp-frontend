import { useLoaderData, useSearchParams } from "@remix-run/react";
import { loader } from "./route";
import DetailLayout from "@/components/layout/detail-layout";
import { useTranslation } from "react-i18next";
import { route } from "~/util/route";
import { NavItem } from "~/types";
import CostCenterInfo from "./tab/cost-center-info";
import {
  setUpToolbar,
  setUpToolbarRegister,
} from "~/util/hooks/ui/useSetUpToolbar";
import { Entity } from "~/types/enums";
import { stateFromJSON } from "~/gen/common";

export default function CostCenterDetailClient() {
  const { costCenter, activities } = useLoaderData<typeof loader>();
  const { t } = useTranslation("common");
  const r = route;
  const [searchParams] = useSearchParams();
  const tab = searchParams.get("tab") || "info";
  const toRoute = (tab: string) => {
    return r.toRoute({
      main: r.costCenter,
      routePrefix: [r.accountingM],
      routeSufix: [costCenter?.name || ""],
      q: {
        tab: tab,
        id:costCenter?.id,
      },
    });
  };
  const navItems: NavItem[] = [
    {
      title: t("info"),
      href: toRoute("info"),
    },
  ];
  setUpToolbarRegister(() => {
    return {
      titleToolbar: costCenter?.name,
      status: stateFromJSON(costCenter?.status),
    
    };
  }, [costCenter]);
  return (
    <DetailLayout
      partyID={costCenter?.id}
      partyName={costCenter?.name}
      entityID={Entity.COST_CENTER}
      activities={activities}
      navItems={navItems}
    >
      {tab == "info" && <CostCenterInfo />}
    </DetailLayout>
  );
}
