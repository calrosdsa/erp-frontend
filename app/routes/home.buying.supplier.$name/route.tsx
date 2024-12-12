import { ActionFunctionArgs, json, LoaderFunctionArgs } from "@remix-run/node";
import apiClient from "~/apiclient";
import SupplierClient from "./supplier.client";
import { editSupplier } from "~/util/data/schemas/buying/supplier-schema";
import { z } from "zod";
import { updateStatusWithEventSchema } from "~/util/data/schemas/base/base-schema";
import { LOAD_ACTION } from "~/constant";
import { ShouldRevalidateFunctionArgs } from "@remix-run/react";

type ActionData = {
  action: string;
  editData: z.infer<typeof editSupplier>;
  updateStatus: z.infer<typeof updateStatusWithEventSchema>;
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const client = apiClient({ request });
  const data = (await request.json()) as ActionData;
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
    case "edit": {
      const d = data.editData;
      console.log("EDIT DATA",d)
      const res = await client.PUT("/supplier", {
        body: {
          name: d.name,
          id: d.id,
          group_id: d.groupID,
        },
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
export const loader = async ({ request }: LoaderFunctionArgs) => {
  const client = apiClient({ request });
  const url = new URL(request.url);
  const searchParams = url.searchParams;
  const res = await client.GET("/supplier/detail/{id}", {
    params: {
      path: {
        id: searchParams.get("id") || "",
      },
    },
  });

  return json({
    supplier: res.data?.result.entity,
    actions: res.data?.actions,
    addresses: res.data?.result.addresses,
    contacts: res.data?.result.contacts,
  });
};

export default function Supplier() {
  return <SupplierClient />;
}
