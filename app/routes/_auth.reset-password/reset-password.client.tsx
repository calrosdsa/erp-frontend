import CustomForm from "@/components/custom/form/CustomForm";
import { Link, useFetcher } from "@remix-run/react";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { forgotPasswordSchema } from "~/util/data/schemas/auth/forgot-password-schema";
import { action } from "./route";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { routes } from "~/util/route";
import { useEffect } from "react";
import { useDisplayMessage } from "~/util/hooks/ui/useDisplayMessage";


export default function ForgotPasswordClient(){
    const fetcher = useFetcher<typeof action>()
    const { t } = useTranslation("common")
    const r = routes
    useDisplayMessage({
      error:fetcher.data?.error
    },[fetcher.data?.error])
    return (
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-center pb-4">
              {t("reset-password")}
            </h1>
          {fetcher.data?.message ?
          <Card>
            <CardContent className="pt-4">
              <div>
              {fetcher.data.message}
              </div>
            </CardContent>
            <CardFooter>
              <Link to={r.signin}  className="w-full">
              <Button className="w-full" variant={"ghost"}>Return to sign in</Button>
              </Link>
            </CardFooter>
          </Card>
          :
          <>
             <div className="flex flex-col space-y-2 text-center">
           
            <p className="text-sm text-muted-foreground">
              {t("_account.resetPassowordMsg")}
            </p>
          </div>
            <CustomForm
            fetcher={fetcher}
            onSubmit={(values:z.infer<typeof forgotPasswordSchema>)=>{
              fetcher.submit({
                resetPassword:values,
              },{
                method:"POST",
                encType:"application/json"
              })
              console.log(values)
            }}
            formItemsData={[
                {
                  name:"email",
                  type:"email",
                  label:t("form.email"),
                  typeForm:"input",
                }
              ]}
              schema={forgotPasswordSchema}
              />
              </>
            }
        </div>
    )
}