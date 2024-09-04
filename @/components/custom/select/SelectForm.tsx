import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CountrySelectItem } from "~/types/app";

interface Props<T extends object, K extends keyof T> {
  data: T[];
  keyName?: K;
  keyValue?: K;
  name: string;
  label?: string;
  form: any;
  onValueChange?: (e: T) => void;
}
export default function SelectForm<T extends object, K extends keyof T>({
  label,
  form,
  keyName,
  keyValue,
  data,
  name,
  onValueChange,
}: Props<T, K>) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="w-full flex flex-col">
          <FormLabel>{label}</FormLabel>
          <Select
            onValueChange={(e) => {
              //   const object = JSON.parse(e)
              if(keyValue == undefined) return
              const item =  data.find(t =>  t[keyValue] == e)
              if (onValueChange != undefined && item) {
                onValueChange(item);
              }
              console.log(e);
              field.onChange(e);
            }}
            defaultValue={field.value}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select a option" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {data.map((option, idx) => {
                return (
                  <SelectItem value={keyValue ? option[keyValue] as string : ""} key={idx}>
                    {keyName ? option[keyName]?.toString() || "" : ""}
                  </SelectItem>
                );
              })}
              {/* <SelectItem value="m@example.com"></SelectItem> */}
              {/* <SelectItem value="m@google.com">m@google.com</SelectItem> */}
              {/* <SelectItem value="m@support.com">m@support.com</SelectItem> */}
            </SelectContent>
          </Select>
          {/* <FormDescription>
                  You can manage email addresses in your{" "}
                  <Link href="/examples/forms">email settings</Link>.
                </FormDescription> */}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

// From https://bitbucket.org/atlassian/atlaskit-mk-2/raw/4ad0e56649c3e6c973e226b7efaeb28cb240ccb0/packages/core/select/src/data/countries.js
