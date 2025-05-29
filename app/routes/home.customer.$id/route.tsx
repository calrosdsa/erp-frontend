import {
  ActionFunctionArgs,
  defer,
  json,
  LoaderFunctionArgs,
  redirect,
} from "@remix-run/node";
import CustomerModal from "./customer-modal";
import apiClient from "~/apiclient";
import { FetchResponse } from "openapi-fetch";
import { handleError } from "~/util/api/handle-status-code";
import { PartyType, partyTypeToJSON } from "~/gen/common";
import {
  CustomerData,
  editCustomerSchema,
  mapToCustomerData,
} from "~/util/data/schemas/selling/customer-schema";
import { z } from "zod";
import { route } from "~/util/route";
import { updateStatusWithEventSchema } from "~/util/data/schemas/base/base-schema";
import { DEFAULT_ID, LOAD_ACTION } from "~/constant";
import { ShouldRevalidateFunctionArgs } from "@remix-run/react";
import { components } from "~/sdk";

type ActionData = {
  action: string;
  customerData: CustomerData;
  updateStatus: z.infer<typeof updateStatusWithEventSchema>;
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const client = apiClient({ request });
  const data = (await request.json()) as ActionData;
  const r = route;
  let actionRes = LOAD_ACTION;
  let message: string | undefined = undefined;
  let error: string | undefined = undefined;
  let customer: components["schemas"]["CustomerDto"] | undefined = undefined;
  console.log("CUSTOMER DATA",data.customerData)
  switch (data.action) {
    case "update-status": {
      const res = await client.PUT("/customer/update-status", {
        body: data.updateStatus,
      });
      message = res.data?.message;
      error = res.error?.detail;
      break;
    }
    case "create-customer": {

      const res = await client.POST("/customer", {
        body: mapToCustomerData(data.customerData),
      });
      error = res.error?.detail;
      message = res.data?.message;
      customer = res.data?.result;
      break;
    }
    case "edit-customer": {
      const res = await client.PUT("/customer", {
        body: mapToCustomerData(data.customerData),
      });
      error = res.error?.detail;
      message = res.data?.message;
      break;
    }
  }
  return json({
    error,
    message,
    action: actionRes,
    customer,
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

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const client = apiClient({ request });
  const url = new URL(request.url);
  const searchParams = url.searchParams;
  const tab = searchParams.get("tab");
  let resConnections: Promise<FetchResponse<any, any, any>> | undefined =
    undefined;
  let customerResult:
    | components["schemas"]["EntityResponseResultEntityCustomerDtoBody"]
    | undefined = undefined;

  if (params.id != DEFAULT_ID) {
    const res = await client.GET("/customer/detail/{id}", {
      params: {
        path: {
          id: params.id || "",
        },
      },
    });
    customerResult = res.data;
    handleError(res.error);
    if (res.data) {
      switch (tab) {
        case "connections": {
          resConnections = client.GET("/party/connections/{id}", {
            params: {
              path: {
                id: res.data.result.entity.id.toString(),
              },
              query: {
                party: partyTypeToJSON(PartyType.customer),
              },
            },
          });
          // console.log(resConnection.data,resConnection.error)
          break;
        }
      }
    }
  }
  // console.log("LOAD CUSTOMER...", res.data?.result.entity);
  return {
    customer: customerResult?.result.entity,
    actions: customerResult?.actions,
    addresses: customerResult?.result.addresses || [],
    contacts: customerResult?.result.contacts || [],
    activities: customerResult?.result.activities || [],
    connections: resConnections,
  };
};

export const openCustomerModal = (
  id?: string,
  callback?: (key: string, value: string) => void
) => {
  if (id && callback) {
    callback(route.customer, id);
  }
};

// export const shouldRevalidate: ShouldRevalidateFunction = ({
//   actionResult,
//   defaultShouldRevalidate,
//   currentParams,
//   currentUrl,
//   formMethod,
// }) => {
//   if (formMethod === "POST" || formMethod === "PUT") {
//     return false;
//   }
//   if(actionResult?.message != undefined){
//     return false;
//   }
//   return defaultShouldRevalidate;
//   // }
//   //
//   // return defaultShouldRevalidate;
// };
