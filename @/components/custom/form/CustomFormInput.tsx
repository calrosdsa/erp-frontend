import React from 'react'
import { Control, FieldValues, Path, UseFormRegister } from 'react-hook-form'
import { cn } from "@/lib/utils"
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import RichTextEditor from '@/components/custom-ui/rich-text/editor'

interface Props<TFieldValues extends FieldValues> extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'name'> {
  label?: string
  control?: Control<TFieldValues>
  name: Path<TFieldValues>
  description?: string
  inputType: "input" | "textarea" | "check" | "richtext"
  required?: boolean
  allowEdit?: boolean
  register?: UseFormRegister<TFieldValues>
}

export default function CustomFormFieldInput<TFieldValues extends FieldValues>({
  label,
  description,
  name,
  required = false,
  allowEdit = true,
  className,
  inputType,
  control,
  register,
  onChange,
  onBlur,
  ...props
}: Props<TFieldValues>) {
  return (
    <div className={className}>
      <FormField
        control={control || undefined}
        name={name}
        render={({ field }) => (
          <FormItem className="flex flex-col">
            {label != undefined && (
              <FormLabel className="text-xs">
                {label} {required && " *"}
              </FormLabel>
            )}
            <FormControl>
              <>
                {inputType === "input" && (
                  <Input
                    {...field}
                    {...props}
                    disabled={!allowEdit}
                    className={cn(
                      !allowEdit &&
                        "disabled:opacity-100 disabled:cursor-default bg-secondary"
                    )}
                    type={props.type}
                    onBlur={(e) => {
                      field.onBlur()
                      onBlur?.(e)
                    }}
                    onChange={(e) => {
                      field.onChange(e)
                      onChange?.(e)
                    }}
                  />
                )}
                {inputType === "textarea" && (
                  <Textarea
                    {...field}
                    {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
                    required={required}
                    className={cn(
                      !allowEdit &&
                        "disabled:opacity-100 disabled:cursor-default bg-secondary"
                    )}
                    disabled={!allowEdit}
                  />
                )}
                {inputType == "richtext" && (
                  <RichTextEditor 
                  {...field} 
                  allowEdit={allowEdit}                  
                  />
                )
                }
                {inputType === "check" && (
                  <div className="h-8 items-center flex">
                    <Checkbox
                      {...field}
                      className={cn(
                        !allowEdit &&
                          "disabled:opacity-100 disabled:cursor-default bg-secondary"
                      )}
                      disabled={!allowEdit}
                      checked={field.value}
                      onCheckedChange={(checked) => {
                        field.onChange(checked)
                        onChange?.(checked as any)
                      }}
                    />
                  </div>
                )}
              </>
            </FormControl>
            {description && <FormDescription>{description}</FormDescription>}
            <FormMessage className='text-xs'/>
          </FormItem>
        )}
      />
    </div>
  )
}