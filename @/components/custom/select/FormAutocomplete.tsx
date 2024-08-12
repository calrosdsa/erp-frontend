import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import { useEffect, useState } from "react";

interface Props<T extends object, K extends keyof T,V extends keyof T> {
    data: T[];
    nameK: K;
    value:V;
    name:string
    onOpen:()=>void
    form:any
    label:string
    description?:string
    onValueChange:(e:string)=>void
    onSelect:(v:T)=>void
  }
  

export default function FormAutocomplete<T extends object,K extends keyof T,V extends keyof T>({
    data,nameK,value,form,label,onOpen,description,name,onValueChange,onSelect
}:Props<T,K,V>){
    return (
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
                  onClick={()=>onOpen()}
                  className={cn(
                    "justify-between h-[37px]",
                    !field.value && "text-muted-foreground"
                  )}
                >
                  {field.value
                    ? data.find(
                        (item) => item[value] === field.value
                      )?.[nameK]?.toString()
                    : "Select item"}
                  <ChevronsUpDown className="ml-2 h w-4 shrink-0 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent >
              <Command>
                <CommandInput placeholder="Search item..." onValueChange={(e)=>{
                  onValueChange(e)
                }}/>
                <CommandList>
                  <CommandEmpty>No results found.</CommandEmpty>
                  <CommandGroup>
                    {data.map((item,idx) => (
                      <CommandItem
                        value={item[value] as string || ""}
                        key={idx}
                        onSelect={() => {
                          form.setValue(name, item[value])
                          onSelect(item)
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
            </PopoverContent>
          </Popover>
          <FormDescription>
            {description}
          </FormDescription>
          <FormMessage />
        </FormItem>
        )}
      />
    )
}