import { ActionFunctionArgs, json } from "@remix-run/node";
import { z } from "zod";
import apiClient from "~/apiclient";
import { LOAD_ACTION } from "~/constant";
import { components, operations } from "~/sdk";

type ActionData = {
  action: string;
  activityID:number
  searchEntitiesQuery:operations["search-entities"]["parameters"]["query"]
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const client = apiClient({ request });
  const data = (await request.json()) as ActionData;
  let error: string | undefined = undefined;
  let message: string | undefined = undefined;
  let activities: components["schemas"]["ActivityDto"][] = [];
  let searchEntities:components["schemas"]["EntityDto"][] = [];
  console.log(data.action)
  switch (data.action) {
    case "search-entities":{
      console.log(data.searchEntitiesQuery)
      const res = await client.GET("/module/search-entities",{
        params:{
          query:data.searchEntitiesQuery,
        }
      })
      searchEntities = res.data?.result || []
      break;
    }
    // case "delete-comment":{
    //     const res = await client.DELETE("/activity", {
    //         params: {
    //             query:{
    //                 id:data.activityID.toString(),
    //             }
    //         },
    //       });
    //       message = res.data?.message;
    //       error = res.error?.detail;
    //       break;  
    // }
    // case "edit-comment": {
    //   const d = data.editComment;
    //   const res = await client.PUT("/activity", {
    //     body: {
    //       comment: d.comment,
    //       id: d.id,
    //     },
    //   });
    //   message = res.data?.message;
    //   error = res.error?.detail;
    //   break;
    // }
    // case "create-comment": {
    //   const d = data.createComment;
    //   console.log("COMMENT",d)
    //   const res = await client.POST("/activity/comment", {
    //     body: {
    //       comment: d.comment,
    //       party_id: d.partyID,
    //     },
    //   });
    //   error = res.error?.detail;
    //   message = res.data?.message
    //   break;
    // }
  }
  return json({
    error,
    message,
    activities,
    searchEntities,
    action:LOAD_ACTION,
  });
};
