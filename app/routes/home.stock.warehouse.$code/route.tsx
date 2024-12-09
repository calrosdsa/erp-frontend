import { ActionFunctionArgs, json, LoaderFunctionArgs } from "@remix-run/node";
import WareHouseClient from "./warehouse.client";
import apiClient from "~/apiclient";
import { z } from "zod";
import { editWarehouseSchema } from "~/util/data/schemas/stock/warehouse-schema";
import { LOAD_ACTION } from "~/constant";
import { ShouldRevalidateFunctionArgs } from "@remix-run/react";

type ActionData = {
  action:string
  editData:z.infer<typeof editWarehouseSchema>
}

export const action = async ({ request }: ActionFunctionArgs) => {
  const client = apiClient({ request });
  const data = (await request.json()) as ActionData;
  let message: string | undefined = undefined;
  let error: string | undefined = undefined;
  let actionRes = LOAD_ACTION
  switch (data.action) {
    case "edit": {
      const d = data.editData;
      const res = await client.PUT("/stock/warehouse", {
        body: {
          id: d.id,
          name: d.name,
          parent_id:d.parentID,
          is_group:d.isGroup,
        },
      });
      error = res.error?.detail;
      message = res.data?.message;
      actionRes = ""
      break;
    }
  }
  return json({
    error,
    message,
    action:actionRes,
  });
};

export function shouldRevalidate({
  formMethod,
  defaultShouldRevalidate,
  actionResult
}:ShouldRevalidateFunctionArgs) {
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
  const res = await client.GET("/stock/warehouse/detail/{id}", {
    params: {
      path: {
        id: searchParams.get("id") || "",
      },
    },
  });
  return json({
    warehouse: res.data?.result.entity,
    actions: res.data?.actions,
    addresses:res.data?.result.addresses,
    contacts:res.data?.result.contacts,
    activities:res.data?.result.activities || [],
  });
};

export default function WareHouse() {
  return <WareHouseClient />;
}
