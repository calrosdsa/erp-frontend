import { DealData, mapToDealData } from "~/util/data/schemas/crm/deal.schema";
import NewDealClient from "./deal-detail.client";
import { ActionFunctionArgs, json, LoaderFunctionArgs } from "@remix-run/node";
import apiClient from "~/apiclient";
import { handleError } from "~/util/api/handle-status-code";
import { MAX_SIZE } from "~/constant";
import { Entity } from "~/types/enums";

type ActionData = {
  action: string;
  dealData: DealData;
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const client = apiClient({ request });
  const data = (await request.json()) as ActionData;
  let message: string | undefined = undefined;
  let error: string | undefined = undefined;
  switch (data.action) {
    case "edit":{
      const res =await client.PUT("/deal",{
        body: mapToDealData(data.dealData),
      })
      error = res.error?.detail;
      message = res.data?.message;
      break;
    }
    case "create": {
      const res = await client.POST("/deal", {
        body: mapToDealData(data.dealData),
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
  const searchParams = url.searchParams;
  
  const id = searchParams.get("id");
  const entityId = searchParams.get("entity_id") ?? Entity.DEAL.toString();

  // Crear promesas separadas para mejor legibilidad
  const stagesPromise = client.GET("/stage", {
    params: {
      query: {
        size: MAX_SIZE,
        entity_id: entityId,
        column: "index",
        orientation: "ASC"
      }
    }
  });

  // Crear promesa condicional para el detalle del deal
  const dealPromise = id ? client.GET("/deal/detail/{id}", {
    params: {
      path: { id }
    }
  }) : Promise.resolve(undefined);

  // Ejecutar promesas en paralelo
  const [stagesRes, dealRes] = await Promise.all([
    stagesPromise,
    dealPromise
  ]);

  return json({
    stages: stagesRes.data?.result || [],
    deal: dealRes?.data?.result.entity || null,
    activities:dealRes?.data?.result.activities || [],
    actions:dealRes?.data?.actions,
    contacts:dealRes?.data?.result.contacts,
    entityActions:dealRes?.data?.associated_actions,
  });
};

export default function NewDeal() {
  return <NewDealClient />;
}
