import { useFetcher } from "@remix-run/react";
import { create } from "zustand";
import { action } from "../route";
import { useToast } from "@/components/ui/use-toast";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { DrawerLayout } from "@/components/layout/drawer/DrawerLayout";
import CustomForm from "@/components/custom/form/CustomForm";
import { createCustomerSchema } from "~/util/data/schemas/selling/customer-schema";
import { z } from "zod";
import { routes } from "~/util/route";
import { GroupAutocompleteForm, useGroupDebounceFetcher } from "~/util/hooks/fetchers/useGroupDebounceFetcher";
import { GlobalState } from "~/types/app";
import { usePermission } from "~/util/hooks/useActions";
import FormAutocomplete from "@/components/custom/select/FormAutocomplete";
import { PartyType, partyTypeToJSON } from "~/gen/common";
import AccordationLayout from "@/components/layout/accordation-layout";
import CustomFormField from "@/components/custom/form/CustomFormField";
import { Input } from "@/components/ui/input";
import CustomFormFieldInput from "@/components/custom/form/CustomFormInput";

export const CreateCustomer = ({
  open,
  onOpenChange,
  globalState,
}: {
  open: boolean;
  onOpenChange: (e: boolean) => void;
  globalState: GlobalState;
}) => {
  const fetcher = useFetcher<typeof action>();
  const { toast } = useToast();
  const { t } = useTranslation("common");
  // const customerTypeFetcher = useFetcher<typeof action>()
  // const [groupDebounceFetcher,onGroupNameChange] = useGroupDebounceFetcher({
  //     partyType:PartyType.customerGroup
  // })
  // const [groupPermission] = usePermission({
  //     actions:groupDebounceFetcher.data?.actions,
  //     roleActions:globalState.roleActions
  // })
  // const createGroup = useCreateGroup()
  const r = routes;
  // const getCustomerTypes = () =>{
  //     customerTypeFetcher.submit({
  //         action:"customer-types",
  //     },{
  //         encType:"application/json",
  //         method:"POST",
  //         action:r.toRoute({
  //             main:partyTypeToJSON(PartyType.customer),
  //             routePrefix:[r.sellingM],
  //         })
  //     })
  // }

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
      className=""
      title={t("_customer.create")}
    >
      <CustomForm
        fetcher={fetcher}
        schema={createCustomerSchema}
        onSubmit={(values: z.infer<typeof createCustomerSchema>) => {
          fetcher.submit(
            {
              action: "create-customer",
              createCustomer: values,
            },
            {
              encType: "application/json",
              method: "POST",
              action: r.toRoute({
                main: partyTypeToJSON(PartyType.customer),
                routePrefix: [r.sellingM],
              }),
            }
          );
        }}
        formItemsData={[
          {
            name: "name",
            type: "string",
            required: true,
            typeForm: "input",
            label: t("form.name"),
          },
          {
            name: "customerType",
            type: "string",
            required: true,
            typeForm: "select",
            data: [
              { name: t("individual"), value: "individual" },
              { name: t("company"), value: "company" },
            ] as SelectItem[],
            keyName: "name",
            keyValue: "value",
            label: t("form.type"),
          },
        ]}
        renderCustomInputs={(form) => {
          return (
            <>
              <GroupAutocompleteForm
                control={form.control}
                label={t("group")}
                roleActions={globalState.roleActions}
                isGroup={false}
                partyType={r.customerGroup}
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

interface CreateCustomerStore {
  open: boolean;
  openDialog: (opt: {}) => void;
  onOpenChange: (e: boolean) => void;
}

export const useCreateCustomer = create<CreateCustomerStore>((set) => ({
  open: false,
  onOpenChange: (e) => set((state) => ({ open: e })),
  openDialog: (opts) => set((state) => ({ open: true })),
}));
