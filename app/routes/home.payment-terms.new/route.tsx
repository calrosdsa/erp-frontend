import { ActionFunctionArgs, json } from "@remix-run/node";
import apiClient from "~/apiclient";
import { components } from "~/sdk";
import { mapToTermsAndConditionsData, TermsAndCondtionsDataType } from "~/util/data/schemas/document/terms-and-conditions.schema";
import NewTermsAndConditionsClient from "./new-payment-terms.client";
import { mapToPaymentTermsData, PaymentTermsType } from "~/util/data/schemas/document/payment-terms.schema";
import NewPaymentTermsClient from "./new-payment-terms.client";

type ActionData = {
  action: string;
  creationData: PaymentTermsType;
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const client = apiClient({ request });
  const data = (await request.json()) as ActionData;
  let message: string | undefined = undefined;
  let error: string | undefined = undefined;
  let paymentTerms:
    | components["schemas"]["PaymentTermsDto"]
    | undefined = undefined;
  switch(data.action){
    case "create":{
        const res = await client.POST("/payment-terms",{
            body:mapToPaymentTermsData(data.creationData)
        })
        error = res.error?.detail
        message = res.data?.message
        paymentTerms = res.data?.result
        break
    }
  }
  return json({
    message,error,paymentTerms,
  });
};


export default function NewPaymentTerms(){
    return <NewPaymentTermsClient/>
}