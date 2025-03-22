import {
  useLoaderData,
  useOutletContext,
  useSearchParams,
} from "@remix-run/react";
import { loader } from "./route";
import Typography, { subtitle } from "@/components/typography/Typography";
import { useTranslation } from "react-i18next";
import DisplayTextValue from "@/components/custom/display/DisplayTextValue";
import { usePermission } from "~/util/hooks/useActions";
import { GlobalState } from "~/types/app-types";
import { route } from "~/util/route";
import DetailLayout from "@/components/layout/detail-layout";
import PriceListInfo from "./tab/price-list-info";
import { setUpToolbar } from "~/util/hooks/ui/useSetUpToolbar";

export default function PriceListDetailClient() {
  const { priceList, actions } = useLoaderData<typeof loader>();
  const { t } = useTranslation("common");
  const globalState = useOutletContext<GlobalState>();
  const [permission] = usePermission({
    actions: actions,
    roleActions: globalState.roleActions,
  });
  const [searchParams] = useSearchParams();
  const tab = searchParams.get("tab") || "info";
  const r = route;
  const toRoute = (tab: string) => {
    return r.toRoute({
      main: r.project,
      routeSufix: [priceList?.name || ""],
      q: {
        tab: tab,
      },
    });
  };
  const navItems = [
    {
      title: t("form.name"),
      href: toRoute("info"),
    },
  ];
  setUpToolbar(()=>{
    return {}
  })
  return (
    <DetailLayout navItems={navItems}
    partyID={priceList?.id}>
      {tab == "info" && <PriceListInfo />}
    </DetailLayout>
  );
}
