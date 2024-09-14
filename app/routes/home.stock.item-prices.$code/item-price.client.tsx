import { useLoaderData } from "@remix-run/react"
import { loader } from "./route"
import ItemPriceInfo from "./components/ItemPriceInfo"
import { PluginApp } from "~/types/enums"
import { useTranslation } from "react-i18next"
import SquareItemPrice from "../home.stock.item-prices_/components/plugin/SquareItemPrice"


export default function ItemPriceDetailClient(){
    return (
        <div className="grid gap-y-5">
            {/* {JSON.stringify({itemPrice})} */}
            <ItemPriceInfo
            />
            {/* {itemPriceData.result.entity.ItemPricePlugin.map((item,idx)=>{
                return (
                    <div key={idx}>
                        {item.Plugin == PluginApp.SQUARE &&
                        <SquareItemPrice
                        data={item.Data}
                        />
                        }
                    </div>
                )
            })} */}
        </div>
    )
}