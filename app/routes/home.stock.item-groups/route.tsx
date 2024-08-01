import { ActionFunctionArgs, json, LoaderFunctionArgs } from "@remix-run/node";
import apiClient from "~/apiclient";
import ItemGroupsClient from "./itemGroups.client";


export const action = async({request}:ActionFunctionArgs)=>{
    const data = await request.json()
    const query = data.query
    const res = await apiClient({ request }).GET("/stock", {
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
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
    const url = new URL(request.url)
    const query = url.searchParams.get("query") as string
    console.log(query)
    const res = await apiClient({ request }).GET("/stock", {
      params: {
        query: {
          page: "1",
          size: "1",
          query:query
        },
      },
    });
    console.log("data", res.error, res.data?.pagination_result);
    return json({
      paginationResult: res.data,
    });
  };


export default function ItemGroups(){
    return (
       <ItemGroupsClient/>
    )
}