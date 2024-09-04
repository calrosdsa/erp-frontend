import { z } from "zod";
import { DEFAULT_MAX_LENGTH, DEFAULT_MIN_LENGTH } from "~/constant";

export const createRoleSchema = z.object({
    name:z.string().min(DEFAULT_MIN_LENGTH).max(DEFAULT_MAX_LENGTH),
    description:z.string().min(DEFAULT_MIN_LENGTH).max(255),
})

export const roleActionSelected = z.object({
    selected:z.boolean(),
    actionId:z.number(),
    actionName:z.string(),
})

export const updateRoleActionsSchema = z.object({
    roleId:z.number(),
    entityName:z.string(),
    actionSelecteds:z.array(roleActionSelected)
})