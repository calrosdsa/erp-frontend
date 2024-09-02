import CustomForm from "@/components/custom/form/CustomForm";
import FormAutocomplete from "@/components/custom/select/FormAutocomplete";
import SelectForm from "@/components/custom/select/SelectForm";
import { DrawerLayout } from "@/components/layout/drawer/DrawerLayout";
import { useFetcher, useParams, useRevalidator } from "@remix-run/react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDebounceFetcher } from "remix-utils/use-debounce-fetcher";
import { z } from "zod";
import { components } from "index";
import { itemVariantFormSchema } from "~/util/data/schemas/stock/item-variant-schemas";
import { routes } from "~/util/route";
import { action } from "../../home.stock.items.$code/route";
import { useToast } from "@/components/ui/use-toast";
import { create } from "zustand";

export default function CreateItemVariant({
  open,
  onOpenChange,
  item,
}: {
  open: boolean;
  onOpenChange: (e: boolean) => void;
  item?:components["schemas"]["Item"]
}) {
  const { t } = useTranslation("common");
  const fetcherDebounce = useDebounceFetcher<
    | {
        pagination_result: {
          results: components["schemas"]["ItemAttribute"][];
          total: number;
        };
      }
    | undefined
  >();

  const fetcherItemAttribute = useFetcher<
    { itemAttribute:components["schemas"]["ItemAttribute"]} | undefined
  >()
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
        schema={itemVariantFormSchema}
        fetcher={fetcher}
        onSubmit={(e: z.infer<typeof itemVariantFormSchema>) => {
          fetcher.submit({
            action:"add-variant",
            itemVariantFormSchema:e,
          },{
            method:"POST",
            action:r.toItemDetailVariants(params.code || ""),
            encType:"application/json"
          })
            console.log("VALUES",e)
        }}
        defaultValues={{
            itemId:item?.ID,
        } as z.infer<typeof itemVariantFormSchema>}
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
                data={fetcherDebounce.data?.pagination_result.results || []}
                label={t("_stock.itemAttribute")}
                value={"Name"}
                nameK={"Name"}
                onValueChange={(e) => {
                  fetcherDebounce.submit(
                    { query: e, action: "get" },
                    {
                      debounceTimeout: 600,
                      method: "POST",
                      action: r.itemAttributes,
                      encType: "application/json",
                    }
                  );
                }}
                onSelect={(v) => {
                //   setSelectedItemAttribute(v);
                  fetcherItemAttribute.submit({
                    code: v.Name,
                    action: "get",
                },{
                    method:"POST",
                    action:r.toItemAttributeDetail(v.Name),
                    encType:"application/json"
                })
                }}
                name="itemAttributeName"
                onOpen={() => {
                  fetcherDebounce.submit(
                    { query: "", action: "get" },
                    {
                      method: "POST",
                      action: r.itemAttributes,
                      encType: "application/json",
                    }
                  );
                }}
              />
              {fetcherItemAttribute.data != undefined && (
                <SelectForm
                  form={form}
                  data={fetcherItemAttribute.data.itemAttribute.ItemAttributeValues}
                  keyName={"Value"}
                  keyValue={"Value"}
                  name="itemAttributeValueName"
                  onValueChange={(e)=>{
                    console.log("UPDATING",e.ID)
                    form.setValue("itemAttributeValueId",e.ID)
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
  item:components["schemas"]["Item"] | undefined
  openDialog:(opts:{item?:components["schemas"]["Item"]})=>void
}
export const useCreateItemVariant = create<CreateItemVariant>((set)=>({
  open:false,
  onOpenChange:(e:boolean)=>set((state)=>({open:e})),
  item:undefined,
  openDialog:(opts)=>set((state)=>({item:opts.item,open:true}))
}))