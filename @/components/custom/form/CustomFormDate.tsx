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
import { CalendarIcon } from "lucide-react";
import { TimePicker } from "../datetime/time-picker";
import { useTranslation } from "react-i18next";

export default function CustomFormDate({
  form,
  label,
  name,
  description,
}: {
  form: any;
  name: string;
  label: string;
  description?: string;
}) {
  const { t } = useTranslation("common");
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel className="text-left">{label}</FormLabel>
          <Popover>
            <FormControl>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-[280px] justify-start text-left font-normal",
                    !field.value && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {field.value ? (
                    format(field.value, "PPP HH:mm:ss")
                  ) : (
                    <span>{t("form.pickADate")}</span>
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
              <div className="p-3 border-t border-border">
                <TimePicker setDate={field.onChange} date={field.value} />
              </div>
            </PopoverContent>
          </Popover>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
