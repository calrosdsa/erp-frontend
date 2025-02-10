import { ActionFunctionArgs, json } from "@remix-run/node";
import apiClient from "~/apiclient";
import {
  AddressAndContactDataType,
  mapToAddressAndContactData,
} from "~/util/data/schemas/document/address-and-contact.schema";
import { DocAccountsType, mapToDocAccountsData } from "~/util/data/schemas/document/doc-accounts.schema";
import { DocTermsType, mapToDocTermsData } from "~/util/data/schemas/document/doc-terms.schema";

type ActionData = {
  action: string;
  addressAndContactData: AddressAndContactDataType;
  docTermsData:DocTermsType
  docAccountsData:DocAccountsType
};
export const action = async ({ request }: ActionFunctionArgs) => {
  const client = apiClient({ request });
  const data = (await request.json()) as ActionData;
  let message: string | undefined = undefined;
  let error: string | undefined = undefined;
  switch (data.action) {
    case "edit-address-and-contact": {
      const res = await client.PUT("/document/info/address-and-contact", {
        body: mapToAddressAndContactData(data.addressAndContactData),
      });
      message = res.data?.message;
      error = res.error?.detail;
      break;
    }
    case "edit-doc-terms":{

      const res =await client.PUT("/document/info/doc-term",{
        body:mapToDocTermsData(data.docTermsData)
      })
      // console.log("EDIT DOC TERMS",res.data?.message,res.error)
      message = res.data?.message
      error = res.error?.detail
      break;
    }
    case "edit-doc-accounts":{
      const res =await client.PUT("/document/info/doc-accounting",{
        body:mapToDocAccountsData(data.docAccountsData),
      })
      message = res.data?.message
      error = res.error?.detail
      break;
    }
  }
  return json({
    message,
    error,
  });
};
