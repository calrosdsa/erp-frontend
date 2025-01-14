import CustomForm from "@/components/custom/form/CustomForm";
import { DrawerLayout } from "@/components/layout/drawer/DrawerLayout";
import { useFetcher, useRevalidator } from "@remix-run/react";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { create } from "zustand";
import { addPartyReferencesSchema } from "~/util/data/schemas/party/party-schemas";
import { route } from "~/util/route";
import { action } from "../route";
import { useEffect, useState } from "react";
import { components } from "~/sdk";
import { useDebounceFetcher } from "remix-utils/use-debounce-fetcher";
import { DEFAULT_DEBOUNCE_TIME } from "~/constant";
import FormAutocomplete from "@/components/custom/select/FormAutocomplete";
import { toast, useToast } from "@/components/ui/use-toast";
import { usePartyDebounceFetcher } from "~/util/hooks/fetchers/usePartyDebounceFetcher";

export const AddReference = ({
  open,
  onOpenChange,
//   onAddNewReference,
  partyId,
  updateReferences,
}: {
  open: boolean;
  onOpenChange: (e: boolean) => void;
  updateReferences:()=>void
//   onAddNewReference:(e:z.infer<typeof addPartyReferencesSchema>)=>void
  // initialAction: string;
  partyId:number
}) => {
  const fetcher = useFetcher<typeof action>();
  const referenceOptsFetcher = useFetcher<typeof action>();
  const { t } = useTranslation("common");
  const r = route;
  const {toast} = useToast()
  const [selectedPartyType, setSelectedPartyType] = useState<
    components["schemas"]["PartyTypeDto"] | undefined
  >(undefined);
  // const partiesDebounceFetcher = useDebounceFetcher<{
  //   parties:components["schemas"]["PartyDto"][]
  // }>()
  const [partiesDebounceFetcher,onPartyNameChange] = usePartyDebounceFetcher({
    partyType:selectedPartyType?.code
  })


  // const onPartyNameChange = (e:string) =>{
  //   if(selectedPartyType == undefined) return 
  //   partiesDebounceFetcher.submit({
  //       action:"parties",
  //       partyType:selectedPartyType.code,
  //       query:e
  //   },{
  //       debounceTimeout:DEFAULT_DEBOUNCE_TIME,
  //       action:r.party,
  //       method:"POST",
  //       encType:"application/json"
  //   })
  // }

  const getPartyRefernceOptions = () => {
    referenceOptsFetcher.submit(
      {
        action: "references-options",
      },
      {
        method: "POST",
        encType: "application/json",
        action: r.party,
      }
    );
  };
  useEffect(() => {
    getPartyRefernceOptions();
  }, []);

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
        updateReferences()
        onOpenChange(false)
    }
  },[fetcher.data])

  return (
    <DrawerLayout open={open} onOpenChange={onOpenChange}>
      <CustomForm
        schema={addPartyReferencesSchema}
        fetcher={fetcher}
        defaultValues={{
            partyId:partyId
        } as z.infer<typeof addPartyReferencesSchema>}
        onSubmit={(values: z.infer<typeof addPartyReferencesSchema>) => {
          console.log("ONSUBMIT",values)
           fetcher.submit({
            action:"add-party-reference",
            addPartyReference:values
           },{
            action:r.party,
            method:"POST",
            encType:"application/json"
           })
        }}
        formItemsData={[
          {
            name: "partyType",
            typeForm: "select",
            label: t("table.reference"),
            data: referenceOptsFetcher.data?.partyOptions || [],
            onSelect: (d: components["schemas"]["PartyTypeDto"]) => {
              console.log("ON SELECT", d);
              setSelectedPartyType(d)
            },
            keyName: "name",
            keyValue: "name",
          },
        ]}
        renderCustomInputs={(form) => {
          return <>
          {selectedPartyType &&
          <FormAutocomplete
          data={partiesDebounceFetcher.data?.parties || []}
          form={form}
          label={t("table.referenceName")}
          onValueChange={onPartyNameChange}
          name="partyName"
          onSelect={(e)=>{
            form.setValue("referenceId",e.id)
          }}
          nameK={"name"}
          />
          }
          </>;
        }}
      />
    </DrawerLayout>
  );
};

interface AddReferenceStore {
  open: boolean;
  onOpenChange: (e: boolean) => void;
  openDialog: (opts: {}) => void;
}
export const useAddReference = create<AddReferenceStore>((set) => ({
  open: false,
  openDialog: (opts) =>
    set((state) => ({
      open: true,
    })),
  onOpenChange: (e) => set((state) => ({ open: e })),
}));
