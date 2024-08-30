import { ActionFunctionArgs, defer, json, LoaderFunctionArgs } from "@remix-run/node";
import apiClient from "~/apiclient";
import { DEFAULT_PAGE, DEFAULT_SIZE } from "~/constant";
import ItemVariantsClient from "./variants.client";
import { itemVariantFormSchema } from "~/util/data/schemas/stock/item-variant-schemas";
import { z } from "zod";

type ActionData = {
  action: string;
  itemVariantFormSchema: z.infer<typeof itemVariantFormSchema>;
};
export const action = async ({ request }: ActionFunctionArgs) => {
  const client = apiClient({ request });
  const data = (await request.json()) as ActionData;
  let error:string | undefined = undefined
  let message:string | undefined = undefined
  switch (data.action) {
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
        error = res.error?.detail;
        message = res.data?.message;
      break;
    }
  }
  return json({
    error,message
  });
};

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const client = apiClient({ request });
  const itemVariants = client.GET("/stock/item/variant", {
    params: {
      query: {
        size: DEFAULT_SIZE,
        page: DEFAULT_PAGE,
        parentId: params.code || "",
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
