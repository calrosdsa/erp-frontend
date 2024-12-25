import { ActionFunctionArgs, json, LoaderFunctionArgs } from "@remix-run/node"
import PricingDetailClient from "./pricing-detail.client"
import apiClient from "~/apiclient"
import { handleError } from "~/util/api/handle-status-code"
import { ShouldRevalidateFunctionArgs } from "@remix-run/react";
import { LOAD_ACTION } from "~/constant";
import { z } from "zod";
import { editPricingSchema, mapPricingChargeData, mapPricingLineItemData } from "~/util/data/schemas/pricing/pricing-schema";
import { updateStatusWithEventSchema } from "~/util/data/schemas/base/base-schema";



type ActionData = {
    action: string;
    editData: z.infer<typeof editPricingSchema>;
    updateStatus:z.infer<typeof updateStatusWithEventSchema>
  };
  export const action = async ({ request }: ActionFunctionArgs) => {
    const client = apiClient({ request });
    const data = (await request.json()) as ActionData;
    let message: string | undefined = undefined;
    let error: string | undefined = undefined;
    let actionRes = LOAD_ACTION
    console.log("EDIT DATA", data.editData);
    switch (data.action) {
      case "update-status":{
        const res = await client.PUT("/pricing/update-status", {
          body: data.updateStatus,
        });
        message = res.data?.message;
        error = res.error?.detail;
        break;
      }
      case "edit": {
        const d = data.editData;
        const pricingLineItems = d.pricing_line_items.map((t) =>
            mapPricingLineItemData(t)
          );
          const pricingCharges = d.pricing_charges.map((t) =>
            mapPricingChargeData(t)
          );
        const res = await client.PUT("/pricing", {
          body: {
            id: d.id || 0,
            pricing_charges:pricingCharges,
            pricing_line_items:pricingLineItems,
          },
        });
        error = res.error?.detail;
        message = res.data?.message;
        break;
      }
    }
    return json({
      error,
      message,
      action:actionRes,
    });
  };
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

export const loader = async({request,params}:LoaderFunctionArgs) =>{
    const client = apiClient({request})
    const res =await client.GET("/pricing/detail/{id}",{
        params:{
            path:{
                id:params.code || ""
            }
        }
    })
    handleError(res.error)
    return json({
        pricing:res.data?.result.entity.pricing,
        // actions:res.data?.actions,
        activities:res.data?.result.activities,
        pricingLines:res.data?.result.entity.pricing_line_items || [],
        pricingCharges:res.data?.result.entity.pricing_charges || [],
        actions:res.data?.associated_actions,
    })
}

export default function PricingDetail(){
    return (
        <PricingDetailClient/>
    )
}