import { z } from "zod";
import { field, fieldNull, fieldRequired } from ".";
import { components } from "~/sdk";
import { formatRFC3339 } from "date-fns";

export type TaskData = z.infer<typeof taskSchema>

export const taskSchema = z.object({
    id: z.number().optional(),
    title: z.string(),
    description: z.string().nullable().optional(),
    priority: z.string().nullable().optional(),
    stage: fieldNull,
    assignee: fieldNull,
    project: fieldRequired,
    due_date: z.date().optional().nullable(),
    index: z.number(),
})

export const mapToTaskData = (e: TaskData) => {
    const d: components["schemas"]["TaskData"] = {
        fields: {
            title: e.title,
            description: e.description,
            priority: e.priority,
            assignee: e.assignee?.id || null,
            project_id: e.project.id,
            stage_id: e.stage?.id || undefined,
            due_date: e.due_date ? formatRFC3339(e.due_date) : null,
            index: e.index,
        },
        id: e.id || 0,
    }
    return d
}