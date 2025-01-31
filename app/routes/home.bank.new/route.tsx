import { ActionFunctionArgs, json } from "@remix-run/node";
import apiClient from "~/apiclient";
import { components } from "~/sdk";
import { mapToTermsAndConditionsData, TermsAndCondtionsDataType } from "~/util/data/schemas/document/terms-and-conditions.schema";
import NewBankClient from "./new-bank.client";
import { BankDataType, mapToBankData } from "~/util/data/schemas/accounting/bank.schema";

type ActionData = {
  action: string;
  createData: BankDataType;
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const client = apiClient({ request });
  const data = (await request.json()) as ActionData;
  let message: string | undefined = undefined;
  let error: string | undefined = undefined;
  let bank:
    | components["schemas"]["BankDto"]
    | undefined = undefined;
  switch(data.action){
    case "create":{
        const res = await client.POST("/bank",{
            body:mapToBankData(data.createData)
        })
        error = res.error?.detail
        message = res.data?.message
        bank = res.data?.result
        break
    }
  }
  return json({
    message,error,bank,
  });
};


export default function NewBank(){
    return <NewBankClient/>
}