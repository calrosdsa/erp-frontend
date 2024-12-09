import { useLoaderData, useSearchParams } from "@remix-run/react";
import { loader } from "./route";
import DisplayTextValue from "@/components/custom/display/DisplayTextValue";
import { routes } from "~/util/route";
import { useTranslation } from "react-i18next";
import { formatLongDate } from "~/util/format/formatDate";
import { setUpToolbar } from "~/util/hooks/ui/useSetUpToolbar";
import { stateFromJSON } from "~/gen/common";
import { NavItem } from "~/types";
import DetailLayout from "@/components/layout/detail-layout";
import AccountInfo from "./components/account-info";

export default function AccountLedgerDetailClient() {
  const { actions, account } = useLoaderData<typeof loader>();
  const { t, i18n } = useTranslation("common");
  const r = routes;
  const [searchParams] = useSearchParams();
  const tab = searchParams.get("tab") || "info";
  const toRoute = (tab: string) => {
    return r.toRoute({
      main: r.accountM,
      routePrefix: [r.accountingM],
      routeSufix: [account?.name || ""],
      q: {
        tab: tab,
        id: account?.uuid || "",
      },
    });
  };

  const navItems: NavItem[] = [
    {
      title: t("info"),
      href: toRoute("info"),
    },
  ];

  setUpToolbar(() => {
    return {
      status: stateFromJSON(account?.status),
    };
  }, [account]);
  return (
    <DetailLayout partyID={account?.id} navItems={navItems}>
      {tab == "info" && <AccountInfo />}
    </DetailLayout>
  );
}
