import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import * as LucideIcons from "lucide-react";
import { cn } from "@/lib/utils";


export interface DisplayProps
  extends React.HTMLAttributes<HTMLDivElement> {
    label:string
    value?:string | null  
}

const DisplayValue = React.forwardRef<HTMLDivElement, DisplayProps>(
  ({ className, ...props }, ref) => {

    return (
      <div
        className={cn(className,"flex flex-col")}
        ref={ref}
        {...props}
      >
        <span className="text-xs text-primary/60">{props.label}</span>
        <span className="text-sm">{props.value || "-"}</span>
      </div>
    );
  }
);

DisplayValue.displayName = "DisplayValue";

export {DisplayValue}