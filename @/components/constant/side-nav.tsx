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
  UserIcon,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { components } from "~/sdk";
import { SessionData } from "~/sessions";
import { NavItem } from "~/types";
import { Role } from "~/types/enums";
import { title } from "../typography/Typography";
import { routes } from "~/util/route";

export const NavItems = ({
  session,
  appConfig,
}: {
  session: SessionData;
  appConfig: components["schemas"]["AppConfigStruct"] | undefined;
}): NavItem[] => {
  const { t } = useTranslation("common");
  let navItems: NavItem[] = [];
  const r = routes
  const companies = {
    title: t("_company.companies"),
    icon: Building2Icon,
    href: "/home/companies",
    // color: "text-sky-500",
  };
  const accounting:NavItem = {
    title: t("accounting"),
    icon:CreditCardIcon,
    href:r.accounting,
    isChildren:true,
    children:[
      {
        title: t("taxes"),
        href:r.taxes
      }
    ]
  }

  const selling: NavItem = {
    title: t("selling"),
    icon: DollarSign,
    href: "/home/selling",
    isChildren:true,
    children: [
      {
        title: t("price-list"),
        href: "/home/selling/stock/price-list",
      },
    ],
  };

  const stock:NavItem = {
    title: t("stock"),
    icon: Layers3Icon,
    href: "/home/stock",
    isChildren: true,
    children: [
      {
        title: t("items"),
        href: "/home/stock/items",
      },
      {
        title: t("itemPrice.p"),
        href: "/home/stock/item-prices",
      },
      {
        title: t("item-groups"),
        href: "/home/stock/item-groups",
      },
      {
        title: t("item-attributes"),
        href: "/home/stock/item-attributes",
      },
      {
        title: t("warehouses"),
        href: r.warehouses,
      },
    ],
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

  const purchases:NavItem = {
    title: t("purchases"),
    href: "/home/purchases/orders",
    icon: CreditCardIcon,
    // isChildren: true,
    // children: [] as NavItem[],
  };

  const account:NavItem = {
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

  switch (session.role) {
    case Role.ROLE_ADMIN: {
      navItems.push(companies);
      navItems.push(accounting)
      navItems.push(selling);
      navItems.push(stock);
      navItems.push(plugins);
      break;
    }
    case Role.ROLE_CLIENT: {
      // purchases.children.push(orders);
      navItems.push(purchases);
      break;
    }
  }

  navItems.push(account)



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
