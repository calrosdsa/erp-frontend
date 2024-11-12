import { useLoaderData, useSearchParams } from "@remix-run/react";
import { loader } from "./route";
import { useTranslation } from "react-i18next";
import { NavItem } from "~/types";
import { routes } from "~/util/route-admin";
import DetailLayout from "@/components/layout/detail-layout";
import EntityInfo from "./tab/entity-info";

export default function EntityDetailClient() {
  const { entity } = useLoaderData<typeof loader>();
  const [searchParams] = useSearchParams();
  const tab = searchParams.get("tab");
  const { t } = useTranslation("common");
  const r = routes;
  const navItems: NavItem[] = [
    {
      title: t("info"),
      href: r.toRoute({
        main: r.entity,
        routeSufix: [entity?.name || ""],
        q: {
          tab: "info",
          id: entity?.id.toString() || "",
        },
      }),
    },
  ];
  return (
    <DetailLayout navItems={navItems}>
      {tab == "info" && <EntityInfo />}
    </DetailLayout>
  );
}
