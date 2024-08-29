import { ActionFunctionArgs, json, LoaderFunctionArgs } from "@remix-run/node";
import apiClient from "~/apiclient";
import ItemGroupsClient from "./item-groups.client";
import { DEFAULT_PAGE, DEFAULT_SIZE } from "~/constant";
import { createItemGroupSchema } from "~/util/data/schemas/stock/item-group-schema";
import { z } from "zod";
import { components } from "~/sdk";

type ActionData = {
  action: string;
  createItemGroup: z.infer<typeof createItemGroupSchema>;
  query:string
};
export const action = async ({ request }: ActionFunctionArgs) => {
  const client = apiClient({ request });
  const data = (await request.json()) as ActionData;
  let error: string | undefined = undefined;
  let message: string | undefined = undefined;
  let paginationResult: {
    readonly $schema?: string;
    pagination_result: components["schemas"]["PaginationResultListItemGroup"];
} | undefined = undefined
  console.log("DATA", data);
  switch (data.action) {
    case "add-item-group": {
      const res = await client.POST("/stock/item-group", {
        body: data.createItemGroup,
      });
      console.log("ERRORS", res.data?.errors);
      if (res.data) {
        message = res.data.message;
      }
      if (res.error) {
        error = res.error.detail;
      }
      break;
    }
    case "get": {
      const res = await client.GET("/stock/item-group",{
        params:{
          query:{
            page:DEFAULT_PAGE,
            size:DEFAULT_SIZE,
            query:data.query
          }
        }
      })
      paginationResult = res.data
      break;
    }
  }
  return json({
    error,
    message,
    paginationResult,
  });
};

// export const action = async({request}:ActionFunctionArgs)=>{
//     const data = await request.json()
//     const query = data.query
//     const res = await apiClient({ request }).GET("/stock/item-group", {
//       params: {
//         query: {
//           page: DEFAULT_PAGE,
//           size: DEFAULT_SIZE,
//           query:query
//         },
//       },
//     });
//     return json({
//       paginationResult: res.data,
//     });``
// }

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const query = url.searchParams.get("query") as string;
  const res = await apiClient({ request }).GET("/stock/item-group", {
    params: {
      query: {
        page: DEFAULT_PAGE,
        size: DEFAULT_SIZE,
        query: query,
      },
    },
  });
  return json({
    paginationResult: res.data,
  });
};

export default function ItemGroups() {
  return <ItemGroupsClient />;
}
