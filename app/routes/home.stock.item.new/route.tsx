import { ActionFunctionArgs, json, LoaderFunctionArgs, redirect } from "@remix-run/node";
import NewItemClient from "./new-item.client";
import apiClient from "~/apiclient";
import { routes } from "~/util/route";
import { components } from "~/sdk";
import { z } from "zod";
import { createItemSchema, mapToItemPriceLine } from "~/util/data/schemas/stock/item-schemas";
import { uomDtoSchemaToUomDto } from "~/util/data/schemas/setting/uom-schema";
import { groupSchemaToGroupDto } from "~/util/data/schemas/group-schema";


type ActionData = {
    action:string
    createItem:z.infer<typeof createItemSchema>
}
export const action = async({request}:ActionFunctionArgs)=>{
    const client = apiClient({request})
    const data = await request.json() as ActionData
    let message:string | undefined = undefined
    let error:string | undefined = undefined 
    let item:components["schemas"]["ItemDto"] | undefined =  undefined
    switch(data.action) {
        case "create-item":{
            const d = data.createItem
            // console.log("DATA NAME",d.name)
            // console.log("DATA",typeof d.itemPriceLines)
            const itemPriceLines = d.itemPriceLines.map(t=>mapToItemPriceLine(t))
            // console.log("DATA",itemPriceLines)
            const res = await client.POST("/stock/item",{
                body:{
                    item:{
                        name:d.name,
                        uom_id:d.uomID,
                        group_id:d.groupID,
                        description:d.description,
                        maintain_stock:d.maintainStock,
                        item_code:d.code,
                    },
                    item_price_lines:itemPriceLines,
                    item_inventory:{
                        has_serial_no: d.itemInventory?.hasSerialNo,
                        serial_no_template: d.itemInventory?.serialNoTemplate,
                        shelf_life_in_days: d.itemInventory?.shelfLifeInDays,
                        warranty_period_in_days: d.itemInventory?.warrantyPeriodInDays,
                        weight_uom_id: d.itemInventory?.weightUomID,
                        wight_per_unit: d.itemInventory?.wightPerUnit
                    }
                }
            })
            console.log(res.error)
            message = res.data?.message
            error = res.error?.detail
            item = res.data?.result
            break;
        }
    }
    return json({
        error,message,item
    })
}

export const loader = async({request}:LoaderFunctionArgs) =>{
    const client = apiClient({request})
    const res = await client.GET("/stock/item/actions")
    return json({
        actions:res.data?.actions,
        entityActions:res.data?.associated_actions,
    })
}

export default function NewItem(){

    return (
        <NewItemClient/>
    )
}