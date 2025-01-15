import { ActionFunctionArgs, json } from "@remix-run/node";
import apiClient from "~/apiclient";
import { components } from "~/sdk";
import { mapToTermsAndConditionsData, TermsAndCondtionsDataType } from "~/util/data/schemas/document/terms-and-conditions.schema";
import NewTermsAndConditionsClient from "./new-terms-and-conditions.client";

type ActionData = {
  action: string;
  createData: TermsAndCondtionsDataType;
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const client = apiClient({ request });
  const data = (await request.json()) as ActionData;
  let message: string | undefined = undefined;
  let error: string | undefined = undefined;
  let termsAndConditions:
    | components["schemas"]["TermsAndConditionsDto"]
    | undefined = undefined;
  switch(data.action){
    case "create":{
        const res = await client.POST("/terms-and-conditions",{
            body:mapToTermsAndConditionsData(data.createData)
        })
        error = res.error?.detail
        message = res.data?.message
        termsAndConditions = res.data?.result
        break
    }
  }
  return json({
    message,error,termsAndConditions,
  });
};


export default function NewTermsAndConditions(){
    return <NewTermsAndConditionsClient/>
}