"use client"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { CalendarIcon, X } from 'lucide-react'
import { TimePicker } from "../datetime/time-picker"
import { useTranslation } from "react-i18next"
import { Control } from "react-hook-form"

export default function CustomFormDate({
  form,
  label,
  name,
  description,
  isDatetime,
  required,
  control,
}: {
  form?: any
  name: string
  label: string
  description?: string
  control?: Control<any, any>
  isDatetime?: boolean
  required?: boolean
}) {
  const { t } = useTranslation("common")

  return (
    <FormField
      control={control || form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel className="text-left text-xs">
            {label} {required && "*"}
          </FormLabel>
          <Popover>
            <FormControl>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size={"sm"}
                  className={cn(
                    "justify-start text-left font-normal group",
                    !field.value && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {field.value ? (
                    <span className="flex-1">
                      {isDatetime
                        ? format(field.value, "PPP HH:mm:ss")
                        : format(field.value, "PPP")}
                    </span>
                  ) : (
                    <span>{t("form.pickADate")}</span>
                  )}
                  {field.value && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 p-0 opacity-70 hover:opacity-100 ml-auto"
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        console.log("CREAR")
                        field.onChange('')
                      }}
                    >
                      <X className="h-3 w-3" />
                      <span className="sr-only">Clear date</span>
                    </Button>
                  )}
                </Button>
              </PopoverTrigger>
            </FormControl>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={field.value}
                onSelect={field.onChange}
                initialFocus
              />
              {isDatetime && (
                <div className="p-3 border-t border-border">
                  <TimePicker setDate={field.onChange} date={field.value} />
                </div>
              )}
            </PopoverContent>
          </Popover>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  )
}