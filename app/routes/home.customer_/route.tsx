import { ActionFunctionArgs, json, LoaderFunctionArgs } from "@remix-run/node";
import apiClient from "~/apiclient";
import { handleError } from "~/util/api/handle-status-code";
import CustomersClient from "./customers-client";
import { DEFAULT_PAGE, DEFAULT_SIZE, LOAD_ACTION } from "~/constant";
import { z } from "zod";
import { customerSchema } from "~/util/data/schemas/selling/customer-schema";
import { components } from "~/sdk";
import { mapToContactData } from "~/util/data/schemas/contact/contact.schema";
import { ShouldRevalidateFunctionArgs } from "@remix-run/react";

type ActionData = {
  action: string;
  createCustomer: z.infer<typeof customerSchema>;
  query: string;
};
export const action = async ({ request }: ActionFunctionArgs) => {
  const client = apiClient({ request });
  const data = (await request.json()) as ActionData;
  let message: string | undefined = undefined;
  let error: string | undefined = undefined;
  let customerTypes: components["schemas"]["CustomerType"][] = [];
  let customers: components["schemas"]["CustomerDto"][] = [];
  let actions: components["schemas"]["ActionDto"][] = [];
  switch (data.action) {
    case "get": {
      const res = await client.GET("/customer", {
        params: {
          query: {
            page: DEFAULT_PAGE,
            size: DEFAULT_SIZE,
            query: data.query || "",
          },
        },
      });
      customers = res.data?.pagination_result.results || [];
      actions = res.data?.actions || [];
      break;
    }
    case "customer-types": {
      const res = await client.GET("/customer/customer-types");
      customerTypes = res.data?.result.entity || [];
      break;
    }
    case "create-customer": {
      // const d = data.createCustomer;
      // const res = await client.POST("/customer", {
      //   body: {
      //     customer: {
      //       name: d.name,
      //       customer_type: d.customerType,
      //       group_id: d.groupID,
      //     },
      //     contact: d.contactData ? mapToContactData(d.contactData) : undefined,
      //   },
      // });
      // message = res.data?.message;
      // error = res.error?.detail;
      break;
    }
  }
  return json({
    message,
    error,
    customerTypes,
    customers,
    actions,
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
  const res = await client.GET("/customer", {
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
    paginationResult: res.data?.pagination_result,
    actions: res.data?.actions,
  });
};

export default function Customers() {
  return <CustomersClient />;
}
