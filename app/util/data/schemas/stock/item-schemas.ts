import { z } from "zod";

export const itemFormSchema = z.object({
  name: z.string().min(2),
  // rate: z.number().min(0).optional(),
  // itemQuantity: z.number().min(0).optional(),
  uomName: z.string(),
  itemGroupName: z.string(),
  // priceListName:z.string().optional(),
  // pluginList:z.array(z.string()).optional(),
});

export const itemDtoSchema = z.object({
  id: z.number().optional(),
  name:z.string(),
  uomId:z.number(),
  itemGroupId: z.number(),
  //Optional fields
  itemType: z.string().optional(),
});
