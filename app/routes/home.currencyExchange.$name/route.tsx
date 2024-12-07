import {
  ActionFunctionArgs,
  defer,
  json,
  LoaderFunctionArgs,
} from "@remix-run/node";
import apiClient from "~/apiclient";
import CurrencyExchangeDetailClient from "./currency-exchange-detail.client";
import { handleError } from "~/util/api/handle-status-code";
import { FetchResponse } from "openapi-fetch";
import { z } from "zod";
import { editChargesTemplateSchema } from "~/util/data/schemas/accounting/charges-template-schema";
import { DEFAULT_PAGE, DEFAULT_SIZE } from "~/constant";
import { editCurrencyExchangeSchema } from "~/util/data/schemas/core/currency-exchange-schema";

type ActionData = {
  action: string;
  editData: z.infer<typeof editCurrencyExchangeSchema>;
};
export const action = async ({ request }: ActionFunctionArgs) => {
  const client = apiClient({ request });
  const data = (await request.json()) as ActionData;
  let message: string | undefined = undefined;
  let error: string | undefined = undefined;
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
  });
};

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
