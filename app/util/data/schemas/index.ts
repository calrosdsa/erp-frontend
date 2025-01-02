import { z } from "zod";

export const field = z
  .object({
    id: z.number().optional(),
    name: z.string().optional(),
    uuid: z.string().optional(),
  })
  
export const fieldNull = z
  .object({
    id: z.number().optional().nullable(),
    name: z.string().optional().nullable(),
    uuid: z.string().optional().nullable(),
  })
  .optional()
  .nullable();
