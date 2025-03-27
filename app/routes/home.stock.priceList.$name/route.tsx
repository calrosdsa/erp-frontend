import { ActionFunctionArgs, json, LoaderFunctionArgs } from "@remix-run/node";
import apiClient from "~/apiclient";
import PriceListDetailClient from "./price-list-detail.client";
import { handleError } from "~/util/api/handle-status-code";
import { z } from "zod";
import { editPriceListSchema } from "~/util/data/schemas/stock/price-list-schema";
import { ShouldRevalidateFunctionArgs } from "@remix-run/react";
import { LOAD_ACTION } from "~/constant";

type ActionData = {
  action: string;
  editData: z.infer<typeof editPriceListSchema>;
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const client = apiClient({ request });
  const data = (await request.json()) as ActionData;
  let message: string | undefined = undefined;
  let error: string | undefined = undefined;
  let actionRes = LOAD_ACTION;

  switch (data.action) {
    case "edit": {
      const d = data.editData;
      const res = await client.PUT("/stock/item/price-list", {
        body: {
          id: d.id,
          name: d.name,
          isBuying: d.isBuying,
          isSelling: d.isSelling,
          currency: d.currency,
        },
      });
      error = res.error?.detail;
      message = res.data?.message;
      actionRes = "";
      break;
    }
  }
  return json({
    error,
    message,
    action: actionRes,
  });
};

export function shouldRevalidate({
  formMethod,
  defaultShouldRevalidate,
  actionResult,
}: ShouldRevalidateFunctionArgs) {
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
  const res = await client.GET("/stock/item/price-list/detail/{id}", {
    params: {
      path: {
        id: searchParams.get("id") || "",
      },
    },
  });
  console.log(res.error);
  handleError(res.error);
  return json({
    priceList: res.data?.result.entity,
    actions: res.data?.actions,
    activities:res.data?.result.activities,
  });
};
export default function PriceListDetail() {
  return <PriceListDetailClient />;
}
