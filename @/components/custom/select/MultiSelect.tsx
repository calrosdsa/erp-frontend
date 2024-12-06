"use client";

import * as React from "react";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Props<T extends object, K extends keyof T> {
  data: T[];
  keyName?: K;
  keyValue: K;
  name: string;
  form: any;
  label?: string;
  description?: string;
  onSelect: (t: T[]) => void;
}

export function MultiSelect<T extends object, K extends keyof T>({
  data,
  keyName,
  keyValue,
  name,
  form,
  description,
  label,
  onSelect,
}: Props<T, K>) {
  const [open, setOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<T[]>([]);
  const [searchQuery, setSearchQuery] = React.useState("");
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleUnselect = React.useCallback(
    (item: T) => {
      if (typeof keyName == "undefined") return;
      setSelected((prev) => prev.filter((s) => s[keyName] !== item[keyName]));
    },
    [keyName]
  );

  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Backspace" && searchQuery === "" && selected.length > 0) {
        setSelected((prev) => {
          const newSelected = [...prev];
          newSelected.pop();
          return newSelected;
        });
      }

      if (e.key === "Escape") {
        setOpen(false);
      }
    },
    [searchQuery, selected]
  );

  React.useEffect(() => {
    const formValue = (form.getValues(name) as (string | number)[]) || [];
    const d = data.filter((item) =>
      formValue.includes(item[keyValue] as string | number)
    );
    setSelected(d);
  }, []);

  const selectables = React.useMemo(() => {
    return data
      .filter((item) => !selected.includes(item))
      .filter((item) => {
        if (!keyName || !searchQuery) return true;
        const value = item[keyName]?.toString().toLowerCase();
        return value?.includes(searchQuery.toLowerCase());
      });
  }, [data, selected, keyName, searchQuery]);

  React.useEffect(() => {
    if (selected.length > 0) {
      const selectedValues = selected.map(
        (item) => keyValue != undefined && item[keyValue]
      );
      form.setValue(name, selectedValues);
      onSelect(selected);
    }
  }, [selected, keyValue, name, form, onSelect]);

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-col w-full">
          <FormLabel>{label}</FormLabel>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-full justify-start h-auto min-h-10"
              >
                <div className="flex flex-wrap gap-1 p-1">
                  {selected.map(
                    (item, idx) =>
                      typeof keyName != "undefined" && (
                        <Badge
                          key={idx}
                          variant="secondary"
                          className="mr-1 mb-1"
                        >
                          {item[keyName]?.toString() || ""}
                          <button
                            className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                handleUnselect(item);
                              }
                            }}
                            onMouseDown={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                            }}
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleUnselect(item);
                            }}
                          >
                            <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                          </button>
                        </Badge>
                      )
                  )}
                  <input
                    ref={inputRef}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={selected.length === 0 ? "Select items..." : ""}
                    className="flex-1 bg-transparent outline-none placeholder:text-muted-foreground min-w-[120px] ml-1"
                  />
                </div>
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-[--radix-popover-trigger-width] p-0"
              align="start"
            >
              <ScrollArea className="h-auto">
                {selectables.length > 0 ? (
                  <div className="grid">
                    {selectables.map((item, idx) => (
                      <div
                        key={idx}
                        role="option"
                        onClick={() => {
                          setSearchQuery("");
                          setSelected((prev) => [...prev, item]);
                          inputRef.current?.focus();
                        }}
                        className={cn(
                          "relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none",
                          "hover:bg-accent hover:text-accent-foreground",
                          "data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                        )}
                      >
                        {(typeof keyName != "undefined" &&
                          item[keyName]?.toString()) ||
                          ""}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-center  text-muted-foreground"></p>
                )}
              </ScrollArea>
            </PopoverContent>
          </Popover>
          <FormDescription>{description}</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
