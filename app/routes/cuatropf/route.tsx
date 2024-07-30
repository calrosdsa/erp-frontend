import { json, MetaFunction, redirect, useActionData } from "@remix-run/react";
import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { commitSession, getSession } from "~/sessions";
import apiClient from "~/apiclient";
import CuatropfClient from "./cuatropf.client";
import FallBack from "~/components/layout/Fallback";
import { useEffect, useState } from "react";
import { ExternalScriptsFunction } from "remix-utils/external-scripts";

let scripts: ExternalScriptsFunction = () => {
  return [{ src: "https://sandbox.web.squarecdn.com/v1/square.js" }];
};
export const handle = { scripts };

export const meta: MetaFunction = () => {
  return [
    { title: "Erp Cuatropf" },
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
    return redirect("/", {
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
  return json({ ok: true });
};

let isHydrating = true;
export default function Cuatropf() {
  const [isHydrated, setIsHydrated] = useState(!isHydrating);

  useEffect(() => {
    isHydrating = false;
    setIsHydrated(true);
  }, []);

  if (isHydrated) {
    return (
      <>
        <CuatropfClient />
      </>
    );
  } else {
    return <FallBack />;
  }

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
