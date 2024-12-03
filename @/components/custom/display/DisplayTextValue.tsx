import { Typography } from "@/components/typography"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { Link } from "@remix-run/react"
import { Check, ChevronsUpDown, PencilIcon, XIcon } from 'lucide-react'
import { ChangeEvent, useState } from "react"
import { useTranslation } from "react-i18next"
import { z } from "zod"
import { makeZodI18nMap } from "zod-i18n-map"
import { ControllerRenderProps, FieldValues } from "react-hook-form"
import FormAutocomplete from "../select/FormAutocomplete"
import { FormControl, FormField, FormItem } from "@/components/ui/form"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import IconButton from "@/components/custom-ui/icon-button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"

interface DisplayTextValueProps <T extends object, K extends keyof T> {
  title: string
  value: string | undefined | boolean | null
  to?: string
  inputType?: "input" | "textarea" | "select"
  readOnly?: boolean
  onChange?: (value: string | boolean) => void
  isEditable?: boolean
  field?: ControllerRenderProps<FieldValues, string>
  selectOptions?:T[]
  selectNameKey?: K;
  onValueChange?: (e: string) => void
  className?:string
  onSelect?: (v: T) => void;
}

export default function   DisplayTextValue<T extends object, K extends keyof T>({
  title,
  value,
  to,
  readOnly = true,
  onChange,
  inputType,
  isEditable = false,
  field,
  selectOptions,
  selectNameKey,
  onValueChange,
  onSelect,
  className
}: DisplayTextValueProps<T, K>) {
  const { t } = useTranslation("common")
  z.setErrorMap(makeZodI18nMap({ t }))

  const [isEditing, setIsEditing] = useState(false)

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (onChange) {
      onChange(e.target.value)
    }
    if (field) {
      field.onChange(e)
    }
  }

  const handleCheckboxChange = (checked: boolean) => {
    if (onChange) {
      onChange(checked)
    }
    if (field) {
      field.onChange(checked)
    }
  }

  const toggleEdit = () => {
    if (isEditable) {
      setIsEditing(!isEditing)
    }
  }

  const renderValue = () => {
    if (to !== undefined) {
      return (
        <Link to={to} className="underline h-8 px-2 items-center flex">
          <Typography variant="body2">{value}</Typography>
        </Link>
      )
    }

    if (typeof value === "boolean") {
      return (
        <div className="h-8 w-7 flex justify-center items-center">
          <Checkbox
            checked={value}
            className="h-6 w-6"
            disabled={readOnly}
            onCheckedChange={handleCheckboxChange}
          />
        </div>
      )
    }

    if (typeof value === "string" || value === undefined || inputType != undefined) {
      const commonProps = {
        readOnly: readOnly && !isEditing,
        onChange: handleInputChange,
        className: cn(
          `focus-visible:ring-0 focus-visible:border-none border-none ring-0 
          ring-offset-0focus-visible:ring-offset-0`,
          readOnly && !isEditing ? "bg-accent" : ""
        ),
        value: readOnly && !isEditing ? value || "-" : value || "",
        ...field,
      }

      if (inputType === "input") {
        return <Input {...commonProps} className={cn(commonProps.className, "h-8")} />
      }

      if (inputType === "textarea") {
        return <Textarea {...commonProps} rows={3} />
      }

      if (inputType === "select" && selectOptions && selectNameKey && field) {
        return (
          <FormField
          name={field?.name || ""}
          render={({ field }) => (
            <FormItem className="flex flex-col w-full ">
              <Popover modal={true}>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="background"
                      role="combobox"
                      size={"sm"}
                      onClick={() => onValueChange ? onValueChange(""):()=>{}}
                      className={cn(
                        "justify-between",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value || "Select item"}
                      {field.value ? (
                  <>
                    <IconButton
                      icon={XIcon}
                      size="sm"
                      className="ml-2 h-6 w-6 shrink-0 opacity-50 "
                      onClick={(e) => {
                        e.stopPropagation();
                        field.onChange("");
                      }}
                    />
                  </>
                ) : (
                  <ChevronsUpDown className="ml-2 h w-4 shrink-0 opacity-50" />
                )}
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent >
                  <Command>
                    <CommandInput
                      placeholder="Buscar..."
                      onValueChange={(e) => {
                        onValueChange ? onValueChange(e):()=>{}
                      }}
                    />
                    <CommandList>
                      <CommandEmpty>No se encontraron resultados.</CommandEmpty>
                      <CommandGroup>
                        {selectOptions.map((item, idx) =>
                            <CommandItem
                              value={(item[selectNameKey] as string) || ""}
                              key={idx}
                              onSelect={() => {
                                console.log("NAME",name)
                                console.log("NAME value",item[selectNameKey])
                                field.onChange(item[selectNameKey]);
                                if(onSelect){
                                  onSelect(item);
                                }
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  item[selectNameKey] === field.value
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              {item[selectNameKey]?.toString() || ""}
                            </CommandItem>
                        )}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                
                </PopoverContent>
              </Popover>
            </FormItem>
          )}
        />
        )
      }
    }

    return <Typography variant="body2" className="h-8 px-2 flex justify-center items-center">{value || "-"}</Typography>
  }

  return (
    <div className={cn(className,"flex flex-col space-y-1")}>
      <Typography variant="label" className="text-xs">{title}</Typography>
      <div className="bg-accent rounded-md p-[3px] shadow-sm flex justify-between items-center ">
        {renderValue()}
        {isEditable && (
          <Button variant="ghost" size="icon" className="h-6 w-6 ml-2" onClick={toggleEdit}>
            <PencilIcon size={14} />
          </Button>
        )}
      </div>
    </div>
  )
}