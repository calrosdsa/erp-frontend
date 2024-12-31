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
import { useSearchParams } from "@remix-run/react";
import { Check, ChevronsUpDown, PlusIcon, XIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { DEFAULT_PAGE } from "~/constant";

interface Props<T extends object, K extends keyof T, V extends keyof T> {
  placeholder?: string;
  data: T[];
  nameK: K;
  valueK: V;
  label?: string;
  onValueChange: (e: string) => void;
  onSelect?: (v: T) => void;
  className?: string;
  addNew?: () => void;
  required?: boolean;
  onCustomDisplay?: (e: T, idx: number) => JSX.Element;
  queryValue: string;
  queryName: string;
}

export default function AutocompleteS<
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
  placeholder,
}: Props<T, K, V>) {
  const { t } = useTranslation("common");
  const [searchParams, setSearchParams] = useSearchParams();
  const [value, setValue] = useState<string | undefined>(
    searchParams.get(queryName) || ""
  );

  const onSelectItem = (item: T) => {
    setValue(item[nameK] as string);
    if (onSelect) {
      onSelect(item);
    }
    searchParams.set(queryName, item[nameK] as string);
    searchParams.set(queryValue, item[valueK] as string);
    searchParams.set("page", DEFAULT_PAGE);
    setSearchParams(searchParams, {
      preventScrollReset: true,
    });
  };
  return (
    <div>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            size={"sm"}
            onClick={() => onValueChange("")}
            className={cn(
              "justify-between w-full  sm:min-w-32",
              !value && "text-muted-foreground"
            )}
          >
            {value || placeholder}
            {/* {field.value
                    ? data
                        .find((item) => item[nameK] === field.value)
                        ?.[nameK]?.toString()
                    : "Select item"} */}
            {value ? (
              <>
                <IconButton
                  icon={XIcon}
                  size="sm"
                  className="ml-2 h-6 w-6 shrink-0 opacity-50 "
                  onClick={(e) => {
                    e.stopPropagation();
                    setValue("");
                    searchParams.delete(queryValue);
                    searchParams.delete(queryName);
                    searchParams.set("page", DEFAULT_PAGE);
                    setSearchParams(searchParams, {
                      preventScrollReset: true,
                    });
                  }}
                />
              </>
            ) : (
              <ChevronsUpDown className="ml-2 h w-4 shrink-0 opacity-50" />
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent>
          <Command>
            <CommandInput
              placeholder="Buscar..."
              onValueChange={(e) => {
                onValueChange(e);
              }}
            />
            <CommandList>
              <CommandEmpty>No se encontraron resultados.</CommandEmpty>
              <CommandGroup>
                {data.map((item, idx) =>
                  onCustomDisplay ? (
                    <CommandItem
                      value={(item[nameK] as string) || ""}
                      key={idx}
                      onSelect={() => {
                        onSelectItem(item);
                      }}
                    >
                      {onCustomDisplay(item, idx)}
                    </CommandItem>
                  ) : (
                    <CommandItem
                      value={(item[nameK] as string) || ""}
                      key={idx}
                      onSelect={() => {
                        onSelectItem(item);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          item[nameK] === value ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {item[nameK]?.toString() || ""}
                    </CommandItem>
                  )
                )}
              </CommandGroup>
            </CommandList>
          </Command>
          <div className="pt-2 px-1">
            {addNew && (
              <Button
                onClick={() => {
                  addNew();
                }}
                size={"sm"}
                className=" space-x-2 flex"
              >
                <Typography fontSize={xs}>{t("form.addNew")}</Typography>
                <PlusIcon size={15} />
              </Button>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}


// import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from "@/components/ui/command";
// import { Input } from "@/components/ui/input";
// import { Popover, PopoverContent } from "@/components/ui/popover";
// import { Skeleton } from "@/components/ui/skeleton";
// import { cn } from "@/lib/utils";
// import { PopoverAnchor } from "@radix-ui/react-popover";
// import { useSearchParams } from "@remix-run/react";
// import { Command as CommandPrimitive } from "cmdk";
// import { Check } from "lucide-react";
// import { ChangeEvent, useMemo, useState } from "react";

// type Props<T extends object, K extends keyof T, V extends keyof T> = {
//   selectedValue?: T;
//   onSelectedValueChange?: (value?: T) => void;
//   searchValue: string;
//   onSearchValueChange: (value: string) => void;
//   items: T[];
//   isLoading?: boolean;
//   emptyMessage?: string;
//   placeholder?: string;
//   nameK: K;
//   valueK: V;
//   queryValue: string;
//   queryName: string;
// };

// export function AutoComplete< T extends object,
// K extends keyof T,
// V extends keyof T>({
//   selectedValue,
//   onSelectedValueChange,
//   searchValue,
//   onSearchValueChange,
//   items,
//   isLoading,
//   emptyMessage = "No items.",
//   placeholder = "Search...",
//   nameK,
//   valueK,
//   queryValue,
//   queryName,
// }: Props<T, K, V>) {
//   const [open, setOpen] = useState(false);
//   const [query,setQuery] = useState(searchValue)
//   const [searchParams, setSearchParams] = useSearchParams();

//   const reset = () => {
//     onSelectedValueChange?.(undefined);
//     onSearchValueChange("");
//   };
//   // const onInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
//   //   if (
//   //     !e.relatedTarget?.hasAttribute("cmdk-list") &&
//   //     labels[selectedValue] !== searchValue
//   //   ) {
//   //     reset();
//   //   }
//   // };

//   const onSelectItem = (item: T) => {
//       setQuery(item[nameK] as string);
//       // if (onSelect) {
//       //   onSelect(item);
//       // }
//       searchParams.set(queryName, item[nameK] as string);
//       searchParams.set(queryValue, item[valueK] as string);
//       setSearchParams(searchParams, {
//         preventScrollReset: true,
//       });
//     };

//   // const onSelectItem = (inputValue: string) => {
//   //   console.log("Input value",inputValue)
//   //   if (inputValue === selectedValue) {
//   //     reset();
//   //   } else {
//   //     // onSelectedValueChange(inputValue as T);
//   //     setQuery(inputValue ?? "");
//   //   }
//   //   setOpen(false);
//   // };

//   const onQueryChange = (e:string) =>{
//     onSearchValueChange(e)
//     setQuery(e)
//   }

//   return (
//     <div className="flex items-center w-32">
//       <Popover open={open} onOpenChange={setOpen}>
//         <Command >
//           <PopoverAnchor asChild>
//             <CommandPrimitive.Input
//               asChild
//               value={query}
//               onValueChange={onQueryChange}
//               onKeyDown={(e) => setOpen(e.key !== "Escape")}
//               onMouseDown={() => setOpen((open) => !!query || !open)}
//               onFocus={() => {
//                 setOpen(true)
//                 onQueryChange("")
//               }}
//               // onBlur={onInputBlur}
//             >
//               <Input placeholder={placeholder} />
//             </CommandPrimitive.Input>
//           </PopoverAnchor>
//           {/* {!open && <CommandList aria-hidden="true" className="hidden" />} */}
//           <PopoverContent
//             asChild
//             onOpenAutoFocus={(e) => e.preventDefault()}
//             onInteractOutside={(e) => {
//               if (
//                 e.target instanceof Element &&
//                 e.target.hasAttribute("cmdk-input")
//               ) {
//                 e.preventDefault();
//               }
//             }}
//             className="w-[--radix-popover-trigger-width] p-0"
//           >
//             <CommandList>
//               {isLoading && (
//                 <CommandPrimitive.Loading>
//                   <div className="p-1">
//                     <Skeleton className="h-6 w-full" />
//                   </div>
//                 </CommandPrimitive.Loading>
//               )}
//               {items.length > 0 && !isLoading ? (
//                 <CommandGroup>
//                   {items.map((option) => (
//                     <CommandItem
//                       key={(option[nameK] as string) || ""}
//                       value={(option[nameK] as string) || ""}
//                       onMouseDown={(e) => e.preventDefault()}
//                       onSelect={()=>onSelectItem(option)}
//                     >
//                       <Check
//                         className={cn(
//                           "mr-2 h-4 w-4",
//                           selectedValue === option[nameK] 
//                             ? "opacity-100"
//                             : "opacity-0"
//                         )}
//                       />
//                       {option[nameK]?.toString() || ""}
//                     </CommandItem>
//                   ))}
//                 </CommandGroup>
//               ) : null}
//               {/* {!isLoading ? (
//                 <CommandEmpty>{emptyMessage ?? "No items."}</CommandEmpty>
//               ) : null} */}
//             </CommandList>
//           </PopoverContent>
//         </Command>
//       </Popover>
//     </div>
//   );
// }