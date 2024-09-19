import React from 'react'
import { Button, ButtonProps } from "@/components/ui/button"
import { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface IconButtonProps extends Omit<ButtonProps, 'size'> {
  icon: LucideIcon;
  size?: 'sm' | 'md' | 'lg';
  label: string;
}

export default function IconButton({
  icon: Icon,
  size = 'md',
  label,
  className,
  variant = 'ghost',
  ...props
}: IconButtonProps) {
  const sizeClasses = {
    sm: 'p-1',
    md: 'p-2',
    lg: 'p-3'
  }

  const iconSizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  }

  return (
    <Button
      type="button"
      variant={variant}
      className={cn(
        "rounded-full",
        sizeClasses[size],
        "hover:bg-primary/10 focus:bg-primary/10",
        "transition-colors duration-200",
        className
      )}
      {...props}
    >
      <Icon className={cn(iconSizeClasses[size], "text-primary")} aria-hidden="true" />
      <span className="sr-only">{label}</span>
    </Button>
  )
}