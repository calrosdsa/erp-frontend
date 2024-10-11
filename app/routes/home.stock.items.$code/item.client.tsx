import {
  Outlet,
  useLoaderData,
  useOutletContext,
  useParams,
} from "@remix-run/react";
import { loader } from "./route";
import ItemInfo from "./components/ItemInfo";
import ItemPrices from "../home.stock.items.$code.item-prices_/Item-detail-prices.client";
import { Separator } from "@/components/ui/separator";
import HorizontalNavTabs from "@/components/layout/nav/horizontal-nav-tabs";
import { routes } from "~/util/route";
import { useTranslation } from "react-i18next";
import { GlobalState, ItemGlobalState } from "~/types/app";
import { components } from "~/sdk";

export default function ItemDetailClient() {
  const r = routes;
  const params = useParams();
  const { item } = useLoaderData<typeof loader>();
  const { t } = useTranslation("common");
  const globalState = useOutletContext<GlobalState>();
  const tabNavItems = [
    {
      title: t("item-prices"),
      href: r.toItemDetailPrices(item?.name || "", item?.uuid || ""),
    },
    {
      title: t("stock"),
      href: r.toItemDetailStock(item?.name || "", item?.uuid || ""),
    },
    {
      title: t("_item.variants"),
      href: r.toItemDetailVariants(item?.name || "", item?.uuid || ""),
    },
  ];

  return (
    <div className="grid gap-y-5">
      {item != undefined && <ItemInfo data={item} />}

      <div className="py-2">
        <HorizontalNavTabs navItems={tabNavItems} />

        <div className="py-3">
          <Outlet
            context={
              {
                item: item,
                globalState: globalState,
              } as ItemGlobalState
            }
          />
        </div>
      </div>
    </div>
  );
}
