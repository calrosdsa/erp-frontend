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
import { Link } from "@remix-run/react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronsUpDown,
  PlusIcon,
  XIcon,
} from "lucide-react";
import { useState } from "react";
import { Control } from "react-hook-form";

interface Props<T extends object, K extends keyof T> {
  data: T[];
  nameK: K;
  name: string;
  form?: any;
  control?: Control<any, any>;
  label?: string;
  description?: string;
  onValueChange?: (e: string) => void;
  onSelect?: (v: T) => void;
  className?: string;
  allowEdit?: boolean;
  addNew?: () => void;
  required?: boolean;
  href?: string;
  onCustomDisplay?: (e: T, idx: number) => JSX.Element;
}

export default function FormAutocomplete<T extends object, K extends keyof T>({
  data,
  nameK,
  form,
  label,
  control,
  description,
  name,
  onValueChange,
  onSelect,
  onCustomDisplay,
  className,
  allowEdit = true,
  addNew,
  required,
  href,
}: Props<T, K>) {
  const [open, setOpen] = useState(false);
  return (
    <FormField
      control={control || (form && form.control)}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-col w-full ">
          {label && (
            <FormLabel className="text-xs">
              {label} {required && "*"}
            </FormLabel>
          )}
          <Popover open={open} onOpenChange={setOpen} modal={true}>
              {href && !allowEdit ? (
              <Button
                variant="outline"
                role="combobox"
                size="sm"
                type="button"
                onClick={(e)=>{
                  e.stopPropagation()
                }}
                className={cn(
                  "justify-between",
                  !field.value && "text-muted-foreground",
                  !allowEdit &&
                    "disabled:opacity-100 disabled:cursor-default bg-secondary"
                )}
              >
                <Link to={href} className="underline">
                  {field.value}
                </Link>
              </Button>
            ) : (
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  role="combobox"
                  size={"sm"}
                  disabled={!allowEdit}
                  onClick={() => {
                    onValueChange?.("");
                    setOpen(!open);
                  }}
                  className={cn(
                    "justify-between",
                    !field.value && "text-muted-foreground",
                    !allowEdit &&
                      "disabled:opacity-100 disabled:cursor-default bg-secondary"
                  )}
                >
                  <span className=" truncate">
                  {field.value || ""}
                  </span>
                  

                  {field.value && field.value != "" && allowEdit && !required ? (
                    <div className="flex items-center">
                      {href && (
                        <div onClick={(e)=>{
                          e.stopPropagation()
                        }}>
                          <Link to={href}>
                            <IconButton
                              icon={ArrowRight}
                              size="sm"
                              className="ml-1 h-6 w-6 shrink-0 opacity-50 "
                            />
                          </Link>
                        </div>
                      )}
                      <IconButton
                        icon={XIcon}
                        size="sm"
                        className="ml-1 h-6 w-6 shrink-0 opacity-50 "
                        onClick={(e) => {
                          e.stopPropagation();
                          field.onChange();
                          setOpen(false);
                          // form.setValue(name, "");
                        }}
                      />
                    </div>
                  ) : (
                    allowEdit && (
                      <ChevronsUpDown className="ml-2 h w-4 shrink-0 opacity-50" />
                    )
                  )}
                </Button>
              </FormControl>
            </PopoverTrigger>
              )}
            <PopoverContent className="">
              <Command className="max-h-[150px] sm:max-h-[200px]">
                <CommandInput
                  placeholder="Buscar..."
                  onValueChange={(e) => {
                    onValueChange?.(e);
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
                          className=" border-b"
                          onSelect={() => {
                            field.onChange(item[nameK]);
                            if (onSelect) {
                              onSelect(item);
                            }
                            setOpen(false);
                          }}
                        >
                          {onCustomDisplay(item, idx)}
                        </CommandItem>
                      ) : (
                        <CommandItem
                          value={(item[nameK] as string) || ""}
                          key={idx}
                          onSelect={() => {
                            console.log("NAME", name);
                            console.log("NAME value", item[nameK]);
                            // form.setValue(name, item[nameK]);
                            field.onChange(item[nameK]);
                            if (onSelect) {
                              onSelect(item);
                            }
                            setOpen(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              item[nameK] === field.value
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
              <div className="pt-2 px-1">
                {addNew && (
                  <Button
                    onClick={() => {
                      addNew();
                    }}
                    size={"sm"}
                    className=" space-x-2 flex"
                  >
                    <Typography fontSize={xs}>Add New</Typography>
                    <PlusIcon size={15} />
                  </Button>
                )}
              </div>
            </PopoverContent>
          </Popover>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
