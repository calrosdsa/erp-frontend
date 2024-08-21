import { z } from "zod";


export const itemVariantFormSchema = z.object({
    name:z.string(),
    itemId:z.number(),
    itemAttributeName: z.string(),
    itemAttributeValueName: z.string(),
    itemAttributeValueId: z.number(),
  });