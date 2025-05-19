import { json, LoaderFunctionArgs } from "@remix-run/node";
import apiClient from "~/apiclient";
import { DEFAULT_SIZE, LOAD_ACTION } from "~/constant";
import ModulesClient from "./modules.client";
import { components, operations } from "~/sdk";
import { ShouldRevalidateFunctionArgs } from "@remix-run/react";

type ActionData = {
  action: string;
  parameters: operations["modules"]["parameters"];
};

export const action = async ({ request }: LoaderFunctionArgs) => {
  const client = apiClient({ request });
  const data = (await request.json()) as ActionData;
  let actions: components["schemas"]["ActionDto"][] = [];
  let results: components["schemas"]["ModuleDto"][] = [];
  switch (data.action) {
    case "list": {
      const res = await client.GET("/module", {
        params: data.parameters,
      });
      actions = res.data?.actions || [];
      results = res.data?.result || [];
    }
  }
  return {
    actions,
    results,
  };
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
  const res = await client.GET("/module", {
    params: {
      query: {
        size: searchParams.get("size") || DEFAULT_SIZE,
      },
    },
  });

  return json({
    results: res.data?.result,
    actions: res.data?.actions,
  });
};

export default function Module() {
  return <ModulesClient />;
}
