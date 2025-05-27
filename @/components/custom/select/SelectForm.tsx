"use client";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { X, Trash2 } from "lucide-react";
import { Control } from "react-hook-form";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

interface Props<T extends object, K extends keyof T, V extends keyof T> {
  data: T[];
  keyName?: K;
  keyValue?: V;
  name: string;
  control?: Control<any, any>;
  label?: string;
  description?: string;
  form?: any;
  allowEdit?: boolean;
  onValueChange?: (e: T | null) => void;
  required?: boolean;
  placeholder?: string;
  onDelete?: (item: T | null) => void;
}

export default function SelectForm<
  T extends object,
  K extends keyof T,
  V extends keyof T
>({
  label,
  form,
  keyName,
  keyValue,
  data,
  name,
  onValueChange,
  required,
  control,
  allowEdit = true,
  description,
  placeholder = "",
  onDelete,
}: Props<T, K, V>) {
  const {t} = useTranslation("common")
  if(!allowEdit){
    
  }
  return (
    <FormField
      control={control || form.control}
      name={name}
      render={({ field }) => {
        if (!allowEdit) {
          return (
            <>
              <div className="flex flex-col">
                {label && (
                  <FormLabel className="text-xs">
                    {label} {required && "*"}
                  </FormLabel>
                )}
                <div>
                  <span className={cn("text-sm")}>{t(field.value) || "-"}</span>
                </div>
              </div>
            </>
          );
        }
        return (
          <FormItem className="w-full flex flex-col">
            <FormLabel className="text-xs">
              {label} {required && "*"}
            </FormLabel>
            <div className="relative">
              <Select
                disabled={!allowEdit}
                onValueChange={(e) => {
                  if (keyValue == undefined) return;
                  const item = data.find((t) => t[keyValue] == e);
                  field.onChange(e);
                  if (onValueChange != undefined) {
                    onValueChange(item || null);
                  }
                }}
                value={field.value || ""}
                required={required}
              >
                <FormControl>
                  <SelectTrigger
                    className={cn(
                      !allowEdit &&
                        "disabled:opacity-100 disabled:cursor-default bg-secondary"
                    )}
                  >
                    <SelectValue placeholder={placeholder} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {data.map((option, idx) => (
                    <SelectItem
                      value={keyValue ? (option[keyValue] as string) : ""}
                      key={idx}
                    >
                      {keyName ? option[keyName]?.toString() || "" : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {field.value && (
                <>
                  {allowEdit && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-8 top-0 h-full px-2 py-0 hover:bg-transparent"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        field.onChange(null);
                        if (onValueChange) {
                          onValueChange(null);
                        }
                      }}
                    >
                      <X className="h-3 w-3 opacity-70 hover:opacity-100" />
                      <span className="sr-only">Clear selection</span>
                    </Button>
                  )}
                  {onDelete && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-2 py-0 hover:bg-transparent"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        const item = data.find(
                          (t) => keyValue && t[keyValue] == field.value
                        );
                        onDelete(item || null);
                        field.onChange(undefined);
                      }}
                    >
                      <Trash2 className="h-3 w-3 opacity-70 hover:opacity-100" />
                      <span className="sr-only">Delete item</span>
                    </Button>
                  )}
                </>
              )}
            </div>
            {description && <FormDescription>{description}</FormDescription>}
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
