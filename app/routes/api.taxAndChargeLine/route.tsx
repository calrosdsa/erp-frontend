import { ActionFunctionArgs, json, LoaderFunctionArgs } from "@remix-run/node";
import { z } from "zod";
import apiClient from "~/apiclient";
import { components } from "~/sdk";
import { mapToTaxAndChargeData, taxAndChargeSchema } from "~/util/data/schemas/accounting/tax-and-charge-schema";

type ActionData = {
  action: string;
  taxLineData: z.infer<typeof taxAndChargeSchema>;
  docPartyID:number
  taxLineID:number
};
export const action = async ({ request }: ActionFunctionArgs) => {
  const client = apiClient({ request });
  const data = (await request.json()) as ActionData;
  let message: string | undefined = undefined;
  let error: string | undefined = undefined;
  let taxAndChargesLines:components["schemas"]["TaxAndChargeLineDto"][] = []
  console.log("TAX LINE DATA",data)
  switch (data.action) {
    case "tax-and-charge-lines":{
      const res =await client.GET("/taxes-and-charges",{
        params:{
          query:{
            id:data.docPartyID.toString(),
          }
        }
      })
      taxAndChargesLines = res.data?.result || []
      error = res.error?.detail
      break
    }
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
    case "delete-tax-line":{
      const res = await client.DELETE("/taxes-and-charges",{
        params:{
          query:{
            id:data.taxLineID?.toString() ||  ""
          }
        }
      })
      message = res.data?.message
      error = res.error?.detail
      break
    }
  }
  return json({ message, error,taxAndChargesLines });
};


// export const loader = async({request}:LoaderFunctionArgs)=>{
//   const 
//   return json({})
// }