import React from "react";
import MessageAlert from "@/components/custom-ui/message-alert";
import { Icons } from "@/components/icons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ChevronsUpDown, PlusIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { EventState, State } from "~/gen/common";
import { useToolbar } from "~/util/hooks/ui/useToolbar";
import { Typography } from "@/components/typography";
import { cn } from "@/lib/utils";
import { useConfirmationDialog } from "../drawer/ConfirmationDialog";

export default function ToolBar({ title }: { title: string }) {
  const toolbarState = useToolbar();
  const {
    actions,
    status,
    titleToolbar,
    view,
    viewTitle,
    buttons,
    disabledSave,
    onChangeState,
    onSave,
    addNew,
  } = toolbarState.payload;
  const { t } = useTranslation("common");
  const { onOpenDialog } = useConfirmationDialog();
  const confirmStatusChange = (event: EventState) => {
    onOpenDialog({
      title: "Por favor, confirme antes de continuar con la acción requerida.",
      onConfirm: () => {
        if (onChangeState) {
          onChangeState(event);
        }
      },
    });
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1 mb-1 flex-wrap justify-between">
        <div className="flex flex-wrap space-x-2 ">
          <Typography variant="title2">
            {titleToolbar != undefined ? titleToolbar : title}
          </Typography>
          {status && (
            <Badge variant={"outline"} className="">
              {t(State[status])}
            </Badge>
          )}
        </div>

        <div className=" flex space-x-3">
          {actions && actions.length > 0 && status != State.DRAFT && (
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  size={"sm"}
                  variant={"outline"}
                  className=" flex space-x-1 h-8 rounded-lg px-3"
                >
                  <span>{t("actions.base")}</span>
                  <ChevronsUpDown className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-56">
                <div className="flex flex-col space-y-1">
                  {actions?.map((item, idx) => (
                    <Button
                      key={idx}
                      size={"sm"}
                      variant="ghost"
                      className="justify-between flex "
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

          {view && view.length > 0 && status != State.DRAFT && (
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  size={"sm"}
                  variant={"outline"}
                  className=" flex space-x-1 h-8 rounded-lg px-3"
                >
                  <span>{viewTitle ? viewTitle : t("actions.view")}</span>
                  <ChevronsUpDown className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent >
                <div className="flex flex-col space-y-1">
                  {view.map((item, idx) => (
                    <Button
                      key={idx}
                      variant="ghost"
                      className="justify-start"
                      onClick={() => item.onClick()}
                    >
                      <span className=" whitespace-normal">
                      {item.label}
                      </span>
                      {item.Icon && <item.Icon className="h-3 w-3 ml-2" />}
                    </Button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          )}

          {buttons?.map((item, idx) => (
            <Button
              key={idx}
              onClick={item.onClick}
              className=" flex space-x-1 h-8"
              variant={"outline"}
              size={"sm"}
            >
              {item.Icon && <item.Icon className="p-1" />}
              <span>{item.label}</span>
            </Button>
          ))}

          {status && (
            <>
              {status == State.DRAFT && onChangeState && (
                <Button
                  size={"sm"}
                  onClick={() => confirmStatusChange(EventState.SUBMIT_EVENT)}
                  className={cn(
                    "flex space-x-1 h-8 rounded-lg px-3 justify-center ",
                    (disabledSave || toolbarState.loading) &&
                      "disabled:opacity-50"
                  )}
                  loading={
                    toolbarState.loading && toolbarState.loadingType == "STATE"
                  }
                  disabled={toolbarState.loading}
                >
                  {t("form.submit")}
                </Button>
              )}

              {status != State.CANCELLED &&
                status != State.DRAFT &&
                onChangeState && (
                  <Button
                    size={"sm"}
                    onClick={() => confirmStatusChange(EventState.CANCEL_EVENT)}
                    className={cn(
                      "flex space-x-1 h-8 rounded-lg px-3 justify-center ",
                      (disabledSave || toolbarState.loading) &&
                        "disabled:opacity-50"
                    )}
                    loading={
                      toolbarState.loading &&
                      toolbarState.loadingType == "STATE"
                    }
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

          {onSave && (
            <Button
              size={"sm"}
              onClick={() => {
                if (onSave) {
                  onSave();
                } else {
                  alert("NO ON SAVE");
                }
              }}
              className={cn(
                "flex space-x-1 h-8 rounded-lg px-3 justify-center ",
                (disabledSave || toolbarState.loading) && "disabled:opacity-50"
              )}
              loading={
                toolbarState.loading && toolbarState.loadingType == "SAVE"
              }
              disabled={disabledSave || toolbarState.loading}
              variant={"outline"}
            >
              {toolbarState.loading ? (
                <Icons.spinner className="h-5 w-5 animate-spin" />
              ) : (
                t("form.save")
              )}
            </Button>
          )}

          {addNew && (
            <Button
              size={"xs"}
              onClick={() => {
                if (addNew) {
                  addNew();
                }
              }}
              variant={"secondary"}
              className=" flex space-x-1  rounded-lg px-3  justify-center"
            >
              <PlusIcon />
              {toolbarState.loading ? (
                <Icons.spinner className="h-5 w-5 animate-spin" />
              ) : (
                t("form.addNew")
              )}
            </Button>
          )}
        </div>
        {status == State.DRAFT && <MessageAlert message="Submit to confirm" />}
      </div>
    </div>
  );
}
