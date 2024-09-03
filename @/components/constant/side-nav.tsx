import {
  BlocksIcon,
  BookOpenCheck,
  Building2Icon,
  CreditCardIcon,
  DollarSign,
  HomeIcon,
  Layers3Icon,
  LayoutDashboard,
  SettingsIcon,
  UserCogIcon,
  UserIcon,
  UsersIcon,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { SessionData } from "~/sessions";
import { NavItem } from "~/types";
import { Entity, Role } from "~/types/enums";
import { title } from "../typography/Typography";
import { routes } from "~/util/route";
import { GlobalState } from "~/types/app";
import { useMemo } from "react";

export const NavItems = ({ data }: { data: GlobalState }): NavItem[] => {
  const { t } = useTranslation("common");
  let navItems: NavItem[] = [];
  const r = routes;
  const { appConfig, user, role } = data;
  const entities = role?.RoleActions.filter(
    (item) => item.Action.Name == "view"
  ).map((item) => item.Action.EntityID);

  const companies = {
    title: t("_company.companies"),
    icon: Building2Icon,
    href: "/home/companies",
    // color: "text-sky-500",
  };

  const accounting: NavItem = {
    title: t("accounting"),
    icon: CreditCardIcon,
    href: r.accounting,
    isChildren: true,
    children: [
      {
        title: t("taxes"),
        href: r.taxes,
      },
    ],
  };

  const selling: NavItem = {
    title: t("selling"),
    icon: DollarSign,
    href: "/home/selling",
    isChildren: true,
    children: [
      {
        title: t("price-list"),
        href: "/home/selling/stock/price-list",
      },
    ],
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
  if (entities?.includes(Entity.ITEM_GROUP_ENTITY_ID)) {
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
  if(entities?.includes(Entity.USERS_ENTITY_ID)){
    usersChildren.push({
      title:t("users"),
      href:r.users,
    })
  }



  const manage: NavItem = {
    title: t("manage"),
    icon: UserCogIcon,
    href: "/home/users",
    isChildren: true,
    children: usersChildren,
  };

  const plugins: NavItem = {
    title: t("plugins"),
    icon: BlocksIcon,
    href: "/home/plugins",
    isChildren: true,
    children: [],
  };
  if (appConfig != undefined) {
    appConfig.plugins.map((item) => {
      const navItem: NavItem = {
        title: t(item.Name),
        href: `/home/plugins/${item.Name}`,
      };
      plugins.children?.push(navItem);
    });
  }

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
  navItems.push(accounting);
  navItems.push(selling);
  if (stockChildrens.length > 0) {
    navItems.push(stock);
  }
  if (usersChildren.length > 0) {
    navItems.push(manage);
  }
  navItems.push(plugins);
  // break;
  // }
  // case Role.ROLE_CLIENT: {
  // purchases.children.push(orders);
  navItems.push(purchases);
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
