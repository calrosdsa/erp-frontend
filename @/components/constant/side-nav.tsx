import {
  BlocksIcon,
  BookOpenCheck,
  Building2Icon,
  CreditCardIcon,
  HomeIcon,
  Layers3Icon,
  LayoutDashboard,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { SessionData } from "~/sessions";
import { NavItem } from "~/types";
import { Role } from "~/types/enums";

export const NavItems = ({ session }: { session: SessionData }): NavItem[] => {
  const { t } = useTranslation();
  let navItems: NavItem[] = [];
  const companies = {
    title: t("company.companies"),
    icon: Building2Icon,
    href: "/home/companies",
    // color: "text-sky-500",
  }
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
        title: t("warehouse"),
        href: "/home/stock/warehouse",
      },
    ],
  }
  const plugins =   {
    title: t("plugins"),
    icon: BlocksIcon,
    href: "/home/plugins",
    isChidren: true,
    children: [
      {
        title: t("square"),
        href: "/home/plugins/square",
      },
    ],
  }

  const purchases = {
    title: t("purchases"),
    href:"/home/purchases",
    icon:CreditCardIcon,
    isChidren: true,
    children: [] as NavItem[]
  }

  const orders = {
    title: t("orders"),
    href:"/home/purchases/orders",
  }

  switch(session.role){
    case Role.ROLE_ADMIN:{
        navItems.push(companies)
        navItems.push(stock)
        navItems.push(plugins)
        break;
    }
    case Role.ROLE_CLIENT:{
        purchases.children.push(orders)
        navItems.push(purchases)
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
    ...navItems
  ];
};
