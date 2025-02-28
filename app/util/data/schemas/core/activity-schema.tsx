import { z } from "zod";
import { DEFAULT_MAX_LENGTH, DEFAULT_MIN_LENGTH } from "~/constant";
import { fieldNull } from "..";
import { components } from "~/sdk";
import { formatRFC3339 } from "date-fns";

export type ActivityData = z.infer<typeof activitySchema>
export type MentionData= z.infer<typeof mentionSchema>
export type ActivityCommentData = z.infer<typeof activityCommentSchema>
export type ActivityDeadlineData = z.infer<typeof activityDeadlineSchema>

export const mentionSchema = z.object({
    id:z.number().optional(),
    action:z.string(),
    profile_id:z.number(),
    activity_id:z.number(),
    start_index:z.number(),
    end_index:z.number(),
})

export const activityCommentSchema = z.object({
    mentions:z.array(mentionSchema),
    activity_id:z.number(),
    comment:z.string(),
})

export const activityDeadlineSchema = z.object({
    activity_id:z.number().optional(),
    link:z.string().nullable().optional(),
    party:fieldNull,
    deadline:z.date(),
    address:z.string().nullable().optional(),
    title:z.string().nullable().optional(),
    content:z.string().nullable().optional(),
    color:z.string(),
    is_completed:z.boolean().optional(),
})

export const activitySchema = z.object({
    party_id:z.number(),
    type:z.string(),
    is_pinned:z.boolean().nullable().optional(),
    activity_comment:activityCommentSchema.optional(),
    activity_deadline:activityDeadlineSchema.optional(),
})

export const mapToActivityData = (e:ActivityData)=>{
    const d:components["schemas"]["ActivityData"] = {
        party_id: e.party_id,
        type: e.type,
        is_pinned:e.is_pinned,
        activity_comment:e.activity_comment? mapToActivityComment(e.activity_comment):undefined,
        activity_deadline:e.activity_deadline? mapToActivityDeadline(e.activity_deadline):undefined,

    }
    return d
}

export const mapToActivityDeadline = (e:ActivityDeadlineData) =>{
    const d:components["schemas"]["ActivityDeadlineData"] = {
        fields: {
            activity_id: e.activity_id || 0,
            address: e.address,
            deadline: formatRFC3339(e.deadline),
            link: e.link,
            title: e.title,
            content:e.content,
            color:e.color,
            is_completed:e.is_completed ||false,
            party_id: e.party?.id,
        }
    }
    return d
}

export const mapToMentionData = (e:MentionData) =>{
    const d:components["schemas"]["MentionData"] = {
        action: e.action,
        fields: {
            activity_id: e.activity_id,
            end_index: e.end_index,
            profile_id: e.profile_id,
            start_index: e.start_index,
        },
        id: e.id || 0,
    }
    return d
}

export const mapToActivityComment = (e:ActivityCommentData) =>{
    const d:components["schemas"]["ActivityCommentData"] = {
        fields: {
            activity_id: e.activity_id,
            comment: e.comment
        },
        mentions: e.mentions.map(t=>mapToMentionData(t))
    }
    return d
}

// export const createCommentSchema = z.object({
//     comment:z.string().min(DEFAULT_MIN_LENGTH).max(500).superRefine((data,ctx)=>{
//        if(data == "") {
//         ctx.addIssue({
//             code: z.ZodIssueCode.custom,
//             params:{
//                 i18n:{key:"custom.required"}
//             },
//             path:["comment"]
//           });
//        }
//     }),
//     partyID:z.number(),
// })

// export const editCommentSchema = z.object({
//     comment:z.string().max(DEFAULT_MAX_LENGTH),
//     id:z.number(),
// })