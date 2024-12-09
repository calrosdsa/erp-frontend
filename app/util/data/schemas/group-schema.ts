import { z } from "zod";
import { DEFAULT_MAX_LENGTH, DEFAULT_MIN_LENGTH } from "~/constant";
import { components } from "~/sdk";

export const groupSchema = z.object({
  name: z.string(),
  is_group: z.boolean(),
  ordinal: z.number(),
  created_at: z.string(),
  enabled: z.boolean(),
  uuid: z.string(),
});

export const createGroupSchema = z.object({
  name: z.string().min(DEFAULT_MIN_LENGTH).max(DEFAULT_MAX_LENGTH),
  // is_group: z.boolean().default(false),
  // parentName:z.string().optional(),
  // parentID: z.number().optional(),
  party_type_code: z.string(),
  // enabled: z.boolean(),
});

export const editGroupSchema = z.object({
  id:z.number(),
  name:z.string().min(DEFAULT_MIN_LENGTH).max(DEFAULT_MAX_LENGTH),
  partyTypeGroup:z.string(),
});

export const groupSchemaToGroupDto = (
  d: z.infer<typeof groupSchema>
): components["schemas"]["GroupDto"] => {
  return {
    id:0,
    name:d.name,
    uuid:d.uuid,
    ordinal:d.ordinal,
    created_at:d.created_at,
    is_group:d.is_group,
    enabled:d.enabled,
  };
};
