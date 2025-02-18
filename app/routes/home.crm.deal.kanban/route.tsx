import { LoaderFunctionArgs } from "@remix-run/node";
import CrmClient from "./deal-kanban.client";
import apiClient from "~/apiclient";
import { DEFAULT_SIZE, LOAD_ACTION, MAX_SIZE } from "~/constant";
import { Entity } from "~/types/enums";
import { ShouldRevalidateFunctionArgs } from "@remix-run/react";

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
          },
        },
      }),
      client.GET("/stage", {
        params: {
          query: {
            size: MAX_SIZE,
            entity_id: searchParams.get("entity_id") ?? Entity.DEAL.toString(),
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
  return <CrmClient />;
}
