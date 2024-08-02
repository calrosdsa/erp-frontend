import { ActionFunctionArgs, json } from "@remix-run/node";
import apiClient from "~/apiclient";
import { DEFAULT_SIZE } from "~/constant";
import { components } from "~/sdk";

type PriceListAction = {
  action: string;
  query: string;
  page?: string;
  size?: string;
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const data = (await request.json()) as PriceListAction;
  let client = apiClient({ request });
  let pagination_result:
    | components["schemas"]["PaginationResultListItemPriceList"]
    | undefined = undefined;
  switch (data.action) {
    case "get": {
      const res = await client.GET("/stock/item/price-list", {
        params: {
          query: {
            query: data.query,
            page: data.page || "1",
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
  });
};
