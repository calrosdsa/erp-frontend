import { partyReferencesColumns } from "@/components/custom/table/columns/party/party-columns"
import { DataTable } from "@/components/custom/table/CustomTable"
import { useEffect, useState } from "react"
import { z } from "zod"
import { PartyType } from "~/types/enums"
import { partyReferencesSchema } from "~/util/data/schemas/party/party-schemas"
import { AddReference, useAddReference } from "./add-reference"
import { useFetcher } from "@remix-run/react"
import { action } from "../route"
import { route } from "~/util/route"



export const PartyReferences = ({
    partyId,
}:{
    partyId:number
}) =>{
    const addReference = useAddReference()
    const partyReferencesfetcher = useFetcher<typeof action>()
    const r = route
    const getPartyReferences = () =>{
        partyReferencesfetcher.submit({
            action:"party-references",
            partyId:partyId
        },{
            method:"POST",
            encType:"application/json",
            action:r.party
        })
    }
    useEffect(()=>{
        getPartyReferences()
    },[])

    return (
        <>
        {addReference.open &&
        <AddReference
        updateReferences={()=>getPartyReferences()}
        onOpenChange={addReference.onOpenChange}
        open={addReference.open}
        partyId={partyId}
        />
        }
        {/* {JSON.stringify(partyReferencesfetcher.data)} */}
            <DataTable
            data={partyReferencesfetcher.data?.partyReferencesPagination?.results || []}
            columns={partyReferencesColumns({})}
            metaActions={{
                meta:{
                    addNew:()=>{
                        addReference.openDialog({})
                    }
                }
            }}
            />
        </>
    )
}