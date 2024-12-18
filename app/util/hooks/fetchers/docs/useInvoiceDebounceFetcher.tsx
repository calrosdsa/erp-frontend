import AutocompleteSearch from "@/components/custom/select/AutocompleteSearch";
import { Control } from "react-hook-form";
import { useDebounceFetcher } from "remix-utils/use-debounce-fetcher";
import { DEFAULT_DEBOUNCE_TIME, DEFAULT_PAGE } from "~/constant";
import { PartyType, partyTypeToJSON } from "~/gen/common";
import { components } from "~/sdk";
import { routes } from "~/util/route";
import FormAutocomplete from "@/components/custom/select/FormAutocomplete";

export const InvoiceAutocompleteForm = ({
  allowEdit = true,
  control,
  label,
  onSelect,
  name,
  partyType,
}: {
  allowEdit?: boolean;
  control?: Control<any, any>;
  label?: string;
  name?: string;
  partyType: string;
  onSelect?: (e: components["schemas"]["InvoiceDto"]) => void;
}) => {
  const [fetcher, onChange] = useInvoiceFetcher({ partyType });
  return (
    <FormAutocomplete
      data={fetcher.data?.results || []}
      onValueChange={onChange}
      label={label}
      name={name || "invoiceCode"}
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
}: {
  placeholder: string;
  partyType: string;
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
      queryName="invoiceName"
      queryValue="invoice"
      onSelect={() => {}}
      onCustomDisplay={(e) => {
        return (
          <div className="flex flex-col">
            <span className=" font-medium">{e.code}</span>
            <span>
              {e.record_no && `${e.record_no}-`}
              {e.party_name}
            </span>
          </div>
        );
      }}
    />
  );
};

export const useInvoiceFetcher = ({ partyType }: { partyType: string }) => {
  const r = routes;
  const fetcherDebounce = useDebounceFetcher<{
    actions: components["schemas"]["ActionDto"][];
    results: components["schemas"]["InvoiceDto"][];
  }>();

  const onChange = (e: string) => {
    fetcherDebounce.submit(
      {
        getData: {
          query: e,
        },
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
