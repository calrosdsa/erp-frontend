import { json, LoaderFunctionArgs } from "@remix-run/node";
import apiClient from "~/apiclient";
import ItemPriceDetailClient from "./item-price.client";
import { handleError } from "~/util/api/handle-status-code";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const client = apiClient({ request });
  const url = new URL(request.url);
  const searchParams = url.searchParams;
  const res = await client.GET("/stock/item/item-price/detail/{id}", {
    params: {
      path: {
        id: searchParams.get("id") || "",
      },
    },
  });
  handleError(res.error);
  console.log(res.data, res.error);
  return json({
    itemPrice: res.data?.result.entity,
    actions: res.data?.actions,
    activities: res.data?.result.activities || [],
    associatedActions: res.data?.associated_actions,
  });
};

export default function ItemPriceDetail() {
  return (
    <div>
      {/* asdmask */}
      <ItemPriceDetailClient />
    </div>
  );
}
