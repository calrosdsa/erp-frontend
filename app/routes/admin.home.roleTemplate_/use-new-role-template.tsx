import CustomForm from "@/components/custom/form/CustomForm";
import { DrawerLayout } from "@/components/layout/drawer/DrawerLayout";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFetcher } from "@remix-run/react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { create } from "zustand";
import { action } from "./route";
import { useDisplayMessage } from "~/util/hooks/ui/useDisplayMessage";

export const createRoleTemplateSchema = z.object({
  name: z.string(),
});

export const NewRoleTemplate = ({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (e: boolean) => void;
}) => {
  const { t } = useTranslation("common");
  const fetcher = useFetcher<typeof action>();

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
    <DrawerLayout open={open} onOpenChange={onOpenChange}
    className=" max-w-sm">
      <CustomForm
        schema={createRoleTemplateSchema}
        fetcher={fetcher}
        onSubmit={(e:z.infer<typeof createRoleTemplateSchema>) => {
            fetcher.submit({
                action:"create-role-template",
                createRoleTemplate:e
            },{
                method:"POST",
                encType:"application/json"
            })
        }}
        formItemsData={[
          {
            name: "name",
            label: t("form.name"),
            typeForm: "input",
          },
        ]}
      />
    </DrawerLayout>
  );
};

interface RoleTempalteStore {
  open: boolean;
  onOpenChange: (e: boolean) => void;
}
export const useNewRoleTemplate = create<RoleTempalteStore>((set) => ({
  open: false,
  onOpenChange: (e) =>
    set((state) => ({
      open: e,
    })),
}));
