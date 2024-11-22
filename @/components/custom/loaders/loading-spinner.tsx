import { cn } from "@/lib/utils"
import { Loader2 } from "lucide-react"

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 'md', className }) => {
    const sizeClasses = {
      sm: 'w-4 h-4',
      md: 'w-8 h-8',
      lg: 'w-12 h-12'
    }
  
    return (
      <div className={cn("flex items-center justify-center", className)} aria-live="polite" aria-busy="true">
        <Loader2 className={cn("animate-spin text-primary", sizeClasses[size])} />
        <span className="sr-only">Loading</span>
      </div>
    )
  }