import { ActionFunctionArgs, json } from "@remix-run/node";
import apiClient from "~/apiclient";
import { components } from "~/sdk";
import { mapToTermsAndConditionsData, TermsAndCondtionsDataType } from "~/util/data/schemas/document/terms-and-conditions.schema";
import NewTermsAndConditionsClient from "./new-cash-outflow.client";
import { BankAccountType, mapToBankAccountData } from "~/util/data/schemas/accounting/bank-account.schema";
import { CashOutflowDataType, mapToCashOutflowData } from "~/util/data/schemas/accounting/cash-outflow.schema";
import NewCashOutflowClient from "./new-cash-outflow.client";

type ActionData = {
  action: string;
  createData: CashOutflowDataType;
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const client = apiClient({ request });
  const data = (await request.json()) as ActionData;
  let message: string | undefined = undefined;
  let error: string | undefined = undefined;
  let entity:
    | components["schemas"]["CashOutflowDto"]
    | undefined = undefined;
  switch(data.action){
    case "create":{
        const res = await client.POST("/cash-outflow",{
            body:mapToCashOutflowData(data.createData)
        })
        error = res.error?.detail
        message = res.data?.message
        entity = res.data?.result
        break
    }
  }
  return json({
    message,error,entity,
  });
};


export default function NewCashOutflow(){
    return <NewCashOutflowClient/>
}