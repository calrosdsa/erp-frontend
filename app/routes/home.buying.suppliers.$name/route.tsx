import { json, LoaderFunctionArgs } from "@remix-run/node"
import apiClient from "~/apiclient"
import SupplierClient from "./supplier.client";


export const loader = async({request}:LoaderFunctionArgs) =>{
    const client = apiClient({request});
    const url = new URL(request.url);
    const searchParams = url.searchParams;
    const res = await client.GET("/supplier/detail/{id}",{
        params:{
            path:{
                id:searchParams.get("id")|| "",
            }
        }
    })

    return json({
        supplier:res.data?.result.entity,
        actions:res.data?.actions,
        addresses:res.data?.result.addresses,
        contacts:res.data?.result.contacts,
    })
}

export default function Supplier(){
    return (
        <SupplierClient/>
    )
}