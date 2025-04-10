import { ActionFunctionArgs, json, LoaderFunctionArgs } from "@remix-run/node";
import { z } from "zod";
import apiClient from "~/apiclient";
import { DEFAULT_ENABLED, DEFAULT_PAGE, DEFAULT_SIZE, LOAD_ACTION } from "~/constant";
import { components } from "~/sdk";
import { PartyType } from "~/types/enums";
import { createGroupSchema } from "~/util/data/schemas/group-schema";
import GroupsClient from "./groups.client";
import { ShouldRevalidateFunctionArgs } from "@remix-run/react";

type ActionData = {
  action: string;
  createGroup: z.infer<typeof createGroupSchema>;
  query: string;
  partyType: string;
  isGroup: boolean;
};

export const action = async ({ request, params }: ActionFunctionArgs) => {
  const client = apiClient({ request });
  const data = (await request.json()) as ActionData;
  let message: string | undefined = undefined;
  let error: string | undefined = undefined;
  console.log("ACTION GROUPS", data);
  let groups: components["schemas"]["GroupDto"][] = [];
  let actions: components["schemas"]["ActionDto"][] = [];
  switch (data.action) {
    case "get": {
      const res = await client.GET("/group/{party}", {
        params: {
          path: {
            party: params.party || "",
          },
          query: {
            page: DEFAULT_PAGE,
            size: DEFAULT_SIZE,
            query: data.query,
            enabled: DEFAULT_ENABLED,
            is_group: data.isGroup.toString(),
          },
        },
      });
      groups = res.data?.pagination_result.results || [];
      actions = res.data?.actions || [];
      break;
    }
    case "create-group": {
      const d = data.createGroup;
      const res = await client.POST("/group", {
        body: {
          name: d.name,
          // is_group:d.is_group,
          party_type_code: d.party_type_code,
          // enabled:d.enabled,
          // parent_id:d.parentID,
        },
      });
      message = res.data?.message;
      error = res.error?.detail;
      break;
    }
  }
  return {
    message,
    error,
    groups,
    actions,
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

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const client = apiClient({ request });
  const url = new URL(request.url);
  const searchParams = url.searchParams;
  const res = await client.GET("/group/{party}", {
    params: {
      path: {
        party: params.party || "",
      },
      query: {
        query: searchParams.get("query") || "",
        page: searchParams.get("page") || DEFAULT_PAGE,
        size: searchParams.get("size") || DEFAULT_SIZE,
      },
    },
  });
  console.log(res.error, res.data);
  return json({
    paginationResult: res.data?.pagination_result,
    actions: res.data?.actions,
  });
};

export default function Groups() {
  return <GroupsClient />;
}
