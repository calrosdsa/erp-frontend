import { BuildingIcon, HomeIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { PartyAdminType, partyAdminTypeToJSON, PartyType, partyTypeToJSON } from "~/gen/common";
import { NavItem } from "~/types";
import { GlobalState } from "~/types/app";
import { routes } from "~/util/route-admin";

export const NavAdminItems = (): NavItem[] => {
  const { t } = useTranslation("common");
  let navItems: NavItem[] = [];
  const r = routes
  navItems.push({
    title:t("company"),
    icon:BuildingIcon,
    href:r.toRoute({
      main:partyTypeToJSON(PartyType.company),
    })
  })
  navItems.push({
    title:t("roleTemplate"),
    href:r.toRoute({
      main:partyAdminTypeToJSON(PartyAdminType.roleTemplate),
    })
  })

  navItems.push({
    title:t("entity"),
    href:r.toRoute({
      main:r.entity,
    })
  })

  return [
    {
      title: "Home",
      icon: HomeIcon,
      href: "/home",
    },
    ...navItems,
  ];
};
