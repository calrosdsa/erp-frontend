import { ActionFunctionArgs, json } from "@remix-run/node";
import { z } from "zod";
import apiClient from "~/apiclient";
import { LOAD_ACTION } from "~/constant";
import { components } from "~/sdk";
import { lineItemSchema } from "~/util/data/schemas/stock/line-item-schema";

type ActionData = {
  action: string;
  editData: components["schemas"]["EditLineItemRequestBody"];
  deleteData: components["schemas"]["DeleteLineItemRequestBody"];
  addData: components["schemas"]["AddLineItemRequestBody"];
};
export const action = async ({ request }: ActionFunctionArgs) => {
  const client = apiClient({ request });
  const data = (await request.json()) as ActionData;
  let message: string | undefined = undefined;
  let error: string | undefined = undefined;
  switch (data.action) {
    case "add-line-item": {
      const d = data.editData;
      console.log("ADD DATA", d);
      const res = await client.POST("/item-line", {
        body: data.addData,
      });
      message = res.data?.message;
      error = res.error?.detail;
      console.log(res.data, res.error);
      break;
    }
    case "edit-line-item": {
      const d = data.editData;
      console.log("EDIT DATA", d);
      const res = await client.PUT("/item-line", {
        body: data.editData,
      });
      message = res.data?.message;
      error = res.error?.detail;
      console.log(res.data, res.error);
      break;
    }
    case "delete-line-item": {
      const d = data.editData;
      console.log("DELETE DATA", d);
      const res = await client.DELETE("/item-line", {
        body: data.deleteData,
      });
      message = res.data?.message;
      error = res.error?.detail;
      console.log(res.data, res.error);
      break;
    }
  }
  return json({ message, error, action: LOAD_ACTION });
};
