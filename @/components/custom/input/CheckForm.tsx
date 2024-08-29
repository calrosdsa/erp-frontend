import { Checkbox } from "@/components/ui/checkbox";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";

interface Props {
  label?: string;
  form: any;
  name: string;
  description?: string;
}
export default function CheckForm({ label, form, name, description }: Props) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem  className="pt-1">
            {label && <FormLabel>{label}</FormLabel>}
            <div className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4 ">
          <FormControl >
            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
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
