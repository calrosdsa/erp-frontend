import { cn } from "@/lib/utils";
import { PlusIcon } from "lucide-react";
import React from "react";
import { Button } from "../button";

export interface FlexboxProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  onCreate?:()=>void
}

const ListLayout = React.forwardRef<HTMLDivElement, FlexboxProps>(
  ({ className,onCreate, ...props }, ref) => {
    return (
      <div className={cn(className)} ref={ref} {...props}>
        <div className="pt-2 pb-4 flex space-x-2">
          <span className="text-xl font-medium">{props.title}</span>
          {onCreate && 
          <Button variant={"outline"} size={"sm"} onClick={()=>onCreate()}>
            <span>Crear</span>
            <PlusIcon/>
          </Button>
        }
        </div>
        {props.children}
      </div>
    );
  }
);
ListLayout.displayName = "ListLayout";


export { ListLayout };

