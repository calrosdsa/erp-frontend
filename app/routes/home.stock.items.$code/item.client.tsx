import { Outlet, useLoaderData, useParams } from "@remix-run/react";
import { loader } from "./route";
import ItemInfo from "./components/ItemInfo";
import ItemPrices from "../home.stock.items.$code.item-prices_/Item-detail-prices.client";
import { Separator } from "@/components/ui/separator";
import { components } from "index";
import HorizontalNavTabs from "@/components/layout/nav/horizontal-nav-tabs";
import { routes } from "~/util/route";
import { useTranslation } from "react-i18next";
import { ItemGlobalState } from "~/types/app";

export default function ItemDetailClient({
  data
}:{
  data:components["schemas"]["EntityResponseResultEntityItemBody"]
}) {

  const r = routes
  const params = useParams()
    const {t} = useTranslation("common")
    // const globalState = useOutletContext<GlobalState>()
    const tabNavItems = [
      {
        title: t("item-prices"),
        href: r.toItemDetailPrices(params.code || ""),
      },
      {
        title: t("_item.variants"),
        href: r.toItemDetailVariants(params.code || ""),
      },
      {
        title: t("stock"),
        href: r.toItemDetailStock(params.code || ""),
      },
    ];

  return (
    <div className="grid gap-y-5">
      {data?.result != undefined && <ItemInfo data={data.result.entity} />}


      <div className="py-2">
      <HorizontalNavTabs
      navItems={tabNavItems}
      />

      <div className="py-3">
      <Outlet
      context={
        {
          item:data.result.entity
        } as ItemGlobalState
      }
      />
      </div>

      </div>
      
      {/* <Separator/>
      <ItemPrices item={data.result.entity}/>
      <Separator/>
      
      <ItemVariants
      item={data.result.entity}
      /> */}

    </div>
  );
}
