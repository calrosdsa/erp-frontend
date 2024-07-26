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
        <Outlet/>
    

        <Box
        sx={(theme) => ({
            height: '100%',
            position: 'fixed',
            right: 0,
          top: 0,
          bottom: 0,
          left: { xs: 0, md: '50vw' },
          transition:
          'background-image var(--Transition-duration), left var(--Transition-duration) !important',
          transitionDelay: 'calc(var(--Transition-duration) + 0.1s)',
          backgroundColor: 'background.level1',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundImage:
          'url(https://images.unsplash.com/photo-1527181152855-fc03fc7949c8?auto=format&w=1000&dpr=2)',
          [theme.getColorSchemeSelector('dark')]: {
              backgroundImage:
              'url(https://images.unsplash.com/photo-1572072393749-3ca9c8ea0831?auto=format&w=1000&dpr=2)',
            },
        })}
      />
        
        </div>
    )
  }else{
    return <FallBack/>
  }
}