import { ActionFunctionArgs, json } from "@remix-run/node";
import { z } from "zod";
import apiClient from "~/apiclient";
import { components } from "~/sdk";
import {
  createCommentSchema,
  editCommentSchema,
} from "~/util/data/schemas/core/activity-schema";

type ActionData = {
  action: string;
  createComment: z.infer<typeof createCommentSchema>;
  editComment: z.infer<typeof editCommentSchema>;
  activityID:number
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const client = apiClient({ request });
  const data = (await request.json()) as ActionData;
  let error: string | undefined = undefined;
  let message: string | undefined = undefined;
  let activities: components["schemas"]["ActivityDto"][] = [];
  switch (data.action) {
    case "delete-comment":{
        const res = await client.DELETE("/activity", {
            params: {
                query:{
                    id:data.activityID.toString(),
                }
            },
          });
          message = res.data?.message;
          error = res.error?.detail;
          break;  
    }
    case "edit-comment": {
      const d = data.editComment;
      const res = await client.PUT("/activity", {
        body: {
          comment: d.comment,
          id: d.id,
        },
      });
      message = res.data?.message;
      error = res.error?.detail;
      break;
    }
    case "create-comment": {
      const d = data.createComment;
      console.log("COMMENT",d)
      const res = await client.POST("/activity/comment", {
        body: {
          comment: d.comment,
          party_id: d.partyID,
        },
      });
      error = res.error?.detail;
      break;
    }
  }
  return json({
    error,
    message,
    activities,
  });
};
