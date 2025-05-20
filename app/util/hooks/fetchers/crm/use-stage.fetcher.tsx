import { useDebounceFetcher } from "remix-utils/use-debounce-fetcher";
import { DEFAULT_DEBOUNCE_TIME, DEFAULT_SIZE } from "~/constant";
import { components, operations } from "~/sdk";
import { route } from "~/util/route";
import FormAutocompleteField, {
  AutocompleteFormProps,
} from "@/components/custom/select/form-autocomplete";
import {
  SmartAutocomplete,
  SmartAutocompleteProps,
} from "@/components/form/smart-autocomplete";

type Stage = components["schemas"]["StageDto"];
interface StageProps
  extends Partial<AutocompleteFormProps<Stage, keyof Stage>> {
  entityID: number;
}

interface StageSmartFormProps
  extends Partial<SmartAutocompleteProps<Stage, keyof Stage>> {
  entityID: number;
}
export const StageSmartAutocomplete = ({ ...props }: StageSmartFormProps) => {
  const [fetcher, onChange] = useStageFetcher({
    entityID: props.entityID,
  });

  return (
    <SmartAutocomplete
      {...props}
      label={props.label ? props.label : "Etapa"}
      data={fetcher.data?.results || []}
      onValueChange={onChange}
      nameK="name"
      name="stage"
    />
  );
};

export const StageFormField = ({ ...props }: StageProps) => {
  const [fetcher, onChange] = useStageFetcher({
    entityID: props.entityID,
  });
  return (
    <FormAutocompleteField
      {...props}
      data={fetcher.data?.results || []}
      onValueChange={onChange}
      name={props.name || "stage"}
      nameK="name"
    />
  );
};

export const useStageFetcher = ({ entityID }: { entityID: number }) => {
  const r = route;
  const fetcherDebounce = useDebounceFetcher<{
    results: components["schemas"]["StageDto"][];
    actions: components["schemas"]["ActionDto"][];
  }>();
  const onChange = (e: string) => {
    const d: operations["stage"]["parameters"] = {
      query: {
        size: DEFAULT_SIZE,
        entity_id: entityID.toString(),
        name: e,
      },
    };
    fetcherDebounce.submit(
      {
        parameters: d as any,
        action: "get",
      },
      {
        method: "POST",
        encType: "application/json",
        debounceTimeout: DEFAULT_DEBOUNCE_TIME,
        action: r.toRoute({
          main: r.stage,
        }),
      }
    );
  };
  return [fetcherDebounce, onChange] as const;
};
