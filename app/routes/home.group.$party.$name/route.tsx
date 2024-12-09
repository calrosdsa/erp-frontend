import { ActionFunctionArgs, json, LoaderFunctionArgs } from "@remix-run/node";
import apiClient from "~/apiclient";
import { PartyType } from "~/types/enums";
import GroupClient from "./group.client";
import { z } from "zod";
import { editGroupSchema } from "~/util/data/schemas/group-schema";

type ActionData = {
    action: string;
    editData: z.infer<typeof editGroupSchema>;
  };
  export const action = async ({ request }: ActionFunctionArgs) => {
    const client = apiClient({ request });
    const data = (await request.json()) as ActionData;
    let error: string | undefined = undefined;
    let message: string | undefined = undefined;
    switch (data.action) {
      case "edit": {
        const d = data.editData;
        const res = await client.PUT("/group", {
          body: {
            id: d.id,
            name: d.name,
            party_type_code:d.partyTypeGroup
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


export const loader = async({request,params}:LoaderFunctionArgs)=>{
    const client = apiClient({request})
    const url = new URL(request.url)
    const searchParams = url.searchParams
    const res = await client.GET("/group/detail/{id}",{
        params:{
            path:{
                id:searchParams.get("id") || ""
            },
            query:{
                party:params.party || "",
            }
        }
    })
    const resDescendents = await client.GET("/group/descendents/{id}",{
        params:{
            path:{
                id:searchParams.get("id") || "",
            },
            query:{
                party:params.party || ""
            }
        }
    })
    return json({
        group:res.data?.result.entity,
        groupDescendents:resDescendents.data?.result.entity,
        actions:res.data?.actions,
        activities:res.data?.result.activities,
    })
}

export default function Group(){
    return <GroupClient/>
}