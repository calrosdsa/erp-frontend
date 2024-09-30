import Typography from "@/components/typography/Typography";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronsUpDown } from "lucide-react";
import { useTranslation } from "react-i18next";
import { State } from "~/gen/common";
import { useToolbar } from "~/util/hooks/ui/useToolbar";

export default function ToolBar({ title }: { title: string }) {
  const toolbarState = useToolbar();
  const { t } = useTranslation("common");
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1 mb-1 flex-wrap justify-between">
      <div className="flex flex-wrap space-x-2">
        <Typography fontSize={22}>
          {toolbarState.title ? toolbarState.title : title}
        </Typography>
        {toolbarState.state && (
          <Badge variant={"outline"} className="">
            {State[toolbarState.state]}
          </Badge>
        )}
      </div>

      <div className="">
        {toolbarState.actions.length > 0 && (
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button
                size={"sm"}
                className=" flex space-x-1 h-8 rounded-lg px-3"
              >
                <span>{t("actions.base")}</span>
                <ChevronsUpDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {/* <DropdownMenuLabel>{}</DropdownMenuLabel>
            <DropdownMenuSeparator /> */}

              {toolbarState.actions.map((item, idx) => {
                return (
                  <DropdownMenuItem
                    key={idx}
                    onClick={() => item.onClick()}
                    className="flex space-x-2"
                  >
                    <span>{item.label}</span>
                    {item.Icon && <item.Icon className="h-3 w-3" />}
                  </DropdownMenuItem>
                );
              })}
              {/* <DropdownMenuItem>Billing</DropdownMenuItem>
            <DropdownMenuSeparator />

            <DropdownMenuItem>Team</DropdownMenuItem>
            <DropdownMenuItem>Subscription</DropdownMenuItem> */}
            </DropdownMenuContent>
          </DropdownMenu>
        )}

      {(toolbarState.state && toolbarState.state == State.DRAFT) &&
      <Button 
       size={"sm"}
        className=" flex space-x-1 h-8 rounded-lg px-3"
      >
        {t("form.submit")}
      </Button>
      }
      </div>
    </div>
  );
}
