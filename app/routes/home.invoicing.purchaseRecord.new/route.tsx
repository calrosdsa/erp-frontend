import { ActionFunctionArgs, json } from "@remix-run/node";
import { z } from "zod";
import apiClient from "~/apiclient";
import { components } from "~/sdk";
import { mapToPurchaseRecordData, purchaseRecordDataSchema } from "~/util/data/schemas/invoicing/purchase-record-schema";
import NewPurchaseRecordClient from "./new-purchase-record";

type ActionData = {
  action: string;
  purchaseRecordData: z.infer<typeof purchaseRecordDataSchema>;
};
export const action = async ({ request }: ActionFunctionArgs) => {
  const data = (await request.json()) as ActionData;
  const client = apiClient({ request });
  let message: string | undefined = undefined;
  let error: string | undefined = undefined;
  let purchaseRecord: components["schemas"]["PurchaseRecordDto"] | undefined =
    undefined;
  switch (data.action) {
    case "create-purchase-record": {
      const d = data.purchaseRecordData;
      const purchaseRecordData = mapToPurchaseRecordData(d)
      const res = await client.POST("/purchase-record", {
        body: {
         ...purchaseRecordData
        },
      });
      console.log(res.data,res.error)
      message = res.data?.message;
      error = res.error?.detail;
      purchaseRecord = res.data?.result;
      break;
    }
  }
  
  return json({
    message,
    error,
    purchaseRecord,
  });
};

export default function NewPurchaseRecord() {
  return <NewPurchaseRecordClient />;
}
