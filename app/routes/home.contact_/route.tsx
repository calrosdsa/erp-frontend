import { ActionFunctionArgs, json, LoaderFunctionArgs } from "@remix-run/node";
import apiClient from "~/apiclient";
import { DEFAULT_PAGE, DEFAULT_SIZE, LOAD_ACTION } from "~/constant";
import ContactsClient from "./contacts.client";
import { handleError } from "~/util/api/handle-status-code";
import { components, operations } from "~/sdk";
import {
  ContactBulkData,
  mapToContactBulkData,
} from "~/util/data/schemas/contact/contact.schema";
import { ShouldRevalidateFunctionArgs } from "@remix-run/react";

type ActionData = {
  action: string;
  query: operations["contacts"]["parameters"]["query"];
  bulkData: ContactBulkData;
};
export const action = async ({ request }: ActionFunctionArgs) => {
  const client = apiClient({ request });
  const data = (await request.json()) as ActionData;
  let results: components["schemas"]["ContactDto"][] = [];
  let actions: components["schemas"]["ActionDto"][] = [];
  let error: string | undefined = undefined;
  let message: string | undefined = undefined;
  switch (data.action) {
    case "bulk-data": {
      // console.log("BULK DATA",data.bulkData)
      const res = await client.POST("/party/contact/bulk", {
        body: mapToContactBulkData(data.bulkData),
      });
      console.log(res.error)
      error = res.error?.detail;
      message = res.data?.message;
      break;
    }
    case "get": {
      const res = await client.GET("/party/contact", {
        params: {
          query: data.query,
        },
      });
      results = res.data?.result || [];
      actions = res.data?.actions || [];
      // console.log("GET CONTACTS",data,res.data?.result)
      break;
    }
  }
  //   handleError(res.error);
  return json({
    results,
    actions,
    message,
    error,
  });
};

export function shouldRevalidate({
  formMethod,
  defaultShouldRevalidate,
  actionResult,
}: ShouldRevalidateFunctionArgs) {
  if (actionResult?.action == LOAD_ACTION) {
    return defaultShouldRevalidate;
  }
  if (formMethod === "POST") {
    return false;
  }
  return defaultShouldRevalidate;
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const client = apiClient({ request });
  const url = new URL(request.url);
  const searchParams = url.searchParams;
  const res = await client.GET("/party/contact", {
    params: {
      query: {
        page: searchParams.get("page") || DEFAULT_PAGE,
        size: searchParams.get("size") || DEFAULT_SIZE,
        query: searchParams.get("query") || "",
      },
    },
  });
  handleError(res.error);
  return json({
    results: res.data?.result,
    actions: res.data?.actions,
  });
};

export default function Contacts() {
  return <ContactsClient />;
}
