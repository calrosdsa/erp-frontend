import { ActionFunctionArgs, json, redirect } from "@remix-run/node";
import { commitSession, getSession } from "~/sessions";

export const action = async ({ request }: ActionFunctionArgs) => {
  console.log("ACTIONS");
  const formData = await request.formData();
  const action = formData.get("action");
  switch (action) {
    case "update-session-defaults":
      const session = await getSession(request.headers.get("Cookie"));
      console.log(
        "UPDATE SESSION",
        formData.get("companyUuid"),
        formData.get("locale")
      );
      const locale = formData.get("locale")?.toString();
      const companyUuid = formData.get("companyUuid")?.toString();
      if (locale != undefined) {
        session.set("locale", locale);
      }
      if (companyUuid != undefined) {
        session.set("companyUuid", companyUuid);
      }
      return redirect("/home", {
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
