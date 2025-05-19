import { z } from "zod";
import { DEFAULT_MAX_LENGTH, DEFAULT_MIN_LENGTH } from "~/constant";
import { fieldNull } from "..";
import { components } from "~/sdk";

export type RoleSchema = z.infer<typeof roleDataSchema>

export const roleDataSchema = z.object({
    id:z.number().optional(),
    code:z.string(),
    description:z.string().optional().nullable(),
    workspace:fieldNull,
})

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
    role_uuid:z.string(),
    entityName:z.string(),
    actionSelecteds:z.array(roleActionSelected)
})

export const mapToRoleData = (e:RoleSchema) =>{
    const d:components["schemas"]["RoleData"] = {
        id:e.id,
        fields:{
            code:e.code,
            workspace_id:e.workspace?.id,
            description:e.description,
        }
    }
    return d
}