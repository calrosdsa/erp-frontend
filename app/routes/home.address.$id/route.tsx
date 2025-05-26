import { ActionFunctionArgs, json, LoaderFunctionArgs } from "@remix-run/node";
import AddressClient from "./address-modal";
import apiClient from "~/apiclient";
import { handleError } from "~/util/api/handle-status-code";
import {
  AddressSchema,
  mapToAddressData,
} from "~/util/data/schemas/core/address.schema";
import { z } from "zod";
import { updateStatusWithEventSchema } from "~/util/data/schemas/base/base-schema";
import { components } from "~/sdk";
import { DEFAULT_ID } from "~/constant";

type ActionData = {
  action: string;
  addressData: AddressSchema;
  updateStatus: z.infer<typeof updateStatusWithEventSchema>;
};
export const action = async ({ request }: ActionFunctionArgs) => {
  const client = apiClient({ request });
  const data = (await request.json()) as ActionData;
  let message: string | undefined = undefined;
  let error: string | undefined = undefined;
  let address: components["schemas"]["AddressDto"] | undefined = undefined;
  switch (data.action) {
    case "create-address": {
      const res = await client.POST("/address", {
        body: mapToAddressData(data.addressData),
      });
      error = res.error?.detail;
      message = res.data?.message;
      address = res.data?.result;
      break;
    }
    case "edit-address": {
      const res = await client.PUT("/address", {
        body: mapToAddressData(data.addressData),
      });
      error = res.error?.detail;
      message = res.data?.message;
      break;
    }
    case "update-status": {
      const res = await client.PUT("/address/update-status", {
        body: data.updateStatus,
      });
      error = res.error?.detail;
      message = res.data?.message;
      break;
    }
  }
  return {
    message,
    error,
    address,
  };
};

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const client = apiClient({ request });
  const url = new URL(request.url);
  let addressResult:
    | components["schemas"]["EntityResponseResultEntityAddressDtoBody"]
    | undefined = undefined;
  if (params.id != DEFAULT_ID) {
    const res = await client.GET("/address/detail/{id}", {
      params: {
        path: {
          id: params.id || "",
        },
      },
    });
    addressResult = res.data;
    handleError(res.error);
  }
  return json({
    address: addressResult?.result.entity,
    actions: addressResult?.actions,
    activities: addressResult?.result.activities,
  });
};
