import { DealData, mapToDealData } from "~/util/data/schemas/crm/deal.schema";
import DealModal from "./deal-modal";
import { ActionFunctionArgs, json, LoaderFunctionArgs } from "@remix-run/node";
import apiClient from "~/apiclient";
import { handleError } from "~/util/api/handle-status-code";
import { LOAD_ACTION, MAX_SIZE } from "~/constant";
import { Entity } from "~/types/enums";
import { components } from "~/sdk";
import { ShouldRevalidateFunctionArgs } from "@remix-run/react";
import { route } from "~/util/route";

type ActionData = {
  action: string;
  dealData: DealData;
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const client = apiClient({ request });
  const data = (await request.json()) as ActionData;
  let message: string | undefined = undefined;
  let error: string | undefined = undefined;
  let deal: components["schemas"]["DealDto"] | undefined = undefined;
  let action = LOAD_ACTION;
  switch (data.action) {
    case "edit": {
      const res = await client.PUT("/deal", {
        body: mapToDealData(data.dealData),
      });
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
      deal = res.data?.result;
      break;
    }
  }
  return json({
    action,
    error,
    message,
    deal,
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

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const client = apiClient({ request });
  const url = new URL(request.url);
  const searchParams = url.searchParams;
  const entityId = searchParams.get("entity_id") ?? Entity.DEAL.toString();
console.log("LOAD DEAL...",params)
  // Crear promesas separadas para mejor legibilidad
  const stagesPromise = client.GET("/stage", {
    params: {
      query: {
        size: MAX_SIZE,
        entity_id: entityId,
        column: "index",
        orientation: "ASC",
      },
    },
  });

  // Crear promesa condicional para el detalle del deal
  const dealPromise = params.id
    ? client.GET("/deal/detail/{id}", {
        params: {
          path: {
            id: params.id,
          },
        },
      })
    : Promise.resolve(undefined);

  // Ejecutar promesas en paralelo
  const [stagesRes, dealRes] = await Promise.all([stagesPromise, dealPromise]);

  return json({
    stages: stagesRes.data?.result || [],
    deal: dealRes?.data?.result.entity.deal || null,
    observers: dealRes?.data?.result.entity.participants || [],
    activities: dealRes?.data?.result.activities || [],
    actions: dealRes?.data?.actions,
    contacts: dealRes?.data?.result.contacts || [],
    entityActions: dealRes?.data?.associated_actions,
  });
};

export const openDealModal = (id?:string,callback?:(key:string,value:string)=>void) => {
  if(id && callback){

    callback(route.deal, id);
  }
};
