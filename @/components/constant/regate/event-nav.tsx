import { CreditCardIcon, DollarSign, PartyPopper, StoreIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { PartyType } from "~/gen/common";
import { NavItem } from "~/types";
import { GlobalState } from "~/types/app";
import { Entity } from "~/types/enums";
import { route } from "~/util/route";

export const EventNav = ({ entities }: { 
    entities: number[] | undefined
}): NavItem => {
  const { t } = useTranslation("common");
  const r = route

const event: NavItem = {
    title: t("regate._event.base"),
    icon: PartyPopper,
    href: r.event,
    // isChildren: true,
    // children: accountingChildrens,
  };

  return event
}