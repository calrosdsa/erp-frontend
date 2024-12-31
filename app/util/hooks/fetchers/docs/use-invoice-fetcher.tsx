import AutocompleteSearch from "@/components/custom/select/AutocompleteSearch";
import { Control } from "react-hook-form";
import { useDebounceFetcher } from "remix-utils/use-debounce-fetcher";
import { DEFAULT_DEBOUNCE_TIME, DEFAULT_PAGE, DEFAULT_SIZE } from "~/constant";
import { PartyType, partyTypeToJSON } from "~/gen/common";
import { components, operations } from "~/sdk";
import { routes } from "~/util/route";
import FormAutocomplete from "@/components/custom/select/FormAutocomplete";

export const InvoiceAutocompleteForm = ({
  allowEdit = true,
  control,
  label,
  onSelect,
  name,
  partyType,
  partyID,
}: {
  allowEdit?: boolean;
  control?: Control<any, any>;
  label?: string;
  name?: string;
  partyType: string;
  partyID?: number;
  onSelect?: (e: components["schemas"]["InvoiceDto"]) => void;
}) => {
  const [fetcher, onChange] = useInvoiceFetcher({ 
    partyType,
    partyID:partyID
   });
  return (
    <FormAutocomplete
      data={fetcher.data?.results || []}
      onValueChange={onChange}
      label={label}
      name={name || "invoice"}
      nameK="code"
      control={control}
      allowEdit={allowEdit}
      onSelect={onSelect}
      onCustomDisplay={(e) => {
        return (
          <div className="flex flex-col">
            <span className=" font-medium">
              {e.record_no && `${e.record_no}-`}
              {e.code}
            </span>
            <span>{e.party_type}</span>
          </div>
        );
      }}
    />
  );
};

export const InvoiceSearch = ({
  placeholder,
  partyType,
  queryName,
  queryValue,
}: {
  placeholder: string;
  partyType: string;
  queryName?:string;
  queryValue?:string;
}) => {
  const [invoiceFetcher, onInvoiceFetcher] = useInvoiceFetcher({
    partyType,
  });
  return (
    <AutocompleteSearch
      data={invoiceFetcher.data?.results || []}
      onValueChange={onInvoiceFetcher}
      nameK={"code"}
      valueK={"id"}
      placeholder={placeholder}
      queryName={queryName || "invoice_code"}
      queryValue={queryValue || "invoice_id"}
      onSelect={() => {}}
      onCustomDisplay={(e) => {
        return (
          <div className="flex flex-col text-xs">
            <span className=" font-medium">{e.code}</span>
            <span>{e.party_name}</span>
          </div>
        );
      }}
    />
  );
};

export const useInvoiceFetcher = ({
  partyType,
  partyID,
}: {
  partyType: string;
  partyID?: number;
}) => {
  const r = routes;
  const fetcherDebounce = useDebounceFetcher<{
    actions: components["schemas"]["ActionDto"][];
    results: components["schemas"]["InvoiceDto"][];
  }>();

  const onChange = (e: string) => {
    fetcherDebounce.submit(
      {
        query: {
          size:DEFAULT_SIZE,
          code:`["like","${e}"]`,
          party_id:partyID,
        } as operations["invoices"]["parameters"]["query"],
        action: "get",
      },
      {
        method: "POST",
        encType: "application/json",
        debounceTimeout: DEFAULT_DEBOUNCE_TIME,
        action: r.toRoute({
          main: partyType,
          routePrefix: [r.invoiceM],
        }),
      }
    );
  };
  return [fetcherDebounce, onChange] as const;
};
