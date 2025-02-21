import Autocomplete from "@/components/custom/select/autocomplete";
import { useFetcher } from "@remix-run/react";
import { useDebounceFetcher } from "remix-utils/use-debounce-fetcher";
import { DEFAULT_DEBOUNCE_TIME, DEFAULT_SIZE } from "~/constant";
import { components, operations } from "~/sdk";
import { route } from "~/util/route";
import { formatQuery } from "..";

export const PaymentTermAutocomplete = ({allowEdit,onSelect,defaultValue}:{
    allowEdit:boolean
    defaultValue?:string
    onSelect:(e:components["schemas"]["PaymentTermsDto"])=>void
}) =>{
    const [fetcher,onChange] = usePaymentTermFetcher()
    return <Autocomplete
     data={fetcher.data?.results || []} 
     nameK={"name"}
     onValueChange={onChange}
     onSelect={onSelect}
     allowEdit={allowEdit}
     defaultValue={defaultValue}
     />
}

export const usePaymentTermFetcher = () => {
  const fetcherDebounce = useDebounceFetcher<{
    actions: components["schemas"]["ActionDto"][];
    results: components["schemas"]["PaymentTermsDto"][];
  }>();

  const onChange = (e: string) => {
    fetcherDebounce.submit(
      {
        query:{
            code:formatQuery(e),
            size:DEFAULT_SIZE,
        } as operations["payment-terms"]["parameters"]["query"],
        action: "get",
      },
      {
        method: "POST",
        encType: "application/json",
        debounceTimeout: DEFAULT_DEBOUNCE_TIME,
        action: route.toRoute({
          main: route.paymentTerms,
        }),
      }
    );
  };
  return [fetcherDebounce, onChange] as const;
};
