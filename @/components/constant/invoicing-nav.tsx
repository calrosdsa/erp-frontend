import { CreditCardIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { PartyType, partyTypeToJSON } from "~/gen/common";
import { NavItem } from "~/types";
import { GlobalState } from "~/types/app";
import { Entity } from "~/types/enums";
import { routes } from "~/util/route";

export const InvoicingNav = ({ entities }: { 
    entities: number[] | undefined
}): NavItem => {
  const { t } = useTranslation("common");
  const r = routes
  let invoicingChildrens:NavItem[] = [];
  if(entities?.includes(Entity.SALES_RECORD)){
    invoicingChildrens.push({
      title: t("salesRecord"),
      href: r.toRoute({
        main:r.salesRecord,
        routePrefix:[r.invoicing],
      }),
    });
  }

  if(entities?.includes(Entity.PURCHASE_RECORD)){
    invoicingChildrens.push({
      title: t("purchaseRecord"),
      href: r.toRoute({
        main:r.purchaseRecord,
        routePrefix:[r.invoicing],
      }),
    });
  }
  

  const invoicing:NavItem = {
    title: t("invoicing"),
    icon: CreditCardIcon,
    href: r.toRoute({
      main:r.salesRecord,
      // routeSufix:[r.invoicing],
      routePrefix:[r.invoicing],
    }),
    isChildren: true,
    children: invoicingChildrens,
  }


  return invoicing
}