import { z } from "zod";


export const updateStateWithEventSchema = z.object({
    party_uuid:z.string(),
    party_type:z.string(),
    events:z.array(z.number()),
    current_state:z.string(),
})