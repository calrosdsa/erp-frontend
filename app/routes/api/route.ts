import { ActionFunctionArgs, json, redirect } from "@remix-run/node";
import { commitSession, getSession } from "~/sessions";
import { sessionDefaultsFormSchema } from "../home/components/SessionDefaults";
import { z } from "zod";
import apiClient from "~/apiclient";
import { components } from "~/sdk";

type ApiAction = {
  action:string
  pathName:string
  sessionDefault:z.infer<typeof sessionDefaultsFormSchema>
}
export const action = async ({ request }: ActionFunctionArgs) => {
  const client = apiClient({request})
  const data:ApiAction = await request.json();
  let sessions:components["schemas"]["UserRelationDto"][]=[]
  console.log(data)
  switch (data.action) {
    case "get-sessions":{
      const res  =await client.GET("/account/sessions")
      sessions = res.data?.result || []
      break;
    }
    case "update-session-defaults":
      const session = await getSession(request.headers.get("Cookie"));
      console.log(
        "UPDATE SESSION",
        data.sessionDefault,
      );
      session.set("locale", data.sessionDefault.locale || "");
        session.set("sessionUuid", data.sessionDefault.sessionUuid || "");
      return redirect(data.pathName, {
        headers: {
          "Set-Cookie": await commitSession(session),
        },
      });
  }
  return json({
    sessions
  });
};

// export const action = async({request}:ActionFunctionArgs) =>{
//     console.log("ACTIONS")
//     const data = await request.json()
//     const action = data.action
//     switch(action){
//         case "update-session-defaults":
//             const session = await getSession(
//                 request.headers.get("Cookie")
//               );
//             console.log("UPDATE SESSION",data.get("companyUuid"),data.get("locale"))
//             const locale = data.locale
//             const companyUuid = data.companyUuid
//             if(locale != undefined){
//                 session.set("locale",locale)
//             }
//             if(companyUuid != undefined && Number(companyUuid) != 0){
//                 session.set("companyUuid",Number(companyUuid))
//             }
//             return redirect("/home", {
//               headers: {
//                 "Set-Cookie": await commitSession(session),
//               },
//             });
//     }
//     return json({})
// }
