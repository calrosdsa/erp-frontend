import { json, MetaFunction, redirect, useActionData } from "@remix-run/react";
import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { commitSession, getSession } from "~/sessions";
import apiClient from "~/apiclient";
import CuatropfClient from "./cuatropf.client";
import { useEffect, useState } from "react";
import { ExternalScriptsFunction } from "remix-utils/external-scripts";
import { components } from "~/sdk";
import { ClientOnly } from "remix-utils/client-only";
import FallBack from "@/components/layout/Fallback";

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

type CuatropfAction ={
}

export const action = async ({ request }: ActionFunctionArgs) => {
  const data = await request.json() as components["schemas"]["CuatropfSubscriptionRequestBody"]
  const client = apiClient({request})
  const url=new URL(request.url)
  const companyUuid = url.searchParams.get("companyUuid")
  console.log(url,companyUuid,request.url,"upload")
  if(companyUuid == null){
    return
  }
  // throw new Error("No company present in request")
  return json({err:  {
    detail: "ERROR",
}})
  // const res = await  client.POST("/cuatropf/subscription/{companyUuid}",{
  //   body:data,
  //   params:{
  //     path:{
  //       companyUuid:companyUuid,
  //     }
  //   }
  // })
  // console.log(res.data,res.error)
  // if(res.response.ok){
  //   return redirect("/cuatropf/success")
  // }
  //   return json({
  //     data:res.data,
  //     err:res.error
  //   })
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url)
  const companyUuid = url.searchParams.get("uuid") || ""
  const objectId = url.searchParams.get("objectId") || ""
  const client = apiClient({request})
  const res = await client.GET("/square/{uuid}/{object_id}",{
    params:{
      path:{
        uuid:companyUuid,
        object_id:objectId
      }
    }
  })
  // console.log(res.data)
  if(res.error != undefined){
    throw new Response(res.error.detail,{
      status:res.response.status,
      statusText:res.error.title
    })
  }

  return json({
    data:res.data
  });
};

// ?companyUuid=94442fed-cf6f-4255-bc22-e4dffcbdec4e&uuid=7f5f07c6-6a23-476c-a9b7-da761f04626a&objectId=3XCEIJ7DAWG66EEIZQKH2H47

// let isHydrating = true;
export default function Cuatropf() {
  // const [isHydrated, setIsHydrated] = useState(!isHydrating);

  // useEffect(() => {
  //   isHydrating = false;
  //   setIsHydrated(true);
  // }, []);

  // if (isHydrated) {
    return (
      <>
      <ClientOnly fallback={<FallBack/>}>
      {()=>{
        return (
          <CuatropfClient />
        )
      }}
      </ClientOnly>
      </>
     );
  // } else {
  //   return <FallBack />;
  // }

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
