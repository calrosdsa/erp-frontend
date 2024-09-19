import { z } from "zod";


export const partyReferencesSchema = z.object({
    partyType:z.string(),
    partyName:z.string(),
    partyId:z.number()
})


export const addPartyReferencesSchema = z.object({
    partyType:z.string(),
    partyName:z.string(),
    partyId:z.number(),
    referenceId:z.number(),
})