import { DealData, mapToDealData } from "~/util/data/schemas/crm/deal.schema";
import NewDealClient from "./new-deal.client";
import { ActionFunctionArgs, json, LoaderFunctionArgs } from "@remix-run/node";
import apiClient from "~/apiclient";
import { handleError } from "~/util/api/handle-status-code";
import { MAX_SIZE } from "~/constant";
import { Entity } from "~/types/enums";

type ActionData = {
  action: string;
  createData: DealData;
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const client = apiClient({ request });
  const data = (await request.json()) as ActionData;
  let message: string | undefined = undefined;
  let error: string | undefined = undefined;
  switch (data.action) {
    case "create": {
      const res = await client.POST("/deal", {
        body: mapToDealData(data.createData),
      });
      error = res.error?.detail;
      message = res.data?.message;
      break;
    }
  }
  return json({
    error,
    message,
  });
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const client = apiClient({ request });
  const url = new URL(request.url);
  const searchParams = url.searchParams

  const [stagesRes] = await Promise.all([
    client.GET("/stage", {
      params: {
        query: {
          size: MAX_SIZE,
          entity_id: searchParams.get("entity_id") ?? Entity.DEAL.toString(),
          column: "index",
          orientation: "ASC",
        },
      },
    }),
  ]);
  return json({
    stages: stagesRes.data?.result || [],
  });
};

export default function NewDeal() {
  return <NewDealClient />;
}
