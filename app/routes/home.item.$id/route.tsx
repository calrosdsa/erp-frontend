import { ActionFunctionArgs, json, LoaderFunctionArgs } from "@remix-run/node";
import apiClient from "~/apiclient";
import { DEFAULT_ID, LOAD_ACTION } from "~/constant";
import { Await, Outlet, ShouldRevalidateFunctionArgs } from "@remix-run/react";
import { components, operations } from "~/sdk";
import {
  ItemSchema,
  mapToItemData,
} from "~/util/data/schemas/stock/item-schemas";

type ActionData = {
  action: string;
  itemData: ItemSchema;
};
export const action = async ({ request }: ActionFunctionArgs) => {
  const client = apiClient({ request });
  const data = (await request.json()) as ActionData;
  const url = new URL(request.url);
  let error: string | undefined = undefined;
  let message: string | undefined = undefined;
  let item: components["schemas"]["ItemDto"] | undefined = undefined;
  let actionRes = LOAD_ACTION;
  switch (data.action) {   
    case "create-item": {
      const res = await client.POST("/stock/item", {
        body: mapToItemData(data.itemData),
      });
      error = res.error?.detail;
      message = res.data?.message;
      item = res.data?.result;
      break;
    }
    case "edit-item": {
      const res = await client.PUT("/stock/item", {
        body: mapToItemData(data.itemData),
      });
      error = res.error?.detail;
      message = res.data?.message;
      console.log("ERROR", res.error);
      break;
    }
  }
  return json({
    error,
    message,
    item,
    action: actionRes,
  });
};

export function shouldRevalidate({
  formMethod,
  defaultShouldRevalidate,
  actionResult,
}: ShouldRevalidateFunctionArgs) {
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
  let itemData:
    | components["schemas"]["EntityResponseResultEntityItemDetailDtoBody"]
    | undefined = undefined;
  undefined;
  if (params.id != DEFAULT_ID) {
    const res = await client.GET("/stock/item/{id}", {
      params: {
        path: {
          id: params.id || "",
        },
      },
    });
    itemData = res.data;
  }

  return json({
    item: itemData?.result.entity,
    activities: itemData?.result.activities,
    associatedActions: itemData?.associated_actions,
    actions: itemData?.actions,
    // stockLevel,
  });
};

// export default function ItemDetail() {
//   const { item } = useLoaderData<typeof loader>();
//   return (
//     <div>
//       <ItemDetailClient />
//       {/* <Suspense fallback={<FallBack />}>
//         <Await resolve={item}>
//           {(item: any) => {
//             const data = item.data as components["schemas"]["EntityResponseResultEntityItemDetailDtoBody"]
//             return (
//               <div>
//                 <ItemDetailClient
//                   item={data.result.entity}
//                 />
//               </div>
//             );
//           }}
//         </Await>
//       </Suspense> */}
//     </div>
//   );
// }
