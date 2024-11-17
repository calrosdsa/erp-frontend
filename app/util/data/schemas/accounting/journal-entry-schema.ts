import { z } from "zod";


export const createJournalEntrySchema = z.object({
    entryType:z.string(),
    postingDate:z.date(),
})