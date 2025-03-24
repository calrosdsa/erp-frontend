import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { PopoverAnchor } from "@radix-ui/react-popover";
import { useSearchParams } from "@remix-run/react";
import { Check, LucideIcon, SearchIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Command as CommandPrimitive } from "cmdk";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { TooltipLayout } from "@/components/layout/tooltip-layout";
import { Badge } from "@/components/ui/badge";

interface ActionButton {
  Icon: LucideIcon;
  onClick: () => void;
}

export interface AutoCompleteProps<T extends object, K extends keyof T> {
  placeholder?: string;
  data: T[];
  nameK: K;
  label?: string;
  onValueChange?: (e: string) => void;
  onSelect?: (v: T) => void;
  onBlur?: (e: string) => void;
  className?: string;
  inputClassName?: string;
  defaultValue?: string;
  addNew?: () => void;
  required?: boolean;
  isSearch?: boolean;
  onCustomDisplay?: (e: T, idx: number) => JSX.Element;
  isLoading?: boolean;
  enableSelected?: boolean;
  shouldFilter?: boolean;
  allowEdit?: boolean;
  actions?: ActionButton[];
  disableAutocomplete?: boolean;
  badgeLabel?: string;
}

export  const Autocomplete = <T extends object, K extends keyof T>({
  data,
  nameK,
  onValueChange,
  onBlur,
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
  disableAutocomplete = false,
  allowEdit = true,
  actions,
  badgeLabel,
}: AutoCompleteProps<T, K>)=> {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState<string>(defaultValue || "");
  const [selected, setSelected] = useState<string | null>(null);
  // const inputRef = useRef<HTMLInputElement | null>(null);

  const onQueryChange = (e: string) => {
    onValueChange?.(e);
    setQuery(e);
  };
  const onSelectItem = (item: T) => {
    const value = item[nameK] as string;
    console.log("VALUE", value);
    setOpen(false);
    setSelected(value);
    setQuery(value);
    if (onSelect) {
      onSelect(item);
    }
    // inputRef.current?.blur();
  };
  useEffect(() => {
    console.log("MOUNT");
  }, []);

  return (
    <div className={cn("",className)}>
      <Popover
        open={!disableAutocomplete && open}
        onOpenChange={setOpen}
        modal={true}
      >
        <Command shouldFilter={shouldFilter} className="">
          <PopoverAnchor asChild className="flex space-x-2">
            <CommandPrimitive.Input
              asChild
              // ref={inputRef}
              value={query}
              onFocus={() => {
                console.log("FOCUS INPUT...");
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
              onBlur={() => onBlur?.(query)}
            >
              {isSearch ? (
                <div
                  className={cn(
                    "flex space-x-1 items-center border rounded-full px-2",
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
                <div
                  className={cn(
                    "flex space-x-1 items-center border  px-2",
                    className
                  )}
                >
                  <Input
                    value={query}
                    placeholder={placeholder}
                    className={cn(
                      "border-0 focus-visible:ring-0 focus-visible:ring-offset-0 px-0 text-xs",
                      inputClassName
                    )}
                  />

                  {badgeLabel && (
                    <Badge variant={"secondary"} className="">
                      {badgeLabel}
                    </Badge>
                  )}
                  {actions?.map((action) => {
                    return (
                      <action.Icon
                        className="h-4 w-4 icon-button"
                        onClick={(e) => {
                          e.stopPropagation();
                          action.onClick();
                        }}
                      />
                    );
                  })}
                </div>
                // <Input
                //   placeholder={placeholder}
                //   className="text-xs m-0 rounded-none "
                // />
              )}
            </CommandPrimitive.Input>
          </PopoverAnchor>
          {!open && <CommandList aria-hidden="true" className="hidden" />}
          {disableAutocomplete && (
            <CommandList aria-hidden="true" className="hidden" />
          )}

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
    </div>
  );
}
