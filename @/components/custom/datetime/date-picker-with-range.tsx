import * as React from "react";
import {
  addDays,
  endOfDay,
  endOfMonth,
  endOfQuarter,
  endOfWeek,
  endOfYear,
  format,
  startOfDay,
  startOfMonth,
  startOfQuarter,
  startOfWeek,
  startOfYear,
  subDays,
} from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function DatePickerWithRange({
  className,
  onChange,
}: {
  onChange?: (from: Date | undefined, to: Date | undefined) => void;
  className?: string;
}) {
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: startOfMonth(new Date()),
    to: endOfMonth(new Date()),
  });
  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-[300px] justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <div className="m-2 w-64">
            <Select
              onValueChange={(value) => {
                let to = new Date();
                let from = new Date();
                switch (value) {
                  case "0": {
                    to = startOfDay(new Date());
                    from = endOfDay(new Date());
                    break;
                  }
                  case "1": {
                    to = startOfWeek(new Date());
                    from = endOfWeek(new Date());
                    break;
                  }
                  case "2": {
                    to = startOfMonth(new Date());
                    from = endOfMonth(new Date());
                    break;
                  }
                  case "3": {
                    to = startOfQuarter(new Date());
                    from = endOfQuarter(new Date());
                    break;
                  }
                  case "4": {
                    to = startOfYear(new Date());
                    from = endOfYear(new Date());
                    break;
                  }
                }
                setDate({
                  to: to,
                  from: from,
                });
                if (onChange) {
                  onChange(to, from);
                }
                // setDate(addDays(new Date(), parseInt(value)))
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent position="popper">
                <SelectItem value="0">Hoy</SelectItem>
                <SelectItem value="1">Esta Semana</SelectItem>
                <SelectItem value="2">Este Mes</SelectItem>
                <SelectItem value="3">Este Trimestre</SelectItem>
                <SelectItem value="4">Este Año</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={(e) => {
              setDate(e);
              if (onChange) {
                onChange(e?.from, e?.to);
              }
            }}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
