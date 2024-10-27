import { useLoaderData, useSearchParams } from "@remix-run/react"
import { loader } from "./route"
import ItemPriceInfo from "./components/ItemPriceInfo"
import { PluginApp } from "~/types/enums"
import { useTranslation } from "react-i18next"
import SquareItemPrice from "../home.stock.item-prices_/components/plugin/SquareItemPrice"
import { setUpToolbar } from "~/util/hooks/ui/useSetUpToolbar"
import DetailLayout from "@/components/layout/detail-layout"
import { routes } from "~/util/route"


export default function ItemPriceDetailClient(){
    const {activities,itemPrice} = useLoaderData<typeof loader>()
    const [searchParams] = useSearchParams()
    const tab = searchParams.get("tab")
    const {t} = useTranslation("common")
    const r = routes
    const tabs = [
        {
          title: t("info"),
          href: r.toItemPrice(itemPrice?.code || ""),
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

    setUpToolbar(()=>{
        return {
        }
    },[])
    return (
        <DetailLayout
        partyID={itemPrice?.id}
        activities={activities}
        navItems={tabs}
        >
            {tab == "info" &&
            <ItemPriceInfo
            />
        }
            </DetailLayout>
    )
}