import { Outlet, ShouldRevalidateFunctionArgs, useLoaderData } from "@remix-run/react";
import HomeLayout from "./homeLayout";
import {
  ActionFunctionArgs,
  json,
  LoaderFunctionArgs,
  redirect,
} from "@remix-run/node";
import {
  commitSession,
  destroySession,
  getSession,
  SessionData,
} from "~/sessions";
import apiClient from "~/apiclient";
import { GlobalState } from "~/types/app-types";
import { ClientOnly } from "remix-utils/client-only";
import FallBack from "@/components/layout/Fallback";
import { LOAD_ACTION } from "~/constant";

export const action = async ({ request, context }: ActionFunctionArgs) => {
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

export function shouldRevalidate({
  formMethod,
  defaultShouldRevalidate,
  actionResult
}:ShouldRevalidateFunctionArgs) {
  if (actionResult?.actionRoot == LOAD_ACTION) {
    return defaultShouldRevalidate;
  }
  if (formMethod === "POST") {
    return false;
  }
  return defaultShouldRevalidate;
}


export const loader = async ({ request, context }: LoaderFunctionArgs) => {
  console.log("API URL CONTEXT", context);
  const session = await getSession(request.headers.get("Cookie"));
  if (!session.has("access_token")) {
    // Redirect to the home page if they are already signed in.
    return redirect("/signin");
  }
  const res = await apiClient({ request }).GET("/account");
  if (res.error) {
    if ((res.error.status = 401)) {
      return redirect("/signin", {
        headers: {
          "Set-Cookie": await destroySession(session),
        },
      });
    }
  }
  const sessionData = session.data as SessionData;
  // console.log(res.data?.company_defaults);
  return json(
    {
      data: res.data,
      session: sessionData,
      user: res.data?.user,
      role: res.data?.role,
      profile: res.data?.profile,
      company: res.data?.company,
      roleActions: res.data?.role_actions,
      companyDefaults: res.data?.company_defaults,
      // activeCompany: res.data?.user.UserRelation.Company,
    },
    {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    }
  );
};

export default function Home() {
  const {
    data,
    session,
    user,
    profile,
    role,
    company,
    roleActions,
    companyDefaults,
  } = useLoaderData<typeof loader>();

  return (
    <ClientOnly fallback={<FallBack />}>
      {() => {
        return (
          <div>
            <HomeLayout
              globalState={{
                // appConfig: data?.appConfig,
                session: session,
                user: user,
                activeCompany: company,
                role: role,
                profile: profile,
                roleActions: roleActions || [],
                companyDefaults: companyDefaults,
              }}
            >
              <Outlet
                context={
                  {
                    user: data?.user,
                    // appConfig: data?.appConfig,
                    session: session,
                    activeCompany: company,
                    role: role,
                    profile: profile,
                    roleActions: roleActions,
                    companyDefaults: companyDefaults,
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
