import { Box } from "@mui/joy";
import { CssVarsProvider } from "@mui/joy/styles/CssVarsProvider";
import CssBaseline from "@mui/material/CssBaseline";
import GlobalStyles from "@mui/material/GlobalStyles";
import { Outlet } from "@remix-run/react";
import { useEffect, useState } from "react";
import FallBack from "~/components/layout/Fallback";
import AuthClient from "./auth.client";
import { json, LoaderFunctionArgs } from "@remix-run/node";
import { getSession } from "~/sessions";

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

export default function AuthLayout() {
  const [isHydrated, setIsHydrated] = useState(!isHydrating);

  useEffect(() => {
    isHydrating = false;
    setIsHydrated(true);
  }, []);

  if (isHydrated) {
    return (
      <div>
        <Outlet />
        <AuthClient />
      </div>
    );
  } else {
    return <FallBack />;
  }
}
