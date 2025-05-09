import { useLoaderData, useSearchParams } from "@remix-run/react";
import { loader } from "./route";
import DisplayTextValue from "@/components/custom/display/DisplayTextValue";
import { route } from "~/util/route";
import { useTranslation } from "react-i18next";
import { formatLongDate } from "~/util/format/formatDate";
import {
  setUpToolbar,
  setUpToolbarDetailPage,
  setUpToolbarRegister,
} from "~/util/hooks/ui/useSetUpToolbar";
import { stateFromJSON } from "~/gen/common";
import { NavItem } from "~/types";
import DetailLayout from "@/components/layout/detail-layout";
import AccountInfo from "./tabs/account-ledger-info";
import { Entity } from "~/types/enums";

export default function AccountLedgerDetailClient() {
  const { actions, account, activities } = useLoaderData<typeof loader>();
  const { t, i18n } = useTranslation("common");
  const r = route;
  const [searchParams] = useSearchParams();
  const tab = searchParams.get("tab") || "info";
  const toRoute = (tab: string) => {
    return r.toRoute({
      main: r.accountM,
      routeSufix: [account?.name || ""],
      q: {
        tab: tab,
        id: account?.id.toString() || "",
      },
    });
  };
  const navItems: NavItem[] = [
    {
      title: t("info"),
      href: toRoute("info"),
    },
  ];

  setUpToolbarRegister(() => {
    return {
      titleToolbar:account?.name,
      status: stateFromJSON(account?.status),
    };
  }, [account]);
  return (
    <DetailLayout
      partyID={account?.id}
      navItems={navItems}
      partyName={account?.name}
      entityID={Entity.LEDGER}
      activities={activities}
    >
      {tab == "info" && <AccountInfo />}
    </DetailLayout>
  );
}
