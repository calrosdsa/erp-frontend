import { useLoaderData, useSearchParams } from "@remix-run/react";
import { loader } from "./route";
import { useTranslation } from "react-i18next";
import { NavItem } from "~/types";
import { routes } from "~/util/route-admin";
import { PartyAdminType, partyAdminTypeToJSON } from "~/gen/common";
import DetailLayout from "@/components/layout/detail-layout";
import RoleTemplateInfo from "./tab/role-template-info";
import { setUpToolbar } from "~/util/hooks/ui/useSetUpToolbar";

export default function RoleTemplateDetailClient() {
  const { roleTemplate } = useLoaderData<typeof loader>();
  const { t } = useTranslation("common");
  const [searchParams] = useSearchParams();
  const tab = searchParams.get("tab");
  const r = routes;
  const navItems: NavItem[] = [
    {
      title: t("info"),
      href: r.toRoute({
        main: partyAdminTypeToJSON(PartyAdminType.roleTemplate),
        routeSufix: [roleTemplate?.name || ""],
        q: {
          tab: "info",
          id: searchParams.get("id") || "",
        },
      }),
    },
  ];
  setUpToolbar(() => {
    return {};
  }, []);
  return (
    <DetailLayout navItems={navItems}>
      {tab == "info" && <RoleTemplateInfo />}
    </DetailLayout>
  );
}
