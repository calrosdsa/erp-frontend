import {
  ActionFunctionArgs,
  defer,
  json,
  LoaderFunctionArgs,
} from "@remix-run/node";
import ItemDetailClient from "./item.client";
import apiClient from "~/apiclient";
import { DEFAULT_PAGE, DEFAULT_SIZE, LOAD_ACTION } from "~/constant";
import { Await, Outlet, ShouldRevalidateFunctionArgs, useLoaderData } from "@remix-run/react";
import { Suspense } from "react";
import FallBack from "@/components/layout/Fallback";
import { z } from "zod";
import { components } from "~/sdk";
import { editItemSchema } from "~/util/data/schemas/stock/item-schemas";
import { editItemInventory } from "~/util/data/schemas/stock/item-inventory-schema";

type ActionData = {
  action: string;
  editItem: z.infer<typeof editItemSchema>;
  editInventory: z.infer<typeof editItemInventory>;
};
export const action = async ({ request }: ActionFunctionArgs) => {
  const client = apiClient({ request });
  const data = (await request.json()) as ActionData;
  const url = new URL(request.url);
  let error: string | undefined = undefined;
  let message: string | undefined = undefined;
  let actionRes = LOAD_ACTION;
  switch (data.action) {
    case "edit-inventory": {
      const d = data.editInventory;
      const res = await client.PUT("/stock/item/inventory-setting", {
        body: {
          item_id:d.itemID,
          has_serial_no: d.hasSerialNo,
          serial_no_template: d.serialNoTemplate,
          shelf_life_in_days: d.shelfLifeInDays,
          warranty_period_in_days: d.warrantyPeriodInDays,
          weight_uom_id: d.weightUomID,
          wight_per_unit: d.wightPerUnit
        },
      });
      error = res.error?.detail;
      message = res.data?.message;
      break;
    }
    case "edit-item": {
      const d = data.editItem;
      const res = await client.PUT("/stock/item", {
        body: {
          id: d.id,
          name: d.name,
          item_code:d.code,
          group_id: d.groupID,
          uom_id: d.uomID,
          maintain_stock: d.maintainStock,
          description: d.description,
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
  const tab = searchParams.get("tab");
  let inventory: components["schemas"]["ItemInventoryDto"] | undefined =
    undefined;
  const res = await client.GET("/stock/item/{id}", {
    params: {
      path: {
        id: searchParams.get("id") || "",
      },
    },
  });
  switch (tab) {
    case "inventory": {
      const resInventory = await client.GET(
        "/stock/item/inventory-setting/{id}",
        {
          params: {
            path: {
              id: res.data?.result.entity.id.toString() || "",
            },
          },
        }
      );
      inventory = resInventory.data?.result;
      break;
    }
  }
  return json({
    item: res.data?.result.entity,
    activities: res.data?.result.activities,
    associatedActions: res.data?.associated_actions,
    actions: res.data?.actions,
    inventory: inventory,
    // stockLevel,
  });
};

export default function ItemDetail() {
  const { item } = useLoaderData<typeof loader>();
  return (
    <div>
      <ItemDetailClient />
      {/* <Suspense fallback={<FallBack />}>
        <Await resolve={item}>
          {(item: any) => {
            const data = item.data as components["schemas"]["EntityResponseResultEntityItemDetailDtoBody"]
            return (
              <div>
                <ItemDetailClient
                  item={data.result.entity}
                />
              </div>
            );
          }}
        </Await>
      </Suspense> */}
    </div>
  );
}
