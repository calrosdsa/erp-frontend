import { ActionFunctionArgs, json, LoaderFunctionArgs } from "@remix-run/node";
import apiClient from "~/apiclient";
import AccountLedgerDetailClient from "./account-ledger-detail.client";
import { handleError } from "~/util/api/handle-status-code";
import { ShouldRevalidateFunctionArgs } from "@remix-run/react";
import { LOAD_ACTION } from "~/constant";
import { z } from "zod";
import { AccountLedgerData, editAccountLedger, mapToAccountLedgerData } from "~/util/data/schemas/accounting/account-ledger.schema";
import { components, operations } from "~/sdk";

type ActionData = {
  action: string;
  editData: AccountLedgerData;
  accountBalanceQuery: operations["account-balance"]["parameters"]["query"];
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const client = apiClient({ request });
  const data = (await request.json()) as ActionData;
  let message: string | undefined = undefined;
  let error: string | undefined = undefined;
  let balance: components["schemas"]["GeneralLedgerOpening"] | undefined =
    undefined;
  let actionRes = LOAD_ACTION;
  console.log("DATA",data)
  switch (data.action) {
    case "account-balance": {
      const res = await client.GET("/accounting/report/account-balance", {
        params: {
          query: data.accountBalanceQuery,
        },
      });
      console.log("DATA BALANCE",res.data,res.error)
      balance = res.data?.result
      break;
    }
    case "edit": {
      const d = data.editData;
      const res = await client.PUT("/ledger", {
        body:mapToAccountLedgerData(d)
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
    balance,
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
  const res = await client.GET("/ledger/detail/{id}", {
    params: {
      path: {
        id: searchParams.get("id") || "",
      },
    },
  });
  handleError(res.error);
  
  return json({
    actions: res.data?.actions,
    account: res.data?.result.entity,
    activities:res.data?.result.activities,
  });
};

export default function AccountLedgerDetail() {
  return <AccountLedgerDetailClient />;
}
