import React from 'react'
import { Button } from "@/components/ui/button"
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
import { Clock } from 'lucide-react'
import { useTranslation } from "react-i18next"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Control } from 'react-hook-form'

interface TimePickerProps {
  name: string
  label: string
  description?: string
  control: Control<any,any>
  required?: boolean
}

export function CustomFormTime({
  control,
  name,
  label,
  description,
  required
}: TimePickerProps) {
  const { t } = useTranslation("common")

  const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'))
  const minutes = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'))

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel className="text-left text-xs">{label} {required && "*"}</FormLabel>
          <Popover>
            <FormControl>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size={"sm"}
                  className={cn(
                    "justify-start text-left font-normal ",
                    !field.value && "text-muted-foreground"
                  )}
                >
                  <Clock className="mr-2 h-4 w-4" />
                  {field.value ? (
                    format(field.value, "HH:mm")
                  ) : (
                    <span></span>
                  )}
                </Button>
              </PopoverTrigger>
            </FormControl>
            <PopoverContent className="w-auto p-0">
              <div className="flex p-3">
                <Select
                  onValueChange={(value) => {
                    const newDate = new Date(field.value || new Date())
                    newDate.setHours(parseInt(value))
                    field.onChange(newDate)
                  }}
                  value={field.value ? format(field.value, "HH") : undefined}
                >
                  <SelectTrigger className="w-[80px]">
                    <SelectValue placeholder="HH" />
                  </SelectTrigger>
                  <SelectContent>
                    {hours.map((hour) => (
                      <SelectItem key={hour} value={hour}>
                        {hour}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <span className="mx-2 text-2xl">:</span>
                <Select
                  onValueChange={(value) => {
                    const newDate = new Date(field.value || new Date())
                    newDate.setMinutes(parseInt(value))
                    field.onChange(newDate)
                  }}
                  value={field.value ? format(field.value, "mm") : undefined}
                >
                  <SelectTrigger className="w-[80px]">
                    <SelectValue placeholder="MM" />
                  </SelectTrigger>
                  <SelectContent>
                    {minutes.map((minute) => (
                      <SelectItem key={minute} value={minute}>
                        {minute}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </PopoverContent>
          </Popover>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  )
}