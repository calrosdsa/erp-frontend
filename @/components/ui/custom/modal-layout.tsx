import { ChevronsUpDown, XIcon } from "lucide-react";
import { ReactNode } from "react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "../sheet";
import { Button } from "../button";
import { create } from "zustand";
import { ButtonToolbar } from "~/types/actions";
import { EventState, State } from "~/gen/common";
import { Popover, PopoverContent, PopoverTrigger } from "../popover";
import { useTranslation } from "react-i18next";
import { useConfirmationDialog } from "@/components/layout/drawer/ConfirmationDialog";
import { cn } from "@/lib/utils";
import { Badge } from "../badge";

export default function ModalLayout({
  children,
  open,
  onOpenChange,
  title,
  className,
  headerSection,
}: {
  children: ReactNode;
  className?: string;
  open: boolean;
  title: string;
  onOpenChange: (e: boolean) => void;
  headerSection?: () => JSX.Element;
}) {
  const { payload } = useModalStore();
  const { actions, status, view, viewTitle, buttons, onChangeState } = payload;
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
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        onInteractOutside={(event) => event.preventDefault()}
        // onInteractOutside={(event) => event.preventDefault()}
        className="w-full  sm:max-w-full md:w-[80%] xl:w-[75%] overflow-auto  [&>button]:hidden px-0 pb-20"
      >
        <div className="px-5">
          <SheetHeader>
            <div className="flex space-x-3 items-center justify-between">
              <div className="flex space-x-3 items-center">
                <SheetClose asChild className="  w-min ">
                  <Button size={"sm"} variant="outline">
                    <XIcon />
                  </Button>
                </SheetClose>
                <SheetTitle>{payload.titleToolbar || title}</SheetTitle>

                {(status && status != State.UNRECOGNIZED) &&(
                  <Badge variant={"outline"} className="">
                    {t(State[status])}
                  </Badge>
                )}
              </div>

              <div className=" flex space-x-3">
                {actions && actions.length > 0 && status != State.DRAFT && (
                  <Popover modal={true}>
                    <PopoverTrigger asChild>
                      <Button
                        size={"sm"}
                        variant={"outline"}
                        className=" flex space-x-1 h-8 rounded-lg px-3 bg-muted"
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
                            className="justify-between flex"
                            onClick={() => item.onClick()}
                          >
                            {item.label}
                            {item.Icon && (
                              <item.Icon className="h-3 w-3 ml-2" />
                            )}
                          </Button>
                        ))}
                      </div>
                    </PopoverContent>
                  </Popover>
                )}

                {view && view.length > 0 && status != State.DRAFT && (
                  <Popover modal={true}>
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
                    <PopoverContent>
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
                            {item.Icon && (
                              <item.Icon className="h-3 w-3 ml-2" />
                            )}
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
                        onClick={() =>
                          confirmStatusChange(EventState.SUBMIT_EVENT)
                        }
                        className={cn(
                          "flex space-x-1 h-8 rounded-lg px-3 justify-center "
                        )}
                        // loading={
                        //   toolbarState.loading && toolbarState.loadingType == "SUBMIT"
                        // }
                      >
                        {t("form.submit")}
                      </Button>
                    )}

                    {status != State.CANCELLED &&
                      status != State.DRAFT &&
                      onChangeState && (
                        <Button
                          size={"sm"}
                          onClick={() =>
                            confirmStatusChange(EventState.CANCEL_EVENT)
                          }
                          className={cn(
                            `flex space-x-1 h-8 rounded-lg px-3 justify-center `
                          )}
                          // loading={
                          //   toolbarState.loading &&
                          //   toolbarState.loadingType == "CANCEL"
                          // }
                          variant={"outline"}
                        >
                          {t("form.cancel")}
                        </Button>
                      )}
                  </>
                )}
              </div>
            </div>
            {/* <ResponsiveSidebar navItems={navItems} /> */}
          </SheetHeader>
          <div className="grid gap-4 py-1">
            {children}
            {/* {tab == "info" && <DealInfoTab />} */}
          </div>
        </div>
        {/* <div className="fixed  w-full right-0  md:max-w-full md:w-[80%] xl:w-[70%]  bottom-0 border-t shadow-xl bg-background">
        <div className="flex justify-center items-center space-x-2 h-16 ">
          <Button size={"lg"} variant={"outline"}>
            Cancelar
          </Button>
          <Button size={"lg"}>Guardar</Button>
        </div>
      </div> */}
      </SheetContent>
    </Sheet>
  );
}

interface Payload {
  actions?: ButtonToolbar[];
  buttons?: ButtonToolbar[];
  view?: ButtonToolbar[];
  viewTitle?: string;
  status?: State;
  titleToolbar?: string;
  onChangeState?: (event: EventState) => void;
}

interface ModalStore {
  payload: Partial<Payload>;
  setPayload: (opts: Partial<Payload>) => void;
}

export const useModalStore = create<ModalStore>((set) => ({
  payload: {},
  setPayload: (e) =>
    set((state) => ({
      payload: e,
    })),
}));
