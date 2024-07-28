import { json, MetaFunction, redirect, useActionData, useFetcher, useLoaderData } from "@remix-run/react";
import React, { Suspense } from "react";
import { CssVarsProvider, useColorScheme } from '@mui/joy/styles';
import GlobalStyles from '@mui/joy/GlobalStyles';
import CssBaseline from '@mui/joy/CssBaseline';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Checkbox from '@mui/joy/Checkbox';
import Divider from '@mui/joy/Divider';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import IconButton, { IconButtonProps } from '@mui/joy/IconButton';
import Link from '@mui/joy/Link';
import Input from '@mui/joy/Input';
import Typography from '@mui/joy/Typography';
import Stack from '@mui/joy/Stack';
import DarkModeRoundedIcon from '@mui/icons-material/DarkModeRounded';
import LightModeRoundedIcon from '@mui/icons-material/LightModeRounded';
import BadgeRoundedIcon from '@mui/icons-material/BadgeRounded';
import { IndexHtmlTransform } from "vite";
import ColorSchemeToggle from "~/components/shared/button/ColorSchemeToggle";
import GoogleIcon from "~/components/shared/icon/GoogleIcon";
import SignInClient from "./signin.client";
import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import createClient from "openapi-fetch";
import { paths } from "~/sdk/account";
import { commitSession, getSession } from "~/sessions";


export const meta: MetaFunction = () => {
    return [
      { title: "Erp SignIn" },
      { name: "description", content: "Welcome to erp" },
    ];
  };

  export const action = async({request}:ActionFunctionArgs)=>{
    const session = await getSession(
      request.headers.get("Cookie")
    );
    const form = await request.formData();
    const data = Object.fromEntries<any>(
      form.entries(),
    );
    const apiClient = createClient<paths>({baseUrl:process.env.API_URL});
    const res = await apiClient.POST("/account/signin",{
      body:{
        email:data.email,
        password:data.password
      }
    })
    if(res.response.ok && res.data != undefined){
      session.set("access_token",res.data.access_token)
      console.log(data,res)      
      return redirect("/auth", {
        headers: {
          "Set-Cookie": await commitSession(session),
        },
      });
    }else{
      return json({message:"dsad"})
    }
    
  }

  export const loader =async({request}:LoaderFunctionArgs)=> {
    const session = await getSession(
      request.headers.get("Cookie")
    );
    if (session.has("access_token")) {
      // Redirect to the home page if they are already signed in.
      return redirect("/auth");
    }
    return json({ok:true})
  }

// let isHydrating = true;
export default function SignIn(){
  // const data = useLoaderData<typeof loader>()
  const data = useActionData<typeof action>();


  return (
      <SignInClient
      />
  )
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