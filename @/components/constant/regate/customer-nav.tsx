import { CreditCardIcon, DollarSign, Users } from "lucide-react";
import { useTranslation } from "react-i18next";
import { PartyType } from "~/gen/common";
import { NavItem } from "~/types";
import { GlobalState } from "~/types/app-types";
import { Entity } from "~/types/enums";
import { route } from "~/util/route";

export const CustomerNav = ({ entities }: { 
    entities: number[] | undefined
}): NavItem => {
  const { t } = useTranslation("common");
  const r = route
  let customerChildrens:NavItem[] = [];
  if(entities?.includes(Entity.CUSTOMER)){
    customerChildrens.push({
      title: t("customers"),
      href: r.customers,
    });
  }
  if(entities?.includes(Entity.CUSTOMER)){
    customerChildrens.push({
      title: t("customerGroup"),
      href: r.toGroupsByParty(PartyType.customerGroup),
    });
  }

  const customer: NavItem = {
    title: "Clientes",
    icon: Users,
    href:r.customers,
    isChildren: true,
    children: customerChildrens,
  };


  return customer
}