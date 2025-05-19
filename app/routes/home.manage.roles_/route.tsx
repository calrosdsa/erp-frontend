import { ActionFunctionArgs, json, LoaderFunctionArgs } from "@remix-run/node";
import RolesClient from "./roles.client";
import apiClient from "~/apiclient";
import { DEFAULT_PAGE, DEFAULT_SIZE, LOAD_ACTION } from "~/constant";
import { components } from "~/sdk";
import { z } from "zod";
import {
  createRoleSchema,
  mapToRoleData,
  RoleSchema,
} from "~/util/data/schemas/manage/role-schema";
import { ShouldRevalidateFunctionArgs } from "@remix-run/react";

type ActionData = {
  action: string;
  query: string;
  roleData: RoleSchema;
};
export const action = async ({ request }: ActionFunctionArgs) => {
  const client = apiClient({ request });
  const data = (await request.json()) as ActionData;
  let roles: components["schemas"]["RoleDto"][] = [];
  let actions: components["schemas"]["ActionDto"][] = [];
  let message: string | undefined = undefined;
  let error: string | undefined = undefined;
  let role: components["schemas"]["RoleDto"] | undefined = undefined;
  switch (data.action) {
    case "get": {
      const res = await client.GET("/role", {
        params: {
          query: {
            page: DEFAULT_PAGE,
            size: DEFAULT_SIZE,
            query: data.query || "",
          },
        },
      });
      roles = res.data?.pagination_result.results || [];
      actions = res.data?.actions || [];
      break;
    }
    case "create-role": {
      const res = await client.POST("/role", {
        body: mapToRoleData(data.roleData),
      });
      message = res.data?.message;
      error = res.error?.detail;
      role = res.data?.result;
      break;
    }
    case "edit-role": {
      const res = await client.PUT("/role", {
        body: mapToRoleData(data.roleData),
      });
      message = res.data?.message;
      error = res.error?.detail;
    }
  }
  console.log("MESSAGE ------", message, error, data.roleData);
  return json({ roles, actions, message, error, role });
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
  const params = url.searchParams;
  const res = await client.GET("/role", {
    params: {
      query: {
        page: params.get("page") || DEFAULT_PAGE,
        size: params.get("size") || DEFAULT_SIZE,
        query: params.get("query") || "",
      },
    },
  });
  return json({
    paginationResult: res.data?.pagination_result,
    actions: res.data?.actions,
  });
};

export default function Roles() {
  return <RolesClient />;
}
