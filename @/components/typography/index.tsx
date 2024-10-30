import React from 'react'
import { cn } from "@/lib/utils"

type VariantType = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'title1' | 'subtitle1' | 'subtitle2' | 'body1' | 'body2' | 'button' | 'caption' | 'overline'
type ColorType = 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error'
type AlignType = 'left' | 'center' | 'right' | 'justify'

interface TypographyProps {
  variant?: VariantType
  color?: ColorType
  align?: AlignType
  className?: string
  children: React.ReactNode
  as?: React.ElementType
}

const variantClasses: Record<VariantType, string> = {
  h1: 'text-4xl font-bold',
  h2: 'text-3xl font-bold',
  h3: 'text-2xl font-bold',
  h4: 'text-xl font-bold',
  h5: 'text-lg font-bold',
  h6: 'text-base font-bold',
  title1: 'text-xl font-medium',
  subtitle1: 'text-lg font-medium',
  subtitle2: 'text-base font-medium',
  body1: 'text-base',
  body2: 'text-sm',
  button: 'text-sm font-medium uppercase',
  caption: 'text-xs font-medium',
  overline: 'text-xs uppercase tracking-wider',
}

const colorClasses: Record<ColorType, string> = {
  default: 'text-foreground',
  primary: 'text-primary',
  secondary: 'text-secondary',
  success: 'text-green-600 dark:text-green-400',
  warning: 'text-yellow-600 dark:text-yellow-400',
  error: 'text-red-600 dark:text-red-400',
}

const alignClasses: Record<AlignType, string> = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
  justify: 'text-justify',
}

const variantElementMap: Record<VariantType, keyof JSX.IntrinsicElements> = {
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  h5: 'h5',
  h6: 'h6',
  title1: 'h6',
  subtitle1: 'h6',
  subtitle2: 'h6',
  body1: 'p',
  body2: 'p',
  button: 'span',
  caption: 'span',
  overline: 'span',
}

export function Typography({
  variant = 'body1',
  color = 'default',
  align = 'left',
  className,
  children,
  as,
}: TypographyProps) {
  const Component = as || variantElementMap[variant]

  return (
    <Component
      className={cn(
        variantClasses[variant],
        colorClasses[color],
        alignClasses[align],
        className
      )}
    >
      {children}
    </Component>
  )
}