import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";
import { Control, ControllerRenderProps, FieldValues } from "react-hook-form";


interface Props {
    form?:any
    label?:string
    control?:Control<any, any>
    name:string
    description?:string
    required?:boolean,
    className?:string
    children:(field: ControllerRenderProps<FieldValues, string>)=>ReactNode
}
export default function CustomFormField({form,label,description,name,children,required=false,
  className="",control
}:Props){
    return (
      <div className={cn("",className)}>
        <FormField
        control={control}
        name={name}
        render={({ field }) => (
          <FormItem className="flex flex-col">
            {label != undefined &&
            <FormLabel>{label} {required && " *"}</FormLabel>
            }
            <FormControl>
              {children(field)}
            </FormControl>
            {description &&
            <FormDescription>
            {description}
            </FormDescription>
            }
            <FormMessage />
          </FormItem>
        )}
        />
        </div>
    )
}