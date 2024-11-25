import * as React from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

interface CustomCheckboxProps extends React.ComponentPropsWithoutRef<typeof Checkbox> {
    label?: string
    labelClassName?: string
    containerClassName?: string
  }
  
  const CustomCheckbox = React.forwardRef<
    React.ElementRef<typeof Checkbox>,
    CustomCheckboxProps
  >(({ label, labelClassName, containerClassName, id, className, ...props }, ref) => {
    const checkboxId = id || React.useId()
  
    return (
      <div className={cn("flex items-center space-x-2", containerClassName)}>
        <Checkbox
          id={checkboxId}
          ref={ref}
          className={className}
          {...props}
        />
        {label && (
          <Label
            htmlFor={checkboxId}
            className={cn(
              "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
              labelClassName
            )}
          >
            {label}
          </Label>
        )}
      </div>
    )
  })
  CustomCheckbox.displayName = "CustomCheckbox"
  
  export { CustomCheckbox }