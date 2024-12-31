import IconButton from "@/components/custom-ui/icon-button";
import { Icons } from "@/components/icons";
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
import { useSearchParams } from "@remix-run/react";
import { Check, ChevronsUpDown, PlusIcon, XIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { DEFAULT_PAGE } from "~/constant";
import { Command as CommandPrimitive } from "cmdk";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { TooltipLayout } from "@/components/layout/tooltip-layout";

interface Props<T extends object, K extends keyof T, V extends keyof T> {
  placeholder?: string;
  data: T[];
  nameK: K;
  valueK: V;
  label?: string;
  onValueChange?: (e: string) => void;
  onSelect?: (v: T) => void;
  className?: string;
  addNew?: () => void;
  required?: boolean;
  onCustomDisplay?: (e: T, idx: number) => JSX.Element;
  queryValue: string;
  queryName: string;
  isLoading?:boolean
}

export default function AutocompleteSearch<
  T extends object,
  K extends keyof T,
  V extends keyof T
>({
  data,
  nameK,
  valueK,
  queryValue,
  queryName,
  onValueChange,
  onSelect,
  onCustomDisplay,
  className,
  addNew,
  isLoading,
  placeholder,
}: Props<T, K, V>) {
  const [open, setOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [query,setQuery] = useState<string>(searchParams.get(queryName) || "")
  const [selected,setSelected] = useState(query)
  const reset = () => {
    // onSelect?.(undefined);
    onValueChange?.("");
  };
  const onInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if(query == ""){
      setSelected("")
      searchParams.delete(queryValue);
      searchParams.delete(queryName);
      setSearchParams(searchParams,{
        preventScrollReset:true,
      })
    }
  };

  const onSelectItem = (item: T) => {
      setQuery(item[nameK] as string);
      setSelected(item[nameK] as string)
      // if (onSelect) {
      //   onSelect(item);
      // }
      searchParams.set(queryName, item[nameK] as string);
      searchParams.set(queryValue, item[valueK] as string);
      setSearchParams(searchParams, {
        preventScrollReset: true,
      });
      setOpen(false)
    };

    // useEffect(()=>{
    //   console.log("search params",searchParams,searchParams.get(queryName))
    //   setQuery(searchParams.get(queryName) || "")
    // },[])

  // const onSelectItem = (inputValue: string) => {
  //   console.log("Input value",inputValue)
  //   if (inputValue === selectedValue) {
  //     reset();
  //   } else {
  //     // onSelectedValueChange(inputValue as T);
  //     setQuery(inputValue ?? "");
  //   }
  //   setOpen(false);
  // };

  const onQueryChange = (e:string) =>{
    onValueChange?.(e)
    setQuery(e)
  }

  return (
    <div className="flex items-center w-32">
      <Popover open={open} onOpenChange={setOpen}>
        <Command shouldFilter={false}>
            <TooltipLayout content={placeholder}>
          <PopoverAnchor asChild>
            <CommandPrimitive.Input
              asChild
              value={query}
              onValueChange={onQueryChange}
              onKeyDown={(e) => setOpen(e.key !== "Escape")}
              onMouseDown={() => setOpen((open) => !!query || !open)}
              onFocus={() => {
                setOpen(true)
                if (query == "") {
                  onValueChange?.(query)
                }
              }}
              onBlur={onInputBlur}
            >
              <Input placeholder={placeholder} />
            </CommandPrimitive.Input>
          </PopoverAnchor>
              </TooltipLayout>
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
            <CommandList >
              {isLoading && (
                <CommandPrimitive.Loading>
                  <div className="p-1">
                    <Skeleton className="h-6 w-full" />
                  </div>
                </CommandPrimitive.Loading>
              )}
              {data.length > 0 && !isLoading ? (
                <CommandGroup >
                  {data?.map((option,idx) => (
                    <CommandItem
                      key={(option[nameK] as string) || ""}
                      value={(option[nameK] as string) || ""}
                      onMouseDown={(e) => e.preventDefault()}
                      onSelect={()=>onSelectItem(option)}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          selected === option[nameK] 
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                      {onCustomDisplay ? onCustomDisplay(option,idx) : option[nameK]?.toString() || ""}
                      {/* {option[nameK]?.toString() || ""} */}
                    </CommandItem>
                  ))}
                </CommandGroup>
              ) : null}
              {/* {!isLoading ? (
                <CommandEmpty>{emptyMessage ?? "No data."}</CommandEmpty>
              ) : null} */}
            </CommandList>
          </PopoverContent>
        </Command>
      </Popover>
    </div>
  );
}
