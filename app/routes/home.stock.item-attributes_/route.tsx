import { ActionFunctionArgs, json, LoaderFunctionArgs } from "@remix-run/node";
import ItemAttributesClient from "./item-attributes.client";
import apiClient from "~/apiclient";
import { DEFAULT_PAGE, DEFAULT_SIZE } from "~/constant";
import { components } from "index";

type PriceListAction = {
    action: string;
    query: string;
  };
  
  export const action = async ({ request }: ActionFunctionArgs) => {
    const data = (await request.json()) as PriceListAction;
    let client = apiClient({ request });
    let pagination_result:
      | components["schemas"]['PaginationResultListItemAttribute']
      | undefined = undefined;
    switch (data.action) {
      case "get": {
        const res = await client.GET("/stock/item/item-attribute", {
          params: {
            query: {
              query: data.query,
              page:  DEFAULT_PAGE,
              size:  DEFAULT_SIZE,
            },
          },
        });
        if (res.data != undefined) {
          pagination_result = res.data.pagination_result;
        }
        console.log("FAIL ITEM ATTRIBUTES",res.error)
        break;
      }
    }
    return json({
      pagination_result,
    });
  };
  
  


export const loader = async({request}:LoaderFunctionArgs) =>{
    const url = new URL(request.url)
    const params = url.searchParams
    const client = apiClient({request})
    const res = await client.GET("/stock/item/item-attribute",{
        params:{
            query:{
                page:params.get("page") || DEFAULT_PAGE,
                size:params.get("size") || DEFAULT_SIZE,
            }
        }
    })

    return json({
        pagination_result:res.data?.pagination_result
    })
}

export default function ItemAttributes(){


    return (
        <div>
            <ItemAttributesClient/>
        </div>
    )
}