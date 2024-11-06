import React, { useEffect, useState } from "react";
import { useSearchParams } from "@remix-run/react";
import { useTranslation } from "react-i18next";
import { Check, ChevronsUpDown, PlusIcon, XIcon } from "lucide-react";
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { DEFAULT_PAGE } from "~/constant";

interface Props<T extends object, K extends keyof T, V extends keyof T> {
  placeholder?: string;
  data: T[];
  nameK: K;
  valueK: V;
  label?: string;
  onValueChange: (e: string) => void;
  onSelect?: (v: T[]) => void;
  className?: string;
  addNew?: () => void;
  required?: boolean;
  onCustomDisplay?: (e: T, idx: number) => JSX.Element;
  queryValue: string;
  queryName: string;
  multiple?: boolean;
}

export default function AutoSearchMult<
  T extends object,
  K extends keyof T,
  V extends keyof T,
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
  multiple = false,
}: Props<T, K, V>) {
  const { t } = useTranslation("common");
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedItems, setSelectedItems] = useState<T[]>([]);

  useEffect(() => {
    const initialValues = searchParams.getAll(queryName);
    const initialItems = data.filter((item) => 
      initialValues.includes(item[nameK] as string)
    );
    setSelectedItems(initialItems);
  }, [searchParams, queryName, data, nameK]);

  const onSelectItem = (item: T) => {
    let newSelectedItems: T[];
    if (multiple) {
      newSelectedItems = selectedItems.some((i) => i[valueK] === item[valueK])
        ? selectedItems.filter((i) => i[valueK] !== item[valueK])
        : [...selectedItems, item];
    } else {
      newSelectedItems = [item];
    }
    setSelectedItems(newSelectedItems);

    if (onSelect) {
      onSelect(newSelectedItems);
    }

    const newParams = new URLSearchParams(searchParams);
    newParams.delete(queryName);
    newParams.delete(queryValue);
    newSelectedItems.forEach((i) => {
      newParams.append(queryName, i[nameK] as string);
      newParams.append(queryValue, i[valueK] as string);
    });
    newParams.set("page", DEFAULT_PAGE);
    setSearchParams(newParams, { preventScrollReset: true });
  };

  const removeItem = (item: T) => {
    const newSelectedItems = selectedItems.filter((i) => i[valueK] !== item[valueK]);
    setSelectedItems(newSelectedItems);
    if (onSelect) {
      onSelect(newSelectedItems);
    }

    const newParams = new URLSearchParams(searchParams);
    newParams.delete(queryName);
    newParams.delete(queryValue);
    newSelectedItems.forEach((i) => {
      newParams.append(queryName, i[nameK] as string);
      newParams.append(queryValue, i[valueK] as string);
    });
    newParams.set("page", DEFAULT_PAGE);
    setSearchParams(newParams, { preventScrollReset: true });
  };

  return (
    <div>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            onClick={() => onValueChange("")}
            className={cn(
              "justify-between w-full sm:min-w-32",
              !selectedItems.length && "text-muted-foreground"
            )}
          >
            {selectedItems.length
              ? selectedItems.map((item) => item[nameK] as string).join(", ")
              : placeholder}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0">
          <Command>
            <CommandInput
              placeholder="Search item..."
              onValueChange={(e) => {
                onValueChange(e);
              }}
            />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup>
                {data.map((item, idx) =>
                  onCustomDisplay ? (
                    <CommandItem
                      value={(item[nameK] as string) || ""}
                      key={idx}
                      onSelect={() => onSelectItem(item)}
                    >
                      {onCustomDisplay(item, idx)}
                    </CommandItem>
                  ) : (
                    <CommandItem
                      value={(item[nameK] as string) || ""}
                      key={idx}
                      onSelect={() => onSelectItem(item)}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          selectedItems.some((i) => i[valueK] === item[valueK])
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                      {item[nameK]?.toString() || ""}
                    </CommandItem>
                  )
                )}
              </CommandGroup>
            </CommandList>
          </Command>
          <div className="border-t p-2">
            {addNew && (
              <Button
                onClick={addNew}
                size="sm"
                className="w-full space-x-2 flex items-center justify-center"
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