import {
  ActionFunctionArgs,
  defer,
  json,
  LoaderFunctionArgs,
} from "@remix-run/node";
import apiClient from "~/apiclient";
import { DEFAULT_PAGE, DEFAULT_SIZE } from "~/constant";
import ItemVariantsClient from "./variants.client";
import { z } from "zod";
import { createItemVariantSchema } from "~/util/data/schemas/stock/item-variant-schemas";

type ActionData = {
  action: string;
  createItemVariant: z.infer<typeof createItemVariantSchema>;
};
export const action = async ({ request }: ActionFunctionArgs) => {
  const client = apiClient({ request });
  const data = (await request.json()) as ActionData;
  let error: string | undefined = undefined;
  let message: string | undefined = undefined;
  switch (data.action) {
    case "add-variant": {
      const itemVairantForm = data.createItemVariant;
      const res = await client.POST("/stock/item/variant", {
        body: {
          attribute_value_id: itemVairantForm.itemAttributeValueId,
          item_uuid: itemVairantForm.itemUuid,
          name: itemVairantForm.name,
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
  const url = new URL(request.url)
  const searchParams = url.searchParams
  const itemVariants = client.GET("/stock/item/variant", {
    params: {
      query: {
        size: DEFAULT_SIZE,
        page: DEFAULT_PAGE,
        parentId: searchParams.get("id") || "",
      },
    },
  });
  return defer({
    itemVariants: itemVariants,
  });
};

export default function ItemVariants() {
  return <ItemVariantsClient />;
}
