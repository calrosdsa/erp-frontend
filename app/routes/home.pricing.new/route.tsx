import { ActionFunctionArgs, json } from "@remix-run/node";
import NewPricingClient from "./new-pricing.client";
import apiClient from "~/apiclient";
import {
  mapPricingChargeData,
  mapPricingLineItemData,
  mapToPricingData,
  pricingDataSchema,
} from "~/util/data/schemas/pricing/pricing-schema";
import { z } from "zod";
import { components } from "~/sdk";

type ActionData = {
  action: string;
  pricingData: z.infer<typeof pricingDataSchema>;
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const client = apiClient({ request });
  const data = (await request.json()) as ActionData;
  let message: string | undefined = undefined;
  let error: string | undefined = undefined;
  let pricing: components["schemas"]["PricingDto"] | undefined = undefined;
  switch (data.action) {
    case "create": {
      const res = await client.POST("/pricing", {
        body: mapToPricingData(data.pricingData)
      });
      message = res.data?.message;
      error = res.error?.detail;
      pricing = res.data?.result
      console.log("ERROR",res.error)
      break;
    }
  }
  return json({
    message,
    error,
    pricing,
  });
};

export default function NewPricing() {
  return <NewPricingClient />;
}
