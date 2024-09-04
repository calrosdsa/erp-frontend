import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { ReactNode } from "react";
import { ControllerRenderProps, FieldValues } from "react-hook-form";


interface Props {
    form:any
    label?:string
    name:string
    description?:string
    children:(field: ControllerRenderProps<FieldValues, string>)=>ReactNode
}
export default function CustomFormField({form,label,description,name,children}:Props){
    return (
        <FormField
        control={form.control}
        name={name}
        render={({ field }) => (
          <FormItem className="">
            {label != undefined &&
            <FormLabel>{label}</FormLabel>
            }
            <FormControl>
              {children(field)}
            </FormControl>
            <FormDescription>
            {description}
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    )
}