
import React, { useState, useEffect } from 'react'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { ControllerRenderProps, FieldValues } from 'react-hook-form'

interface AmountInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  currency?: string
  onAmountChange?: (amount: number) => void
  className?: string
  field: ControllerRenderProps<FieldValues, string>
  initialAmount?:string | number
}

export default function AmountInput({
  currency = "USD",
  initialAmount,
  onAmountChange,
  field,
  className,
  ...props
}: AmountInputProps) {
  // const [inputValue, setInputValue] = useState("")
  // const [formattedValue, setFormattedValue] = useState("")

  // const formatAmount = (value: string) => {
  //   const numericValue = value.replace(/[^0-9.]/g, "")
  //   const parts = numericValue.split(".")
  //   parts[0] = parts[0]!.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  //   return parts.join(".")
  // }

  // const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const value = e.target.value
  //   setInputValue(value)
  //   const numericValue = parseFloat(value.replace(/[^0-9.]/g, ""))
  //   if (!isNaN(numericValue)) {
  //     onAmountChange?.(numericValue)
  //   }
  // }

  // useEffect(() => {
  //   setFormattedValue(formatAmount(inputValue))
  // }, [inputValue])  
  return (

    <div className="relative">
        <Input
        //   type="text"
          {...field}
          inputMode="decimal"
          // value={formattedValue}
          // onChange={handleInputChange}
          placeholder={`${currency} 0.00`}
          {...props}
          />
          </div>
  )
}