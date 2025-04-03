import {
  ActionFunctionArgs,
  defer,
  json,
  LoaderFunctionArgs,
  redirect,
} from "@remix-run/node";
import SupplierModal from "./supplier-modal";
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
import { mapToSupplierData, SupplierData } from "~/util/data/schemas/buying/supplier-schema";

type ActionData = {
  action: string;
  supplierData: SupplierData;
  updateStatus: z.infer<typeof updateStatusWithEventSchema>;
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const client = apiClient({ request });
  const data = (await request.json()) as ActionData;
  const r = route;
  let actionRes = LOAD_ACTION;
  let message: string | undefined = undefined;
  let error: string | undefined = undefined;
  switch (data.action) {
    case "update-status": {
      const res = await client.PUT("/supplier/update-status", {
        body: data.updateStatus,
      });
      message = res.data?.message;
      error = res.error?.detail;
      break;
    }
    case "create-supplier": {
      const res = await client.POST("/supplier", {
        body: mapToSupplierData(data.supplierData),
      });
      error = res.error?.detail;
      message = res.data?.message;
      break;
    }
    case "edit-supplier": {
      const res = await client.PUT("/supplier", {
        body: mapToSupplierData(data.supplierData),
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
  console.log(" LOADER CUSTOMER NAME -----", params.name);
  const r = route;
  let resConnections: Promise<FetchResponse<any, any, any>> | undefined =
    undefined;
  const res = await client.GET("/supplier/detail/{id}", {
    params: {
      path: {
        id: params.id || "",
      },
    },
  });
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
              party: partyTypeToJSON(PartyType.supplier),
            },
          },
        });
        // console.log(resConnection.data,resConnection.error)
        break;
      }
    }
  }
  console.log("LOAD Supplier...", params.name);
  return {
    supplier: res.data?.result.entity,
    actions: res.data?.actions,
    addresses: res.data?.result.addresses || [],
    contacts: res.data?.result.contacts || [],
    activities: res.data?.result.activities || [],
    connections: resConnections,
  };
};

export const openSupplierModal = (
  id?: string,
  callback?: (key: string, value: string) => void
) => {
  if (id && callback) {
    callback(route.supplier, id);
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
