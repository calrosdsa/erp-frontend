import { json, LoaderFunctionArgs } from "@remix-run/node";
import apiClient from "~/apiclient";
import { LOAD_ACTION } from "~/constant";
import { components, operations } from "~/sdk";

type ActionData = {
  action: string;
  data: components["schemas"]["StageData"];
  stageTransition: components["schemas"]["StageTransitionData"];
  id:string
  parameters:operations["stage"]["parameters"]
};

export const action = async ({ request }: LoaderFunctionArgs) => {
  const client = apiClient({ request });
  const data = (await request.json()) as ActionData;
  console.log("STAGE DATA",data)
  let message: string | undefined = undefined;
  let error: string | undefined = undefined;
  let actionRes = LOAD_ACTION;
  let results :components["schemas"]["StageDto"][] = []
  let actions:components["schemas"]["ActionDto"][] = []
  switch (data.action) {
    case "get":{
      const res =await client.GET("/stage",{
        params:data.parameters
      })
      results = res.data?.result || []
      actions = res.data?.actions || []
      actionRes = "";
      break;
    }
    case "delete":{
      const res =await client.DELETE("/stage",{
        params:{
          query:{
            id:data.id
          }
        }
      })
      message = res.data?.message
      error = res.error?.detail
      break
    }
    case "stage-transition": {
      const res = await client.PUT("/stage/transition", {
        body: data.stageTransition,
      });
      message = res.data?.message;
      error = res.error?.detail;
      break;
    }
    case "edit": {
      const res = await client.PUT("/stage", {
        body: data.data,
      });
      message = res.data?.message;
      error = res.error?.detail;
      actionRes = "";
      break;
    }
    case "create": {
      const res = await client.POST("/stage", {
        body: data.data,
      });
      message = res.data?.message;
      error = res.error?.detail;
      break;
    }
  }
  return json({
    message,
    error,
    action: actionRes,
    actions,
    results,
  });
};
