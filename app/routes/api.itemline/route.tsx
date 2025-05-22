import { ActionFunctionArgs, json } from "@remix-run/node";
import { z } from "zod";
import apiClient from "~/apiclient";
import { LOAD_ACTION } from "~/constant";
import { components, operations } from "~/sdk";
import {
  lineItemSchema,
  mapToProductListData,
  ProductListSchema,
} from "~/util/data/schemas/stock/line-item-schema";

type ActionData = {
  action: string;
  editData: components["schemas"]["EditLineItemRequestBody"];
  deleteData: components["schemas"]["DeleteLineItemRequestBody"];
  addData: components["schemas"]["AddLineItemRequestBody"];
  params: operations["item-lines"]["parameters"];
  productsData: ProductListSchema;
};
export const action = async ({ request }: ActionFunctionArgs) => {
  const client = apiClient({ request });
  const data = (await request.json()) as ActionData;
  let message: string | undefined = undefined;
  let error: string | undefined = undefined;
  let lineItems: components["schemas"]["LineItemDto"][] = [];
  let shouldRevalidate = false;
  switch (data.action) {
    case "upsert-products": {
      const res = await client.POST("/item-line/products", {
        body: mapToProductListData(data.productsData),
      });
      error = res.error?.detail;
      message = res.data?.message;
      console.log("UPSERT PRODUCTS",res.error,message,data.productsData)
      break;
    }
    case "list": {
      const res = await client.GET("/item-line", {
        params: data.params,
      });
      lineItems = res.data?.result || [];
      break;
    }
    case "add-line-item": {
      const d = data.editData;
      console.log("ADD DATA", d);
      const res = await client.POST("/item-line", {
        body: data.addData,
      });
      message = res.data?.message;
      error = res.error?.detail;
      console.log(res.data, res.error);
      shouldRevalidate = true;
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
      shouldRevalidate = true;
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
      shouldRevalidate = true;
      break;
    }
  }
  return json({
    message,
    error,
    lineItems,
    shouldRevalidate,
  });
};
