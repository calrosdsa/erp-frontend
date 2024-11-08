import { ActionFunctionArgs, json, LoaderFunctionArgs } from "@remix-run/node";
import AccountsClient from "./warehouse-tree-view.client";
import apiClient from "~/apiclient";
import { DEFAULT_PAGE, DEFAULT_SIZE } from "~/constant";
import { components } from "~/sdk";
import WarehouseTreeViewClient from "./warehouse-tree-view.client";
import { handleError } from "~/util/api/handle-status-code";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const client = apiClient({ request });
  // const url = new URL(request.url)
  // const searchParams = url.searchParams
  const res = await client.GET("/stock/warehouse/view/tree");
  handleError(res.error)
  return json({
    data: res.data?.result,
    actions: res.data?.actions,
  });
};
export default function WarehouseTreeView() {
  return (
    <div>
      <WarehouseTreeViewClient />
    </div>
  );
}
