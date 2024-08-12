import { Box } from "@mui/joy";
import { Outlet, useLoaderData } from "@remix-run/react";
import { useEffect, useState } from "react";
import HomeLayout from "./homeLayout";
import {
  ActionFunctionArgs,
  json,
  LoaderFunctionArgs,
  redirect,
} from "@remix-run/node";
import { commitSession, destroySession, getSession, SessionData } from "~/sessions";
import apiClient from "~/apiclient";
import { GlobalState, UserData } from "~/types/app";
import { components } from "~/sdk";
import { ClientOnly } from "remix-utils/client-only";
import { Role } from "~/types/enums";
import { administratorToUserData, clientToUserData } from "~/util/convertor/entityToUserData";
import FallBack from "@/components/layout/Fallback";

let isHydrating = true;

type HomeActions = {
  action: string;
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const data = await request.formData();
  switch (data.get("action")) {
    case "signout":
      const session = await getSession(request.headers.get("Cookie"));
      return redirect("/signin", {
        headers: {
          "Set-Cookie": await destroySession(session),
        },
      });
    default:
      return redirect("/signin");
  }
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const session = await getSession(request.headers.get("Cookie"));  
  if (!session.has("access_token")) {
    // Redirect to the home page if they are already signed in.
    return redirect("/signin");
  }

  const companyUuid = session.get("companyUuid");
  const role = session.get("role");

  // if (!session.has("companyID")) {
  //   console.log(request.url);
  //   if (!request.url.includes("settings")) {
  //     return redirect("/home/settings?action=session");
  //   }
  // }

  let activeCompany: components["schemas"]["Company"] | undefined = undefined;
  let userData: UserData | undefined = undefined;
  const res = await apiClient({ request }).GET("/account");
  const sessionData = session.data as SessionData;
  if (companyUuid != undefined && res.data != undefined) {
    activeCompany = res.data.user.Companies.find(
      (item) => item.Uuid == companyUuid
    );
  }

  if (res.data != undefined) {
    if (role != undefined) {
      switch (role) {
        case Role.ROLE_CLIENT:{
          if (res.data?.user.Clients.length > 0) {
            userData = clientToUserData(res.data?.user.Clients[0]);
            const currenCompany= res.data.user.Companies.find(item =>item.ID == userData?.CompanyID)
            if(currenCompany != undefined){
              activeCompany = currenCompany
              session.set("companyUuid",activeCompany.Uuid)
              if(userData != undefined){
                session.set("userSessionUuid",userData.Uuid)
              }

              
              console.log("CURRENCT COMPANY",activeCompany)
            }
          }
          // session.set("companyUuid",)
          break
        }
        case Role.ROLE_ADMIN:{
          userData = administratorToUserData(res.data.user.Administrator)
          break 
        }
      }
    }
  }
  return json({
    data: res.data,
    session: sessionData,
    activeCompany: activeCompany,
    userData:userData
  },{
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
};

export default function Home() {
  const { data, session, activeCompany,userData } = useLoaderData<typeof loader>();

  return (
    <ClientOnly fallback={<FallBack />}>
      {() => {
        return (
          <div>
            <HomeLayout
              globalState={{
                user: data?.user,
                appConfig: data?.appConfig,
                session: session,
                activeCompany: activeCompany,
                userData:userData
              }}
            >
              <Outlet
                context={
                  {
                    user: data?.user,
                    appConfig: data?.appConfig,
                    session: session,
                    activeCompany: activeCompany,
                    userData:userData
                  } as GlobalState
                }
              />
            </HomeLayout>
          </div>
        );
      }}
    </ClientOnly>
  );
}
