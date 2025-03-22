import { ActionFunctionArgs, json, LoaderFunctionArgs } from "@remix-run/node";
import CrmClient from "./deal-kanban.client";
import apiClient from "~/apiclient";
import { DEFAULT_ORDER, DEFAULT_SIZE, LOAD_ACTION, MAX_SIZE } from "~/constant";
import { Entity } from "~/types/enums";
import { Outlet, ShouldRevalidateFunctionArgs, useOutletContext } from "@remix-run/react";
import { GlobalState } from "~/types/app-types";
import { components } from "~/sdk";

type ActionData = {
  dealTransition:components["schemas"]["DealTransitionData"]
  action:string
}

export const action = async({request}:ActionFunctionArgs)=>{
  const client = apiClient({request})
  const data =await request.json() as ActionData
  let message :string | undefined = undefined 
  let error:string | undefined = undefined
  let action = LOAD_ACTION
  switch(data.action){
    case "deal-transition":{
      const res= await client.PUT("/deal/transition",{
        body:data.dealTransition,
      })
      message = res.data?.message
      error = res.error?.detail
      console.log(res.error,res.data)
      break;
    }
  }
  return json({
    message,error,action
  })
}

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
  try {
    const client = apiClient({ request });
    const url = new URL(request.url);
    const searchParams = url.searchParams;

    // Parallelize requests with proper error handling
    const [dealsRes, stagesRes] = await Promise.all([
      client.GET("/deal", {
        params: {
          query: {
            size: MAX_SIZE,
            column:"index",
            orientation:"ASC"
          },
        },
      }),
      client.GET("/stage", {
        params: {
          query: {
            size: MAX_SIZE,
            entity_id: searchParams.get("entity_id") ?? Entity.DEAL.toString(),
            column:"index",
            orientation:"ASC"
          },
        },
      }),
    ]);

    // const stagesRes =
    return {
      deals: dealsRes.data?.result,
      stages: stagesRes.data?.result,
    };
  } catch (error) {
    console.error("Loader error:", error);

    // Convert to proper error response
    throw new Response("Failed to load pipeline data", {
      status: error instanceof Error ? 500 : 500,
    });
  }
};

export default function Crm() {
  const globalContext = useOutletContext<GlobalState>()
  return (
    <>
    <Outlet
    context={globalContext}
    />
    <CrmClient />
   
    </>
  );
}
