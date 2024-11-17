import CustomForm from "@/components/custom/form/CustomForm";
import { DrawerLayout } from "@/components/layout/drawer/DrawerLayout";
import { useFetcher } from "@remix-run/react";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { create } from "zustand";
import { useDisplayMessage } from "~/util/hooks/ui/useDisplayMessage";
import { routes } from "~/util/route";
import { action } from "./route";

export const createCostCenterSchema = z.object({
  name: z.string(),
  enabled: z.boolean(),
});

export const NewCostCenter = ({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (e: boolean) => void;
}) => {
  const { t } = useTranslation("common");
  const fetcher = useFetcher<typeof action>();
  const r = routes;

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
        onSubmit={(e: z.infer<typeof createCostCenterSchema>) => {
          fetcher.submit(
            {
              action: "create-cost-center",
              createCostCenter: e,
            },
            {
              method: "POST",
              action: r.toRoute({
                main: r.costCenter,
                routePrefix: [r.accountingM],
              }),
              encType: "application/json",
            }
          );
        }}
        schema={createCostCenterSchema}
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

interface NewCostCenterStore {
  open: boolean;
  onOpenChange: (e: boolean) => void;
}

export const useNewCostCenter = create<NewCostCenterStore>((set) => ({
  open: false,
  onOpenChange: (e) =>
    set((state) => ({
      open: e,
    })),
}));
