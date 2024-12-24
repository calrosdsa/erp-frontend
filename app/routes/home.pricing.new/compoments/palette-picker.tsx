"use client"

import React, { useState } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Check } from 'lucide-react'

interface PalettePickerProps {
  onColorSelect: (color: string) => void
}

const colors = [
  '#FF6900', '#FCB900', '#7BDCB5', '#00D084', '#8ED1FC', '#0693E3',
  '#ABB8C3', '#EB144C', '#F78DA7', '#9900EF', '#FFFFFF', '#000000'
]

export default function PalettePicker({ onColorSelect }: PalettePickerProps) {
  const [selectedColor, setSelectedColor] = useState<string | null>(null)
  const [isOpen, setIsOpen] = useState(false)

  const handleColorSelect = (color: string) => {
    setSelectedColor(color)
    onColorSelect(color)
    setIsOpen(false)
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-[200px] justify-start text-left font-normal"
        >
          <div className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: selectedColor || '#FFFFFF' }} />
          {selectedColor ? selectedColor : 'Pick a color'}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-3">
        <div className="grid grid-cols-4 gap-2">
          {colors.map((color) => (
            <button
              key={color}
              className="w-10 h-10 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-gray-500 relative"
              style={{ backgroundColor: color }}
              onClick={() => handleColorSelect(color)}
            >
              {selectedColor === color && (
                <Check className="absolute inset-0 m-auto text-white stroke-2" size={20} />
              )}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}