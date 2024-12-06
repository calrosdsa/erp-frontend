import AutocompleteSearch from "@/components/custom/select/AutocompleteSearch";
import FormAutocomplete from "@/components/custom/select/FormAutocomplete";
import { Control } from "react-hook-form";
import { useDebounceFetcher } from "remix-utils/use-debounce-fetcher";
import { DEFAULT_DEBOUNCE_TIME } from "~/constant";
import { PartyType, partyTypeToJSON } from "~/gen/common";
import { components } from "~/sdk";
import { routes } from "~/util/route";

interface ChargesTemplateFormProps {
  allowEdit?: boolean;
  control?: Control<any, any>;
  label?: string;
  onSelect: (e: components["schemas"]["ChargesTemplateDto"]) => void;
}

export const ChargesTemplateForm =({
  allowEdit,
  control,
  label,
  onSelect,
}: ChargesTemplateFormProps) => {
  const [chargesTemplate, onChange] = useChargesTemplatesFetcher();

  return (
    <FormAutocomplete
      data={chargesTemplate.data?.chargesTemplates || []}
      onValueChange={onChange}
      label={label}
      name="chargesTemplateName"
      nameK="name"
      control={control}
      allowEdit={allowEdit}
      onSelect={onSelect}
    />
  );
}

export const useChargesTemplatesFetcher = () => {
  const r = routes;
  const fetcherDebounce = useDebounceFetcher<{
    actions: components["schemas"]["ActionDto"][];
    chargesTemplates: components["schemas"]["ChargesTemplateDto"][];
  }>();

  const onChange = (e: string) => {
    fetcherDebounce.submit(
      {
        action: "get",
        query: e,
      },
      {
        method: "POST",
        debounceTimeout: DEFAULT_DEBOUNCE_TIME,
        encType: "application/json",
        action: r.toRoute({
          main: r.chargesTemplate,
          routePrefix:[r.accountingM],
        }),
      }
    );
  };
  return [fetcherDebounce, onChange] as const;
};
