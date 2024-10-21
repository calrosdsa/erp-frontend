import MessageAlert from "@/components/custom-ui/message-alert";
import { Icons } from "@/components/icons";
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
import { ChevronsUpDown, PlusCircle, PlusIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { EventState, State, stateToJSON } from "~/gen/common";
import { useToolbar } from "~/util/hooks/ui/useToolbar";

export default function ToolBar({ title }: { title: string }) {
  const toolbarState = useToolbar();
  const { t } = useTranslation("common");
  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1 mb-1 flex-wrap justify-between">
        <div className="flex flex-wrap space-x-2 ">
          <Typography fontSize={22}>
            {toolbarState.title != undefined ? toolbarState.title : title}
          </Typography>
          {toolbarState.status && (
            <Badge variant={"outline"} className="">
              {State[toolbarState.status]}
            </Badge>
          )}
        </div>

        <div className=" flex space-x-3">
          {toolbarState.actions.length > 0 &&
            toolbarState?.status != State.DRAFT && (
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
                        className="flex space-x-2 justify-between"
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

          {toolbarState.status && (
            <>
              {toolbarState.status == State.DRAFT &&
                toolbarState.onChangeState && (
                  <Button
                    size={"sm"}
                    onClick={() =>
                      toolbarState.onChangeState &&
                      toolbarState.onChangeState(EventState.SUBMIT_EVENT)
                    }
                    className=" flex space-x-1 h-8 rounded-lg px-3 w-20 justify-center"
                    disabled={toolbarState.loading}
                  >
                    {toolbarState.loading ? (
                      <Icons.spinner className="h-5 w-5 animate-spin" />
                    ) : (
                      t("form.submit")
                    )}
                  </Button>
                )}

              {toolbarState.status != State.CANCELLED &&
                toolbarState.status != State.DRAFT &&
                toolbarState.onChangeState && (
                  <Button
                    size={"sm"}
                    onClick={() =>
                      toolbarState.onChangeState &&
                      toolbarState.onChangeState(EventState.CANCEL_EVENT)
                    }
                    className=" flex space-x-1 h-8 rounded-lg px-3 w-20 justify-center"
                    disabled={toolbarState.loading}
                    variant={"outline"}
                  >
                    {toolbarState.loading ? (
                      <Icons.spinner className="h-5 w-5 animate-spin" />
                    ) : (
                      t("form.cancel")
                    )}
                  </Button>
                )}
            </>
          )}
          {toolbarState.onSave && (
            <Button
              size={"sm"}
              onClick={() => {
                if (toolbarState.onSave) {
                  toolbarState.onSave();
                } else {
                  alert("NO ON SAVE");
                }
              }}
              className=" flex space-x-1 h-8 rounded-lg px-3 w-20 justify-center"
              disabled={toolbarState.disabledSave || toolbarState.loading}
              variant={"outline"}
            >
              {toolbarState.loading ? (
                <Icons.spinner className="h-5 w-5 animate-spin" />
              ) : (
                t("form.save")
              )}
            </Button>
          )}

          {toolbarState.addNew && (
            <Button
              size={"sm"}
              onClick={() => {
                if (toolbarState.addNew) {
                  toolbarState.addNew();
                } 
              }}
              className=" flex space-x-1 h-8 rounded-lg px-3 w-20 justify-center"
              // disabled={toolbarState.loading}
              // variant={"outline"}
            >
              <PlusIcon/>
              {toolbarState.loading ? (
                <Icons.spinner className="h-5 w-5 animate-spin" />
              ) : (
                t("form.addNew")
              )}
            </Button>
          )}
        </div>
        {toolbarState.status == State.DRAFT && (
          <MessageAlert message="Submit to confirm" />
        )}
      </div>
    </div>
  );
}
