import { useLoaderData } from "@remix-run/react"
import { loader } from "./route"
import ItemPriceInfo from "./components/ItemPriceInfo"
import { PluginApp } from "~/types/enums"
import SquareItemPrice from "../home.stock.item-prices/components/plugin/SquareItemPrice"
import { useTranslation } from "react-i18next"


export default function ItemPriceDetailClient(){
    const {itemPriceData} = useLoaderData<typeof loader>()

    return (
        <div className="grid gap-y-5">
            {/* {JSON.stringify({itemPrice})} */}
            <ItemPriceInfo
            />

            {itemPriceData.result.entity.ItemPricePlugin.map((item,idx)=>{
                return (
                    <div key={idx}>
                        {item.Plugin == PluginApp.SQUARE &&
                        <SquareItemPrice
                        data={item.Data}
                        />
                        }
                    </div>
                )
            })}
        </div>
    )
}