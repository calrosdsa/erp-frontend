import { ActionFunctionArgs, json, LoaderFunctionArgs } from "@remix-run/node";
import CompaniesClient from "./companies.client";
import apiClient from "~/apiclient";
import { components } from "~/sdk";
import { DEFAULT_PAGE, DEFAULT_SIZE } from "~/constant";
import { z } from "zod";
import { createCompanySchema } from "~/util/data/schemas/company/company-schemas";

type CompaniesAction = {
  action: string;
  page?: string;
  size?: string;
  query?: string;
  createCompany:z.infer<typeof createCompanySchema>
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const data = (await request.json()) as CompaniesAction;
  let client = apiClient({ request });
  let companies:components["schemas"]["Company"][] = []
  let message:string | undefined = undefined
  let error:string | undefined = undefined
  switch (data.action) {
    case "create-company":{
      const d = data.createCompany
      const res = await client.POST("/company",{
        body:{
          name:d.name,
          parentId:d.parentId || null
        }
      })
      message = res.data?.message
      error = res.error?.detail
      console.log(res.error)
      break;
    }
    case "get": {
      const res = await client.GET("/company", {
        params: {
          query: {
            query: data.query,
            page: data.page || DEFAULT_PAGE,
            size: data.size || DEFAULT_SIZE,
          },
        },
      });
        companies = res.data?.pagination_result.results || [];
      break;
    }
    case "get-valid-parent-companies": {
      const res = await client.GET("/company/valid/parent/companies", {
        params: {
          query: {
            query: data.query,
            page: data.page || DEFAULT_PAGE,
            size: data.size || DEFAULT_SIZE,
          },
        },
      });
        companies = res.data?.pagination_result.results || [];
      break;
    }
  }
  return json({
    companies,
    error,
    message
  });
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const res = await apiClient({ request }).GET("/company", {
    params: {
      query: {
        page: DEFAULT_PAGE,
        size: DEFAULT_SIZE,
      },
    },
  });
  console.log("data", res.error, res.data?.pagination_result.results.length);
  return json({
    paginationResult: res.data,
  });
};
export default function Companies() {
  return <CompaniesClient />;
}
