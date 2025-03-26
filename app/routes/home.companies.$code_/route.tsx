import { ActionFunctionArgs, json, LoaderFunctionArgs } from "@remix-run/node";
import apiClient from "~/apiclient";
import CompanyClient from "./company.client";
import { handleError } from "~/util/api/handle-status-code";
import { components } from "~/sdk";
import {
  AccountSettingData,
  mapToAccountSettingData,
} from "~/util/data/schemas/company/account-setting.schema";
import { LOAD_ACTION } from "~/constant";
import { ShouldRevalidateFunctionArgs } from "@remix-run/react";

type ActionData = {
  action: string;
  accountSettingData: AccountSettingData;
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const client = apiClient({ request });
  const data = (await request.json()) as ActionData;
  let message: string | undefined = undefined;
  let error: string | undefined = undefined;
  switch (data.action) {
    case "edit-account-setting": {
      const res = await client.PUT("/company/setting/account", {
        body: mapToAccountSettingData(data.accountSettingData),
      });
      message = res.data?.message;
      error = res.error?.detail;
      break;
    }
  }
  return json({
    message,
    error,
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
  const tab = searchParams.get("tab");
  const res = await client.GET("/company/detail/{id}", {
    params: {
      path: {
        id: searchParams.get("id") || "",
      },
    },
  });
  const companyID = res.data?.result.entity.id.toString() || "";
  handleError(res.error);
  let accountSettings: components["schemas"]["AccountSettingsDto"] | undefined =
    undefined;
  switch (tab) {
    case "accounts": {
      const response = await client.GET("/company/setting/account", {
        params: {
          query: {
            id: companyID,
          },
        },
      });
      accountSettings = response.data?.result;
    }
  }
  return json({
    company: res.data?.result.entity,
    accountSettings,
    actions: res.data?.associated_actions,
    activities: res.data?.result.activities,
  });
};

export default function Company() {
  return <CompanyClient />;
}
