import { json, LoaderFunctionArgs } from "@remix-run/node";
import RoleClient from "./role.client";
import apiClient from "~/apiclient";
import { DEFAULT_PAGE, DEFAULT_SIZE, LOAD_ACTION } from "~/constant";
import { z } from "zod";
import { updateRoleActionsSchema } from "~/util/data/schemas/manage/role-schema";
import { components } from "~/sdk";

type ActionData = {
    action:string
    updateRoleActions:components["schemas"]["EditRolePermissionActionsBody"]
}

export const action = async({request}:LoaderFunctionArgs)=>{
    const client = apiClient({request})
    const data = await request.json() as ActionData
    let message:string | undefined = undefined
    let error:string | undefined = undefined
    let actionRes = LOAD_ACTION
    switch(data.action){
        
        case "update-role-actions":{
            const res=  await client.POST("/role/permision/actions",{
                body:data.updateRoleActions,
            })
            message = res.data?.message
            error= res.error?.detail
            console.log(res.error)
            break;
        }
    }
    return json({
        message,error,
        actionRoot:actionRes,
    })
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
    const client = apiClient({ request });
    const url = new URL(request.url);
    const roleId = url.searchParams.get("id");
  
    // Validamos que se reciba el id
    if (!roleId) {
      throw new Error("Falta el parámetro requerido 'id'");
    }
  
    // Ejecutamos las peticiones de forma concurrente
    const [detailRes, roleActionsRes, entityActionsRes] = await Promise.all([
      client.GET("/role/detail/{id}", {
        params: {
          path: { id: roleId },
        },
      }),
      client.GET("/role/role-definitions", {
        params: {
          query: {
            parentId: roleId,
            page: DEFAULT_PAGE,
            size: "1000",
          },
        },
      }),
      client.GET("/role/entity-actions"),
    ]);
  
    // Extraemos los datos necesarios de las respuestas
    const role = detailRes.data?.result?.entity;
    const actions = detailRes.data?.actions;
    const activities = detailRes.data?.result?.activities;
    const roleActions =
      roleActionsRes.data?.pagination_result?.results || [];
    const entityActions = entityActionsRes.data?.result;
  
    return json({
      role,
      actions,
      roleActions,
      entityActions,
      activities,
    });
  };

export default function Role(){
    return (
        <RoleClient/>
    )
}