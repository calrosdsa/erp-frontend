import { z } from "zod";
import { DEFAULT_MAX_LENGTH, DEFAULT_MIN_LENGTH } from "~/constant";


export const createEventSchema = z.object({
    name:z.string().min(DEFAULT_MIN_LENGTH),
    description:z.string().optional()
})

export const editEventSchema = z.object({
    eventID:z.number(),
    name:z.string().min(DEFAULT_MIN_LENGTH).max(DEFAULT_MAX_LENGTH),
    description:z.string().optional(),
  });