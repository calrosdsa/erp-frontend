import { Checkbox } from "@/components/ui/checkbox";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { CheckedState } from "@radix-ui/react-checkbox";

interface Props {
  label?: string;
  form: any;
  name: string;
  description?: string;
  onChange?:(e:CheckedState)=>void
}
export default function CheckForm({ label, form, name, description,onChange}: Props) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem  className="flex flex-col">
            {label && <FormLabel>{label}</FormLabel>}
            <div className="flex flex-row items-center space-x-3 space-y-0 rounded-md border py-3 px-2">
          <FormControl >
            <Checkbox checked={field.value} onCheckedChange={(e)=>{
              field.onChange(e)
              if(onChange){
                onChange(e)
              }
              }} />
          </FormControl>
          <div className="space-y-1 leading-none">
            {description && (
                <FormLabel>
                {description}
                </FormLabel>
            )}
          </div>
            </div>
        </FormItem>
      )}
    />
  );
}
