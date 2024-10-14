import { ActionFunctionArgs, json, LoaderFunctionArgs } from "@remix-run/node";
import CourtClient from "./courts.cliet";
import apiClient from "~/apiclient";
import { DEFAULT_PAGE, DEFAULT_SIZE } from "~/constant";
import { handleError } from "~/util/api/handle-status-code";
import { components } from "~/sdk";

type ActionData = {
    action: string;
    query: string;
  };
  export const action = async ({ request }: ActionFunctionArgs) => {
    const client = apiClient({ request });
    const data = (await request.json()) as ActionData;
    let message: string | undefined = undefined;
    let error: string | undefined = undefined;
    let courts: components["schemas"]["CourtDto"][] = [];
    let actions: components["schemas"]["ActionDto"][] = [];
    switch (data.action) {
      case "get": {
        const res = await client.GET("/court", {
          params: {
            query: {
              page: DEFAULT_PAGE,
              size: DEFAULT_SIZE,
              query: data.query || "",
            },
          },
        });
        courts = res.data?.pagination_result.results || [];
        actions = res.data?.actions || [];
        break;
      }
     
    }
    return json({
      message,
      error,
      courts,
      actions,
    });
  };
  

export const loader = async({request}:LoaderFunctionArgs)=>{
    const client = apiClient({request})
    const url = new URL(request.url)
    const searchParams= url.searchParams
    const res = await client.GET("/court",{
        params:{
            query:{
                page:searchParams.get("page") || DEFAULT_PAGE,
                size:searchParams.get("size") ||DEFAULT_SIZE,
                query:searchParams.get("query") || "",
            }
        }
    })
    handleError(res.error)
    return json({
        paginationResult:res.data?.pagination_result,
        actions:res.data?.actions
    })
}

export default function Court(){
    return  <CourtClient/>
}