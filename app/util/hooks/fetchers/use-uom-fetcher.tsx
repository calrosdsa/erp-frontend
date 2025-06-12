import { useEffect } from "react";
import { useDebounceFetcher } from "remix-utils/use-debounce-fetcher";
import { DEFAULT_DEBOUNCE_TIME } from "~/constant";
import { components } from "~/sdk";
import { PartyType } from "~/types/enums";
import { route } from "~/util/route";
import { usePermission } from "../useActions";
import { Control } from "react-hook-form";
import FormAutocomplete from "@/components/custom/select/FormAutocomplete";
import FormAutocompleteField from "@/components/custom/select/form-autocomplete";
import {
  Autocomplete,
  AutoCompleteProps,
} from "@/components/custom/select/autocomplete";
import { SmartAutocomplete } from "@/components/form/smart-autocomplete";

type Uom = components["schemas"]["UOMDto"];


interface UomAutocompleteProps
  extends Partial<AutoCompleteProps<Uom, keyof Uom>> {}
export const UomAutocomple = ({ ...props }: UomAutocompleteProps) => {
  const [fetcher, onChange] = useUomDebounceFetcher();
  return (
    <Autocomplete
      {...props}
      onValueChange={onChange}
      data={fetcher.data?.uoms || []}
      nameK="name"
    />
  );
};

export const UomFormField = ({ name, ...props }: UomAutocompleteProps) => {
  const [fetcherDebounce, onChange] = useUomDebounceFetcher();
  return (
    <FormAutocompleteField
      {...props}
      data={fetcherDebounce.data?.uoms || []}
      onValueChange={onChange}
      name={name || "uom"}
      nameK="name"
    />
  );
};

export const UomSmartField = ({ name, ...props }: UomAutocompleteProps) => {
  const [fetcherDebounce, onChange] = useUomDebounceFetcher();
  return (
    <SmartAutocomplete
      {...props}
      data={fetcherDebounce.data?.uoms || []}
      label={props.label ? props.label : "Unidad de Medida"}
      onValueChange={onChange}
      name={name || "uom"}
      nameK="name"
    />
  );
};

export const UomAutocompleteForm = ({
  allowEdit = true,
  required,
  control,
  label,
  onSelect,
  name,
}: {
  allowEdit?: boolean;
  control?: Control<any, any>;
  label?: string;
  name?: string;
  required?: boolean;
  onSelect: (e: components["schemas"]["UOMDto"]) => void;
}) => {
  const [fetcherDebounce, onChange] = useUomDebounceFetcher();
  return (
    <FormAutocompleteField
      data={fetcherDebounce.data?.uoms || []}
      onValueChange={onChange}
      label={label}
      name={name || "uom"}
      nameK="name"
      required={required}
      control={control}
      allowEdit={allowEdit}
      onSelect={onSelect}
    />
  );
};

export const useUomDebounceFetcher = () => {
  const r = route;
  const debounceFetcher = useDebounceFetcher<{
    // actions:components["schemas"]["ActionDto"][],
    uoms: components["schemas"]["UOMDto"][];
  }>();

  const onChange = (e: string) => {
    debounceFetcher.submit(
      {
        action: "get",
        query: e,
      },
      {
        method: "POST",
        debounceTimeout: DEFAULT_DEBOUNCE_TIME,
        encType: "application/json",
        action: r.uom,
      }
    );
  };

  return [debounceFetcher, onChange] as const;
};
