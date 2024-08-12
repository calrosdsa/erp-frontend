import * as React from "react";
import { X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Command as CommandPrimitive } from "cmdk";
import { FormField, FormItem, FormLabel } from "@/components/ui/form";

interface Props<T extends object, K extends keyof T> {
  data: T[];
  keyName: K;
  name: string;
  form: any;
  label?: string;
  description?: string;
  onSelect:(t:T[])=>void
}

export function MultiSelect<T extends object, K extends keyof T>({
  data,
  keyName,
  name,
  form,
  description,
  label,
  onSelect
}: Props<T, K>) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [open, setOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<T[]>([]);
  const [inputValue, setInputValue] = React.useState("");

  const handleUnselect = React.useCallback((item: T) => {
    setSelected((prev) => prev.filter((s) => s[keyName] !== item[keyName]));
  }, []);

  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      const input = inputRef.current;
      if (input) {
        if (e.key === "Delete" || e.key === "Backspace") {
          if (input.value === "") {
            setSelected((prev) => {
              const newSelected = [...prev];
              newSelected.pop();
              return newSelected;
            });
          }
        }
        // This is not a default behaviour of the <input /> field
        if (e.key === "Escape") {
          input.blur();
        }
      }
    },
    []
  );

  const selectables = data.filter((item) => !selected.includes(item));

  React.useEffect(() => {
    if (selected.length > 0) {
      const selectedValues = selected.map((item) => item[keyName]);
      form.setValue(name, selectedValues);
      onSelect(selected)
    }
  }, [selected]);

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-col ">
          <FormLabel>{label}</FormLabel>
          <Command
            onKeyDown={handleKeyDown}
            className="overflow-visible bg-transparent"
          >
            <div className="group rounded-md border border-input px-3 py-2 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
              <div className="flex flex-wrap gap-1">
                {selected.map((item, idx) => {
                  return (
                    <Badge key={idx} variant="secondary">
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
                        onClick={() => handleUnselect(item)}
                      >
                        <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                      </button>
                    </Badge>
                  );
                })}
                {/* Avoid having the "Search" Icon */}
                <CommandPrimitive.Input
                  ref={inputRef}
                  value={inputValue}
                  onValueChange={setInputValue}
                  onBlur={() => setOpen(false)}
                  onFocus={() => setOpen(true)}
                  placeholder="Select frameworks..."
                  className="ml-2 flex-1 bg-transparent outline-none placeholder:text-muted-foreground"
                />
              </div>
            </div>
            <div className="relative mt-2">
              <CommandList>
                {open && selectables.length > 0 ? (
                  <div className="absolute top-0 z-10 w-full rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in">
                    <CommandGroup className="h-full overflow-auto ">
                      {selectables.map((item, idx) => {
                        return (
                          <CommandItem
                            key={idx}
                            onMouseDown={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                            }}
                            onSelect={(value) => {
                              setInputValue("");
                              setSelected((prev) => [...prev, item]);
                            }}
                            className={"cursor-pointer"}
                          >
                            {item[keyName]?.toString() || ""}
                          </CommandItem>
                        );
                      })}
                    </CommandGroup>
                  </div>
                ) : null}
              </CommandList>
            </div>
          </Command>
        </FormItem>
      )}
    />
  );
}
