import { cn } from "@/lib/utils";
import { PlusIcon, SettingsIcon } from "lucide-react";
import React from "react";
import { Button } from "../button";
import { ButtonToolbar } from "~/types/actions";
import { Popover, PopoverContent, PopoverTrigger } from "../popover";

export interface FlexboxProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  onCreate?: () => void;
  actions?: ButtonToolbar[];
}

const ListLayout = React.forwardRef<HTMLDivElement, FlexboxProps>(
  ({ className, onCreate, actions, ...props }, ref) => {
    return (
      <div className={cn(className)} ref={ref} {...props}>
        <div className="flex justify-between">
          <div className="pt-2 pb-4 flex space-x-2">
            <span className="text-xl font-medium">{props.title}</span>
            {onCreate && (
              <Button
                variant={"outline"}
                size={"sm"}
                onClick={() => onCreate()}
              >
                <span>Crear</span>
                <PlusIcon />
              </Button>
            )}
          </div>

          {(actions && actions.length > 0) && (
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  size={"sm"}
                  variant={"outline"}
                  className=" flex space-x-1 h-8 rounded-lg px-3 bg-muted"
                >
                  <SettingsIcon className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-56">
                <div className="flex flex-col space-y-1">
                  {actions?.map((item, idx) => (
                    <Button
                      key={idx}
                      size={"sm"}
                      variant="ghost"
                      className="justify-between flex"
                      onClick={() => item.onClick()}
                    >
                      {item.label}
                      {item.Icon && <item.Icon className="h-3 w-3 ml-2" />}
                    </Button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          )}
          
        </div>
        {props.children}
      </div>
    );
  }
);
ListLayout.displayName = "ListLayout";

export { ListLayout };
