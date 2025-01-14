import CustomForm from "@/components/custom/form/CustomForm";
import { DrawerLayout } from "@/components/layout/drawer/DrawerLayout";
import { useFetcher, useNavigate } from "@remix-run/react";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { useToast } from "@/components/ui/use-toast";
import { useEffect } from "react";
import { changePasswordSchema } from "~/util/data/schemas/auth/forgot-password-schema";
import { useDisplayMessage } from "~/util/hooks/ui/useDisplayMessage";
import { action } from "./route";
import { route } from "~/util/route";

export default function ChangePasswordClient() {
  const { t } = useTranslation("common");
  const fetcher = useFetcher<typeof action>();
  const zodM = useTranslation("zod");
  const r = route
  const navigate = useNavigate()
  useDisplayMessage(
    {
      error: fetcher.data?.error,
      success: fetcher.data?.message,
      onSuccessMessage:()=>{
        navigate(r.signin)
      }
    },
    [fetcher.data]
  );
  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight text-center pb-4">
        {t("change-password")}
      </h1>
      <CustomForm
        formItemsData={[
          {
            name: "newPassword",
            type: "password",
            typeForm: "input",
            label: t("form.newPassword"),
          },
          {
            name: "confirmNewPassword",
            type: "password",
            typeForm: "input",
            label: t("form.confirmNewPassword"),
          },
        ]}
        fetcher={fetcher}
        buttonText= {t("change-password")}
        onSubmit={(e: z.infer<typeof changePasswordSchema>) => {
          fetcher.submit(
            {
              changePassword: e,
            },
            {
              method: "post",
              encType: "application/json",
            }
          );
        }}
        schema={changePasswordSchema.refine(
          (values) => {
            return values.newPassword === values.confirmNewPassword;
          },
          {
            message: zodM.t("errors.password_must_match"),
            path: ["confirmNewPassword"],
          }
        )}
      ></CustomForm>
    </div>
  );
}
