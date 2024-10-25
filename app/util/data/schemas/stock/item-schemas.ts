import { z } from "zod";
import { uomSchema } from "../setting/uom-schema";
import { groupSchema } from "../group-schema";
import { DEFAULT_MAX_LENGTH, DEFAULT_MIN_LENGTH } from "~/constant";

export const createItemSchema = z.object({
  name: z.string().min(DEFAULT_MIN_LENGTH).max(DEFAULT_MAX_LENGTH),
  // rate: z.number().min(0).optional(),
  // itemQuantity: z.number().min(0).optional(),
  
  uomName: z.string(),
  groupName:z.string(),
  groupID:z.number(),
  uomID:z.number()
  // priceListName:z.string().optional(),
  // pluginList:z.array(z.string()).optional(),
});

export const updateItemSchema = z.object({
  name:z.string(),
  itemType: z.string(),
});
