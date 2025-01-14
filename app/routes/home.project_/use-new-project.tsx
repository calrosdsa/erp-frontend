import CustomForm from "@/components/custom/form/CustomForm";
import { DrawerLayout } from "@/components/layout/drawer/DrawerLayout";
import { useFetcher } from "@remix-run/react";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { create } from "zustand";
import { useDisplayMessage } from "~/util/hooks/ui/useDisplayMessage";
import { route } from "~/util/route";
import { action } from "./route";

export const createProjectSchema = z.object({
  name: z.string(),
  enabled: z.boolean(),
});

export const NewProject = ({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (e: boolean) => void;
}) => {
  const { t } = useTranslation("common");
  const fetcher = useFetcher<typeof action>();
  const r = route;

  useDisplayMessage(
    {
      success: fetcher.data?.message,
      error: fetcher.data?.error,
      onShowMessage: () => {
        onOpenChange(false);
      },
    },
    [fetcher.data]
  );
  return (
    <DrawerLayout open={open} onOpenChange={onOpenChange}>
      <CustomForm
        fetcher={fetcher}
        defaultValues={{
            enabled:true
        }}
        onSubmit={(e: z.infer<typeof createProjectSchema>) => {
          fetcher.submit(
            {
              action: "create-project",
              createProject: e,
            },
            {
              method: "POST",
              action: r.toRoute({
                main: r.project,
              }),
              encType: "application/json",
            }
          );
        }}
        schema={createProjectSchema}
        formItemsData={[
          {
            name: "name",
            typeForm: "input",
            label: t("form.name"),
          },
          {
            name: "enabled",
            typeForm: "check",
            label: t("form.enabled"),
          },
        ]}
      />
    </DrawerLayout>
  );
};

interface NewProjectStore {
  open: boolean;
  onOpenChange: (e: boolean) => void;
}

export const useNewProject = create<NewProjectStore>((set) => ({
  open: false,
  onOpenChange: (e) =>
    set((state) => ({
      open: e,
    })),
}));
