import { Box } from "@mui/joy";
import { CssVarsProvider } from "@mui/joy/styles/CssVarsProvider";
import CssBaseline from "@mui/material/CssBaseline";
import GlobalStyles from "@mui/material/GlobalStyles";
import { Outlet } from "@remix-run/react";
import { useEffect, useState } from "react";
import FallBack from "~/components/layout/Fallback";



let isHydrating = true;

export default function AuthLayout(){
  const [isHydrated, setIsHydrated] = useState(
    !isHydrating
  );

  useEffect(() => {
    isHydrating = false;
    setIsHydrated(true);
  }, []);

  if(isHydrated){

    return (
      <div>
       <h1>HELLO</h1>
        </div>
    )
  }else{
    return <FallBack/>
  }
}