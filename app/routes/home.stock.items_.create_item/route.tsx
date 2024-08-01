import { ActionFunctionArgs, json } from "@remix-run/node";
import CreateItemClient from "./itemCreate.client";
import apiClient from "~/apiclient";


export const action = async({request}:ActionFunctionArgs)=>{
    const formData = await request.formData()
    console.log(Object.fromEntries(formData))
    return json({
      ok: true,
    });
}

export default function CreateItem(){

    return (
        <CreateItemClient/>
    )
}