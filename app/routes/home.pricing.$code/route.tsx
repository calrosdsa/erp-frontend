import {
  ActionFunctionArgs,
  defer,
  json,
  LoaderFunctionArgs,
} from "@remix-run/node";
import PricingDetailClient from "./pricing-detail.client";
import apiClient from "~/apiclient";
import { handleError } from "~/util/api/handle-status-code";
import { ShouldRevalidateFunctionArgs } from "@remix-run/react";
import { LOAD_ACTION } from "~/constant";
import { z } from "zod";
import {
  mapPricingChargeData,
  mapPricingLineItemData,
  mapToPricingData,
  pricingDataSchema,
} from "~/util/data/schemas/pricing/pricing-schema";
import { updateStatusWithEventSchema } from "~/util/data/schemas/base/base-schema";
import { components } from "~/sdk";
import { FetchResponse } from "openapi-fetch";
import { PartyType, partyTypeFromJSON, partyTypeToJSON } from "~/gen/common";

type ActionData = {
  action: string;
  editData: z.infer<typeof pricingDataSchema>;
  updateStatus: z.infer<typeof updateStatusWithEventSchema>;
  pricingData: components["schemas"]["PricingDataRequestBody"];
};
export const action = async ({ request }: ActionFunctionArgs) => {
  const client = apiClient({ request });
  const data = (await request.json()) as ActionData;
  let message: string | undefined = undefined;
  let error: string | undefined = undefined;
  let actionRes = LOAD_ACTION;
  switch (data.action) {
    case "generate-po": {
      const res = await client.POST("/pricing/generate-po", {
        body: data.pricingData,
      });
      message = res.data?.message;
      error = res.error?.detail;
      console.log(res.error);
      break;
    }
    case "generate-quotation": {
      const res = await client.POST("/pricing/generate-quotation", {
        body: data.pricingData,
      });
      message = res.data?.message;
      error = res.error?.detail;
      console.log(res.error);
      break;
    }
    case "update-status": {
      const res = await client.PUT("/pricing/update-status", {
        body: data.updateStatus,
      });
      message = res.data?.message;
      error = res.error?.detail;
      break;
    }
    case "edit": {
      const res = await client.PUT("/pricing", {
        body: mapToPricingData(data.editData)
      });
      error = res.error?.detail;
      message = res.data?.message;
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
  const tab = searchParams.get("tab");
  let resConnections: Promise<FetchResponse<any, any, any>> | undefined =
    undefined;
  const res = await client.GET("/pricing/detail/{id}", {
    params: {
      path: {
        id: params.code || "",
      },
    },
  });
  handleError(res.error);
  if (res.data) {
    switch (tab) {
      case "connections": {
        resConnections = client.GET("/party/connections/{id}", {
          params: {
            path: {
              id: res.data.result.entity.pricing.id.toString(),
            },
            query: {
              party: partyTypeToJSON(PartyType.pricing) || "",
            },
          },
        });
        console.log("RES Connection...");
        break;
      }
    }
  }

  return defer({
    pricing: res.data?.result.entity.pricing,
    // actions:res.data?.actions,
    activities: res.data?.result.activities,
    pricingLines: res.data?.result.entity.pricing_line_items || [],
    pricingCharges: res.data?.result.entity.pricing_charges || [],
    actions: res.data?.associated_actions,
    connections: resConnections,
  });
};

export default function PricingDetail() {
  return <PricingDetailClient />;
}
