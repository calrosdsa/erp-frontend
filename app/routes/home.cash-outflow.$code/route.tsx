import { ActionFunctionArgs, json, LoaderFunctionArgs } from "@remix-run/node";
import apiClient from "~/apiclient";
import { handleError } from "~/util/api/handle-status-code";
import {
  mapToTermsAndConditionsData,
  TermsAndCondtionsDataType,
} from "~/util/data/schemas/document/terms-and-conditions.schema";
import TermsAndConditionsDetailClient from "./cash-outflow-detail.client";
import { UpdateStatusWithEventType } from "~/util/data/schemas/base/base-schema";
import { LOAD_ACTION } from "~/constant";
import { ShouldRevalidateFunctionArgs } from "@remix-run/react";
import {
  BankAccountType,
  mapToBankAccountData,
} from "~/util/data/schemas/accounting/bank-account.schema";
import BankAccountDetailClient from "./cash-outflow-detail.client";
import {
  CashOutflowDataType,
  mapToCashOutflowData,
} from "~/util/data/schemas/accounting/cash-outflow.schema";
import CashOutflowDetailClient from "./cash-outflow-detail.client";
import { components } from "~/sdk";
import { party } from "~/util/party";

type ActionData = {
  action: string;
  editData: CashOutflowDataType;
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
      const res = await client.PUT("/cash-outflow/update-status", {
        body: data.updateStatus,
      });
      message = res.data?.message;
      error = res.error?.detail;
      break;
    }
    case "edit": {
      // console.log(data.editData)
      const res = await client.PUT("/cash-outflow", {
        body: mapToCashOutflowData(data.editData),
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

export const loader = async ({ request,params }: LoaderFunctionArgs) => {
  const client = apiClient({ request });
  const url = new URL(request.url);
  const searchParams = url.searchParams;
  const tab = searchParams.get("tab");
  const res = await client.GET("/cash-outflow/detail/{id}", {
    params: {
      path: {
        id: params.code || "",
      },
    },
  });
  let taxLines: components["schemas"]["TaxAndChargeLineDto"][] = [];
    let docAccounts:components["schemas"]["DocAccountingDto"] | undefined = undefined
  
  handleError(res.error);
  if (res.data) {
    switch (tab) {
      case "info": {
        const taxLinesRes = await client.GET("/taxes-and-charges", {
          params: {
            query: {
              id: res.data.result.entity.id.toString(),
            },
          },
        });
        taxLines = taxLinesRes.data?.result || [];
        break;
      }
      case "defaults":{
        const accountsRes = await client.GET("/document/info/doc-accounting/{id}",{
          params:{
            path:{
              id:res.data.result.entity.id.toString(),
            },
            query:{
              party: party.cashOutflow || "",
            }
          }
        })
        docAccounts = accountsRes.data?.result
        break
      }
    }
  }
  return json({
    entity: res.data?.result.entity,
    actions: res.data?.actions,
    activities: res.data?.result.activities,
    taxLines: taxLines,
  });
};

export default function CashOutflowDetail() {
  return <CashOutflowDetailClient />;
}
