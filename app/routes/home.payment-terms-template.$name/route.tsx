import { ActionFunctionArgs, json, LoaderFunctionArgs } from "@remix-run/node";
import apiClient from "~/apiclient";
import { handleError } from "~/util/api/handle-status-code";
import {
  mapToTermsAndConditionsData,
  TermsAndCondtionsDataType,
} from "~/util/data/schemas/document/terms-and-conditions.schema";
import TermsAndConditionsDetailClient from "./terms-and-conditions-detail.client";
import { UpdateStatusWithEventType } from "~/util/data/schemas/base/base-schema";
import { LOAD_ACTION } from "~/constant";
import { ShouldRevalidateFunctionArgs } from "@remix-run/react";
import { mapToPaymentTermsTemplateData, PaymentTermsTemplateType } from "~/util/data/schemas/document/payment-terms-template.schema";
import PaymentTermsTemplateDetailClient from "./terms-and-conditions-detail.client";
import { components } from "~/sdk";

type ActionData = {
  action: string;
  editionData: PaymentTermsTemplateType;
  updateStatus: UpdateStatusWithEventType;
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const client = apiClient({ request });
  const data = (await request.json()) as ActionData;
  let error: string | undefined = undefined;
  let message: string | undefined = undefined;
  let actionRes = LOAD_ACTION;

  switch (data.action) {
    case "update-status": {
      const res = await client.PUT("/payment-terms-template/update-status", {
        body: data.updateStatus,
      });
      message = res.data?.message;
      error = res.error?.detail;
      break;
    }
    case "edit": {
      const res = await client.PUT("/payment-terms-template", {
        body: mapToPaymentTermsTemplateData(data.editionData),
      });
      error = res.error?.detail;
      message = res.data?.message;
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

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const client = apiClient({ request });
  const url = new URL(request.url);
  const searchParams = url.searchParams;
  const tab = searchParams.get("tab") || "info"
  const res = await client.GET("/payment-terms-template/detail/{id}", {
    params: {
      path: {
        id: searchParams.get("id") || "",
      },
    },
  });
  handleError(res.error);
  let paymentTermLines:components["schemas"]["PaymentTermsLineDto"][] = []
  switch(tab) {
    case "info":{
      const response =await client.GET("/payment-terms/{id}/lines",{
        params:{
          path:{
            id:res.data?.result.entity.id?.toString() || "",
          }
        }
      })
      paymentTermLines = response.data?.result || []
      break
    }
  }
  return json({
    entity: res.data?.result.entity,
    actions: res.data?.actions,
    activities: res.data?.result.activities,
    paymentTermLines:paymentTermLines,
  });
};

export default function PaymentTermsTemplateDetail() {
  return <PaymentTermsTemplateDetailClient />;
}
