import { ActionFunctionArgs, json, LoaderFunctionArgs } from "@remix-run/node";
import CourtClient from "./courts.cliet";
import apiClient from "~/apiclient";
import { DEFAULT_PAGE, DEFAULT_SIZE, LOAD_ACTION } from "~/constant";
import { handleError } from "~/util/api/handle-status-code";
import { components, operations } from "~/sdk";
import { ShouldRevalidateFunctionArgs } from "@remix-run/react";

type ActionData = {
  action: string;
  query: operations["courts"]["parameters"]["query"];
};
export const action = async ({ request }: ActionFunctionArgs) => {
  const client = apiClient({ request });
  const data = (await request.json()) as ActionData;
  let message: string | undefined = undefined;
  let error: string | undefined = undefined;
  let courts: components["schemas"]["CourtDto"][] = [];
  let actions: components["schemas"]["ActionDto"][] = [];
  switch (data.action) {
    case "get": {
      const res = await client.GET("/court", {
        params: {
          query: data.query
        },
      });
      courts = res.data?.result || [];
      actions = res.data?.actions || [];
      break;
    }
  }
  return json({
    message,
    error,
    courts,
    actions,
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

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const client = apiClient({ request });
  const url = new URL(request.url);
  const searchParams = url.searchParams;
  const res = await client.GET("/court", {
    params: {
      query: {
        size: searchParams.get("size") || DEFAULT_SIZE,
        query: searchParams.get("query") || "",
      },
    },
  });
  handleError(res.error);
  return json({
    results: res.data?.result,
    actions: res.data?.actions,
  });
};

export default function Court() {
  return <CourtClient />;
}
