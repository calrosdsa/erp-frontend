import { ActionFunctionArgs, json, LoaderFunctionArgs } from "@remix-run/node";
import apiClient from "~/apiclient";
import { DEFAULT_PAGE, DEFAULT_SIZE } from "~/constant";
import { handleError } from "~/util/api/handle-status-code";
import CostCenterClient from "./charges-template.client";
import { z } from "zod";
import { State, stateToJSON } from "~/gen/common";
import { components } from "~/sdk";
import ChargesTemplateClient from "./charges-template.client";

type ActionData = {
  action: string;
  query: string;
};
export const action = async ({ request }: ActionFunctionArgs) => {
  const client = apiClient({ request });
  const data = (await request.json()) as ActionData;
  let message: string | undefined = undefined;
  let error: string | undefined = undefined;
  let chargesTemplates: components["schemas"]["ChargesTemplateDto"][] = [];
  let actions: components["schemas"]["ActionDto"][] = [];
  console.log("CHARGES TEMPLATE...")
  switch (data.action) {
    case "get": {
      const res = await client.GET("/charge-template", {
        params: {
          query: {
            page: DEFAULT_PAGE,
            size: DEFAULT_SIZE,
            query: data.query,
          },
        },
      });
      console.log(res.data?.pagination_result.results)
      chargesTemplates = res.data?.pagination_result.results || [];
      actions = res.data?.actions || [];
      break;
    }
  }
  return json({
    message,
    error,
    chargesTemplates,
  });
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const client = apiClient({ request });
  const url = new URL(request.url);
  const searchParams = url.searchParams;
  const res = await client.GET("/charge-template", {
    params: {
      query: {
        page: searchParams.get("page") || DEFAULT_PAGE,
        size: searchParams.get("size") || DEFAULT_SIZE,
      },
    },
  });
  handleError(res.error);
  return json({
    paginationResult: res.data?.pagination_result,
    actions: res.data?.actions,
  });
};

export default function ChargesTemplate() {
  return <ChargesTemplateClient />;
}
