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
import { ReactNode } from "react";
import { Control, ControllerRenderProps, FieldValues } from "react-hook-form";

interface Props {
  label?: string;
  control?: Control<any, any>;
  name: string;
  description?: string;
  inputType: "input" | "textarea" | "check";
  required?: boolean;
  className?: string;
  allowEdit?: boolean;
}
export default function CustomFormFieldInput({
  label,
  description,
  name,
  required = false,
  allowEdit,
  className = "",
  inputType,
  control,
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
                  />
                )}
                {inputType == "textarea" && (
                  <Textarea
                    {...field}
                    className={cn(
                      !allowEdit &&
                        "disabled:opacity-100 disabled:cursor-default bg-secondary"
                    )}
                    disabled={!allowEdit}
                  />
                )}
                {inputType == "check" && (
                  <div>
                    <Checkbox
                      {...field}
                      className={cn(
                        !allowEdit &&
                          "disabled:opacity-100 disabled:cursor-default bg-secondary"
                      )}
                      checked={field.value}
                      onCheckedChange={(e) => {
                        field.onChange(e);
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
