import { ActionFunctionArgs, json, LoaderFunctionArgs } from "@remix-run/node";
import apiClient from "~/apiclient";
import { handleError } from "~/util/api/handle-status-code";
import {
  mapToTermsAndConditionsData,
  TermsAndCondtionsDataType,
} from "~/util/data/schemas/document/terms-and-conditions.schema";
import TermsAndConditionsDetailClient from "./bank-account-detail.client";
import { UpdateStatusWithEventType } from "~/util/data/schemas/base/base-schema";
import { LOAD_ACTION } from "~/constant";
import { ShouldRevalidateFunctionArgs } from "@remix-run/react";
import { BankAccountType, mapToBankAccountData } from "~/util/data/schemas/accounting/bank-account.schema";
import BankAccountDetailClient from "./bank-account-detail.client";

type ActionData = {
  action: string;
  editData: BankAccountType;
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
      const res = await client.PUT("/bank-account/update-status", {
        body: data.updateStatus,
      });
      message = res.data?.message;
      error = res.error?.detail;
      break;
    }
    case "edit": {
      const res = await client.PUT("/bank-account", {
        body: mapToBankAccountData(data.editData),
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
  const res = await client.GET("/bank-account/detail/{id}", {
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

export default function BankAccountDetail() {
  return <BankAccountDetailClient />;
}
