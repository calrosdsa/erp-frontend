import { useEffect } from "react"
import { useDebounceFetcher } from "remix-utils/use-debounce-fetcher"
import { DEFAULT_DEBOUNCE_TIME, DEFAULT_SIZE } from "~/constant"
import { components, operations } from "~/sdk"
import { PartyType } from "~/types/enums"
import { route } from "~/util/route"
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
  onSelect,
  roleActions,
  description,
  required,
}: {
  allowEdit?: boolean;
  control?: Control<any, any>;
  label?: string;
  name?: string;
  description?:string;
  isGroup?: boolean;
  roleActions?: components["schemas"]["RoleActionDto"][];
  onSelect?:(e:components["schemas"]["LedgerDto"])=>void;
  required?:boolean
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
      data={fetcherDebounce.data?.results || []}
      onValueChange={onChange}
      label={label}
      name={name || "ledger"}
      nameK="name"
      control={control}
      description={description}
      allowEdit={allowEdit}
      onSelect={onSelect}
      required={required}
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
    onClear,
  }: {
    allowEdit?: boolean;
    control?: Control<any, any>;
    label?: string;
    name?: string;
    onSelect: (e: components["schemas"]["LedgerDto"]) => void;
    isGroup?: boolean;
    roleActions?: components["schemas"]["RoleActionDto"][];
    onClear?:()=>void
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
        data={fetcherDebounce.data?.results || []}
        onValueChange={onChange}
        label={label}
        name={name || "ledger"}
        nameK="name"
        control={control}
        allowEdit={allowEdit}
        onSelect={onSelect}
        onClear={onClear}
      />
    );
  };

export const useAccountLedgerDebounceFetcher = ({isGroup}:{
    //Pass  isGroup=true  for  filter only ledger groups
    isGroup:boolean
}) =>{
   const r = route;
    const fetcherDebounce = useDebounceFetcher<{
      results: components["schemas"]["LedgerDto"][];
      actions: components["schemas"]["ActionDto"][];
    }>();
    const onChange = (e: string) => {
      const d: operations["get-acconts"]["parameters"]["query"] = {
        size: DEFAULT_SIZE,
        name: e,
        is_group:String(isGroup)
      };
      fetcherDebounce.submit(
        {
          query: d as any,
          action: "get",
        },
        {
          method: "POST",
          encType: "application/json",
          debounceTimeout: DEFAULT_DEBOUNCE_TIME,
          action: r.toRoute({
              main:r.ledger,
              routePrefix:[r.accountingM]
          }),
        }
      );
    };
    return [fetcherDebounce, onChange] as const;
    // const r = route
    // const debounceFetcher = useDebounceFetcher<{
    //     // actions:components["schemas"]["ActionDto"][],
    //     actions:components["schemas"]["ActionDto"][],
    //     accounts:components["schemas"]["LedgerDto"][]
    // }>()

    // const onChange = (e:string)=>{
    //     debounceFetcher.submit({
    //         action:"get",
    //         query:e,
    //         isGroup:isGroup,
    //     },{
    //         method:"POST",
    //         debounceTimeout:DEFAULT_DEBOUNCE_TIME,
    //         encType:"application/json",
    //         action:r.chartOfAccount
    //     })
    // }
    
}