import { ActionFunctionArgs, json, LoaderFunctionArgs } from "@remix-run/node"
import apiClient from "~/apiclient"
import { DEFAULT_PAGE, DEFAULT_SIZE } from "~/constant"
import { handleError } from "~/util/api/handle-status-code"
import AddressesClient from "./addresses.client"
import { components, operations } from "~/sdk"

type ActionData = {
    action:string
    query:operations["get-addresses"]["parameters"]["query"]
}

export const action = async({request}:ActionFunctionArgs) =>{
    const client = apiClient({request})
    const data = await request.json() 
    let results:components["schemas"]["AddressDto"][] = []
    let actions:components["schemas"]["ActionDto"][] = []
    switch (data.action) {
      case "get": {
        const res = await client.GET("/address", {
          params: {
            query: data.query
          },
        });
        results = res.data?.result || []
        actions = res.data?.actions || []
        break;
      }
    }
  //   handleError(res.error);
    return json({
      results,
      actions,
    });
}


export const loader = async({request}:LoaderFunctionArgs)=>{
    const client = apiClient({request})
    const url = new URL(request.url)
    const searchParams = url.searchParams
    const res = await client.GET("/address",{
        params:{
            query:{
                size:searchParams.get("size") || DEFAULT_SIZE,
                query:searchParams.get("query") || "",
            }
        }
    })
    console.log(res.data,res.error)
    handleError(res.error)
    return json({
        paginationResult:res.data?.result,
        actions:res.data?.actions,
    })
}

export default function Addresses(){
    return (
        <div>
            <AddressesClient/>
        </div>
    )
}