import { z } from "zod";


export const roleAction = z.object({
    roleId:z.number(),
    actionId:z.number(),
})

export const updateRoleActionsSchema = z.object({
    roleActions:z.array(roleAction)
})