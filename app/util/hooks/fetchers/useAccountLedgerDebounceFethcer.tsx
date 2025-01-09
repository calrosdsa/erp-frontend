import { useEffect } from "react"
import { useDebounceFetcher } from "remix-utils/use-debounce-fetcher"
import { DEFAULT_DEBOUNCE_TIME } from "~/constant"
import { components } from "~/sdk"
import { PartyType } from "~/types/enums"
import { routes } from "~/util/route"
import { usePermission } from "../useActions"
import FormAutocomplete from "@/components/custom/select/FormAutocomplete"
import { Control } from "react-hook-form"
import FormAutocompleteField from "@/components/custom/select/FormAutocompleteField"



export const LedgerAutocompleteFormField = ({
  allowEdit = true,
  control,
  label,
  name,
  isGroup = false,
  roleActions,
}: {
  allowEdit?: boolean;
  control?: Control<any, any>;
  label?: string;
  name?: string;
  isGroup?: boolean;
  roleActions?: components["schemas"]["RoleActionDto"][];
}) => {
  const [fetcherDebounce, onChange] = useAccountLedgerDebounceFetcher({
    isGroup,
  });
  // const [permission] = usePermission({
  //   actions:fetcherDebounce.data?.actions,
  //   roleActions,
  // });

  return (
    <FormAutocompleteField
      data={fetcherDebounce.data?.accounts || []}
      onValueChange={onChange}
      label={label}
      name={name || "ledger"}
      nameK="name"
      control={control}
      allowEdit={allowEdit}
    />
  );
};

export const LedgerAutocompleteForm = ({
    allowEdit = true,
    control,
    label,
    onSelect,
    name,
    isGroup = false,
    roleActions,
  }: {
    allowEdit?: boolean;
    control?: Control<any, any>;
    label?: string;
    name?: string;
    onSelect: (e: components["schemas"]["LedgerDto"]) => void;
    isGroup?: boolean;
    roleActions?: components["schemas"]["RoleActionDto"][];
  }) => {
    const [fetcherDebounce, onChange] = useAccountLedgerDebounceFetcher({
      isGroup,
    });
    // const [permission] = usePermission({
    //   actions:fetcherDebounce.data?.actions,
    //   roleActions,
    // });
  
    return (
      <FormAutocomplete
        data={fetcherDebounce.data?.accounts || []}
        onValueChange={onChange}
        label={label}
        name={name || "ledger"}
        nameK="name"
        control={control}
        allowEdit={allowEdit}
        onSelect={onSelect}
        
      />
    );
  };

export const useAccountLedgerDebounceFetcher = ({isGroup}:{
    //Pass  isGroup=true  for  filter only ledger groups
    isGroup:boolean
}) =>{
    const r = routes
    const debounceFetcher = useDebounceFetcher<{
        // actions:components["schemas"]["ActionDto"][],
        actions:components["schemas"]["ActionDto"][],
        accounts:components["schemas"]["LedgerDto"][]
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
            action:r.chartOfAccount
        })
    }
    
 

    return [debounceFetcher,onChange] as const
}