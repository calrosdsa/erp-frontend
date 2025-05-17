import { z } from "zod";
import { components } from "~/sdk";

export type WorkSpaceData = z.infer<typeof workSpaceSchema>

export const workSpaceSchema = z.object({
    id:z.number().optional(),
    name:z.string(),
})


export const mapToWorkSpaceData = (e:WorkSpaceData) => {
    const d:components["schemas"]["WorkSpaceData"] = {
        id:e.id,
        fields:{
            name:e.name
        }
    }
    return d
}