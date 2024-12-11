import {
  Building2Icon,
  ContactIcon,
  CreditCardIcon,
  HomeIcon,
  Layers3Icon,
  MapPinHouseIcon,
  SettingsIcon,
  UserCogIcon,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { SessionData } from "~/sessions";
import { NavItem } from "~/types";
import { Entity, Role } from "~/types/enums";
import { title } from "../typography/Typography";
import { routes } from "~/util/route";
import { GlobalState } from "~/types/app";
import { useMemo } from "react";
import { BuyingNav } from "./buying-nav";
import { SellingNav } from "./selling-nav";
import { AccountingNav } from "./accounting-nav";
import { CourtNav } from "./regate/court-nav";
import { BookingNav } from "./regate/booking-nav";
import { EventNav } from "./regate/event-nav";
import { DashboarNav } from "./regate/dashboard";
import { CustomerNav } from "./regate/customer-nav";
import { PartyType, partyTypeToJSON } from "~/gen/common";
import { PianoFormsNav } from "./piano/piano-forms-nav";
import { ProjectNav } from "./project-nav";
import { StockNav } from "./stock-nav";
import { InvoicingNav } from "./invoicing-nav";

export const NavItems = ({ data }: { data: GlobalState }): NavItem[] => {
  const { t } = useTranslation("common");
  let navItems: NavItem[] = [];
  const r = routes;
  const { user, role, roleActions } = data;
  const entities = roleActions
    .filter((item) => item.action.name == "view")
    .map((item) => item.action.entity_id);

  const invoicingNav = InvoicingNav({
    entities: entities,
  });

  const buyingNav = BuyingNav({
    entities: entities,
  });

  const sellingNav = SellingNav({
    entities: entities,
  });
  const stockNav = StockNav({
    entities: entities,
  });
  const accountingNav = AccountingNav({
    entities: entities,
  });

  // Regate
  const dashboardNav = DashboarNav({
    entities: entities,
  });
  const courtNav = CourtNav({
    entities: entities,
  });
  const bookingNav = BookingNav({
    entities: entities,
  });
  const eventNav = EventNav({
    entities: entities,
  });

  const pianoFormsNav = PianoFormsNav({
    entities: entities,
  });

  const project = ProjectNav({
    entities: entities,
  });
  // const customerNav = CustomerNav({
  //   entities:entities
  // })

  const companies = {
    title: t("_company.companies"),
    icon: Building2Icon,
    href: "/home/companies",
    // color: "text-sky-500",
  };

  const addresses = {
    title: t("address"),
    icon: MapPinHouseIcon,
    href: r.address,
    // color: "text-sky-500",
  };

  const contacts = {
    title: t("contact"),
    icon: ContactIcon,
    href: r.contact,
    // color: "text-sky-500",
  };

  let usersChildren: NavItem[] = [];
  if (entities?.includes(Entity.ROLE)) {
    usersChildren.push({
      title: t("roles"),
      href: r.roles,
    });
  }
  if (entities?.includes(Entity.USERS)) {
    usersChildren.push({
      title: t("users"),
      href: r.users,
    });
  }

  const manage: NavItem = {
    title: t("manage"),
    icon: UserCogIcon,
    href: r.toRoute({
      main: r.userM,
      routePrefix: [r.manageM],
    }),
    isChildren: true,
    children: usersChildren,
  };

  // const plugins: NavItem = {
  //   title: t("plugins"),
  //   icon: BlocksIcon,
  //   href: "/home/plugins",
  //   isChildren: true,
  //   children: [],
  // };
  // if (appConfig != undefined) {
  //   appConfig.plugins.map((item) => {
  //     const navItem: NavItem = {
  //       title: t(item.Name),
  //       href: `/home/plugins/${item.Name}`,
  //     };
  //     plugins.children?.push(navItem);
  //   });
  // }

  const purchases: NavItem = {
    title: t("purchases"),
    href: "/home/purchases/orders",
    icon: CreditCardIcon,
    // isChildren: true,
    // children: [] as NavItem[],
  };

  const account: NavItem = {
    title: t("settings"),
    href: "/home/settings/profile",
    icon: SettingsIcon,
    // isChildren: true,
    // children: [] as NavItem[],
  };

  // const orders = {
  //   title: t("orders"),
  //   href: "/home/purchases/orders",
  // };

  // switch (session.role) {
  // case Role.ROLE_ADMIN: {

  // if (entities?.includes(Entity.COMPANY)) {
  //   navItems.push(companies);
  // }

  //Regate
  if (entities.includes(Entity.REGATE_CHART)) {
    navItems.push(dashboardNav);
  }

  if (entities?.includes(Entity.COURT)) {
    navItems.push(courtNav);
  }
  if (entities?.includes(Entity.BOOKING)) {
    navItems.push(bookingNav);
  }
  if (entities?.includes(Entity.EVENTBOOKING)) {
    navItems.push(eventNav);
  }

  if (accountingNav.children && accountingNav.children.length > 0) {
    navItems.push(accountingNav);
  }

  //Piano

  if (pianoFormsNav.children && pianoFormsNav.children.length > 0) {
    navItems.push(pianoFormsNav);
  }

  // if(customerNav.children && customerNav.children.length > 0) {
  //   navItems.push(customerNav)
  // }
  if (invoicingNav.children && invoicingNav.children.length > 0) {
    navItems.push(invoicingNav);
  }

  if (buyingNav.children && buyingNav.children.length > 0) {
    navItems.push(buyingNav);
  }
  if (sellingNav.children && sellingNav.children.length > 0) {
    navItems.push(sellingNav);
  }
  if (stockNav.children && stockNav.children.length > 0) {
    navItems.push(stockNav);
  }
  if (usersChildren.length > 0) {
    navItems.push(manage);
  }

  if (entities.includes(Entity.PROJECT)) {
    navItems.push(project);
  }

  if (entities?.includes(Entity.ADDRESS)) {
    navItems.push(addresses);
  }
  if (entities?.includes(Entity.CONTACT)) {
    navItems.push(contacts);
  }
  // navItems.push(plugins);
  // break;
  // }
  // case Role.ROLE_CLIENT: {
  // purchases.children.push(orders);
  // navItems.push(purchases);
  // break;
  // }
  // }

  navItems.push(account);

  return [
    // {
    //   title: "Home",
    //   icon: HomeIcon,
    //   href: "/home",
    //   // color: "text-sky-500",
    // },
    // {
    //   title: "Dashboard",
    //   icon: LayoutDashboard,
    //   href: "/",
    //   // color: "text-sky-500",
    // },
    ...navItems,
  ];
};
