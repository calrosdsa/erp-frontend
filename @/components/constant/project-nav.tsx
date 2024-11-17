import { CreditCardIcon, DollarSign, SquareChartGantt } from "lucide-react";
import { useTranslation } from "react-i18next";
import { PartyType } from "~/gen/common";
import { NavItem } from "~/types";
import { GlobalState } from "~/types/app";
import { Entity } from "~/types/enums";
import { routes } from "~/util/route";

export const ProjectNav = ({ entities }: { 
    entities: number[] | undefined
}): NavItem => {
  const { t } = useTranslation("common");
  const r = routes
//   let accountingChildrens:NavItem[] = [];
 
//   if(entities?.includes(Entity.COST_CENTER)){
//     accountingChildrens.push({
//       title:t("costCenter"),
//       href:r.toRoute({
//         main:r.costCenter,
//         routePrefix:[r.accountingM]
//       }),
//     })
//   }

const project: NavItem = {
    title: t("project"),
    icon: SquareChartGantt,
    href: r.toRoute({
        main:r.project,
    }),
    isChildren: false,
    // children: accountingChildrens,
  };

  return project
}