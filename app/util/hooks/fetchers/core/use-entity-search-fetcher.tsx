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

export const useSearchEntity = ({
  loadModules=true,loadEntities=true
}:{
  loadModules?:boolean;
  loadEntities?:boolean;
}) => {
  const r = route;
  const fetcherDebounce = useDebounceFetcher<{
    searchEntities: components["schemas"]["EntityDto"][];
  }>();

  const onChange = (e: string) => {
    const d:operations["search-entities"]["parameters"]["query"] = {
      size: DEFAULT_SIZE,
      query: e.toLowerCase(),
      load_entities:loadEntities || false,
      load_modules:loadModules || false,
    } 
    fetcherDebounce.submit(
      {
        searchEntitiesQuery: d as any,
        action: "search-entities",
      },
      {
        method: "POST",
        encType: "application/json",
        debounceTimeout: DEFAULT_DEBOUNCE_TIME,
        action: r.apiCore,
      }
    );
  };
  return [fetcherDebounce, onChange] as const;
};
