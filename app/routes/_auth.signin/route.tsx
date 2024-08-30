import { json, MetaFunction, redirect, useActionData } from "@remix-run/react";
import SignInClient from "./signin.client";
import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { commitSession, getSession } from "~/sessions";
import apiClient from "~/apiclient";
import { ClientOnly } from "remix-utils/client-only";
import { components } from "~/sdk";

export const meta: MetaFunction = () => {
  return [
    { title: "Erp SignIn" },
    { name: "description", content: "Welcome to erp" },
  ];
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const session = await getSession(request.headers.get("Cookie"));
  const form = await request.formData();
  const data = Object.fromEntries<any>(form.entries());
  const res = await apiClient({ request }).POST("/account/sign-in", {
    body: {
      email: data.email,
      password: data.password,
    },
  });
  if (res.response.ok && res.data != undefined) {
    session.set("access_token", res.data.access_token);
    session.set("locale", "en");
    if(res.data.user.Companies && res.data.user.Companies.length > 0){
      session.set("companyUuid", res.data.user.Companies[0]?.Uuid || "");
    }
      if (res.data.user.Roles.length == 1) {
      session.set("role", res.data.user.Roles[0]?.Code as string);
    }
    return redirect("/home", {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    });
  } else {
    console.log("ERROR", res.error);
    return json({
      message: "dsad",
      error: res.error,
    });
  }
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  
  // console.log("",request.headers)
  const session = await getSession(request.headers.get("Cookie"));
  if (session.has("access_token")) {
    // Redirect to the home page if they are already signed in.
    return redirect("/");
  }
  
  return json({ 
    ok: true,
   });
};

// let isHydrating = true;
export default function SignIn() {
  // const data = useLoaderData<typeof loader>()

  return (
    <>
        <ClientOnly>
      {() => {
        return (
            <SignInClient />
          );
        }}
        </ClientOnly>
    </>
  );
  // }else{
  //   return(
  //     <div>
  //       asdmkasmd
  //     </div>
  //   )
  // }

  // if (isHydrated) {
  //   return(
  //     <div>
  //         <SignInSide/>
  //     </div>
  // )
  // }else{
  //   return(
  //       <div>
  //         dasdaskl
  //       </div>
  //   )

  // }
}
