import { Checkbox } from "@/components/ui/checkbox";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Control,  } from "react-hook-form";

interface Props {
  label?: string;
  control?: Control<any, any>;
  name: string;
  description?: string;
  inputType: "input" | "textarea" | "check";
  required?: boolean;
  className?: string;
  allowEdit?: boolean;
  onChange?:()=>void
  onBlur?:()=>void
}
export default function CustomFormFieldInput({
  label,
  description,
  name,
  required = false,
  allowEdit= true,
  className = "",
  inputType,
  control,
  onChange,
  onBlur
}: Props) {
  return (
    <div className={cn("", className)}>
      <FormField
        control={control}
        name={name}
        render={({ field }) => (
          <FormItem className="flex flex-col">
            {label != undefined && (
              <FormLabel className=" text-xs">
                {label} {required && " *"}
              </FormLabel>
            )}
            <FormControl>
              <>
                {inputType == "input" && (
                  <Input
                    disabled={!allowEdit}
                    className={cn(
                      !allowEdit &&
                        "disabled:opacity-100 disabled:cursor-default bg-secondary"
                    )}
                    {...field}
                    onBlur={()=>{
                      if(onBlur){
                        onBlur()
                      }
                    }}
                  />
                )}
                {inputType == "textarea" && (
                  <Textarea
                    {...field}
                    required={required}
                    className={cn(
                      !allowEdit &&
                        "disabled:opacity-100 disabled:cursor-default bg-secondary"
                    )}
                    disabled={!allowEdit}
                  />
                )}
                {inputType == "check" && (
                  <div className="h-8 items-center flex">
                    <Checkbox
                      {...field}
                      className={cn(
                        "",
                        !allowEdit &&
                          "disabled:opacity-100 disabled:cursor-default bg-secondary"
                      )}
                      disabled={!allowEdit}
                      checked={field.value}
                      onCheckedChange={(e) => {
                        field.onChange(e);
                        if(onChange){
                          onChange()
                        }
                      }}
                    />
                  </div>
                )}
              </>
            </FormControl>
            {description && <FormDescription>{description}</FormDescription>}
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
