import CustomForm from "@/components/custom/form/CustomForm";
import { DrawerLayout } from "@/components/layout/drawer/DrawerLayout";
import { useFetcher } from "@remix-run/react";
import { z } from "zod";
import { create } from "zustand";
import { createCompanySchema } from "~/util/data/schemas/company/company-schemas";
import { action } from "../route";
import { useTranslation } from "react-i18next";
import { useDebounceFetcher } from "remix-utils/use-debounce-fetcher";
import FormAutocomplete from "@/components/custom/select/FormAutocomplete";
import { DEFAULT_DEBOUNCE_TIME } from "~/constant";
import { routes } from "~/util/route";
import { useToast } from "@/components/ui/use-toast";
import { useEffect } from "react";
import { components } from "~/sdk";

export const CreateCompany = ({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (e: boolean) => void;
}) => {
  const fetcher = useFetcher<typeof action>();
  const { t } = useTranslation("common");
  const r = routes
  const validParentCompaniesFetcher = useDebounceFetcher<{
    companies: components["schemas"]["Company"][];
  }>();
  const {toast} = useToast()
  useEffect(()=>{
    if(fetcher.data?.error){
        toast({
            title:fetcher.data.error
        })
    }
    if(fetcher.data?.message){
        toast({
            title:fetcher.data.message
        })
        onOpenChange(false)
    }
  },[fetcher.data])
  return (
    <DrawerLayout
      open={open}
      onOpenChange={onOpenChange}
      title={t("f.add-new", { o: t("_company.base") })}
    >
      <CustomForm
        schema={createCompanySchema}
        onSubmit={(values: z.infer<typeof createCompanySchema>) => {
            fetcher.submit({
                action:"create-company",
                createCompany:values
            },{
                method:"POST",
                encType:"application/json",
                action:r.companies
            })
        }}
        fetcher={fetcher}
        formItemsData={[
          {
            name: "name",
            label: t("form.name"),
            type: "string",
            typeForm: "input",
          },
        ]}
        renderCustomInputs={(form) => {
          return (
            <>
              <FormAutocomplete
                form={form}
                data={validParentCompaniesFetcher.data?.companies || []}
                onSelect={(v)=>{
                  form.setValue("parentId", v.ID);
                }}
                onValueChange={(e) => {
                  validParentCompaniesFetcher.submit(
                    {
                      action: "get-valid-parent-companies",
                      query: e,
                    },
                    {
                      debounceTimeout:DEFAULT_DEBOUNCE_TIME,
                      method: "POST",
                      action: r.companies,
                      encType: "application/json",
                    }
                  );
                }}
                name="parentName"
                nameK="Name"
                label={t("companies")}
                onOpen={()=>{
                    validParentCompaniesFetcher.submit(
                        {
                          action: "get-valid-parent-companies",
                          query: "",
                        },
                        {
                          debounceTimeout:DEFAULT_DEBOUNCE_TIME,
                          method: "POST",
                          action: r.companies,
                          encType: "application/json",
                        }
                      );
                }}
              />
            </>
          );
        }}
      ></CustomForm>
    </DrawerLayout>
  );
};

interface CreateCompanyStore {
  open: boolean;
  onOpenChange: (e: boolean) => void;
  openDialog: (opts: {}) => void;
}

export const useCreateCompany = create<CreateCompanyStore>((set) => ({
  open: false,
  onOpenChange: (e) => set((state) => ({ open: e })),
  openDialog: (opts) => set((state) => ({ open: true })),
}));
