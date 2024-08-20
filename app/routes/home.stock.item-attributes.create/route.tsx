import { ActionFunctionArgs, json } from "@remix-run/node";
import CreateItemAttributeClient, {
  createItemAttributeSchema,
} from "./create-item-attribute.client";
import { z } from "zod";
import apiClient from "~/apiclient";

type ActionData = {
  createItemData: z.infer<typeof createItemAttributeSchema>;
};
export const action = async ({ request }: ActionFunctionArgs) => {
  const client = apiClient({ request });
  const data = (await request.json()) as ActionData;
  let errorAction: string | undefined = undefined;
  let successMessage: string | undefined = undefined;
  const res = await client.POST("/stock/item/item-attribute", {
    body: data.createItemData,
  });
  if (res.error != undefined) {
    errorAction = res.error.detail;
  }
  if (res.data != undefined) {
    successMessage = res.data.message;
  }
  return json({
    errorAction,
    successMessage,
  });
};

export default function CreateItemAttribute() {
  return (
    <div>
      <CreateItemAttributeClient />
    </div>
  );
}
