import { ActionFunctionArgs, json, LoaderFunctionArgs } from "@remix-run/node";
import AccountsClient from "./accounts-tree-view.client";
import apiClient from "~/apiclient";
import { DEFAULT_PAGE, DEFAULT_SIZE } from "~/constant";
import { components } from "~/sdk";
import AccountsTreeViewClient from "./accounts-tree-view.client";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const client = apiClient({ request });
  // const url = new URL(request.url)
  // const searchParams = url.searchParams
  const res = await client.GET("/ledger/view/tree");
  console.log(res.error);
  return json({
    data: res.data?.result,
    actions: res.data?.actions,
  });
};
export default function AccountsTreeView() {
  return (
    <div>
      <AccountsTreeViewClient />
    </div>
  );
}
