import {
  CalendarIcon,
  CreditCardIcon,
  DollarSign,
  StoreIcon,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { PartyType } from "~/gen/common";
import { NavItem } from "~/types";
import { GlobalState } from "~/types/app";
import { Entity } from "~/types/enums";
import { route } from "~/util/route";

export const BookingNav = ({
  entities,
}: {
  entities: number[] | undefined;
}): NavItem => {
  const { t } = useTranslation("common");
  const r = route;
  let bookingNavs: NavItem[] = [];
  if (entities?.includes(Entity.BOOKING)) {
    bookingNavs.push({
      title: "Reservar",
      href: r.toRoute({
        main:r.bookingM,
        routeSufix:["schedule"]
      }),
    });
  }
  if (entities?.includes(Entity.BOOKING)) {
    bookingNavs.push({
      title: "Lista de Reservas",
      href: r.toRoute({
        main:r.bookingM,
      }),
    });
  }

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
  const booking: NavItem = {
    title: t("regate._booking.base"),
    icon: CalendarIcon,
    defaultOpen:true,
    href: r.booking,
    isChildren: true,
    children: bookingNavs,
  };

  return booking;
};
