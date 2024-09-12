import { Outlet, useLoaderData, useOutletContext, useParams } from "@remix-run/react";
import { loader } from "./route";
import Typography, { subtitle } from "@/components/typography/Typography";
import { useTranslation } from "react-i18next";
import { GlobalState, WarehouseGlobalState } from "~/types/app";
import { routes } from "~/util/route";
import DetailLayout from "@/components/layout/detail-layout";

export default function WareHouseClient() {
  // const globalState = useOutletContext<GlobalState>()
  const { warehouse } = useLoaderData<typeof loader>();
  const { t } = useTranslation("common");
  const r = routes;
  const navItems = [
    {
      title: t("info"),
      href: r.toWarehouseInfo(warehouse?.name || "",warehouse?.uuid || ""),
    },
    {
      title: t("items"),
      href: r.toWarehouseItems(warehouse?.name || "",warehouse?.uuid || ""),
    },
  ];
  return (
   <DetailLayout 
   navItems={navItems}
   >
    <Outlet
    context={{
      warehouse:warehouse
    } as WarehouseGlobalState}
    />
    </DetailLayout>
  );
}
