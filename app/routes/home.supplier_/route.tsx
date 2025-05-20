import { ActionFunctionArgs, json, LoaderFunctionArgs } from "@remix-run/node";
import apiClient from "~/apiclient";
import {
  DEFAULT_ENABLED,
  DEFAULT_ID,
  DEFAULT_PAGE,
  DEFAULT_SIZE,
  LOAD_ACTION,
} from "~/constant";
import SuppliersClient from "./suppliers.client";
import { z } from "zod";
import {
  mapToSupplierData,
  SupplierData,
  supplierSchema,
} from "~/util/data/schemas/buying/supplier-schema";
import { components } from "~/sdk";
import { mapToContactData } from "~/util/data/schemas/contact/contact.schema";
import { ShouldRevalidateFunctionArgs } from "@remix-run/react";
import { route } from "~/util/route";

type ActionData = {
  action: string;
  supplierData: SupplierData;
  query: string;
};
export const action = async ({ request }: ActionFunctionArgs) => {
  const client = apiClient({ request });
  const data = (await request.json()) as ActionData;
  let message: string | undefined = undefined;
  let error: string | undefined = undefined;
  let suppliers: components["schemas"]["SupplierDto"][] = [];
  let supplier:components["schemas"]["SupplierDto"] | undefined = undefined
  let actions: components["schemas"]["ActionDto"][] = [];
  const url = new URL(request.url);
  const searchParams = url.searchParams;
  switch (data.action) {
    case "create-supplier": {
      const res = await client.POST("/supplier", {
        body: mapToSupplierData(data.supplierData),
      });
      error = res.error?.detail;
      message = res.data?.message;
      supplier = res.data?.result
      break;
    }
    case "edit-supplier": {
      const res = await client.PUT("/supplier", {
        body: mapToSupplierData(data.supplierData),
      });
      error = res.error?.detail;
      message = res.data?.message;
      break;
    }
    case "get": {
      const res = await client.GET("/supplier", {
        params: {
          query: {
            page: searchParams.get("page") || DEFAULT_PAGE,
            size: searchParams.get("size") || DEFAULT_SIZE,
            enabled: DEFAULT_ENABLED,
            query: data.query || "",
          },
        },
      });
      suppliers = res.data?.pagination_result.results || [];
      actions = res.data?.actions || [];
      break;
    }
  }
  return json({
    message,
    error,
    suppliers,
    actions,
    supplier,
  });
};

export function shouldRevalidate({
  formMethod,
  defaultShouldRevalidate,
  actionResult,
  nextUrl,
}: ShouldRevalidateFunctionArgs) {
  if (actionResult?.actionRoot == LOAD_ACTION) {
    return defaultShouldRevalidate;
  }
  if (formMethod === "POST") {
    return false;
  }
  const nextParams = new URL(nextUrl.href).searchParams;
  const supplier = nextParams.get(route.supplier);
  if (supplier) {
    return false;
  }
  return defaultShouldRevalidate;
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const client = apiClient({ request });
  const url = new URL(request.url);
  const searchParams = url.searchParams;
  const res = await client.GET("/supplier", {
    params: {
      query: {
        page: searchParams.get("page") || DEFAULT_PAGE,
        size: searchParams.get("size") || DEFAULT_SIZE,
        query: searchParams.get("query") || "",
      },
    },
  });

  console.log("LOAD SUPPLIERS...");
  return json({
    paginationResult: res.data?.pagination_result,
    actions: res.data?.actions,
  });
};

export default function Supplier() {
  return <SuppliersClient />;
}
