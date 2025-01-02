import { useEffect } from "react"
import { Control } from "react-hook-form"
import { useDebounceFetcher } from "remix-utils/use-debounce-fetcher"
import { DEFAULT_DEBOUNCE_TIME } from "~/constant"
import { components } from "~/sdk"
import { PartyType } from "~/types/enums"
import { routes } from "~/util/route"
import { usePermission } from "../useActions"
import { useCreateWareHouse } from "~/routes/home.stock.warehouse_/components/add-warehouse"
import FormAutocomplete from "@/components/custom/select/FormAutocomplete"
import FormAutocompleteField from "@/components/custom/select/FormAutocompleteField"



export const WarehouseAutocompleteFormField = ({
  allowEdit = true,
  control,
  label,
  onSelect,
  name,
  isGroup,
  roleActions,
}: {
  allowEdit?: boolean;
  control: Control<any, any>;
  label?: string;
  name?: string;
  onSelect?: (e: components["schemas"]["WareHouseDto"]) => void;
  isGroup: boolean;
  roleActions?: components["schemas"]["RoleActionDto"][];
}) => {
  const [fetcherDebounce, onChange] = useWarehouseDebounceFetcher({
    isGroup,
  });
  const [permission] = usePermission({
    actions:fetcherDebounce.data?.actions,
    roleActions,
  });
  const createWareHouse = useCreateWareHouse();

  return (
    <FormAutocompleteField
      data={fetcherDebounce.data?.warehouses || []}
      onValueChange={onChange}
      label={label}
      name={name || "warehouse"}
      nameK="name"
      control={control}
      allowEdit={allowEdit}
      onSelect={onSelect}
      {...(permission?.create && {
        addNew: () =>
          createWareHouse.openDialog({}),
      })}
    />
  );
};


export const WarehouseAutocompleteForm = ({
    allowEdit = true,
    control,
    label,
    onSelect,
    name,
    isGroup,
    roleActions,
  }: {
    allowEdit?: boolean;
    control: Control<any, any>;
    label?: string;
    name?: string;
    onSelect: (e: components["schemas"]["WareHouseDto"]) => void;
    isGroup: boolean;
    roleActions?: components["schemas"]["RoleActionDto"][];
  }) => {
    const [fetcherDebounce, onChange] = useWarehouseDebounceFetcher({
      isGroup,
    });
    const [permission] = usePermission({
      actions:fetcherDebounce.data?.actions,
      roleActions,
    });
    const createWareHouse = useCreateWareHouse();
  
    return (
      <FormAutocomplete
        data={fetcherDebounce.data?.warehouses || []}
        onValueChange={onChange}
        label={label}
        name={name || "warehouse"}
        nameK="name"
        control={control}
        allowEdit={allowEdit}
        onSelect={onSelect}
        {...(permission?.create && {
          addNew: () =>
            createWareHouse.openDialog({}),
        })}
      />
    );
  };

export const useWarehouseDebounceFetcher = ({isGroup}:{
    isGroup:boolean
}) =>{
    const r = routes
    const debounceFetcher = useDebounceFetcher<{
        actions:components["schemas"]["ActionDto"][],
        warehouses:components["schemas"]["WareHouseDto"][],
    }>()

    const onChange = (e:string)=>{
        
        debounceFetcher.submit({
            action:"get",
            query:e,
            isGroup:isGroup,
        },{
            method:"POST",
            debounceTimeout:DEFAULT_DEBOUNCE_TIME,
            encType:"application/json",
            action:r.warehouses
        })
    }
    
 

    return [debounceFetcher,onChange] as const
}