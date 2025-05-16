import { LoaderFunctionArgs } from "@remix-run/node";
import apiClient from "~/apiclient";
import { DEFAULT_SIZE } from "~/constant";
import WorkSpaceClient from "./workspace.client";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const client = apiClient({ request });
  const url = new URL(request.url);
  const searchParams = url.searchParams;
  const res = await client.GET("/workspace", {
    params: {
      query: {
        size: searchParams.get("size") || DEFAULT_SIZE,
        column: searchParams.get("column") || undefined,
        order: searchParams.get("order") || undefined,
      },
    },
  });

  return {
    results: res.data?.result,
    actions: res.data?.actions,
  };
};

export default function Workspace() {
  return <WorkSpaceClient />;
}
