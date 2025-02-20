import { ActionFunctionArgs, json, LoaderFunctionArgs } from "@remix-run/node";
import apiClient from "~/apiclient";
import { handleError } from "~/util/api/handle-status-code";
import CustomersClient from "./customers-client";
import { DEFAULT_PAGE, DEFAULT_SIZE } from "~/constant";
import { z } from "zod";
import { createCustomerSchema } from "~/util/data/schemas/selling/customer-schema";
import { components } from "~/sdk";
import { mapToContactData } from "~/util/data/schemas/contact/contact.schema";

type ActionData = {
  action: string;
  createCustomer: z.infer<typeof createCustomerSchema>;
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
      const d = data.createCustomer;
      const res = await client.POST("/customer", {
        body: {
          customer:{
            name: d.name,
            customer_type: d.customerType,
            group_id: d.groupID,
          },
          contact:mapToContactData(d.contactData)
        },
      });
      message = res.data?.message;
      error = res.error?.detail;
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
