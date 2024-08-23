import CustomForm from "@/components/custom/form/CustomForm";
import { DrawerLayout } from "@/components/layout/drawer/DrawerLayout";
import { useFetcher } from "@remix-run/react";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { updatePasswordSchema } from "~/util/data/schemas/account/account-schema";
import { action } from "../route";
import { useToast } from "@/components/ui/use-toast";
import { useEffect } from "react";

export default function UpdatePassword({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (e: boolean) => void;
}) {
  const { t } = useTranslation("common");
  const fetcher = useFetcher<typeof action>();
  const zodM = useTranslation("zod");
  const { toast } = useToast();

  useEffect(() => {
    if (fetcher.data?.error) {
      toast({
        title: fetcher.data?.error,
      });
    }
    if (fetcher.data?.message) {
      toast({
        title: fetcher.data.message,
      });
      onOpenChange(false)
    }
  }, [fetcher.data]);
  return (
    <DrawerLayout
      title={t("_account.updatePassword")}
      open={open}
      onOpenChange={onOpenChange}
    >
      <CustomForm
        formItemsData={[
          {
            name: "password",
            type: "password",
            typeForm: "input",
            label: t("form.password"),
          },
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
        onSubmit={(e: z.infer<typeof updatePasswordSchema>) => {
          fetcher.submit(
            {
              action: "update-password",
              updatePassword: e,
            },
            {
              method: "post",
              encType: "application/json",
            }
          );
        }}
        schema={updatePasswordSchema.refine(
          (values) => {
            return values.newPassword === values.confirmNewPassword;
          },
          {
            message: zodM.t("errors.password_must_match"),
            path: ["confirmNewPassword"],
          }
        )}
      ></CustomForm>
    </DrawerLayout>
  );
}
