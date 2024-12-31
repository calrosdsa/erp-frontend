import { ActionFunctionArgs, json } from "@remix-run/node";
import NewPricingClient from "./new-pricing.client";
import apiClient from "~/apiclient";
import {
  mapPricingChargeData,
  mapPricingLineItemData,
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
      const pricingLineItems = data.pricingData.pricing_line_items.map((t) =>
        mapPricingLineItemData(t)
      );
      const pricingCharges = data.pricingData.pricing_charges.map((t) =>
        mapPricingChargeData(t)
      );
      const d = data.pricingData
      const res = await client.POST("/pricing", {
        body: {
          id:d.id || 0,
          pricing_data:{

          },
          project:d.projectID,
          cost_center:d.costCenterID,
          pricing_charges: pricingCharges,
          pricing_line_items: pricingLineItems,
        },
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
