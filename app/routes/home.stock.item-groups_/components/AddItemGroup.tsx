import CustomForm from "@/components/custom/form/CustomForm";
import { DrawerLayout } from "@/components/layout/drawer/DrawerLayout";
import { useFetcher } from "@remix-run/react";
import { useTranslation } from "react-i18next";
import { createItemGroupSchema } from "~/util/data/schemas/stock/item-group-schema";
import { useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { z } from "zod";
import { action } from "../route";

export default function AddItemGroupItem({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (e: boolean) => void;
}) {
  const fetcher = useFetcher<typeof action>();
  const { t } = useTranslation("common");
  const { toast } = useToast()
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
      title={t("form.item-group")}
      open={open}
      onOpenChange={onOpenChange}
    >
      <CustomForm
        fetcher={fetcher}
        schema={createItemGroupSchema}
        formItemsData={[
          {
            label:t("form.name"),
            name: "name",
            type: "string",
            typeForm: "input",
          },
        ]}
        onSubmit={(e:z.infer<typeof createItemGroupSchema>) => {
            console.log("VALUES", e);
            fetcher.submit({
                action:"add-item-group",
                createItemGroup:e
            },{
                method:"POST",
                encType:"application/json"
            })
        }}
      ></CustomForm>
    </DrawerLayout>
  );
}
