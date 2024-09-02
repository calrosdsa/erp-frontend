import { z } from "zod";
import PriceListsClient from "./price-list.client";
import { ActionFunctionArgs, json, LoaderFunctionArgs } from "@remix-run/node";
import apiClient from "~/apiclient";
import { DEFAULT_PAGE, DEFAULT_SIZE } from "~/constant";
import { components } from "index";
import { createPriceListSchema } from "~/util/data/schemas/stock/price-list-schema";

type PriceListAction = {
  action: string;
  query: string;
  page?: string;
  size?: string;
  createPriceList:z.infer<typeof createPriceListSchema>
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const data = (await request.json()) as PriceListAction;
  let client = apiClient({ request });
  let message:string | undefined = undefined
  let error:string |undefined = undefined
  let pagination_result:
    | components["schemas"]["PaginationResultListItemPriceList"]
    | undefined = undefined;
  switch (data.action) {
    case "add-price-list":{
      const res = await client.POST("/stock/item/price-list",{
        body:data.createPriceList
      })
      message = res.data?.message
      error = res.error?.detail
      break;
    }
    case "get": {
      const res = await client.GET("/stock/item/price-list", {
        params: {
          query: {
            query: data.query,
            page: data.page || DEFAULT_PAGE,
            size: data.size || DEFAULT_SIZE,
          },
        },
      });
      if (res.data != undefined) {
        pagination_result = res.data.pagination_result;
      }
      console.log(res.error)
      break;
    }
  }
  return json({
    pagination_result,
    message,error
  });
};



export const loader = async({request}:LoaderFunctionArgs) =>{
    const client = apiClient({request});
    const url = new URL(request.url)
    const searchParams = url.searchParams
    const res = await client.GET("/stock/item/price-list",{
        params:{
            query:{
                page:searchParams.get("page") || DEFAULT_PAGE,
                size:searchParams.get("size") || DEFAULT_SIZE
            }
        }
    })
    return json({
        data:res.data
    })
}

export default function PriceLists(){
    return(
        <PriceListsClient/>
    )
}