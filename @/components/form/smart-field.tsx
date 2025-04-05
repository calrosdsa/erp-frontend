"use client";

import { Button } from "@/components/ui/button";

import type React from "react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { useFormContext } from "./form-provider";

export type FieldType =
  | "text"
  | "email"
  | "password"
  | "number"
  | "textarea"
  | "checkbox"
  | "select"
  | "date"
  | "calendar";

export interface SelectOption {
  value: string;
  label: string;
}

interface SmartFieldProps {
  name: string;
  label: string;
  type?: FieldType;
  placeholder?: string;
  description?: string;
  options?: SelectOption[];
  className?: string;
  displayValueFormatter?: (value: any) => React.ReactNode;
}

export function SmartField({
  name,
  label,
  type = "text",
  placeholder,
  description,
  options = [],
  className,
  displayValueFormatter,
}: SmartFieldProps) {
  const { form, isEditing } = useFormContext();

  if (!form) {
    throw new Error("SmartField must be used within a SmartForm");
  }

  const renderDisplayValue = (value: any) => {
    if (displayValueFormatter) {
      return displayValueFormatter(value);
    }

    if (value === undefined || value === null || value === "") {
      return <span className="text-muted-foreground">No proporcionado</span>;
    }

    switch (type) {
      case "checkbox":
        return value ? "Yes" : "No";
      case "select":
        const option = options.find((opt) => opt.value === value);
        return option?.label || value;
      case "date":
      case "calendar":
        return value ? format(new Date(value), "PPP") : "";
      case "textarea":
        return <div className="whitespace-pre-wrap">{value}</div>;
      default:
        return value;
    }
  };

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn(className,"space-y-0")}>
          <FormLabel className="text-xs text-primary/60">{label}</FormLabel>

          {isEditing ? (
            <FormControl>
              <>
                {type === "textarea" && (
                  <Textarea
                    placeholder={placeholder}
                    {...field}
                    value={field.value || ""}
                  />
                )}

                {type === "checkbox" && (
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )}

                {type === "select" && (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder={placeholder} />
                    </SelectTrigger>
                    <SelectContent>
                      {options.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}

                {(type === "date" || type === "calendar") && (
                  <Popover modal={true}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value ? (
                          format(new Date(field.value), "PPP")
                        ) : (
                          <span>Seleciona una fecha</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={
                          field.value ? new Date(field.value) : undefined
                        }
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                )}

                {["text", "email", "password", "number"].includes(type) && (
                  <Input
                    type={type}
                    placeholder={placeholder}
                    {...field}
                    value={field.value || ""}
                  />
                )}
              </>
            </FormControl>
          ) : (
            <div className="text-sm">{renderDisplayValue(field.value)}</div>
          )}

          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
