import { json, LoaderFunctionArgs } from "@remix-run/node";
import CompaniesClient from "./companies.client";
import { validateSession } from "~/sessions";
import apiClient from "~/apiclient";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  console.log("LOADER COMPANIES")
  // validateSession(request,)
  const res = await apiClient({ request }).GET("/company", {
    params: {
      query: {
        page: "1",
        size: "1",
      },
    },
  });
  console.log("data", res.error, res.data?.pagination_result);
  return json({
    paginationResult: res.data,
  });
};
export default function Companies() {
  return <CompaniesClient />;
}
