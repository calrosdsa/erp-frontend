import {
  BlocksIcon,
  BookOpenCheck,
  Building2Icon,
  CreditCardIcon,
  DollarSign,
  HomeIcon,
  Layers3Icon,
  LayoutDashboard,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { components } from "~/sdk";
import { SessionData } from "~/sessions";
import { NavItem } from "~/types";
import { Role } from "~/types/enums";
import { title } from "../typography/Typography";

export const NavItems = ({
  session,
  appConfig,
}: {
  session: SessionData;
  appConfig: components["schemas"]["AppConfigStruct"] | undefined;
}): NavItem[] => {
  const { t } = useTranslation();
  let navItems: NavItem[] = [];
  const companies = {
    title: t("company.companies"),
    icon: Building2Icon,
    href: "/home/companies",
    // color: "text-sky-500",
  };
  const selling: NavItem = {
    title: t("selling"),
    icon: DollarSign,
    href: "/home/selling",
    isChidren:true,
    children: [
      {
        title: t("price-list"),
        href: "/home/selling/stock/price-list",
      },
    ],
  };

  const stock = {
    title: t("stock"),
    icon: Layers3Icon,
    href: "/home/stock",
    isChidren: true,
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
        title: t("item-atributes"),
        href: "/home/stock/item-attributes",
      },
      {
        title: t("warehouse"),
        href: "/home/stock/warehouse",
      },
    ],
  };
  const plugins: NavItem = {
    title: t("plugins"),
    icon: BlocksIcon,
    href: "/home/plugins",
    isChidren: true,
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

  const purchases = {
    title: t("purchases"),
    href: "/home/purchases",
    icon: CreditCardIcon,
    isChidren: true,
    children: [] as NavItem[],
  };

  const orders = {
    title: t("orders"),
    href: "/home/purchases/orders",
  };

  switch (session.role) {
    case Role.ROLE_ADMIN: {
      navItems.push(companies);
      navItems.push(selling);
      navItems.push(stock);
      navItems.push(plugins);
      break;
    }
    case Role.ROLE_CLIENT: {
      purchases.children.push(orders);
      navItems.push(purchases);
      break;
    }
  }

  return [
    {
      title: "Home",
      icon: HomeIcon,
      href: "/home",
      // color: "text-sky-500",
    },
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      href: "/",
      // color: "text-sky-500",
    },
    ...navItems,
  ];
};
