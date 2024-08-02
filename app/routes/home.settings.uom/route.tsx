import { ActionFunctionArgs, json } from "@remix-run/node"
import apiClient from "~/apiclient"
import { components } from "~/sdk"


type ActionUOM = {
    action:string
    query?:string
}

export const action = async({request}:ActionFunctionArgs)=>{
    const data = await request.json() as ActionUOM
    let client = apiClient({request})
    let uoms:components["schemas"]["UnitOfMeasureTranslation"][] = []
    switch(data.action){
        case "get":{
            const res = await client.GET("/uom",{
                params:{
                    query:{
                        query:data.query
                    }
                }
            })
            if(res.data != undefined){
                uoms = res.data.results
            }
            console.log("ERROR UMO",res.error,res.data)
            break
        }
    }


    return json({
        uoms
    })
}