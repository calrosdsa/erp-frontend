import { ActionFunctionArgs, json, LoaderFunctionArgs } from "@remix-run/node";
import apiClient from "~/apiclient";
import { handleError } from "~/util/api/handle-status-code";
import {
  mapToTermsAndConditionsData,
  TermsAndCondtionsDataType,
} from "~/util/data/schemas/document/terms-and-conditions.schema";
import TermsAndConditionsDetailClient from "./payment-terms-detail.client";
import { UpdateStatusWithEventType } from "~/util/data/schemas/base/base-schema";
import { LOAD_ACTION } from "~/constant";
import { ShouldRevalidateFunctionArgs } from "@remix-run/react";
import PaymentTermsDetailClient from "./payment-terms-detail.client";
import { mapToPaymentTermsData, PaymentTermsType } from "~/util/data/schemas/document/payment-terms.schema";

type ActionData = {
  action: string;
  editionData: PaymentTermsType;
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
      const res = await client.PUT("/payment-terms/update-status", {
        body: data.updateStatus,
      });
      message = res.data?.message;
      error = res.error?.detail;
      break;
    }
    case "edit": {
      // console.log(data.editionData)
      const res = await client.PUT("/payment-terms", {
        body: mapToPaymentTermsData(data.editionData),
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
  const res = await client.GET("/payment-terms/detail/{id}", {
    params: {
      path: {
        id: searchParams.get("id") || "",
      },
    },
  });
  handleError(res.error);
  return json({
    entity: res.data?.result.entity,
    actions: res.data?.actions,
    activities: res.data?.result.activities,
  });
};

export default function PaymentTermsDetail() {
  return <PaymentTermsDetailClient />;
}
