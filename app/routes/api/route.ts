import { ActionFunctionArgs, json, redirect } from "@remix-run/node";
import { commitSession, getSession } from "~/sessions";
import { sessionDefaultsFormSchema } from "../home/components/SessionDefaults";
import { z } from "zod";

type ApiAction = {
  action:string
  pathName:string
  sessionDefault:z.infer<typeof sessionDefaultsFormSchema>
}
export const action = async ({ request }: ActionFunctionArgs) => {
  const data:ApiAction = await request.json();
  console.log(data)
  switch (data.action) {
    case "update-session-defaults":
      const session = await getSession(request.headers.get("Cookie"));
      console.log(
        "UPDATE SESSION",
        data.sessionDefault,
      );
      session.set("locale", data.sessionDefault.locale);
        session.set("companyUuid", data.sessionDefault.companyUuid);
      return redirect(data.pathName, {
        headers: {
          "Set-Cookie": await commitSession(session),
        },
      });
  }
  return json({});
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
