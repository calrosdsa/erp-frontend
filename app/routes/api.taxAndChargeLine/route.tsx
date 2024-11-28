import { ActionFunctionArgs, json } from "@remix-run/node";
import { z } from "zod";
import apiClient from "~/apiclient";
import { mapToTaxAndChargeData, taxAndChargeSchema } from "~/util/data/schemas/accounting/tax-and-charge-schema";

type ActionData = {
  action: string;
  taxLineData: z.infer<typeof taxAndChargeSchema>;
  docPartyID:number
};
export const action = async ({ request }: ActionFunctionArgs) => {
  const client = apiClient({ request });
  const data = (await request.json()) as ActionData;
  let message: string | undefined = undefined;
  let error: string | undefined = undefined;
  console.log("TAX LINE DATA",data)
  
  switch (data.action) {
    case "edit-tax-line": {
      const d = data.taxLineData;
      const taxLine = mapToTaxAndChargeData(d)
      const res = await client.PUT("/taxes-and-charges", {
        body: {
          id:Number(d.taxLineID),
          ...taxLine,
        },
      });
      message = res.data?.message;
      error = res.error?.detail;
      console.log(res.data,res.error)
      break;
    }
    case "add-tax-line": {
      const d = data.taxLineData;
      const taxLine = mapToTaxAndChargeData(d)
      const res = await client.POST("/taxes-and-charges", {
        params:{
          query:{
            id:data.docPartyID.toString(),
          },
        },
        body: {
          ...taxLine,
        },
      });
      message = res.data?.message;
      error = res.error?.detail;
      console.log(res.data,res.error)
      break;
    }
  }
  return json({ message, error });
};
