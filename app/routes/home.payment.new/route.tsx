import { ActionFunctionArgs, json, LoaderFunctionArgs } from "@remix-run/node";
import PaymentCreateClient from "./new-payment.client";
import apiClient from "~/apiclient";
import { z } from "zod";
import {
  mapToPaymentBody,
  partyReferencesToDto,
  paymentDataSchema,
} from "~/util/data/schemas/accounting/payment-schema";
import { components } from "~/sdk";
import { formatRFC3339 } from "date-fns";
import { mapToTaxAndChargeData } from "~/util/data/schemas/accounting/tax-and-charge-schema";

type ActionData = {
  action: string;
  paymentData: z.infer<typeof paymentDataSchema>;
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const client = apiClient({ request });
  const data = (await request.json()) as ActionData;
  let error: string | undefined = undefined;
  let message: string | undefined = undefined;
  let payment: components["schemas"]["PaymentDto"] | undefined = undefined;
  let partiesType: components["schemas"]["PartyTypeDto"][] = [];
  switch (data.action) {
    case "payment-parties": {
      const res = await client.GET("/payment/parties");
      partiesType = res.data?.result || [];
      console.log("payment parties type", res.error);
      break;
    }
    case "create-payment": {
      const res = await client.POST("/payment", {
        body: mapToPaymentBody(data.paymentData),
      });
      error = res.error?.detail;
      message = res.data?.message;
      payment = res.data?.result;
      console.log(res.error, res.data);
      break;
    }
  }
  return json({
    error,
    message,
    payment,
    partiesType,
  });
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const client = apiClient({ request });
  const res = await client.GET("/payment/associated-actions");
  const paymentAccountsRes = await client.GET("/payment/payment-accounts");
  return json({
    associatedActions: res.data?.associated_actions,
    paymentAccounts: paymentAccountsRes.data?.result,
  });
};

export default function CreatePayment() {
  return <PaymentCreateClient />;
}
