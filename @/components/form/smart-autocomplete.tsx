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
import { Check, LucideIcon, PlusIcon, SearchIcon, XIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Command as CommandPrimitive } from "cmdk";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useFormContext } from "./form-provider";
import IconButton from "../custom-ui/icon-button";

interface ActionButton {
  Icon: LucideIcon;
  onClick: () => void;
}

export interface SmartAutocompleteProps<T extends object, K extends keyof T> {
  placeholder?: string;
  data: T[];
  nameK: K;
  name?: string;
  label?: string;
  onValueChange?: (e: string) => void;
  onSelect?: (v: T) => void;
  onBlur?: (e: string) => void;
  className?: string;
  inputClassName?: string;
  defaultValue?: string | null;
  addNew?: () => void;
  required?: boolean;
  isSearch?: boolean;
  onCustomDisplay?: (e: T, idx: number) => JSX.Element;
  isLoading?: boolean;
  enableSelected?: boolean;
  shouldFilter?: boolean;
  actions?: ActionButton[];
  disableAutocomplete?: boolean;
  badgeLabel?: string;
}

const SmartAutocomplete = <T extends object, K extends keyof T>({
  data,
  nameK,
  name,
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
  actions,
  label,
  badgeLabel,
}: SmartAutocompleteProps<T, K>) => {
  const { form, isEditing } = useFormContext();
  if (!form) {
    throw new Error("SmartField must be used within a SmartForm");
  }
  const [open, setOpen] = useState(false);
  const fieldValue = form.getValues(name || "");
  const [query, setQuery] = useState<string>(
    defaultValue || fieldValue["name"] || ""
  );
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
    if (name && name != "currency") {
      form?.setValue(name, {
        id: item["id" as keyof T],
        name: item[nameK as keyof T],
      });
    }
    // inputRef.current?.blur();
  };
  useEffect(() => {
    console.log("MOUNT");
  }, []);

  if (!isEditing) {
    return (
      <div className="flex flex-col py-[5px]Z">
        {label && <span className="text-xs text-primary/60">{label}</span>}
        <div>
          <span className="text-sm">{query || "-"}</span>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("", className)}>
      <Popover
        open={!disableAutocomplete && open}
        onOpenChange={setOpen}
        modal={true}
      >
        <Command shouldFilter={shouldFilter} className="py-[5px]">
          <PopoverAnchor asChild className="">
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
              <div className="flex flex-col ">
                {label && (
                  <span className="text-xs text-primary/60">{label}</span>
                )}

                {isSearch ? (
                  <div
                    className={cn(
                      "flex space-x-1 items-center border rounded-full px-2"
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
                      "flex space-x-1 items-center border h-9 rounded-sm  px-2 mt-[3px]",
                      className
                    )}
                  >
                    <Input
                      value={query}
                      placeholder={placeholder}
                      className={cn(
                        "border-0 focus-visible:ring-0 focus-visible:ring-offset-0 h-8 px-0 text-sm",
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

                    {selected && (
                      <IconButton
                        icon={XIcon}
                        className="h-6 w-6"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (name) {
                            setSelected(null);
                            setQuery("");
                            form?.setValue(name, {});
                          }
                        }}
                      />
                    )}
                  </div>
                )}
              </div>
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
            className="w-[--radix-popover-trigger-width] p-1"
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
              {addNew && (
                <Button
                  size={"sm"}
                  variant={"default"}
                  className=" py-1"
                  onClick={() => {
                    addNew();
                    setOpen(false);
                  }}
                >
                  <span>Crear Nuevo</span>
                  <PlusIcon />
                </Button>
              )}
              {/* {!isLoading ? <CommandEmpty>{"No data."}</CommandEmpty> : null} */}
            </CommandList>
          </PopoverContent>
        </Command>
      </Popover>
    </div>
  );
};
SmartAutocomplete.displayName = "SmartAutocomplete";

export { SmartAutocomplete };
