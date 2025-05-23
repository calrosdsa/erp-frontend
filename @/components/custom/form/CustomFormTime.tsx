import React from "react";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Clock } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Control } from "react-hook-form";

interface TimePickerProps {
  name: string;
  label: string;
  description?: string;
  control: Control<any, any>;
  required?: boolean;
  allowEdit?: boolean;
}

export function CustomFormTime({
  control,
  name,
  label,
  description,
  required,
  allowEdit = true,
}: TimePickerProps) {
  const { t } = useTranslation("common");

  const hours = Array.from({ length: 24 }, (_, i) =>
    i.toString().padStart(2, "0")
  );
  const minutes = Array.from({ length: 60 }, (_, i) =>
    i.toString().padStart(2, "0")
  );
  const seconds = Array.from({ length: 60 }, (_, i) =>
    i.toString().padStart(2, "0")
  );

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        if (!allowEdit) {
          return (
            <>
              <div className="flex flex-col">
                {label && (
                  <FormLabel className="text-xs">
                    {label} {required && "*"}
                  </FormLabel>
                )}
                <div>
                  <span className="flex-1 text-sm">
                  {field.value ? field.value : <span></span>}
                  </span>
                </div>
            {description && <FormDescription>{description}</FormDescription>}

              </div>
            </>
          );
        }
        return (
          <FormItem className="flex flex-col">
            <FormLabel className="text-left text-xs">
              {label} {required && "*"}
            </FormLabel>
            <Popover>
              <FormControl>
                <PopoverTrigger asChild disabled={!allowEdit}>
                  <Button
                    variant="outline"
                    size={"sm"}
                    className={cn(
                      "justify-start text-left font-normal ",
                      !field.value && "text-muted-foreground",
                      !allowEdit &&
                        "disabled:opacity-100 disabled:cursor-default bg-secondary"
                    )}
                  >
                    <Clock className="mr-2 h-4 w-4" />
                    {field.value ? field.value : <span></span>}
                  </Button>
                </PopoverTrigger>
              </FormControl>
              <PopoverContent className="w-auto p-0">
                <div className="flex p-3">
                  <Select
                    onValueChange={(value) => {
                      const [hours, minutes, seconds] = (
                        field.value || "00:00:00"
                      ).split(":");
                      const newDate = new Date(
                        1970,
                        0,
                        1,
                        parseInt(value),
                        parseInt(minutes),
                        parseInt(seconds)
                      );
                      field.onChange(format(newDate, "HH:mm:ss"));
                    }}
                    value={field.value ? field.value.split(":")[0] : undefined}
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
                      const [hours, minutes, seconds] = (
                        field.value || "00:00:00"
                      ).split(":");
                      const newDate = new Date(
                        1970,
                        0,
                        1,
                        parseInt(hours),
                        parseInt(value),
                        parseInt(seconds)
                      );
                      field.onChange(format(newDate, "HH:mm:ss"));
                    }}
                    value={field.value ? field.value.split(":")[1] : undefined}
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
        );
      }}
    />
  );
}
