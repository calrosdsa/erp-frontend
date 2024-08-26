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
import { Check, ChevronsUpDown, PlusIcon } from "lucide-react";
import { useEffect, useState } from "react";

interface Props<T extends object, K extends keyof T, V extends keyof T> {
  data: T[];
  nameK: K;
  value: V;
  name: string;
  onOpen: () => void;
  form: any;
  label: string;
  description?: string;
  onValueChange: (e: string) => void;
  onSelect: (v: T) => void;
  className?:string
}

export default function FormAutocomplete<
  T extends object,
  K extends keyof T,
  V extends keyof T
>({
  data,
  nameK,
  value,
  form,
  label,
  onOpen,
  description,
  name,
  onValueChange,
  onSelect,
  className
}: Props<T, K, V>) {
  return (
    <div className={cn("",className)}>
      <FormField
        control={form.control}
        name={name}
        render={({ field }) => (
          <FormItem className="flex flex-col ">
            <FormLabel>{label}</FormLabel>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant="outline"
                    role="combobox"
                    onClick={() => onOpen()}
                    className={cn(
                      "justify-between h-[37px]",
                      !field.value && "text-muted-foreground"
                    )}
                  >
                    {field.value
                      ? data
                          .find((item) => item[value] === field.value)
                          ?.[nameK]?.toString()
                      : "Select item"}
                    <ChevronsUpDown className="ml-2 h w-4 shrink-0 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent>
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
                      {data.map((item, idx) => (
                        <CommandItem
                          value={(item[value] as string) || ""}
                          key={idx}
                          onSelect={() => {
                            form.setValue(name, item[value]);
                            onSelect(item);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              item[value] === field.value
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          {item[nameK]?.toString() || ""}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
                <div className="pt-2 px-1">
                  <Button size={"sm"} className=" space-x-2 flex">
                    <Typography fontSize={xs}>Add New</Typography>
                    <PlusIcon size={15} />
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
            <FormDescription>{description}</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
