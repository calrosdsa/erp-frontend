import {
  ActionFunctionArgs,
  defer,
  json,
  LoaderFunctionArgs,
} from "@remix-run/node";
import apiClient from "~/apiclient";
import PurchaseRecordDetailClient from "./purchase-record-detail.client";
import { handleError } from "~/util/api/handle-status-code";
import { z } from "zod";
import { editCurrencyExchangeSchema } from "~/util/data/schemas/core/currency-exchange-schema";
import { ShouldRevalidateFunctionArgs } from "@remix-run/react";
import { LOAD_ACTION } from "~/constant";
import { updateStatusWithEventSchema } from "~/util/data/schemas/base/base-schema";
import {
  purchaseRecordDataSchema,
  mapToPurchaseRecordData,
} from "~/util/data/schemas/invoicing/purchase-record-schema";

type ActionData = {
  action: string;
  purchaseRecordData: z.infer<typeof purchaseRecordDataSchema>;
  updateStatus: z.infer<typeof updateStatusWithEventSchema>;
};
export const action = async ({ request }: ActionFunctionArgs) => {
  const client = apiClient({ request });
  const data = (await request.json()) as ActionData;
  let message: string | undefined = undefined;
  let error: string | undefined = undefined;
  let actionRes = LOAD_ACTION;
  switch (data.action) {
    case "update-status": {
      const res = await client.PUT("/purchase-record/update-status", {
        body: data.updateStatus,
      });
      message = res.data?.message;
      error = res.error?.detail;
      break;
    }
    case "edit": {
      const d = data.purchaseRecordData;
      const purchaseRecordData = mapToPurchaseRecordData(d);
      const res = await client.PUT("/purchase-record", {
        body: purchaseRecordData,
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
  console.log("ID", searchParams.get("id"));
  const res = await client.GET("/purchase-record/detail/{id}", {
    params: {
      path: {
        id: searchParams.get("id") || "",
      },
    },
  });
  handleError(res.error);
  return json({
    purchaseRecord: res.data?.result.entity,
    actions: res.data?.actions,
    activities: res.data?.result.activities,
  });
};

export default function PurchaseRecordDetail() {
  return <PurchaseRecordDetailClient />;
}
