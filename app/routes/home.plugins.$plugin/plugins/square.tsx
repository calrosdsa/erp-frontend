import { Button } from "@/components/ui/button";
import { FormControl, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Form, useFetcher } from "@remix-run/react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { components } from "~/sdk";

type SquareCredentials = {
  accessToken:string
  applicationId:string
  locationId:string
  apiVersion:string
}
  
export default function SquarePlugin({companyPlugin}:{
  companyPlugin: components["schemas"]["CompanyPlugins"];
}) {
  const { t } = useTranslation();
  const [showAccessToken,setShowAccessToken] = useState(true)
  const fetcher = useFetcher()
  const [credentials,setCredentias] = useState<SquareCredentials | null>(null)

  const parseCredentials = (c:string | undefined) =>{
    try{
      if(c == undefined) {
        return 
      }
      console.log(c)
      // const cleanedString = c.slice(1, -1);
      const parse = JSON.parse(c) as SquareCredentials
      console.log(parse)
      setCredentias(parse)
    }catch(err){
      setCredentias({
        accessToken:"",
        locationId:"",
        applicationId:"",
        apiVersion:"",
      })
      console.log(err)
    }
  }
  useEffect(()=>{
    parseCredentials(companyPlugin.Credentials)
  },[companyPlugin])

  return (
    <div>
      {credentials != null &&
      <fetcher.Form method="post" action="/home/plugins/square" className="grid gap-y-3 max-w-sm">
      <input type="hidden" value="update-credentials" name="action" />
        <FormControl>
          <FormLabel>{t("applicationId")}</FormLabel>
          <Input type="text" name="applicationId" defaultValue={credentials?.applicationId} />
        </FormControl>

        <FormControl>
          <FormLabel>{t("accessToken")}</FormLabel>
          <Input type={showAccessToken ? "password":"text"} required name="accessToken" 
          defaultValue={credentials?.accessToken} 
          />
        </FormControl>

        <FormControl>
          <FormLabel>{t("locationId")}</FormLabel>
          <Input type="text" name="locationId" defaultValue={credentials?.locationId}  />
        </FormControl>

        <FormControl>
          <FormLabel>{t("apiVersion")}</FormLabel>
          <Input type="text" name="apiVersion" defaultValue={credentials?.apiVersion}  />
        </FormControl>

        <Button
        loading={fetcher.state == "submitting"}
        type="submit">{t("form.save")}</Button>
      </fetcher.Form>
      }
    </div>
  );
}
