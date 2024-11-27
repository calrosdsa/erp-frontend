import React, { useState } from 'react'
import { Button, ButtonProps } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { InfoIcon } from "lucide-react"

interface ExtendedButtonTooltipProps extends ButtonProps {
  enableTooltip?: boolean;
  tooltipContent?: React.ReactNode;
}

export default function ConditionalTooltip({ 
  enableTooltip = true, 
  tooltipContent,
  children,
  ...buttonProps
}: ExtendedButtonTooltipProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (enableTooltip) {
      setIsOpen(!isOpen)  
    }
    buttonProps.onClick?.(event)
  }

  const buttonContent = (
    <Button 
      {...buttonProps}
      onClick={handleClick}
    >
      {children || 'Info'} {!children && <InfoIcon className="h-4 w-4 ml-2" />}
    </Button>
  )

  if (!enableTooltip) {
    return buttonContent
  }

  return (
    <TooltipProvider>
      <Tooltip open={isOpen} onOpenChange={setIsOpen}>
        <TooltipTrigger asChild>
          {buttonContent}
        </TooltipTrigger>
        <TooltipContent 
          className="max-w-xs bg-primary text-primary-foreground p-4 rounded-lg shadow-lg"
          sideOffset={5}
        >
          {tooltipContent || (
            <>
              <h3 className="font-semibold mb-2">Important Information</h3>
              <p className="text-sm">This is a custom tooltip with a nice UI message. It appears on both hover and click!</p>
            </>
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}