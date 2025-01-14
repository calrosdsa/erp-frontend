import { ActionFunctionArgs, json, redirect } from "@remix-run/node";
import CreateItemAttributeClient, {
  createItemAttributeSchema,
} from "./create-item-attribute.client";
import { z } from "zod";
import apiClient from "~/apiclient";
import { route } from "~/util/route";

type ActionData = {
  createItemData: z.infer<typeof createItemAttributeSchema>;
};
export const action = async ({ request }: ActionFunctionArgs) => {
  const client = apiClient({ request });
  const data = (await request.json()) as ActionData;
  let errorAction: string | undefined = undefined;
  const res = await client.POST("/stock/item/item-attribute", {
    body: data.createItemData,
  });
  if (res.error != undefined) {
    errorAction = res.error.detail;
  }
  if (res.data) {
    const r = route
    return redirect(r.toItemAttributeDetail(res.data.result.Name))
    // successMessage = res.data.message;
  }

  return json({
    errorAction,
  });
};

export default function CreateItemAttribute() {
  return (
    <div>
      <CreateItemAttributeClient />
    </div>
  );
}
