import { defer, json, LoaderFunctionArgs } from "@remix-run/node";
import ItemDetailClient from "./itemDetail.client";
import apiClient from "~/apiclient";
import { DEFAULT_PAGE, DEFAULT_SIZE } from "~/constant";
import { Await, useLoaderData } from "@remix-run/react";
import { Suspense } from "react";
import FallBack from "@/components/layout/Fallback";
import { components } from "~/sdk";


export const loader = async({request,params}:LoaderFunctionArgs) =>{
    const client = apiClient({request})
    const code = params.code
    const res = client.GET("/stock/item/{id}",{
        params:{
            path:{
                id:code || ""
            }
        }
    })

    const itemPrices = await client.GET("/stock/item/item-price/{itemCode}",{
        params:{
            query:{
                size:DEFAULT_SIZE,
                page:DEFAULT_PAGE,
            },
            path:{
                itemCode:code || ""
            }
        }
    })
    return defer({
        item:res,
        itemPrices:itemPrices.data
    })
}

export default function ItemDetail(){
    const { item, itemPrices } =
    useLoaderData<typeof loader>();
    return(
        <div>
            <Suspense fallback={<FallBack />}>
        <Await resolve={item}>
          {(item:any) => {
              return (
                  <div>
                    <ItemDetailClient
                    data={item.data as components["schemas"]["EntityResponseResultEntityItemBody"]}
                    />
                </div>
            )
          }}
        </Await>
      </Suspense>
      
        </div>
    )
}
