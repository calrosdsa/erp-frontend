import { ActionFunctionArgs, json, LoaderFunctionArgs } from "@remix-run/node";
import ItemAttributesClient from "./item-attributes.client";
import apiClient from "~/apiclient";
import { DEFAULT_PAGE, DEFAULT_SIZE } from "~/constant";
import { components } from "~/sdk";

type PriceListAction = {
    action: string;
    query: string;
  };
  
  export const action = async ({ request }: ActionFunctionArgs) => {
    const data = (await request.json()) as PriceListAction;
    let client = apiClient({ request });
    let itemAttributes:components["schemas"]["ItemAttributeDto"][] = []
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
          itemAttributes = res.data.pagination_result.results || [];
        }
        break;
      }
    }
    return json({
      itemAttributes,
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
        paginationResult:res.data?.pagination_result,
        actions:res.data?.actions
    })
}

export default function ItemAttributes(){


    return (
        <div>
            <ItemAttributesClient/>
        </div>
    )
}