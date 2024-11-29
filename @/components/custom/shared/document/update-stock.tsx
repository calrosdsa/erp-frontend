import { UseFormReturn } from "react-hook-form";
import { useDocumentStore } from "./use-document-store";
import { GlobalState } from "~/types/app";
import { useOutletContext } from "@remix-run/react";
import { useWarehouseDebounceFetcher } from "~/util/hooks/fetchers/useWarehouseDebounceFetcher";
import { usePermission } from "~/util/hooks/useActions";
import { useCreateWareHouse } from "~/routes/home.stock.warehouse_/components/add-warehouse";
import { PartyType, partyTypeToJSON } from "~/gen/common";
import CustomFormField from "../../form/CustomFormField";
import { CustomCheckbox } from "../../input/CustomCheckBox";
import FormAutocomplete from "../../select/FormAutocomplete";
import { useTranslation } from "react-i18next";

export default function UpdateStock({form,updateStock,partyType}:{
    form: UseFormReturn<any>;
    updateStock?:boolean
    partyType:string
}){
  const {roleActions} = useOutletContext<GlobalState>();
  const [warehouseFetcher, onWarehouseChange] = useWarehouseDebounceFetcher({
    isGroup: false,
  });
  const [permissionWarehouse] = usePermission({
    actions: warehouseFetcher.data?.actions,
    roleActions: roleActions,
  });
  const createWareHouse = useCreateWareHouse();
  const isSaleInvoice = partyType == partyTypeToJSON(PartyType.saleInvoice)
  const isPurchaseInvoice = partyType == partyTypeToJSON(PartyType.purchaseInvoice)
  const {t} = useTranslation("common")
    return(
        <>
         {(isSaleInvoice || isPurchaseInvoice) && 
        <>
          <CustomFormField
          form={form.control}
          name="updateStock"
          children={(field)=>{
            return  <CustomCheckbox
            checked={field.value}
            onCheckedChange={(e)=>{
                field.onChange(e)
                form.trigger("updateStock")
            }}
            label={t("form.updateStock")}
          />
          }}
          />
          {(isSaleInvoice &&  updateStock) && 
           <FormAutocomplete
           control={form.control}
           data={warehouseFetcher.data?.warehouses || []}
           name="sourceWarehouseName"
           nameK={"name"}
           onValueChange={onWarehouseChange}
           onSelect={(v) => {
             form.setValue("sourceWarehouse", v.id);
           }}
           label={t("f.source", { o: t("_warehouse.base") })}
           {...(permissionWarehouse?.create && {
             addNew: () => {
               createWareHouse.openDialog({});
             },
           })}
         />
          }

        </>
        }
        </>
    )
}