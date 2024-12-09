import { ActionFunctionArgs, json, LoaderFunctionArgs } from "@remix-run/node";
import apiClient from "~/apiclient";
import AccountLedgerDetailClient from "./account-ledger-detail.client";
import { handleError } from "~/util/api/handle-status-code";
import { ShouldRevalidateFunctionArgs } from "@remix-run/react";
import { LOAD_ACTION } from "~/constant";
import { z } from "zod";
import { editAccountLedger } from "~/util/data/schemas/accounting/account-schema";

type ActionData = {
  action: string;
  editData: z.infer<typeof editAccountLedger>;
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const client = apiClient({ request });
  const data = (await request.json()) as ActionData;
  let message: string | undefined = undefined;
  let error: string | undefined = undefined;
  let actionRes = LOAD_ACTION;
  switch (data.action) {
    case "edit": {
      const d = data.editData;
      const res = await client.PUT("/ledger", {
        body: {
          id: d.id,
          account_type: d.accountType,
          account_root_type: d.accountRootType,
          name: d.name,
          parent_id: d.parentID,
          ledger_no: d.ledgerNo || undefined,
          is_group: d.isGroup,
          cash_flow_section: d.cashFlowSection,
          report_type: d.reportType,
        },
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
  });
};

export default function AccountLedgerDetail() {
  return <AccountLedgerDetailClient />;
}
