    import { json, LoaderFunctionArgs } from "@remix-run/node";
    import apiClient from "~/apiclient";
    import { PartyType } from "~/types/enums";
    import SupplierGroupClient from "./supplier-group.client";


    export const loader = async({request}:LoaderFunctionArgs)=>{
        const client = apiClient({request})
        const url = new URL(request.url)
        const searchParams = url.searchParams
        const res = await client.GET("/group/detail/{id}",{
            params:{
                path:{
                    id:searchParams.get("id") || ""
                },
                query:{
                    party:PartyType.PARTY_SUPPLIER_GROUP
                }
            }
        })
        const resDescendents = await client.GET("/group/descendents/{id}",{
            params:{
                path:{
                    id:searchParams.get("id") || "",
                }
            }
        })
        return json({
            group:res.data?.result.entity,
            groupDescendents:resDescendents.data?.result.entity,
            actions:res.data?.actions
        })
    }

    export default function GroupClient(){
        return <SupplierGroupClient/>
    }