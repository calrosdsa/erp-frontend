import { z } from "zod";


export const createItemVariantSchema = z.object({
    name:z.string(),
    itemUuid:z.string(),
    itemAttributeName: z.string(),
    itemAttributeValueName: z.string(),
    itemAttributeValueId: z.number(),
  });