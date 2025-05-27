import { z } from "zod";
import { components } from "~/sdk";
import { itemActionSchema, itemFieldSchema } from "..";

export type WorkSpaceData = z.infer<typeof workSpaceSchema>;

export const workSpaceSchema = z.object({
  id: z.number().optional(),
  name: z.string(),
  modules: z.array(itemFieldSchema),
});

export const mapToWorkSpaceData = (e: WorkSpaceData) => {
  const d: components["schemas"]["WorkSpaceData"] = {
    id: e.id,
    fields: {
      name: e.name,
    },
    modules:e.modules.map(item=>item.id),
  };
  return d;
};
