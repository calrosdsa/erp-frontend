import { ActionFunctionArgs, json, LoaderFunctionArgs } from "@remix-run/node";
import apiClient from "~/apiclient";
import { DEFAULT_PAGE, DEFAULT_SIZE } from "~/constant";
import MovingForms from "./moving-forms.client";
import { endOfMonth, format, formatRFC3339, startOfMonth } from "date-fns";
import { handleError } from "~/util/api/handle-status-code";

type ActionData = {
  action: string;
  fromDate:string;
  toDate:string;
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const client = apiClient({ request });
  const url = new URL(request.url);
  const searchParams = url.searchParams;
  const res = await client.GET("/pianoForms", {
    params: {
      query: {
        page: searchParams.get("page") || DEFAULT_PAGE,
        size: searchParams.get("size") || DEFAULT_SIZE,
        query: searchParams.get("query") || "",
        order: searchParams.get("order") || "",
        column: searchParams.get("column") || "",
      },
    },
  });
  handleError(res.error)
  return json({
    paginationResult: res.data?.pagination_result,
  });
};

export default function RelocationAndMoving() {
  return <MovingForms />;
}
