import apiClient from "~/apiclient";
import ACompanyClient, { createCompanySchema } from "./a-company.client";
import { ActionFunctionArgs, json, LoaderFunctionArgs } from "@remix-run/node";
import { DEFAULT_PAGE, DEFAULT_SIZE } from "~/constant";
import apiClientAdmin from "~/apiclientAdmin";
import { z } from "zod";

type ActionData = {
  action: string;
  createCompany: z.infer<typeof createCompanySchema>;
};
export const action = async ({ request }: ActionFunctionArgs) => {
  const client = apiClientAdmin({ request });
  const data = (await request.json()) as ActionData;
  let message: string | undefined = undefined;
  let error: string | undefined = undefined;
  switch (data.action) {
    case "create-company": {
      const d = data.createCompany;
      const res = await client.POST("/admin/company", {
        body: {
          name: d.name,
          company_modules:d.modules.map(t=>({
            label:t.label,name:t.name,
            icon_code:t.icon_code,
            icon_name:t.icon_name,
            priority:t.priority,
          }))
        },
      });
      message = res.data?.message
      error = res.error?.detail
      break;
    }
  }
  return json({ message, error });
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const client = apiClientAdmin({ request });
  const url = new URL(request.url);
  const searchParams = url.searchParams;
  const res = await client.GET("/admin/company", {
    params: {
      query: {
        page: searchParams.get("page") || DEFAULT_PAGE,
        size: searchParams.get("size") || DEFAULT_SIZE,
      },
    },
  });
  console.log(res.data, res.error);
  return json({
    paginationResult: res.data?.pagination_result,
  });
};

export default function ACompany() {
  return <ACompanyClient />;
}
