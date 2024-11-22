import { defer, json, LoaderFunctionArgs } from "@remix-run/node"
import CustomerClient from "./customer.client"
import apiClient from "~/apiclient"
import { FetchResponse } from "openapi-fetch"
import { handleError } from "~/util/api/handle-status-code"
import { PartyType, partyTypeToJSON } from "~/gen/common"


export const loader = async({request,params}:LoaderFunctionArgs) =>{
    const client = apiClient({request})
    const url = new URL(request.url)
    const searchParams = url.searchParams
    const tab = searchParams.get("tab");
    let resConnections: Promise<FetchResponse<any, any, any>> | undefined =
      undefined;
    const res = await client.GET("/customer/detail/{id}",{
        params:{
            path:{
                id:params.name || ""
            }
        }
    })
    handleError(res.error)
    if (res.data) {
        switch (tab) {
          case "connections": {
            resConnections  = client.GET("/party/connections/{id}", {
              params: {
                path: {
                  id: res.data.result.entity.id.toString(),
                },
                query: {
                  party: partyTypeToJSON(PartyType.customer),
                },
              },
            });
            // console.log(resConnection.data,resConnection.error)
            break
          }
        }
      }
    return defer({
        customer:res.data?.result.entity,
        actions:res.data?.actions,
        addresses:res.data?.result.addresses || [],
        contacts:res.data?.result.contacts || [],
        activities:res.data?.result.activities || [],
        connections:resConnections,
    })
}

export default function Customer(){
    return <CustomerClient/>
}