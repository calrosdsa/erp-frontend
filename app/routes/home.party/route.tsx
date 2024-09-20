import { ActionFunctionArgs, json } from "@remix-run/node"
import { z } from "zod"
import apiClient from "~/apiclient"
import { DEFAULT_PAGE, DEFAULT_SIZE } from "~/constant"
import { components } from "~/sdk"
import { addPartyReferencesSchema, partyReferencesSchema } from "~/util/data/schemas/party/party-schemas"

type ActionData= {
    action:string
    partyType:string
    query:string
    partyId:number
    addPartyReference:z.infer<typeof addPartyReferencesSchema>
}
export const action = async({request}:ActionFunctionArgs) =>{
    const client = apiClient({request})
    const data =await request.json() as ActionData
    const url = new URL(request.url)
    const searchParams = url.searchParams
    let message:string | undefined = undefined
    let error:string | undefined = undefined
    let parties:components["schemas"]["PartyDto"][] = []
    let partyOptions:components["schemas"]["PartyTypeDto"][] =[]
    let partyReferencesPagination:components["schemas"]["PaginationResultListPartyReferenceDto"] | undefined = undefined
    switch(data.action){
        case "party-references":{
            const res = await client.GET("/party/references",{
                params:{
                    query:{
                        page:searchParams.get("page") || DEFAULT_PAGE,
                        size:searchParams.get("size") || DEFAULT_SIZE,
                        parentId:data.partyId.toString(),
                    }
                }
            })
            partyReferencesPagination = res.data?.pagination_result 
            break;
        }
        case "add-party-reference":{
            const res = await client.POST("/party/references",{
                body:{
                    party_id:data.addPartyReference.partyId,
                    reference_id:data.addPartyReference.referenceId,
                }
            })
            message = res.data?.message
            error = res.error?.detail
            break;
        }
        case "references-options":{
            const res = await client.GET("/party/references/type")
            partyOptions = res.data?.result || []
            break;
        }
        case "parties":{
            console.log(data)
            const res =await client.GET("/party/parties-by-references/{party_type}",{
                params:{
                    query:{
                        query:data.query
                    },
                    path:{
                        party_type:data.partyType,
                    },
                }
            })
            console.log(res.data,res.error)
            if(res.data){
                parties = res.data.result.entity
            }
            break;
        }
    }
    return json({
        parties,error,message,partyOptions,
        partyReferencesPagination,
    })
}