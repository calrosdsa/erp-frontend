import { json, LoaderFunctionArgs } from "@remix-run/node";
import apiClient from "~/apiclient";
import CostCenterDetailClient from "./cost-center-detail.client";
import { handleError } from "~/util/api/handle-status-code";
import { ShouldRevalidateFunctionArgs } from "@remix-run/react";
import { LOAD_ACTION } from "~/constant";



export function shouldRevalidate({
  formMethod,
  defaultShouldRevalidate,
  actionResult
}:ShouldRevalidateFunctionArgs) {
  if (actionResult?.action == LOAD_ACTION) {
    return defaultShouldRevalidate;
  }
  if (formMethod === "POST") {
    return false;
  }
  return defaultShouldRevalidate;
}

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const client = apiClient({ request });
  const url = new URL(request.url);
  const searchParams = url.searchParams;
  const res = await client.GET("/cost-center/detail/{id}", {
    params: {
      path: {
        id: searchParams.get("id") || "",
      },
    },
  });
  handleError(res.error);
  return json({
    costCenter: res.data?.result.entity,
    activities:res.data?.result.activities,
  });
};

export default function CostCenterDetail() {
  return <CostCenterDetailClient />;
}
