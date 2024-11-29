"use client"

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { X } from 'lucide-react'
import { Control } from "react-hook-form"
import { cn } from "@/lib/utils"

interface Props<T extends object, K extends keyof T, V extends keyof T> {
  data: T[]
  keyName?: K
  keyValue?: V
  name: string
  control?: Control<any, any>
  label?: string
  description?: string
  form?: any
  onValueChange?: (e: T | null) => void
  required?: boolean
  placeholder?: string
}

export default function SelectForm<
  T extends object,
  K extends keyof T,
  V extends keyof T
>({
  label,
  form,
  keyName,
  keyValue,
  data,
  name,
  onValueChange,
  required,
  control,
  description,
  placeholder = "Choose an option",
}: Props<T, K, V>) {
  return (
    <FormField
      control={control || form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="w-full flex flex-col">
          <FormLabel className="text-xs">
            {label} {required && "*"}
          </FormLabel>
          <div className="">
            <Select
              onValueChange={(e) => {
                if (keyValue == undefined) return
                const item = data.find((t) => t[keyValue] == e)
                field.onChange(e)
                if (onValueChange != undefined) {
                  onValueChange(item || null)
                }
              }}
              value={field.value || ""}
              required={required}
            >
              <FormControl>
                <SelectTrigger className="h-9">
                  <SelectValue placeholder={placeholder} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {data.map((option, idx) => (
                  <SelectItem
                    value={keyValue ? (option[keyValue] as string) : ""}
                    key={idx}
                  >
                    {keyName ? option[keyName]?.toString() || "" : ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {field.value && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-8 top-0 h-full px-2 py-0 hover:bg-transparent"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  field.onChange(undefined)
                  if (onValueChange) {
                    onValueChange(null)
                  }
                }}
              >
                <X className="h-3 w-3 opacity-70 hover:opacity-100" />
                <span className="sr-only">Clear selection</span>
              </Button>
            )}
          </div>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  )
}