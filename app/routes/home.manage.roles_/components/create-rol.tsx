import { DrawerLayout } from "@/components/layout/drawer/DrawerLayout";
import { useFetcher } from "@remix-run/react";
import { create } from "zustand";
import { action } from "../route";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import CustomForm from "@/components/custom/form/CustomForm";
import { roleDataSchema } from "~/util/data/schemas/manage/role-schema";
import { z } from "zod";
import { route } from "~/util/route";
import { useDisplayMessage } from "~/util/hooks/ui/useDisplayMessage";

export const CreateRole = ({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (e: boolean) => void;
}) => {
  const fetcher = useFetcher<typeof action>();
  const { t } = useTranslation("common");
  const r = route;

  useDisplayMessage(
    {
      error: fetcher.data?.error,
      success: fetcher.data?.message,
      onShowMessage: () => {
        onOpenChange(false);
      },
    },
    [fetcher.data]
  );
  return (
    <DrawerLayout
      open={open}
      onOpenChange={onOpenChange}
      title={t("f.add-new", { o: t("_role.base") })}
    >
      <CustomForm
        fetcher={fetcher}
        schema={roleDataSchema}
        onSubmit={(values: z.infer<typeof roleDataSchema>) => {
          fetcher.submit(
            {
              action: "create-role",
              roleData: values,
            },
            {
              encType: "application/json",
              method: "POST",
              action: route.to(r.role),
            }
          );
        }}
        formItemsData={[
          {
            name: "code",
            label: t("form.name"),
            type: "string",
            typeForm: "input",
          },
          {
            name: "description",
            label: t("form.description"),
            typeForm: "textarea",
          },
        ]}
      />
    </DrawerLayout>
  );
};

interface CreateRoleStore {
  open: boolean;
  onOpenChange: (e: boolean) => void;
  openDialog: (opts: {}) => void;
}
export const useCreateRole = create<CreateRoleStore>((set) => ({
  open: false,
  onOpenChange: (e) => set((state) => ({ open: e })),
  openDialog: (opts) => set((state) => ({ open: true })),
}));
