import { useLoaderData, useSearchParams } from "@remix-run/react";
import { loader } from "./route";
import Typography, { subtitle } from "@/components/typography/Typography";
import { useTranslation } from "react-i18next";
import DisplayTextValue from "@/components/custom/display/DisplayTextValue";
import { formatLongDate } from "~/util/format/formatDate";
import DetailLayout from "@/components/layout/detail-layout";
import { route } from "~/util/route";
import { NavItem } from "~/types";
import CompanyInfo from "./tab/company-info";
import { setUpToolbar } from "~/util/hooks/ui/useSetUpToolbar";
import CompanyAccounts from "./tab/company-accounts";

export default function CompanyClient() {
  const { company } = useLoaderData<typeof loader>();
  const { t, i18n } = useTranslation("common");
  const r = route;
  const [searchParams] = useSearchParams();
  const tab = searchParams.get("tab");

  const navItems: NavItem[] = [
    {
      title: t("info"),
      href: r.toRoute({
        main: r.companiesM,
        routeSufix: [company?.name || ""],
        q: {
          tab: "info",
          id: company?.uuid || "",
        },
      }),
    },
    {
      title: t("accounts"),
      href: r.toRoute({
        main: r.companiesM,
        routeSufix: [company?.name || ""],
        q: {
          tab: "accounts",
          id: company?.uuid || "",
        },
      }),
    },
  ];
  setUpToolbar(() => {
    return {};
  }, []);
  return (
    <DetailLayout navItems={navItems} partyID={company?.id}>
      {tab == "info" && <CompanyInfo />}
      {tab == "accounts" && <CompanyAccounts />}
    </DetailLayout>
  );
}
