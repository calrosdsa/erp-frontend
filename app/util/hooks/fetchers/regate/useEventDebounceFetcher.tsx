import FormAutocompleteField, { AutocompleteFormProps } from "@/components/custom/select/FormAutocompleteField";
import { useDebounceFetcher } from "remix-utils/use-debounce-fetcher"
import { DEFAULT_DEBOUNCE_TIME } from "~/constant"
import { components } from "~/sdk"
import { route } from "~/util/route"
import { usePermission } from "../../useActions";


type Event = components["schemas"]["EventBookingDto"];
interface EventFormProps
  extends Partial<AutocompleteFormProps<Event, keyof Event>> {
  roleActions?: components["schemas"]["RoleActionDto"][];
  openModal?:()=>void
}

export const EventAutoCompleteForm = ({
  roleActions,
  ...props
}: EventFormProps) => {
  const [fetcher, onChange] = useEventDebounceFetcher();
  const [permission] = usePermission({
    roleActions,
    actions: fetcher.data?.actions,
  });
  return (
    <FormAutocompleteField
      {...props}
      data={fetcher.data?.events || []}
      onValueChange={onChange}
      name={props.name || "event"}
      nameK="name" 
      {...(permission.create && {
        addNew: () => {
          props.openModal?.()
        },
      })}
    />
  );
};


export const useEventDebounceFetcher = () =>{
    const r = route
    const fetcherDebounce = useDebounceFetcher<{
        actions:components["schemas"]["ActionDto"][],
        events:components["schemas"]["EventBookingDto"][],
    }>()

    const onChange = (e:string)=>{
        fetcherDebounce.submit({
            action:"get",
            query:e
        },{
            method:"POST",
            debounceTimeout:DEFAULT_DEBOUNCE_TIME,
            encType:"application/json",
            action:r.to(r.event),       
        })
    }
    return [fetcherDebounce,onChange] as const
}