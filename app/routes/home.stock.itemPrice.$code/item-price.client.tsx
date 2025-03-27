import { useLoaderData, useSearchParams } from "@remix-run/react";
import { loader } from "./route";
import ItemPriceInfo from "./components/Item-price-info";
import { Entity, PluginApp } from "~/types/enums";
import { useTranslation } from "react-i18next";
import {
  setUpToolbar,
  setUpToolbarRegister,
} from "~/util/hooks/ui/useSetUpToolbar";
import DetailLayout from "@/components/layout/detail-layout";
import { route } from "~/util/route";
import { party } from "~/util/party";

export default function ItemPriceDetailClient() {
  const { activities, itemPrice } = useLoaderData<typeof loader>();
  const [searchParams] = useSearchParams();
  const tab = searchParams.get("tab");
  const { t } = useTranslation("common");
  const r = route;
  const tabs = [
    {
      title: t("info"),
      href: r.toRouteDetail(route.itemPrice,itemPrice?.item_name || "",{
        tab:"info",
        id:itemPrice?.id.toString() || "",
      }),
    },
    // {
    //   title: t("stock"),
    //   href: r.toItemDetailStock(item?.name || "", item?.uuid || ""),
    // },
    // {
    //   title: t("_item.variants"),
    //   href: r.toItemDetailVariants(item?.name || "", item?.uuid || ""),
    // },
  ];

  setUpToolbarRegister(() => {
    return {
      titleToolbar: itemPrice?.item_name,
    };
  }, []);
  return (
    <DetailLayout
      entityID={Entity.ITEM_PRICE}
      partyName={itemPrice?.item_name}
      partyID={itemPrice?.id}
      activities={activities}
      navItems={tabs}
    >
      {tab == "info" && <ItemPriceInfo />}
    </DetailLayout>
  );
}
