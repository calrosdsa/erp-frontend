import { ActionFunctionArgs, json, LoaderFunctionArgs } from "@remix-run/node";
import apiClient from "~/apiclient";
import ItemGroupsClient from "./itemGroups.client";
import { DEFAULT_SIZE } from "~/constant";


export const action = async({request}:ActionFunctionArgs)=>{
    const data = await request.json()
    const query = data.query
    const res = await apiClient({ request }).GET("/stock/item-group", {
      params: {
        query: {
          page: "1",
          size: DEFAULT_SIZE,
          query:query
        },
      },
    });
    return json({
      paginationResult: res.data,
    });
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
    const url = new URL(request.url)
    const query = url.searchParams.get("query") as string
    const res = await apiClient({ request }).GET("/stock/item-group", {
      params: {
        query: {
          page: "1",
          size: "1",
          query:query
        },
      },
    });
    return json({
      paginationResult: res.data,
    });
  };


export default function ItemGroups(){
    return (
       <ItemGroupsClient/>
    )
}