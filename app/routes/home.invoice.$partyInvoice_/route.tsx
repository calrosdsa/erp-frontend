import { ActionFunctionArgs, json, LoaderFunctionArgs } from "@remix-run/node";
import apiClient from "~/apiclient";
import { DEFAULT_PAGE, DEFAULT_SIZE } from "~/constant";
import { handleError } from "~/util/api/handle-status-code";
import InvoicesClient from "./invoices.client";
import { components } from "~/sdk";
// export const action = async ({ request, params }: ActionFunctionArgs) => {
//   const client = apiClient({ request });
//   const url = new URL(request.url);
//   const searchParams = url.searchParams;
//   const action = searchParams.get("action");
//   let invoices:components["schemas"]
//   switch (action) {
//     case "get": {
//       const res = await client.GET("/invoice/{party}", {
//         params: {
//           query: {
//             page: searchParams.get("page") || DEFAULT_PAGE,
//             size: searchParams.get("size") || DEFAULT_SIZE,
//           },
//           path: {
//             party: params.partyInvoice || "",
//           },
//         },
//       });
//       break;
//     }
//   }
// //   handleError(res.error);
//   return json({
//     invoices: res.data?.pagination_result,
//     actions: res.data?.actions,
//   });
// };

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const client = apiClient({ request });
  const url = new URL(request.url);
  const searchParams = url.searchParams;
  console.log("INVOICES...",)
  const res = await client.GET("/invoice/{party}", {
    params: {
      query: {
        page: searchParams.get("page") || DEFAULT_PAGE,
        size: searchParams.get("size") || DEFAULT_SIZE,
        query:searchParams.get("query") || "",
      },
      path: {
        party: params.partyInvoice || "",
      },
    },
  });
  handleError(res.error);
  return json({
    results: res.data?.pagination_result.results,
    actions: res.data?.actions,
  });
};

export default function PurchaseInvoices() {
  return <InvoicesClient />;
}
