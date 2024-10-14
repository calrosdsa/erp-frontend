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

export const NavItems = ({ data }: { data: GlobalState }): NavItem[] => {
  const { t } = useTranslation("common");
  let navItems: NavItem[] = [];
  const r = routes;
  const { user, role,roleActions } = data;
  const entities = roleActions.filter(
    (item) => item.action.name == "view"
  ).map((item) => item.action.entity_id);

  const buyingNav = BuyingNav({
    entities:entities
  })

  const sellingNav = SellingNav({
    entities:entities,
  })
  const accountingNav = AccountingNav({
    entities:entities
  })

  // Regate
  const courtNav = CourtNav({
    entities:entities
  })
  const bookingNav = BookingNav({
    entities:entities
  })

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

  

 


 

  let stockChildrens: NavItem[] = [];
  if (entities?.includes(Entity.ITEM_ENTITY_ID)) {
    stockChildrens.push({
      title: t("items"),
      href: "/home/stock/items",
    });
  }
  if (entities?.includes(Entity.ITEM_PRICE_ENTITY_ID)) {
    stockChildrens.push({
      title: t("itemPrice.p"),
      href: "/home/stock/item-prices",
    });
  }
  if (entities?.includes(Entity.ITEM_ENTITY_ID)) {
    stockChildrens.push({
      title: t("item-groups"),
      href: "/home/stock/item-groups",
    });
  }
  if (entities?.includes(Entity.ITEM_ATTRIBUTES_ENTITY_ID)) {
    stockChildrens.push({
      title: t("item-attributes"),
      href: "/home/stock/item-attributes",
    });
  }
  if (entities?.includes(Entity.ITEM_WAREHOUSE_ENTITY_ID)) {
    stockChildrens.push({
      title: t("warehouses"),
      href: r.warehouses,
    });
  }

  const stock: NavItem = {
    title: t("stock"),
    icon: Layers3Icon,
    href: "/home/stock",
    isChildren: true,
    children: stockChildrens,
  };

  let usersChildren: NavItem[] = [];
  if (entities?.includes(Entity.ROLE_ENTITY_ID)) {
    usersChildren.push({
      title: t("roles"),
      href: r.roles,
    });
  }
  if (entities?.includes(Entity.USERS_ENTITY_ID)) {
    usersChildren.push({
      title: t("users"),
      href: r.users,
    });
  }

  const manage: NavItem = {
    title: t("manage"),
    icon: UserCogIcon,
    href: "/home/users",
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
  if (entities?.includes(Entity.COMPANY_ENTITY_ID)) {
    navItems.push(companies);
  }
  if (accountingNav.children && accountingNav.children.length > 0) {
    navItems.push(accountingNav);
  }

  //Regate
  if(entities?.includes(Entity.COURT_ENTITY_ID)){
    navItems.push(courtNav)
  }
  if(entities?.includes(Entity.BOOKING_ENTITY_ID)){
    navItems.push(bookingNav)
  }


  if(buyingNav.children && buyingNav.children.length > 0) {
    navItems.push(buyingNav)
  }
  if(sellingNav.children && sellingNav.children.length > 0) {
    navItems.push(sellingNav)
  }



  if (stockChildrens.length > 0) {
    navItems.push(stock);
  }
  if (usersChildren.length > 0) {
    navItems.push(manage);
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
    {
      title: "Home",
      icon: HomeIcon,
      href: "/home",
      // color: "text-sky-500",
    },
    // {
    //   title: "Dashboard",
    //   icon: LayoutDashboard,
    //   href: "/",
    //   // color: "text-sky-500",
    // },
    ...navItems,
  ];
};
