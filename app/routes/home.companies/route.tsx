import { ActionFunctionArgs, json, LoaderFunctionArgs } from "@remix-run/node";
import CompaniesClient from "./companies.client";
import apiClient from "~/apiclient";
import { components } from "~/sdk";
import { DEFAULT_PAGE, DEFAULT_SIZE } from "~/constant";

type CompaniesAction  = {
  action:string
  page?:string
  size?:string
  query?:string
}

export const action = async ({ request }: ActionFunctionArgs) => {
  const data = (await request.json()) as CompaniesAction;
  let client = apiClient({ request });
  let pagination_result:
    | components["schemas"]["PaginationResultListCompany"]
    | undefined = undefined;
    switch (data.action) {
      case "get": {
      console.log("HOME COMPANIES")
      const res = await client.GET("/company", {
        params: {
          query: {
            query: data.query,
            page: data.page || DEFAULT_PAGE,
            size: data.size || DEFAULT_SIZE,
          },
        },
      });
      if (res.data != undefined) {
        pagination_result = res.data.pagination_result;
      }
      break;
    }
  }
  return json({
    pagination_result,
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
