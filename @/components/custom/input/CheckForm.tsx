import { Checkbox } from "@/components/ui/checkbox";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { CheckedState } from "@radix-ui/react-checkbox";
import { Control } from "react-hook-form";

interface Props {
  label?: string;
  form?: any;
  name: string;
  description?: string;
  control?:Control<any, any>
  onChange?:(e:CheckedState)=>void
}
export default function CheckForm({ label, form,control, name, description,onChange}: Props) {
  return (
    <FormField
      control={control || form.control}
      name={name}
      render={({ field }) => (
        <FormItem  className="flex flex-col">
            {label && <FormLabel className="text-xs">{label}</FormLabel>}
            <div className="flex flex-row items-center space-x-3 space-y-0 rounded-md border pb-[10px] pt-[10px] px-2">
          <FormControl >
            <Checkbox 
            checked={field.value} onCheckedChange={(e)=>{
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
            <FormMessage />
          </div>
            </div>
        </FormItem>
      )}
    />
  );
}
