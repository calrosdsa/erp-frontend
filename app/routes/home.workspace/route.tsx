import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import apiClient from "~/apiclient";
import { DEFAULT_SIZE, LOAD_ACTION } from "~/constant";
import WorkSpaceClient from "./workspace.client";
import { components, operations } from "~/sdk";
import { ShouldRevalidateFunctionArgs } from "@remix-run/react";

type ActionData = {
  action:string
  params:operations["workspace"]["parameters"]
}

export const action = async({request}:ActionFunctionArgs) =>{
  const client = apiClient({request})
  const data =await request.json() as ActionData
  let results:components["schemas"]["WorkSpaceDto"][] = []
  let actions:components["schemas"]["ActionDto"][] = []
  switch(data.action){
    case "list":{
      const res= await client.GET("/workspace",{
        params:data.params
      })
      results = res.data?.result || []
      actions = res.data?.actions || []
      break
    }
  }
  return {
    results,
    actions,
  }
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
  const client = apiClient({ request });
  const url = new URL(request.url);
  const searchParams = url.searchParams;
  const res = await client.GET("/workspace", {
    params: {
      query: {
        size: searchParams.get("size") || DEFAULT_SIZE,
        column: searchParams.get("column") || undefined,
        order: searchParams.get("order") || undefined,
      },
    },
  });

  return {
    results: res.data?.result,
    actions: res.data?.actions,
  };
};

export default function Workspace() {
  return <WorkSpaceClient />;
}
