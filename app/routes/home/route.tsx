import { Box } from "@mui/joy";
import { Outlet, useLoaderData } from "@remix-run/react";
import { useEffect, useState } from "react";
import FallBack from "~/components/layout/Fallback";
import HomeLayout from "./homeLayout";
import {
  ActionFunctionArgs,
  json,
  LoaderFunctionArgs,
  redirect,
} from "@remix-run/node";
import { destroySession, getSession, SessionData } from "~/sessions";
import apiClient from "~/apiclient";
import { GlobalState } from "~/types/app";

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

  // if (!session.has("companyID")) {
  //   console.log(request.url);
  //   if (!request.url.includes("settings")) {
  //     return redirect("/home/settings?action=session");
  //   }
  // }

  const res = await apiClient({ request }).GET("/account");
  const sessionData = session.data as SessionData
  console.log("SESSIOIN",session.data );
  return json({
    data: res.data,
    session:sessionData
  });
};

export default function Home() {
  const [isHydrated, setIsHydrated] = useState(!isHydrating);
  const { data,session } = useLoaderData<typeof loader>();

  useEffect(() => {
    isHydrating = false;
    setIsHydrated(true);
  }, []);

  if (isHydrated) {
    return (
      <div>
        <HomeLayout
          globalState={{
            user: data?.user,
            appConfig: data?.appConfig,
            session:session
          }}
        >
          <Outlet
            context={
              {
                user: data?.user,
                appConfig: data?.appConfig,
                session:session
              } as GlobalState
            }
          />
        </HomeLayout>
      </div>
    );
  } else {
    return <FallBack />;
  }
}
