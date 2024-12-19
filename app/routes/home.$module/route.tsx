import { json, LoaderFunctionArgs } from "@remix-run/node";
import apiClient from "~/apiclient";
import { handleError } from "~/util/api/handle-status-code";
import ModuleClient from "./module.client";

export const loader = async ({ request,params }: LoaderFunctionArgs) => {
  const client = apiClient({ request });
  const url = new URL(request.url);
  const searchParams = url.searchParams;
  const tab = searchParams.get("tab");
  const res = await client.GET("/module/detail/{id}", {
    params: {
      path: {
        id: params.module || "",
      },
    },
  });
  handleError(res.error);
  return json({
    module: res.data?.result.entity,
    actions: res.data?.actions,
  });
};


export default function Module() {
  return <ModuleClient/>
}
