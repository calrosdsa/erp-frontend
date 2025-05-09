import { CreditCardIcon, DollarSign, StoreIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { PartyType } from "~/gen/common";
import { NavItem } from "~/types";
import { GlobalState } from "~/types/app-types";
import { Entity } from "~/types/enums";
import { route } from "~/util/route";

export const CourtNav = ({ entities }: { 
    entities: number[] | undefined
}): NavItem => {
  const { t } = useTranslation("common");
  const r = route
//   let accountingChildrens:NavItem[] = [];
//   if(entities?.includes(Entity.LEDGER_ENTITY_ID)){
//     accountingChildrens.push({
//       title: t("_ledger.chartOfAccounts"),
//       href: r.chartOfAccount,
//     });
//   }
//   if (entities?.includes(Entity.TAX_ENTITY_ID)) {
//     accountingChildrens.push({
//       title: t("taxes"),
//       href: r.taxes,
//     });
//   }
//   if(entities?.includes(Entity.PAYMENT_ENTITY_ID)){
//     accountingChildrens.push({
//       title:t("_payment.base"),
//       href:r.payment,
//     })
//   }

//   if (entities?.includes(Entity.PRICE_LIST_ENTITY_ID)) {
//     accountingChildrens.push({
//       title: t("price-list"),
//       href: r.priceList,
//     });
//   }
const court: NavItem = {
    title: t("regate._court.base"),
    icon: StoreIcon,
    href: r.court,
    // isChildren: true,
    // children: accountingChildrens,
  };

  return court
}