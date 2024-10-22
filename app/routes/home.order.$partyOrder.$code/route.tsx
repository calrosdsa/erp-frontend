import { ActionFunctionArgs, defer, json, LoaderFunctionArgs } from "@remix-run/node"
import PurchaseOrderClient from "./order.client"
import apiClient from "~/apiclient"
import { PartyType, regatePartyTypeToJSON } from "~/gen/common"
import { updateStateWithEventSchema } from "~/util/data/schemas/base/base-schema"
import { z } from "zod"
import { FetchResponse } from "openapi-fetch"

type ActionData = {
    action:string
    updateStatusWithEvent:z.infer<typeof updateStateWithEventSchema>
}
export const action = async({request}:ActionFunctionArgs)=>{
    const client = apiClient({request})
    const data = await request.json() as ActionData
    let message:string | undefined= undefined
    let error:string | undefined = undefined
    switch(data.action){
        case "update-status-with-event":{
            const res=  await client.PUT("/order/update-status",{
                body:data.updateStatusWithEvent
            })
            message = res.data?.message
            error = res.error?.detail
            console.log("ORDER ",res.error)
            break;
        }
    }
    return json({
        message,error
    })
}

export const loader = async ({request,params}:LoaderFunctionArgs)=>{
    const client = apiClient({request})
    const url = new URL(request.url)
    const searchParams = url.searchParams
    const tab = searchParams.get("tab")
    let resConnections: Promise<FetchResponse<any, any, any>> | undefined =
    undefined;
    const res = await client.GET("/order/detail/{id}",{
        params:{
            path:{
                id:params.code ||  ""
            },
            query:{
                party:params.partyOrder || ""
            }
        }
    })
    if (res.data) {
        switch (tab) {
          case "connections": {
            resConnections  = client.GET("/party/connections/{id}", {
              params: {
                path: {
                  id: res.data.result.entity.id.toString(),
                },
                query: {
                  party: params.partyOrder || "",
                },
              },
            });
            // console.log(resConnection.data,resConnection.error)
            break
          }
        }
      }
    // res.data?.related_actions
    return defer({
        actions:res.data?.actions,
        order:res.data?.result.entity,
        associatedActions:res.data?.associated_actions,
        connections:resConnections,
        activities:res.data?.result.activities,
    })
}

export default function PurchaseOrder(){
    return <PurchaseOrderClient/>
}