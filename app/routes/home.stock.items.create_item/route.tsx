import { ActionFunctionArgs, json, redirect } from "@remix-run/node";
import CreateItemClient from "./item-create.client";
import apiClient from "~/apiclient";
import { routes } from "~/util/route";
import { components } from "~/sdk";
import { z } from "zod";
import { createItemSchema } from "~/util/data/schemas/stock/item-schemas";
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
    const r = routes
    switch(data.action) {
        case "create-item":{
            const d = data.createItem
            const res = await client.POST("/stock/item",{
                body:{
                    name:d.name,
                    uom:uomDtoSchemaToUomDto(d.uom),
                    group:groupSchemaToGroupDto(d.group)
                }
            })
            if(res.data){
                return redirect(r.toItemDetail(res.data.result.name,res.data.result.uuid))
            }
            error = res.error?.detail
            break;
        }
    }
    return json({
        error
    })
}

export default function CreateItem(){

    return (
        <CreateItemClient/>
    )
}