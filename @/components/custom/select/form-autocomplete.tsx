import IconButton from "@/components/custom-ui/icon-button";
import Typography, { sm, xs } from "@/components/typography/Typography";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
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
import { PopoverAnchor } from "@radix-ui/react-popover";
import { Link } from "@remix-run/react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronsUpDown,
  MoveRightIcon,
  PlusIcon,
  XIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Control } from "react-hook-form";
import { Command as CommandPrimitive } from "cmdk";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Separator } from "@radix-ui/react-select";
import { AutoCompleteProps } from "./autocomplete";
import { OpenModalFunc } from "~/types";

export interface AutocompleteFormProps<T extends object, K extends keyof T> {
  data: T[];
  nameK: K;
  name: string;
  form?: any;
  control?: Control<any, any>;
  label?: string;
  description?: string;
  onValueChange?: (e: string) => void;
  onSelect?: (v: T) => void;
  onClear?: () => void;
  onFocus?: () => void;
  className?: string;
  allowEdit?: boolean;
  addNew?: () => void;
  modal?: boolean;
  placeholder?: string;
  loading?: boolean;
  disableAutocomplete?: boolean;
  required?: boolean;
  enableSelected?: boolean;
  defaultValue?: string;
  href?: string;
  onCustomDisplay?: (e: T, idx: number) => JSX.Element;
  inputClassName?: string;
  navigate?: (e: any) => void;
  openModal?:OpenModalFunc
}

export default function FormAutocompleteField<
  T extends object,
  K extends keyof T
>({
  data,
  nameK,
  form,
  label,
  control,
  description,
  name,
  onValueChange,
  onSelect,
  onFocus,
  onClear,
  onCustomDisplay,
  className,
  allowEdit = true,
  modal = true,
  addNew,
  required,
  href,
  placeholder,
  loading,
  enableSelected,
  disableAutocomplete,
  inputClassName,
  defaultValue,
  navigate,
}: AutoCompleteProps<T, K>) {
  const [open, setOpen] = useState(false);
  const fieldValue = form.getValues(name || "");
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
    form?.setValue(name, {
      id: item["id" as keyof T],
      name: item[nameK as keyof T],
      uuid: item["uuid" as keyof T],
    });
    // inputRef.current?.blur();
  };

  return (
    <FormField
      control={control || (form && form?.control)}
      name={name || ""}
      render={({ field }) => {
        const fieldID = field?.value?.id;
        useEffect(() => {
          if (field.value?.id && field.value?.name)
            setQuery(field.value?.name || "");
          setSelected(field.value?.name);
        }, [fieldID]);

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
                  <span
                    className={cn(
                      "text-sm",
                      navigate && "underline cursor-pointer"
                    )}
                    onClick={() =>
                      navigate && navigate(fieldValue["id" as keyof T])
                    }
                  >
                    {query || "-"}
                  </span>
                </div>
              </div>
            </>
          );
        }
        return (
          <FormItem className="flex flex-col w-full ">
            <Popover open={open} onOpenChange={setOpen} modal={modal}>
              <Command className="">
                <PopoverAnchor asChild className="">
                  <CommandPrimitive.Input
                    asChild
                    // ref={inputRef}
                    value={query}
                    onFocus={() => {
                      onFocus?.();
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
                  >
                    <div className="flex flex-col space-y-[7px] ">
                      {label && (
                        <FormLabel className="text-xs text-primary/60">
                          {label} {required && "*"}
                        </FormLabel>
                      )}
                      {/* {label && (
                      <FormLabel className="text-xs text-primary/60">
                        {label} {required && "*"}
                      </FormLabel>
                    )} */}

                      <div
                        className={cn(
                          "flex space-x-1 items-center border h-9 rounded-sm  px-2 mt-[3px]",
                          className
                        )}
                      >
                        <Input
                          value={query}
                          disabled={!allowEdit}
                          placeholder={placeholder}
                          className={cn(
                            "border-0 focus-visible:ring-0 focus-visible:ring-offset-0 h-8 px-0 text-sm",
                            inputClassName
                          )}
                        />

                        {/* {badgeLabel && (
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
                        })} */}

                        {selected && (
                          <IconButton
                            icon={XIcon}
                            disabled={!allowEdit}
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
                  <div>
  
                  <CommandList>
                    {loading && (
                      <CommandPrimitive.Loading>
                        <div className="p-1 flex flex-col space-y-2">
                          <Skeleton className="h-8 w-full" />
                          <Skeleton className="h-8 w-full" />
                        </div>
                      </CommandPrimitive.Loading>
                    )}

                    {data.length > 0 && !loading ? (
                      <CommandGroup className=" h-40 overflow-auto">
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

                    {/* {!loading ? <CommandEmpty>{"No data."}</CommandEmpty> : null} */}
                  </CommandList>

                   {addNew && (
                                  <div className="w-full pt-2 pb-1 flex justify-end">
                                  <Button
                                    size={"xs"}
                                    variant={"outline"}
                                    onClick={() => {
                                      addNew();
                                      setOpen(false);
                                    }}
                                  >
                                    <span>Crear Nuevo</span>
                                    <PlusIcon />
                                  </Button>
                                      </div>
                                )}
                          </div>
                </PopoverContent>
              </Command>
            </Popover>
            {description && <FormDescription>{description}</FormDescription>}
            <FormMessage className="text-xs" />
          </FormItem>
        );
      }}
    />
  );
}
