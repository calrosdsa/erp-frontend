

import AutocompleteSearch from "@/components/custom/select/AutocompleteSearch";
import { Control } from "react-hook-form";
import { useDebounceFetcher } from "remix-utils/use-debounce-fetcher";
import { DEFAULT_DEBOUNCE_TIME, DEFAULT_PAGE, DEFAULT_SIZE } from "~/constant";
import { PartyType, partyTypeToJSON } from "~/gen/common";
import { components, operations } from "~/sdk";
import { route } from "~/util/route";
import FormAutocomplete from "@/components/custom/select/FormAutocomplete";

// export const InvoiceAutocompleteForm = ({
//   allowEdit = true,
//   control,
//   label,
//   onSelect,
//   name,
//   partyType,
//   partyID,
// }: {
//   allowEdit?: boolean;
//   control?: Control<any, any>;
//   label?: string;
//   name?: string;
//   partyType: string;
//   partyID?: number;
//   onSelect?: (e: components["schemas"]["InvoiceDto"]) => void;
// }) => {
//   const [fetcher, onChange] = useInvoiceFetcher({ 
//     partyType,
//     partyID:partyID
//    });
//   return (
//     <FormAutocomplete
//       data={fetcher.data?.results || []}
//       onValueChange={onChange}
//       label={label}
//       name={name || "invoice"}
//       nameK="code"
//       control={control}
//       allowEdit={allowEdit}
//       onSelect={onSelect}
//       onCustomDisplay={(e) => {
//         return (
//           <div className="flex flex-col">
//             <span className=" font-medium">
//               {e.record_no && `${e.record_no}-`}
//               {e.code}
//             </span>
//             <span>{e.party_type}</span>
//           </div>
//         );
//       }}
//     />
//   );
// };

export const PricingSearch = ({
  placeholder,
}: {
  placeholder: string;
}) => {
  const [pricingFetcher, onChange] = usePricingFetcher();
  return (
    <AutocompleteSearch
      data={pricingFetcher.data?.results || []}
      onValueChange={onChange}
      nameK={"code"}
      valueK={"id"}
      placeholder={placeholder}
      queryName="pricing_code"
      queryValue="pricing_id"
      onSelect={() => {}}
    //   onCustomDisplay={(e) => {
    //     return (
    //       <div className="flex flex-col text-xs">
    //         <span className=" font-medium">{e.code}</span>
    //         <span>
    //           {e.record_no && `${e.record_no}-`}
    //           {e.party_name}
    //         </span>
    //       </div>
    //     );
    //   }}
    />
  );
};

export const usePricingFetcher = () => {
  const r = route;
  const fetcherDebounce = useDebounceFetcher<{
    actions: components["schemas"]["ActionDto"][];
    results: components["schemas"]["PricingDto"][];
  }>();

  const onChange = (e: string) => {
    fetcherDebounce.submit(
      {
        query:{
            code:`["like","${e}"]`,
            size:DEFAULT_SIZE,
        } as operations["pricings"]["parameters"]["query"],
        action: "get",
      },
      {
        method: "POST",
        encType: "application/json",
        debounceTimeout: DEFAULT_DEBOUNCE_TIME,
        action: r.toRoute({
          main: r.p.pricing,
        }),
      }
    );
  };
  return [fetcherDebounce, onChange] as const;
};
