import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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
import { CalendarIcon, X } from "lucide-react";
import { TimePicker } from "../datetime/time-picker";
import { useTranslation } from "react-i18next";
import type { Control } from "react-hook-form";
import { toZonedTime } from "date-fns-tz";

export default function CustomFormDate({
  form,
  label,
  name,
  description,
  isDatetime,
  required,
  control,
  allowEdit = true,
  disableXButtdon,
}: {
  form?: any;
  name: string;
  label?: string;
  description?: string;
  control?: Control<any, any>;
  isDatetime?: boolean;
  required?: boolean;
  allowEdit?: boolean;
  disableXButtdon?: boolean;
}) {
  const { t } = useTranslation("common");

  return (
    <FormField
      control={control || form.control}
      name={name}
      render={({ field }) => {
        if (!allowEdit) {
          return (
            <>
              <div className="flex flex-col">
                {label && (
                  <FormLabel className="text-xs text-primary/60">
                    {label} {required && "*"}
                  </FormLabel>
                )}
                <div>
                  <span className="flex-1 text-sm">
                    {field.value ? isDatetime
                      ? format(field.value, "PPP HH:mm:ss")
                      : format(toZonedTime(field.value, "UTC"), "PP")
                      : "-"
                    }
                  </span>
                </div>
              </div>
            </>
          );
        }

        return (
          <FormItem className="flex flex-col">
            {label && (
              <FormLabel className="text-left text-xs text-primary/60">
                {label} {required && "*"}
              </FormLabel>
            )}
            <Popover modal={true}>
              <FormControl>
                <PopoverTrigger asChild disabled={!allowEdit}>
                  <Button
                    variant="outline"
                    size={"sm"}
                    className={cn(
                      "justify-start text-left font-normal group",
                      !field.value && "text-muted-foreground",
                      !allowEdit &&
                        "disabled:opacity-100 disabled:cursor-default bg-secondary"
                    )}
                  >
                    <>
                      {allowEdit && <CalendarIcon className="mr-2 h-4 w-4" />}
                      {field.value ? (
                        <span className="flex-1">
                          {isDatetime
                            ? format(field.value, "PPP HH:mm:ss")
                            : format(toZonedTime(field.value, "UTC"), "PPP")}
                        </span>
                      ) : (
                        allowEdit && <span>{t("form.pickADate")}</span>
                      )}
                    </>
                    {field.value && allowEdit && !disableXButtdon && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-4 w-4 p-0 opacity-70 hover:opacity-100 ml-auto"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          field.onChange(null);
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
                  // selected={field.value ? toZonedTime(field.value, "Etc/UTC") : undefined}
                  selected={field.value}
                  onSelect={(date) => {
                    if (date) {
                      // If we already have a value, preserve the time
                      if (field.value) {
                        const currentDate = new Date(field.value);
                        date.setHours(
                          currentDate.getHours(),
                          currentDate.getMinutes(),
                          currentDate.getSeconds()
                        );
                      } else {
                        // Set default time to start of day
                        date.setHours(0, 0, 0, 0);
                      }
                      field.onChange(date);
                    } else {
                      field.onChange(null);
                    }
                  }}
                  initialFocus
                />
                {isDatetime && field.value && (
                  <div className="p-3 border-t border-border">
                    <TimePicker setDate={field.onChange} date={field.value} />
                  </div>
                )}
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
