import { DealData, mapToDealData } from "~/util/data/schemas/crm/deal-schema";
import DealModal from "./deal-modal";
import { ActionFunctionArgs, json, LoaderFunctionArgs } from "@remix-run/node";
import apiClient from "~/apiclient";
import { handleError } from "~/util/api/handle-status-code";
import { DEFAULT_ID, LOAD_ACTION, MAX_SIZE } from "~/constant";
import { Entity } from "~/types/enums";
import { components } from "~/sdk";
import { ShouldRevalidateFunctionArgs } from "@remix-run/react";
import { route } from "~/util/route";
import { ItemLineType, itemLineTypeToJSON } from "~/gen/common";

type ActionData = {
  action: string;
  dealData: DealData; //From zod schema type 
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const client = apiClient({ request });
  const data = (await request.json()) as ActionData;
  let message: string | undefined = undefined;
  let error: string | undefined = undefined;
  let deal: components["schemas"]["DealDto"] | undefined = undefined;
  let action = LOAD_ACTION;
  let shouldRevalidate: boolean = false;
  switch (data.action) {
    case "edit": {
      const res = await client.PUT("/deal", {
        body: mapToDealData(data.dealData),
      });
      error = res.error?.detail;
      message = res.data?.message;
      shouldRevalidate = true;
      break;
    }
    case "create": {
      const res = await client.POST("/deal", {
        body: mapToDealData(data.dealData),
      });
      error = res.error?.detail;
      message = res.data?.message;
      deal = res.data?.result;
      shouldRevalidate = true;
      break;
    }
  }
  return json({
    action,
    error,
    message,
    deal,
    shouldRevalidate,
  });
};

export function shouldRevalidate({
  formMethod,
  defaultShouldRevalidate,
  actionResult,
}: ShouldRevalidateFunctionArgs) {
  if (actionResult?.shouldRevalidate) {
    return defaultShouldRevalidate;
  }
  return false;
}

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const client = apiClient({ request });
  const url = new URL(request.url);
  const searchParams = url.searchParams;

  const entityId = searchParams.get("entity_id") ?? Entity.DEAL.toString();
  let stages: components["schemas"]["StageDto"][] = [];
  let dealData:
    | components["schemas"]["EntityResponseResultEntityDealDetailDtoBody"]
    | undefined = undefined;
  let lineItems: components["schemas"]["LineItemDto"][] = [];

  if (params.id != DEFAULT_ID) {
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
    const dealPromise = client.GET("/deal/detail/{id}", {
      params: {
        path: {
          id: params.id || "",
        },
      },
    });

    const lineItemsPromise = client.GET("/item-line", {
      params: {
        query: {
          line_type: itemLineTypeToJSON(ItemLineType.DEAL_LINE_ITEM),
          id: params.id,
        },
      },
    });

    // Ejecutar promesas en paralelo
    const [stagesRes, dealRes, lineItemsRes] = await Promise.all([
      stagesPromise,
      dealPromise,
      lineItemsPromise,
    ]);
    stages = stagesRes.data?.result || [];
    dealData = dealRes?.data;
    lineItems = lineItemsRes.data?.result || [];
  }

  return json({
    stages: stages || [],
    deal: dealData?.result.entity.deal || null,
    observers: dealData?.result.entity.participants || [],
    activities: dealData?.result.activities || [],
    actions: dealData?.actions,
    contacts: dealData?.result.contacts || [],
    entityActions: dealData?.associated_actions,
    lineItems,
  });
};

export const openDealModal = (
  id?: string,
  callback?: (key: string, value: string) => void
) => {
  if (id && callback) {
    callback(route.deal, id);
  }
};
