import { ActionFunctionArgs, defer, json, LoaderFunctionArgs } from "@remix-run/node"
import apiClient from "~/apiclient"
import ChargesTemplateDetailClient from "./charges-template-detail.client"
import { handleError } from "~/util/api/handle-status-code"
import { FetchResponse } from "openapi-fetch"
import { z } from "zod"
import { editChargesTemplateSchema } from "~/util/data/schemas/accounting/charges-template-schema"

type ActionData = {
    action: string;
    editData: z.infer<typeof editChargesTemplateSchema>;
};
export const action = async ({ request }: ActionFunctionArgs) => {
    const client = apiClient({ request });
    const data = (await request.json()) as ActionData;
    let message: string | undefined = undefined;
    let error: string | undefined = undefined;
    switch (data.action) {
      case "edit": {
        const d = data.editData;
        const res = await client.PUT("/charge-template", {
          body: {
            name: d.name,
            id:d.id,
          },
        });
        error = res.error?.detail;
        message = res.data?.message;
        break;
      }
    }
    return json({
      error,
      message,
    });
  };

export const loader = async({request}:LoaderFunctionArgs) =>{
    const client = apiClient({request})
    const url = new URL(request.url)
    const searchParams = url.searchParams
    const tab = searchParams.get("tab")
    let taxLinesRes: Promise<FetchResponse<any, any, any>> | undefined =
    undefined;
    const res = await client.GET("/charge-template/detail/{id}",{
        params:{
            path:{
                id:searchParams.get("id") || "",
            }
        }
    })
    handleError(res.error)
    if (res.data) {
        switch (tab) {
          case "info": {
            taxLinesRes = client.GET("/taxes-and-charges",{
              params:{
                query:{
                  id:res.data.result.entity.id.toString(),
                }
              }
            })
            break;
          }
        }
      }
    return defer({
        chargesTemplate:res.data?.result.entity,
        taxLines:taxLinesRes
    })
}

export default function ChargesTemplateDetail(){
    return <ChargesTemplateDetailClient/>
}