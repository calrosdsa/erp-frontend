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
import { components } from "index";
import { itemDtoSchema } from "~/util/data/schemas/stock/item-schemas";
import { z } from "zod";
import { itemVariantFormSchema } from "~/util/data/schemas/stock/item-variant-schemas";
import { itemPriceFormSchema } from "~/util/data/schemas/stock/item-price-schema";

type ActionData = {
  action: string;
  item: z.infer<typeof itemDtoSchema>;
};
export const action = async ({ request }: ActionFunctionArgs) => {
  const client = apiClient({ request });
  const data = (await request.json()) as ActionData;
  let error: string | undefined = undefined;
  let message: string | undefined = undefined;
  switch (data.action) {
    case "update-item": {
      console.log(data.item);
      const res = await client.PUT("/stock/item", {
        body: {
          entity: data.item,
        },
      });
      console.log(res.error);
      if (res.data) {
        message = res.data.message;
      }
      if (res.error) {
        error = res.error.detail;
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
  const code = params.code;
  const res = client.GET("/stock/item/{id}", {
    params: {
      path: {
        id: code || "",
      },
    },
  });

  return defer({
    item: res,
  });
};

export default function ItemDetail() {
  const { item } = useLoaderData<typeof loader>();
  return (
    <div>
      <Suspense fallback={<FallBack />}>
        <Await resolve={item}>
          {(item: any) => {
            return (
              <div>
                <ItemDetailClient
                  data={
                    item.data as components["schemas"]["EntityResponseResultEntityItemBody"]
                  }
                />
              </div>
            );
          }}
        </Await>
      </Suspense>
    </div>
  );
}
