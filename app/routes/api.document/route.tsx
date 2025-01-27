import { ActionFunctionArgs, json } from "@remix-run/node";
import apiClient from "~/apiclient";
import {
  AddressAndContactDataType,
  mapToAddressAndContactData,
} from "~/util/data/schemas/document/address-and-contact.schema";

type ActionData = {
  action: string;
  addressAndContactData: AddressAndContactDataType;
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
  }
  return json({
    message,
    error,
  });
};
