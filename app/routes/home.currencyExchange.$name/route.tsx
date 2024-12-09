import {
  ActionFunctionArgs,
  defer,
  json,
  LoaderFunctionArgs,
} from "@remix-run/node";
import apiClient from "~/apiclient";
import CurrencyExchangeDetailClient from "./currency-exchange-detail.client";
import { handleError } from "~/util/api/handle-status-code";
import { z } from "zod";
import { editCurrencyExchangeSchema } from "~/util/data/schemas/core/currency-exchange-schema";
import { ShouldRevalidateFunctionArgs } from "@remix-run/react";
import { LOAD_ACTION } from "~/constant";

type ActionData = {
  action: string;
  editData: z.infer<typeof editCurrencyExchangeSchema>;
};
export const action = async ({ request }: ActionFunctionArgs) => {
  const client = apiClient({ request });
  const data = (await request.json()) as ActionData;
  let message: string | undefined = undefined;
  let error: string | undefined = undefined;
  let actionRes = LOAD_ACTION
  console.log("EDIT DATA", data.editData);
  switch (data.action) {
    case "edit": {
      const d = data.editData;
      const res = await client.PUT("/currency-exchange", {
        body: {
          id: d.id,
          name: d.name,
          for_buying: d.forBuying,
          for_selling: d.forSelling,
          from_currency: d.fromCurrency,
          to_currency: d.toCurrency,
          exchange_rate: d.exchangeRate,
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

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const client = apiClient({ request });
  const url = new URL(request.url);
  const searchParams = url.searchParams;
  const tab = searchParams.get("tab");
  const res = await client.GET("/currency-exchange/detail/{id}", {
    params: {
      path: {
        id: searchParams.get("id") || "",
      },
    },
  });
  handleError(res.error);
  return json({
    currencyExchange: res.data?.result.entity,
    actions: res.data?.actions,
  });
};

export default function CurrencyExchangeDetail() {
  return <CurrencyExchangeDetailClient />;
}
