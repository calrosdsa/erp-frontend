import { Box } from "@mui/joy";
import { Outlet, useLoaderData } from "@remix-run/react";
import { useEffect, useState } from "react";
import FallBack from "~/components/layout/Fallback";
import HomeLayout from "./homeLayout";
import { ActionFunctionArgs, json, LoaderFunctionArgs, redirect } from "@remix-run/node";
import { destroySession, getSession } from "~/sessions";
import apiClient from "~/apiclient";
import { GlobalState } from "~/types/app";

let isHydrating = true;

type HomeActions = {
  action:string
}

export const action = async({request}:ActionFunctionArgs) =>{
  const data = await request.formData()
  switch(data.get("action")){
    case "signout":
      const session = await getSession(
        request.headers.get("Cookie")
      );
      return redirect("/signin",{
        headers: {
          "Set-Cookie": await destroySession(session),
        },
      })
    default:
      return redirect("/signin")
  }
}

export const loader = async({request}:LoaderFunctionArgs) =>{
  const session = await getSession(
    request.headers.get("Cookie")
  );
  if (!session.has("access_token")) {
    // Redirect to the home page if they are already signed in.
    return redirect("/signin"); 
  }

  const res = await apiClient({request}).GET("/account")
  console.log("ACCOUNT DATA",res.data)
  return json({
    account:res.data
  })
}

export default function Home() {
  const [isHydrated, setIsHydrated] = useState(!isHydrating);
  const {account} = useLoaderData<typeof loader>()

  useEffect(() => {
    isHydrating = false;
    setIsHydrated(true);
  }, []);

  if (isHydrated) {
    return (
      <div>
        <HomeLayout>
        <Outlet 
        context={{
          account:account
        } as GlobalState }
        />
        </HomeLayout>
      </div>
    );
  } else {
    return <FallBack />;
  }
}
