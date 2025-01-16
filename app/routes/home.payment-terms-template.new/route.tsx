import { ActionFunctionArgs, json } from "@remix-run/node";
import apiClient from "~/apiclient";
import { components } from "~/sdk";
import { mapToTermsAndConditionsData, TermsAndCondtionsDataType } from "~/util/data/schemas/document/terms-and-conditions.schema";
import NewTermsAndConditionsClient from "./new-payment-terms-template.client";
import { mapToPaymentTermsTemplateData, PaymentTermsTemplateType } from "~/util/data/schemas/document/payment-terms-template.schema";
import NewPaymentTermsTemplateClient from "./new-payment-terms-template.client";

type ActionData = {
  action: string;
  creationData: PaymentTermsTemplateType;
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const client = apiClient({ request });
  const data = (await request.json()) as ActionData;
  let message: string | undefined = undefined;
  let error: string | undefined = undefined;
  let paymentTermsTemplate:
    | components["schemas"]["PaymentTermsTemplateDto"]
    | undefined = undefined;
  switch(data.action){
    case "create":{
        const res = await client.POST("/payment-terms-template",{
            body:mapToPaymentTermsTemplateData(data.creationData)
        })
        error = res.error?.detail
        message = res.data?.message
        paymentTermsTemplate = res.data?.result
        break
    }
  }
  return json({
    message,error,paymentTermsTemplate,
  });
};


export default function NewPaymentTermsTemplate(){
    return <NewPaymentTermsTemplateClient/>
}