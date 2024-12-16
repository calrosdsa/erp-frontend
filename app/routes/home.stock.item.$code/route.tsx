import {
  ActionFunctionArgs,
  defer,
  json,
  LoaderFunctionArgs,
} from "@remix-run/node";
import ItemDetailClient from "./item.client";
import apiClient from "~/apiclient";
import { DEFAULT_PAGE, DEFAULT_SIZE } from "~/constant";
import { Await, Outlet, useLoaderData } from "@remix-run/react";
import { Suspense } from "react";
import FallBack from "@/components/layout/Fallback";
import { z } from "zod";
import { components } from "~/sdk";
import { editItemSchema } from "~/util/data/schemas/stock/item-schemas";

type ActionData = {
  action: string;
  editItem: z.infer<typeof editItemSchema>;
};
export const action = async ({ request }: ActionFunctionArgs) => {
  const client = apiClient({ request });
  const data = (await request.json()) as ActionData;
  const url = new URL(request.url);
  let error: string | undefined = undefined;
  let message: string | undefined = undefined;
  switch (data.action) {
    case "edit-item": {
      const d = data.editItem;
      const res = await client.PUT("/stock/item", {
        body: {
          id: d.id,
          name: d.name,
          group_id: d.groupID,
          uom_id: d.uomID,
          maintain_stock:d.maintainStock,
          description:d.description,
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
  });
};

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
    const client = apiClient({ request });
  const url = new URL(request.url);
  const searchParams = url.searchParams;
  const tab = searchParams.get("tab");
  const res = await client.GET("/stock/item/{id}", {
    params: {
      path: {
        id: searchParams.get("id") || "",
      },
    },
  });
  return json({
    item: res.data?.result.entity,
    activities: res.data?.result.activities,
    associatedActions: res.data?.associated_actions,
    actions:res.data?.actions,
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
