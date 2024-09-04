import { ActionFunctionArgs, json, LoaderFunctionArgs } from "@remix-run/node";
import RolesClient from "./roles.client";
import apiClient from "~/apiclient";
import { DEFAULT_PAGE, DEFAULT_SIZE } from "~/constant";
import { components } from "~/sdk";
import { z } from "zod";
import { createRoleSchema } from "~/util/data/schemas/manage/role-schema";

type ActionData = {
  action: string;
  query: string;
  createRole:z.infer<typeof createRoleSchema>
};
export const action = async ({ request }: ActionFunctionArgs) => {
  const client = apiClient({ request });
  const data = (await request.json()) as ActionData;
  let roles: components["schemas"]["Role"][] = [];
  let actions: components["schemas"]["Action"][] = [];
  let message:string | undefined = undefined
  let error:string | undefined = undefined
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
      break
    }
    case "create-role":{
        const d = data.createRole
        const res= await client.POST("/role",{
            body:d
        })
        message= res.data?.message
        error = res.error?.detail
      break;
    }
  }
  return json({ roles, actions,message,error });
};

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
    actions:res.data?.actions,
  });
};

export default function Roles() {
  return <RolesClient />;
}
