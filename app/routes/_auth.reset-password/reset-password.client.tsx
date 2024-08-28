import CustomForm from "@/components/custom/form/CustomForm";
import { useFetcher } from "@remix-run/react";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { forgotPasswordSchema } from "~/util/data/schemas/auth/forgot-password-schema";


export default function ForgotPasswordClient(){
    const fetcher = useFetcher()
    const { t } = useTranslation("common")
    return (
        <div>
             <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              {t("reset-password")}
            </h1>
            <p className="text-sm text-muted-foreground">
              {t("_account.resetPassowordMsg")}
            </p>
          </div>
            <CustomForm
            fetcher={fetcher}
            onSubmit={(values:z.infer<typeof forgotPasswordSchema>)=>{
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
        </div>
    )
}