import { useLoaderData, useSearchParams } from "@remix-run/react";
import { loader } from "./route";
import DetailLayout from "@/components/layout/detail-layout";
import { useTranslation } from "react-i18next";
import { route } from "~/util/route";
import { NavItem } from "~/types";
import { setUpToolbar, setUpToolbarRegister } from "~/util/hooks/ui/useSetUpToolbar";
import { Entity } from "~/types/enums";
import ChargesTemplateInfo from "./tab/charges-template-info";

export default function ChargesTemplateDetailClient() {
  const { chargesTemplate, activities } = useLoaderData<typeof loader>();
  const { t } = useTranslation("common");
  const r = route;
  const [searchParams] = useSearchParams();
  const tab = searchParams.get("tab") || "info";
  const toRoute = (tab: string) => {
    return r.toRoute({
      main: r.chargesTemplate,
      routePrefix: [r.accountingM],
      routeSufix: [chargesTemplate?.name || ""],
      q: {
        tab: tab,
        id: chargesTemplate?.id || "",
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
            titleToolbar:chargesTemplate?.name,
        }
    },[chargesTemplate])
//   setUpToolbar(() => {
//     return {
//         title:chargesTemplate?.name,
//     };
//   }, [chargesTemplate]);

  return (
    <DetailLayout
      entityID={Entity.CHARGES_TEMPLATE}
      activities={activities}
      partyID={chargesTemplate?.id}
      navItems={navItems}
      fullWidth={true}
      partyName={chargesTemplate?.name}
    >
      {tab == "info" && <ChargesTemplateInfo />}
    </DetailLayout>
  );
}
