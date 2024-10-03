import { CreditCardIcon, DollarSign } from "lucide-react";
import { useTranslation } from "react-i18next";
import { PartyType } from "~/gen/common";
import { NavItem } from "~/types";
import { GlobalState } from "~/types/app";
import { Entity } from "~/types/enums";
import { routes } from "~/util/route";

export const AccountingNav = ({ entities }: { 
    entities: number[] | undefined
}): NavItem => {
  const { t } = useTranslation("common");
  const r = routes
  let accountingChildrens:NavItem[] = [];
  if(entities?.includes(Entity.LEDGER_ENTITY_ID)){
    accountingChildrens.push({
      title: t("_ledger.chartOfAccounts"),
      href: r.chartOfAccount,
    });
  }
  if (entities?.includes(Entity.TAX_ENTITY_ID)) {
    accountingChildrens.push({
      title: t("taxes"),
      href: r.taxes,
    });
  }

//   if (entities?.includes(Entity.PRICE_LIST_ENTITY_ID)) {
//     accountingChildrens.push({
//       title: t("price-list"),
//       href: r.priceList,
//     });
//   }
const accounting: NavItem = {
    title: t("accounting"),
    icon: CreditCardIcon,
    href: r.accounting,
    isChildren: true,
    children: accountingChildrens,
  };

  return accounting
}