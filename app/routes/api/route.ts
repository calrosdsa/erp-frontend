import { ActionFunctionArgs, json, LoaderFunctionArgs, redirect } from "@remix-run/node";
import { commitSession, getSession } from "~/sessions";
import { sessionDefaultsFormSchema } from "../home/components/SessionDefaults";
import { z } from "zod";
import apiClient from "~/apiclient";
import { components } from "~/sdk";
import { endOfMonth, formatRFC3339, startOfMonth } from "date-fns";

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
export const loader = async ({ request }: LoaderFunctionArgs) => {
  const client = apiClient({ request });
  const url = new URL(request.url)
  const searchParams = url.searchParams
  console.log(searchParams.get("type"))
  try {
    const response = await client.POST("/pianoForms/export", {
      parseAs: "stream",
      body: {
        from_date: formatRFC3339(startOfMonth(new Date())),
        to_date: formatRFC3339(endOfMonth(new Date())),
      },
    });

    // Check for errors in the response
    if (response.error) {
      console.error('API error:', response.error);
      throw new Error('Error in response from API');
    }

    // Check if the response is ok
    if (!response.response.ok) {
      throw new Error('Network response was not ok');
    }

    const reader = response.response.body?.getReader();
    const chunks: Uint8Array[] = [];

    const readStream = async () => {
      while (true) {
        const { done, value } = await reader!.read();
        if (done) {
          break; // Stream is finished
        }
        chunks.push(value); // Collect chunks
      }

      // Create a Blob from the collected chunks
      const blob = new Blob(chunks);
      
      return blob; // Return the Blob directly
    };

    const blob = await readStream(); // Await the result of the readStream function
    return new Response(blob, { status: 200 }); // Return the Blob as a Response

  } catch (error) {
    console.error('Error:', error);
    // Handle error response appropriately
    return new Response('Internal Server Error', { status: 500 });
  }
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
