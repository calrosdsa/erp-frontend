


import { Control } from "react-hook-form";
import { useDebounceFetcher } from "remix-utils/use-debounce-fetcher";
import { DEFAULT_DEBOUNCE_TIME, DEFAULT_SIZE } from "~/constant";
import { components, operations } from "~/sdk";
import { route } from "~/util/route";
import FormAutocompleteField, { AutocompleteFormProps } from "@/components/custom/select/form-autocomplete";
import { usePermission } from "../../useActions";

interface BankFormProps extends Partial<AutocompleteFormProps<any, keyof any>> {
  partyID?:number,
  isCompanyAccount?:boolean
  roleActions:components["schemas"]["RoleActionDto"][]
  navigateToCreate?:()=>void
}
export const BankAccountForm = ({
  navigateToCreate,roleActions,isCompanyAccount,partyID,...props
}: BankFormProps) => {
  const [fetcher, onChange] = useBankAccountFetcher({
    partyID:partyID,
    isCompanyAccount:isCompanyAccount,
  });
  const [permission] = usePermission({
    roleActions:roleActions,
    actions:fetcher.data?.actions
  })
  return (
    <FormAutocompleteField
      {...props}
      data={fetcher.data?.results || []}
      onValueChange={onChange}
      name={props.name || "bank_account"}
      nameK="account_name"
      {...(permission.view && {
        addNew:props.addNew
      })}
    />
  );
};

export const useBankAccountFetcher = ({partyID,isCompanyAccount}:{
  partyID?:number,
  isCompanyAccount?:boolean
}) => {
  const r = route;
  const fetcherDebounce = useDebounceFetcher<{
    results: components["schemas"]["BankAccountDto"][];
    actions: components["schemas"]["ActionDto"][];
  }>();
  const onChange = (e: string) => {
    const d: operations["bank-account"]["parameters"]["query"] = {
      size: DEFAULT_SIZE,
      account_name: e,
      is_company_account:isCompanyAccount ? String(isCompanyAccount): undefined,
      party_id:partyID?.toString()
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
            main:r.bankAccount
        }),
      }
    );
  };
  return [fetcherDebounce, onChange] as const;
};
