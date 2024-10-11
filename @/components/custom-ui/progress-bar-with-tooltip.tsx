import React, { useState } from 'react'
import { Progress } from "@/components/ui/progress"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface Props {
  current?: number;
  total?: number;
}

export default function ProgressBarWithTooltip({ current = 0, total = 100 }: Props) {
  const [isTooltipOpen, setIsTooltipOpen] = useState(false)
  const safeTotal = total > 0 ? total : 100
  const safeCurrent = Math.max(0, Math.min(current, safeTotal))
  const percentage = (safeCurrent / safeTotal) * 100

  return (
    <div className="w-full">
      <TooltipProvider>
        <Tooltip open={isTooltipOpen}>
          <TooltipTrigger asChild>
            <div
              className="w-full cursor-pointer"
              onMouseEnter={() => setIsTooltipOpen(true)}
              onMouseLeave={() => setIsTooltipOpen(false)}
              onClick={() => setIsTooltipOpen(!isTooltipOpen)}
            >
              <Progress 
                value={percentage} 
                className="w-full h-4"
              />
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>{percentage.toFixed(1)}%</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      {/* <div className="flex justify-between mt-2 text-sm text-gray-600">
        <span>{safeCurrent.toLocaleString()}</span>
        <span>{safeTotal.toLocaleString()}</span>
      </div> */}
    </div>
  )
}