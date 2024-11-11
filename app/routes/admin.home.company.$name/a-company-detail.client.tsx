import { useLoaderData, useNavigate, useSearchParams } from "@remix-run/react";
import { loader } from "./route";
import DetailLayout from "@/components/layout/detail-layout";
import { NavItem } from "~/types";
import { useTranslation } from "react-i18next";
import { routes } from "~/util/route-admin";
import { PartyType, partyTypeToJSON } from "~/gen/common";
import ACompanyInfo from "./tab/a-company-info";
import ACompanyModules from "./tab/a-company-modules";

export default function ACompanyDetailClient() {
  const { company } = useLoaderData<typeof loader>();
  const { t } = useTranslation("common");
  const [searchParams] = useSearchParams();
  const tab = searchParams.get("tab");
  const r = routes;
  const navItems: NavItem[] = [
    {
      title: t("info"),
      href: r.toRoute({
        main: partyTypeToJSON(PartyType.company),
        routeSufix: [company?.name || ""],
        q: {
          tab: "info",
          id: company?.id.toString() || "",
        },
      }),
    },
    {
      title: "Modules",
      href: r.toRoute({
        main: partyTypeToJSON(PartyType.company),
        routeSufix: [company?.name || ""],
        q: {
          tab: "modules",
          id: company?.id.toString() || "",
        },
      }),
    },
  ];
  return (
    <DetailLayout navItems={navItems}>
      {tab == "info" && <ACompanyInfo />}
      {tab == "modules" && <ACompanyModules />}
    </DetailLayout>
  );
}
