import CustomForm from "@/components/custom/form/CustomForm";
import FormAutocomplete from "@/components/custom/select/FormAutocomplete";
import SelectForm from "@/components/custom/select/SelectForm";
import { DrawerLayout } from "@/components/layout/drawer/DrawerLayout";
import { useFetcher, useParams, useRevalidator } from "@remix-run/react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDebounceFetcher } from "remix-utils/use-debounce-fetcher";
import { z } from "zod";
import { routes } from "~/util/route";
import { action } from "../../home.stock.items.$code/route";
import { useToast } from "@/components/ui/use-toast";
import { create } from "zustand";
import { components } from "~/sdk";
import { useItemAttributeFetcher } from "~/util/hooks/fetchers/useItemAttributeFetcher";
import { createItemVariantSchema } from "~/util/data/schemas/stock/item-variant-schemas";

export default function CreateItemVariant({
  open,
  onOpenChange,
  item,
}: {
  open: boolean;
  onOpenChange: (e: boolean) => void;
  item?:{
    name:string
    uuid:string
  }
}) {
  const { t } = useTranslation("common");
  const fetcherItemAttribute = useDebounceFetcher<{
    itemAttribute:components["schemas"]["ItemAttributeDto"]
  }>();
  const [itemAttributeFetcher,onItemAttributeChange] = useItemAttributeFetcher()
  const params = useParams()
  const revalidator = useRevalidator()
  const fetcher = useFetcher<typeof action>();
  const r = routes;
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
      title={t("_item.addVariant")}
    >
        {/* {JSON.stringify(fetcherItemAttribute.data)} */}
      <CustomForm
        schema={createItemVariantSchema}
        fetcher={fetcher}
        onSubmit={(e: z.infer<typeof createItemVariantSchema>) => {
          fetcher.submit({
            action:"add-variant",
            createItemVariant:e,
          },{
            method:"POST",
            action:r.toItemDetailVariants(item?.name || "",item?.uuid || ""),
            encType:"application/json"
          })
            console.log("VALUES",e)
        }}
        defaultValues={{
          itemUuid:item?.uuid,
        } as z.infer<typeof createItemVariantSchema>}
        formItemsData={[
          {
            name: "name",
            type: "string",
            typeForm: "input",
            label: t("form.name"),
          },
        ]}
        renderCustomInputs={(form) => {
          return (
            <div className="py-2">
              <FormAutocomplete
                form={form}
                data={itemAttributeFetcher.data?.itemAttributes || []}
                label={t("_stock.itemAttribute")}
                nameK={"name"}
                onValueChange={onItemAttributeChange}
                onSelect={(v) => {
                //   setSelectedItemAttribute(v);
                  fetcherItemAttribute.submit({
                    action: "get",
                },{
                    method:"POST",
                    action:r.toItemAttributeDetail(v.name,v.uuid),
                    encType:"application/json"
                })
                }}
                name="itemAttributeName"
              />
              {fetcherItemAttribute.data != undefined && (
                <SelectForm
                  form={form}
                  data={fetcherItemAttribute.data.itemAttribute.item_attribute_values}
                  keyName={"value"}
                  keyValue={"value"}
                  name="itemAttributeValueName"
                  onValueChange={(e)=>{
                    form.setValue("itemAttributeValueId",e.id)
                    revalidator.revalidate()
                  }}
                  label={t("_stock.itemAttributeValue")}
                />
              )}
            </div>
          );
        }}
      />
    </DrawerLayout>
  );
}

interface CreateItemVariant {
  open:boolean
  onOpenChange:(e:boolean)=>void
  item?: {
    name:string
    uuid:string
  }
  openDialog:(opts:{item?:{
    name:string
    uuid:string
  }})=>void
}
export const useCreateItemVariant = create<CreateItemVariant>((set)=>({
  open:false,
  onOpenChange:(e:boolean)=>set((state)=>({open:e})),
  item:undefined,
  openDialog:(opts)=>set((state)=>({item:opts.item,open:true}))
}))