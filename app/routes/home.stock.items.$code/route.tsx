import {
  ActionFunctionArgs,
  defer,
  json,
  LoaderFunctionArgs,
} from "@remix-run/node";
import ItemDetailClient from "./item.client";
import apiClient from "~/apiclient";
import { DEFAULT_PAGE, DEFAULT_SIZE } from "~/constant";
import { Await, useLoaderData } from "@remix-run/react";
import { Suspense } from "react";
import FallBack from "@/components/layout/Fallback";
import { z } from "zod";
import { components } from "~/sdk";
import { updateItemSchema } from "~/util/data/schemas/stock/item-schemas";

type ActionData = {
  action: string;
  updateItem: z.infer<typeof updateItemSchema>;
};
export const action = async ({ request }: ActionFunctionArgs) => {
  const client = apiClient({ request });
  const data = (await request.json()) as ActionData;
  const url = new URL(request.url)
  const searchParams = url.searchParams
  let error: string | undefined = undefined;
  let message: string | undefined = undefined;
  switch (data.action) {
    case "update-item": {
      const d = data.updateItem
      const res = await client.PUT("/stock/item", {
        body: {
          name:d.name,
          item_type:d.itemType,
        },
        params:{
          query:{
            parentId:searchParams.get("id") || ""
          }
        }
      });
      if (res.data) {
        message = res.data.message;
      }
      if (res.error) {
        error = res.error.detail
      }
      break
    }
  }
  return json({
    error,
    message,
  });
};

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const client = apiClient({ request });
  const url = new URL(request.url)
  const searchParams = url.searchParams
  const res = await client.GET("/stock/item/{id}", {
    params: {
      path: {
        id: searchParams.get("id") || "",
      },
    },
  });
  return json({
    item: res.data?.result.entity,
  });
};

export default function ItemDetail() {
  const { item } = useLoaderData<typeof loader>();
  return (
    <div>
      <ItemDetailClient/>
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
