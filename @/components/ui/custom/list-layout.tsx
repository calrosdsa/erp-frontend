import { cn } from "@/lib/utils";
import { ArrowDownWideNarrow, ArrowUpWideNarrow, PlusIcon, SettingsIcon } from "lucide-react";
import React from "react";
import { Button } from "../button";
import { ButtonToolbar } from "~/types/actions";
import { Popover, PopoverContent, PopoverTrigger } from "../popover";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../dropdown-menu";
import { useSearchParams } from "@remix-run/react";
import { DEFAULT_ORDER } from "~/constant";

export interface FlexboxProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  onCreate?: () => void;
  actions?: ButtonToolbar[];
  orderOptions?: SelectItem[];
}

const ListLayout = React.forwardRef<HTMLDivElement, FlexboxProps>(
  ({ className, onCreate, actions,orderOptions = [], ...props }, ref) => {
    const [searchParams, setSearchParams] = useSearchParams();
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

          <div className="flex space-x-2 items-center">

          
          {orderOptions.length > 0 && (
            <DropdownMenu>
              <div className="flex items-center">
                <Button
                  variant="outline"
                  className="rounded-r-none"
                  size="sm"
                  onClick={() => {
                    const order = searchParams.get("orientation");
                    // if (orderOptions.length > 0 && orderOptions[0]) {
                    //   searchParams.set("column", orderOptions[0].value);
                    //   searchParams.set("columnName", orderOptions[0].name);
                    // }
                    searchParams.set(
                      "orientation",
                      order === DEFAULT_ORDER ? "asc" : DEFAULT_ORDER
                    );
                    setSearchParams(searchParams, { preventScrollReset: true });
                  }}
                >
                  {searchParams.get("orientation") === DEFAULT_ORDER ? (
                    <ArrowDownWideNarrow size={13} />
                  ) : (
                    <ArrowUpWideNarrow size={13} />
                  )}
                </Button>
                <DropdownMenuTrigger>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-l-none"
                  >
                    {searchParams.get("columnName") ||
                      orderOptions[0]?.name ||
                      ""}
                  </Button>
                </DropdownMenuTrigger>
              </div>
              <DropdownMenuContent>
                {orderOptions.map((item, idx) => (
                  <DropdownMenuItem
                    key={idx}
                    onClick={() => {
                      searchParams.set("column", item.value);
                      searchParams.set("columnName", item.name);
                      setSearchParams(searchParams, {
                        preventScrollReset: true,
                      });
                    }}
                  >
                    {item.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}


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
          
        </div>
        {props.children}
      </div>
    );
  }
);
ListLayout.displayName = "ListLayout";

export { ListLayout };
