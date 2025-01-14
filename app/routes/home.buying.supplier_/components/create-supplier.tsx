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
import { route } from "~/util/route";
import { GroupAutocompleteForm, useGroupDebounceFetcher } from "~/util/hooks/fetchers/useGroupDebounceFetcher";
import { usePermission } from "~/util/hooks/useActions";
import { GlobalState } from "~/types/app";
import FormAutocomplete from "@/components/custom/select/FormAutocomplete";
import { PartyType, partyTypeToJSON } from "~/gen/common";
import AccordationLayout from "@/components/layout/accordation-layout";
import CustomFormFieldInput from "@/components/custom/form/CustomFormInput";

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
  
  
  const r = route;
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
        onSubmit={(values: z.infer<typeof createSupplierSchema>) => {
          fetcher.submit(
            {
              action: "create-supplier",
              createSupplier: values,
            },
            {
              encType: "application/json",
              action: r.toRoute({
                main:partyTypeToJSON(PartyType.supplier),
                routePrefix:[r.buyingM]
              }),
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
            required:true,
          },
        ]}
        renderCustomInputs={(form) => {
          return (
            <> 
            <GroupAutocompleteForm
            control={form.control}
            label={t("group")}
            isGroup={false}
            partyType={r.supplierGroup}
            roleActions={globalState.roleActions}
            onSelect={(e) => {
              form.setValue("groupID", e.id);
            }}
          />
         <AccordationLayout title={t("contact")} className="grid gap-3">
                <CustomFormFieldInput
                  label={t("form.phoneNumber")}
                  name="contactData.phoneNumber"
                  control={form.control}
                  inputType="input"
                  type="tel"
                />
                <CustomFormFieldInput
                  label={t("form.email")}
                  name="contactData.email"
                  control={form.control}
                  inputType="input"
                  type="email"
                />
              </AccordationLayout>
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
