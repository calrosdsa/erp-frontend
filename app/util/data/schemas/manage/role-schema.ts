import { z } from "zod";


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