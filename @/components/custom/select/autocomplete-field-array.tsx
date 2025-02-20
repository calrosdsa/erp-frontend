import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

import {
  Popover,
  PopoverContent,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { PopoverAnchor } from "@radix-ui/react-popover";
import {
  Check,
  SearchIcon,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Command as CommandPrimitive } from "cmdk";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { FormDescription, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { ControllerRenderProps, FieldValues } from "react-hook-form";

export interface AutoCompleteFieldArray<T extends object, K extends keyof T> {
  placeholder?: string;
  data: T[];
  nameK: K;
  label?: string;
  onValueChange?: (e: string) => void;
  onSelect?: (v: T) => void;
  className?: string;
  inputClassName?: string;
  defaultValue?: string;
  addNew?: () => void;
  isSearch?: boolean;
  onCustomDisplay?: (e: T, idx: number) => JSX.Element;
  isLoading?: boolean;
  enableSelected?: boolean;
  shouldFilter?: boolean;
  allowEdit?: boolean;
  description?:string
  required?:boolean
  field?: ControllerRenderProps<FieldValues, string>
}

export default function AutocompleteFieldArray<T extends object, K extends keyof T>({
  data,
  nameK,
  onValueChange,
  onSelect,
  onCustomDisplay,
  className,
  addNew,
  isLoading,
  defaultValue,
  placeholder,
  isSearch,
  inputClassName,
  enableSelected = true,
  shouldFilter = false,
  label,
  allowEdit = true,
  required,
  description,
  field,
}: AutoCompleteFieldArray<T, K>) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState<string>(defaultValue || "");
  const [selected, setSelected] = useState<string | null>(null);
  // const inputRef = useRef<HTMLInputElement | null>(null);

  const onQueryChange = (e: string) => {
    onValueChange?.(e);
    setQuery(e);
  };
  const onSelectItem = (item: T) => {
    // field?.onChange(item[nameK]);
    const value = item[nameK] as string;
    console.log("VALUE", value);
    setOpen(false);
    if (onSelect) {
      onSelect(item);
    }
    setSelected(value);
    setQuery(value);
    // inputRef.current?.blur();
  };

  return (
    <FormItem className="flex flex-col w-full  ">
      {label && (
        <FormLabel className="text-xs">
          {label} {required && "*"}
        </FormLabel>
      )}
      <Popover open={open} onOpenChange={setOpen} modal={true}>
        <Command shouldFilter={shouldFilter} className="">
          <PopoverAnchor asChild className="flex space-x-2">
            <CommandPrimitive.Input
              asChild
              // ref={inputRef}
              value={query}
              onFocus={() => {
                onValueChange?.("");
              }}
              onValueChange={onQueryChange}
              onKeyDown={(e) => {
                switch (e.key) {
                  case "Escape": {
                    setOpen(e.key !== "Escape");
                    break;
                  }
                }
              }}
              // onMouseDown={() => setOpen((open) => !!query || !open)
              onClick={() => {
                setOpen(true);
                if (query == "" && data.length == 0) {
                  onValueChange?.(query);
                }
              }}
              onBlur={() => {}}
            >
              {isSearch ? (
                <div
                  className={cn(
                    "flex space-x-1 items-center border  px-2",
                    className
                  )}
                >
                  <SearchIcon className="p-[2px]" />

                  <Input
                    placeholder={placeholder}
                    className={cn(
                      "border-0 focus-visible:ring-0 focus-visible:ring-offset-0 px-0 ",
                      inputClassName
                    )}
                  />
                </div>
              ) : (
                <Input
                  placeholder={placeholder}
                  className="text-xs m-0 rounded-none "
                />
              )}
            </CommandPrimitive.Input>
          </PopoverAnchor>
          {!open && <CommandList aria-hidden="true" className="hidden" />}

          <PopoverContent
            asChild
            onOpenAutoFocus={(e) => e.preventDefault()}
            onInteractOutside={(e) => {
              if (
                e.target instanceof Element &&
                e.target.hasAttribute("cmdk-input")
              ) {
                e.preventDefault();
              }
            }}
            className="w-[--radix-popover-trigger-width] p-0"
          >
            <CommandList>
              {isLoading && (
                <CommandPrimitive.Loading>
                  <div className="p-1">
                    <Skeleton className="h-6 w-full" />
                  </div>
                </CommandPrimitive.Loading>
              )}
              {data.length > 0 && !isLoading ? (
                <CommandGroup>
                  {data?.map((option, idx) => (
                    <CommandItem
                      key={(option[nameK] as string) || ""}
                      value={(option[nameK] as string) || ""}
                      onMouseDown={(e) => e.preventDefault()}
                      onSelect={() => {
                        onSelectItem(option);
                      }}
                    >
                      {enableSelected && (
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            selected === option[nameK]
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                      )}
                      {onCustomDisplay
                        ? onCustomDisplay(option, idx)
                        : option[nameK]?.toString() || ""}
                      {/* {option[nameK]?.toString() || ""} */}
                    </CommandItem>
                  ))}
                </CommandGroup>
              ) : null}
              {/* {!isLoading ? <CommandEmpty>{"No data."}</CommandEmpty> : null} */}
            </CommandList>
          </PopoverContent>
        </Command>
      </Popover>
      {description && <FormDescription>{description}</FormDescription>}
      <FormMessage className="text-xs" />
    </FormItem>
  );
}
