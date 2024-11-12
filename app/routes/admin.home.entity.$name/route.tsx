import { ActionFunctionArgs, json, LoaderFunctionArgs } from "@remix-run/node";
import apiClientAdmin from "~/apiclientAdmin";
import EntityDetailClient from "./entity-detail.client";
import { z } from "zod";
import { addEntityActionSchema } from "./tab/entity-info";

type ActionDto = {
  action: string;
  addEntityAction: z.infer<typeof addEntityActionSchema>;
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const client = apiClientAdmin({ request });
  const data = (await request.json()) as ActionDto;
  let error: string | undefined = undefined;
  let message: string | undefined = undefined;
  switch (data.action) {
    case "add-entity-action": {
      const d = data.addEntityAction;
      const res = await client.POST("/admin/core/entity/action", {
        body: {
          name: d.name,
          entity_id: d.entityID,
        },
      });
      message = res.data?.message
      error = res.error?.detail
      break;
    }
  }
  // const url = new URL(request.url)
  return json({
    error,message
  });
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const client = apiClientAdmin({ request });
  const url = new URL(request.url);
  const searchParams = url.searchParams;
  const res = await client.GET("/admin/core/entity/detail/{id}", {
    params: {
      path: {
        id: searchParams.get("id") || "",
      },
    },
  });

  return json({
    entity: res.data?.result.entity.entity,
    actions: res.data?.result.entity.actions,
  });
};

export default function EntityDetail() {
  return <EntityDetailClient />;
}
