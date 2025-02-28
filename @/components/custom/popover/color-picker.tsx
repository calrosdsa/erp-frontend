"use client";

import { ReactNode, useState } from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface ColorPickerProps {
  onChange?: (color: string) => void;
  defaultColor?: string;
  children?: ReactNode;
}

export default function ColorPicker({
  onChange,
  children,
  defaultColor,
}: ColorPickerProps) {
  const [selectedColor, setSelectedColor] = useState(defaultColor || "#2563eb");

  const colors = [
    "#dc2626", // red
    "#ea580c", // orange
    "#d97706", // amber
    "#65a30d", // lime
    "#16a34a", // green
    "#0891b2", // cyan
    "#2563eb", // blue
    "#4f46e5", // indigo
    "#9333ea", // purple
    "#c026d3", // fuchsia
    "#db2777", // pink
    "#475569", // slate
  ];

  const handleColorChange = (color: string) => {
    setSelectedColor(color);
    onChange?.(color);
  };

  return (
    <Popover modal={true}>
      <PopoverTrigger asChild>
        {children ? 
        children
        :
        <div className="h-5 w-5 rounded-md cursor-pointer" style={{
          backgroundColor:selectedColor
        }}/>
        }
        </PopoverTrigger>
      <PopoverContent className="w-64">
        <div className="grid grid-cols-4 gap-2">
          {colors.map((color) => (
            <button
              key={color}
              className="h-8 w-8 rounded-full border relative cursor-pointer flex items-center justify-center"
              style={{ backgroundColor: color }}
              onClick={() => handleColorChange(color)}
            >
              {selectedColor === color && (
                <Check className="h-4 w-4 text-white" />
              )}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
