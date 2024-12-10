import { ActionFunctionArgs, json } from "@remix-run/node";
import { z } from "zod";
import apiClient from "~/apiclient";
import { components } from "~/sdk";
import { createChargesTemplateSchema } from "~/util/data/schemas/accounting/charges-template-schema";
import { mapToTaxAndChargeData } from "~/util/data/schemas/accounting/tax-and-charge-schema";
import NewCurrencyExchangeClient from "./new-currency-exchange";
import { createCurrencyExchangeSchema } from "~/util/data/schemas/core/currency-exchange-schema";

type ActionData = {
  action: string;
  createCurrencyExchange: z.infer<typeof createCurrencyExchangeSchema>;
};
export const action = async ({ request }: ActionFunctionArgs) => {
  const data = (await request.json()) as ActionData;
  const client = apiClient({ request });
  let message: string | undefined = undefined;
  let error: string | undefined = undefined;
  let currencyExchange: components["schemas"]["CurrencyExchangeDto"] | undefined =
    undefined;
  switch (data.action) {
    case "create-currency-exchange": {
      const d = data.createCurrencyExchange;
      const res = await client.POST("/currency-exchange", {
        body: {
          name:d.name,
          for_buying:d.forBuying,
          for_selling:d.forSelling,
          from_currency:d.fromCurrency,
          to_currency:d.toCurrency,
          exchange_rate:d.exchangeRate,
        },
      });
      message = res.data?.message;
      error = res.error?.detail;
      currencyExchange = res.data?.result;
      break;
    }
  }
  return json({
    message,
    error,
    currencyExchange,
  });
};

export default function NewCurrencyExchange() {
  return <NewCurrencyExchangeClient />;
}
