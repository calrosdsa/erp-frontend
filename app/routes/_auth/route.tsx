import { Outlet } from "@remix-run/react";
import { useEffect, useState } from "react";
import AuthClient from "./auth.client";
import { json, LoaderFunctionArgs } from "@remix-run/node";
import { getSession } from "~/sessions";
import FallBack from "@/components/layout/Fallback";
import { components } from "index";
import apiClient from "~/apiclient";

let isHydrating = true;
// export const loader =async({request}:LoaderFunctionArgs)=> {
//   const session = await getSession(
//     request.headers.get("Cookie")
//   );
//   if (session.has("access_token")) {
//     // Redirect to the home page if they are already signed in.
//   }
//   return json({ok:true})
// }

export const loader = async({request}:LoaderFunctionArgs) =>{
  const url = new URL(request.url)
  const params = url.searchParams
  const companyUuid = params.get("uuid")
  let company:components["schemas"]["Company"] | undefined = undefined
  if(companyUuid){
    const client = apiClient({request})
    const res = await client.GET("/company/{uuid}",{
      params:{
        path:{
          uuid:companyUuid
        }
      }
    })
    company = res.data?.result
  }
  return json({
    company
  })
}

export default function AuthLayout() {
  const [isHydrated, setIsHydrated] = useState(!isHydrating);

  useEffect(() => {
    isHydrating = false;
    setIsHydrated(true);
  }, []);

  if (isHydrated) {
    return (
      <div>
        <AuthClient>
          <Outlet />
        </AuthClient>
      </div>
    );
  } else {
    return <FallBack />;
  }
}
