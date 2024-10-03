import { DrawerLayout } from "@/components/layout/drawer/DrawerLayout";
import { useFetcher } from "@remix-run/react";
import { create } from "zustand";
import { action } from "../route";
import { useTranslation } from "react-i18next";
import { useToast } from "@/components/ui/use-toast";
import { useEffect } from "react";
import CustomForm from "@/components/custom/form/CustomForm";
import { createSupplierSchema } from "~/util/data/schemas/buying/supplier-schema";
import { z } from "zod";
import { routes } from "~/util/route";
import { useGroupDebounceFetcher } from "~/util/hooks/fetchers/useGroupDebounceFetcher";
import { usePermission } from "~/util/hooks/useActions";
import { GlobalState } from "~/types/app";
import FormAutocomplete from "@/components/custom/select/FormAutocomplete";
import { useCreateGroup } from "~/routes/home.groups.$party_/components/create-group";
import { PartyType } from "~/gen/common";

export const CreateSupplier = ({
  open,
  onOpenChange,
  globalState,
}: {
  open: boolean;
  onOpenChange: (e: boolean) => void;
  globalState: GlobalState;
}) => {
  const fetcher = useFetcher<typeof action>();
  const { t } = useTranslation("common");
  const { toast } = useToast();
  const [groupDebounceFetcher, onChangeGroupName] = useGroupDebounceFetcher({
    partyType: PartyType.supplierGroup,
  });
  const createGroup = useCreateGroup();
  const [groupPermission] = usePermission({
    actions: groupDebounceFetcher.data?.actions,
    roleActions: globalState.roleActions,
  });
  const d = groupDebounceFetcher.data?.groups || [];
  const r = routes;
  useEffect(() => {
    if (fetcher.data?.error) {
      toast({
        title: fetcher.data.error,
      });
    }
    if (fetcher.data?.message) {
      toast({
        title: fetcher.data.message,
      });
      onOpenChange(false);
    }
  }, [fetcher.data]);
  return (
    <DrawerLayout
      open={open}
      onOpenChange={onOpenChange}
      title={t("f.add-new", { o: t("_supplier.base") })}
    >
      <CustomForm
        schema={createSupplierSchema}
        fetcher={fetcher}
        defaultValues={
          {
            enabled: true,
          } as z.infer<typeof createSupplierSchema>
        }
        onSubmit={(values: z.infer<typeof createSupplierSchema>) => {
          fetcher.submit(
            {
              action: "create-supplier",
              createSupplier: values,
            },
            {
              encType: "application/json",
              action: r.suppliers,
              method: "POST",
            }
          );
        }}
        formItemsData={[
          {
            name: "name",
            label: t("form.name"),
            type: "string",
            typeForm: "input",
          },
          {
            name: "enabled",
            label: t("form.enabled"),
            type: "boolean",
            typeForm: "check",
            description: t("f.enable", { o: t("_supplier.base") }),
          },
        ]}
        renderCustomInputs={(form) => {
          return (
            <>
              <FormAutocomplete
                form={form}
                label={t("group")}
                data={groupDebounceFetcher.data?.groups || []}
                onValueChange={(e) => onChangeGroupName(e)}
                name="groupName"
                nameK={"name"}
                onSelect={(v) => {
                  form.setValue("group", v);
                }}
                {...(groupPermission?.create && {
                  addNew: () =>
                    createGroup.openDialog({
                      partyType: PartyType[PartyType.supplierGroup],
                    }),
                })}
              />
            </>
          );
        }}
      />
    </DrawerLayout>
  );
};

interface CreateSupplierStore {
  open: boolean;
  onOpenChange: (e: boolean) => void;
  openDialog: (opts: {}) => void;
}
export const useCreateSupplier = create<CreateSupplierStore>((set) => ({
  open: false,
  onOpenChange: (e) => set((state) => ({ open: e })),
  openDialog: (opts) => set((state) => ({ open: true })),
}));
