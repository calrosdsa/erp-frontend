import { ActionFunctionArgs, json, LoaderFunctionArgs } from "@remix-run/node";
import { z } from "zod";
import apiClient from "~/apiclient";
import { LOAD_ACTION } from "~/constant";
import { components } from "~/sdk";
import {
  mapToTaxAndChargeData,
  taxAndChargeSchema,
} from "~/util/data/schemas/accounting/tax-and-charge-schema";

type ActionData = {
  action: string;
  docPartyID: number;
  editData: components["schemas"]["EditTaxLineRequestBody"];
  addData: components["schemas"]["AddTaxLineRequestBody"];
  deleteData: components["schemas"]["DeleteTaxLineRequestBody"];
};
export const action = async ({ request }: ActionFunctionArgs) => {
  const client = apiClient({ request });
  const data = (await request.json()) as ActionData;
  let message: string | undefined = undefined;
  let error: string | undefined = undefined;
  let taxAndChargesLines: components["schemas"]["TaxAndChargeLineDto"][] = [];
  console.log("TAX LINE DATA", data);
  switch (data.action) {
    case "tax-and-charge-lines": {
      const res = await client.GET("/taxes-and-charges", {
        params: {
          query: {
            id: data.docPartyID.toString(),
          },
        },
      });
      taxAndChargesLines = res.data?.result || [];
      error = res.error?.detail;
      break;
    }
    case "edit-tax-line": {
      const res = await client.PUT("/taxes-and-charges", {
        body: data.editData,
      });
      message = res.data?.message;
      error = res.error?.detail;
      console.log(res.data, res.error);
      break;
    }
    case "add-tax-line": {
      const res = await client.POST("/taxes-and-charges", {
        body: data.addData,
      });
      message = res.data?.message;
      error = res.error?.detail;
      console.log(res.data, res.error);
      break;
    }
    case "delete-tax-line": {
      const res = await client.DELETE("/taxes-and-charges", {
        body: data.deleteData,
      });
      message = res.data?.message;
      error = res.error?.detail;
      break;
    }
  }
  return json({
    message,
    error,
    taxAndChargesLines,
    action: LOAD_ACTION,
  });
};

// export const loader = async({request}:LoaderFunctionArgs)=>{
//   const
//   return json({})
// }
