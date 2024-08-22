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
import { components } from "~/sdk";
import { itemDtoSchema } from "~/util/data/schemas/stock/item-schemas";
import { z } from "zod";
import { itemVariantFormSchema } from "~/util/data/schemas/stock/item-variant-schemas";
import { itemPriceFormSchema } from "~/util/data/schemas/stock/item-price-schema";

type ActionData = {
  action: string;
  item: z.infer<typeof itemDtoSchema>;
  itemVariantFormSchema: z.infer<typeof itemVariantFormSchema>;
  itemPriceFormSchema: z.infer<typeof itemPriceFormSchema>;
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
    case "add-variant": {
      const itemVairantForm = data.itemVariantFormSchema;
      const res = await client.POST("/stock/item/variant", {
        body: {
          itemVariant: {
            itemAttributeValueId: itemVairantForm.itemAttributeValueId,
            itemId: itemVairantForm.itemId,
            name: itemVairantForm.name,
          },
        },
      });
      console.log(res.error);
      if (res.error) {
        error = res.error.detail;
      }
      if (res.data) {
        message = res.data.message;
      }
      break;
    }
    case "add-item-price": {
      const itemPriceFormData = data.itemPriceFormSchema;
      const res = await client.POST("/stock/item/item-price", {
        body: {
          itemPrice: {
            itemId: itemPriceFormData.itemId,
            itemQuantity: Number(itemPriceFormData.itemQuantity),
            priceListId: itemPriceFormData.priceListId,
            rate: Number(itemPriceFormData.rate),
            taxId: itemPriceFormData.taxId,
          },
          plugins: itemPriceFormData.plugins || [],
        },
      });
      console.log(res.error)
      if (res.data) {
        message = res.data.message;
      }
      if (res.error) {
        error = res.error.detail;
      }
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
  const code = params.code;
  const res = client.GET("/stock/item/{id}", {
    params: {
      path: {
        id: code || "",
      },
    },
  });

  const itemVariants = client.GET("/stock/item/variant", {
    params: {
      query: {
        size: DEFAULT_SIZE,
        page: DEFAULT_PAGE,
        parentId: code || "",
      },
    },
  });

  const itemPrices = await client.GET("/stock/item/item-price/{itemCode}", {
    params: {
      query: {
        size: DEFAULT_SIZE,
        page: DEFAULT_PAGE,
      },
      path: {
        itemCode: code || "",
      },
    },
  });
  return defer({
    item: res,
    itemVariants: itemVariants,
    itemPrices: itemPrices.data,
  });
};

export default function ItemDetail() {
  const { item, itemPrices } = useLoaderData<typeof loader>();
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
