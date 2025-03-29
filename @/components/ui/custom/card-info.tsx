import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { PencilIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "../button";

export interface DisplayProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  enableEdit?: boolean;
  isNew?:Boolean
  onEnableEdit?: (e:boolean) => void;
}

const CardInfo = React.forwardRef<HTMLDivElement, DisplayProps>(
  ({ className, ...props }, ref) => {
    return (
      <div className={cn(className, "card")} ref={ref} {...props}>
        <div className="flex justify-between border-b pb-1 items-center">
          <span className="font-medium text-sm">{props.title || ""}</span>
          {(props.enableEdit && !props.isNew) ?
          <Button variant={"ghost"} size={"sm"} onClick={()=>{
            props.onEnableEdit?.(false)
          }}>
            Cancelar
          </Button>
          :
          <Button
          variant={"ghost"}
          size={"sm"}
          onClick={() => {
              props.onEnableEdit?.(true);
            }}
            >
            <PencilIcon  className="w-4 h-4"/>
            <span className="">Editar</span>
          </Button>
        }
        </div>
        <div className="py-2">
        {props.children}
        </div>
      </div>
    );
  }
);

CardInfo.displayName = "CardInfo";

export { CardInfo };
