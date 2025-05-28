import { ChevronsUpDownIcon, Loader2, XIcon } from "lucide-react";
import { DependencyList, ReactNode, useEffect, useState } from "react";
import { create } from "zustand";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ButtonToolbar } from "~/types/actions";
import { EventState, State } from "~/gen/common";
import { useTranslation } from "react-i18next";
import { Popover, PopoverContent, PopoverTrigger } from "../popover";
import { useConfirmationDialog } from "@/components/layout/drawer/ConfirmationDialog";
import { cn } from "@/lib/utils";
import { Badge } from "../badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../dropdown-menu";
import { useTimeout } from "usehooks-ts";

export default function ModalLayout({
  keyPayload,
  children,
  open,
  onOpenChange,
  title,
  className,
}: {
  children: ReactNode;
  className?: string;
  open: boolean;
  keyPayload: string;
  title?: string;
  onOpenChange?: (e: boolean) => void;
  headerSection?: () => JSX.Element;
}) {
  const { editPayload } = useModalStore();
  const payload = useModalStore((state) => state.payload[keyPayload]) || {};
  const { t } = useTranslation("common");
  const { onOpenDialog } = useConfirmationDialog();
  const confirmStatusChange = (event: EventState) => {
    onOpenDialog({
      title: "Por favor, confirme antes de continuar con la acción requerida.",
      onConfirm: () => {
        if (payload.onChangeState) {
          payload.onChangeState(event);
        }
      },
    });
  };
  return (
    <Sheet open={open} onOpenChange={(e) => onOpenChange?.(e)} modal={true}>
      <SheetContent
        onInteractOutside={(event) => event.preventDefault()}
        className={cn(
          "w-full md:max-w-full md:w-[80%] xl:w-[80%] overflow-auto  [&>button]:hidden px-0 pb-20 ",
          className
        )}
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
                <SheetTitle className=" flex space-x-2 items-center">
                  <span>{title || payload.title}</span>
                  {payload.status && payload.status != State.UNRECOGNIZED && (
                    <Badge variant={"outline"} className="">
                      {t(State[payload.status])}
                    </Badge>
                  )}
                </SheetTitle>
              </div>

              <div className=" flex space-x-3">
                {payload.actions &&
                  payload.actions.length > 0 &&
                  payload.status != State.DRAFT && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          size={"sm"}
                          variant={"outline"}
                          className="flex space-x-1 h-8 rounded-lg px-3 bg-muted"
                        >
                          <span>{t("actions.base")}</span>
                          <ChevronsUpDownIcon className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-56">
                        {payload.actions?.map((item, idx) => (
                          <DropdownMenuItem
                            key={idx}
                            className="flex justify-between"
                            onClick={(e) => {
                              // e.preventDefault();
                              onOpenDialog({
                                title:
                                  "Por favor, confirme antes de continuar con la acción requerida.",
                                onConfirm: () => {
                                  item.onClick();
                                },
                              });
                            }}
                          >
                            {item.label}
                            {item.Icon && (
                              <item.Icon className="h-3 w-3 ml-2" />
                            )}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}

                {payload.view &&
                  payload.view.length > 0 &&
                  payload.status != State.DRAFT && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          size={"sm"}
                          variant={"outline"}
                          className=" flex space-x-1 h-8 rounded-lg px-3"
                        >
                          <span>
                            {payload.viewTitle
                              ? payload.viewTitle
                              : t("actions.view")}
                          </span>
                          <ChevronsUpDownIcon className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <div className="flex flex-col space-y-1">
                          {payload.view.map((item, idx) => (
                            <DropdownMenuItem
                              key={idx}
                              
                              className="flex justify-between hover:bg-muted cursor-pointer"
                              onClick={(e) => {
                                item.onClick();
                                // e.preventDefault();
                                // useTimeout(()=>{
                                // },100)
                              }}
                            >
                              {item.label}
                              {item.Icon && (
                                <item.Icon className="h-3 w-3 ml-2" />
                              )}
                            </DropdownMenuItem>
                            // <Button
                            //   key={idx}
                            //   variant="ghost"
                            //   className="justify-start"
                            //   onClick={() => {
                            //     useTimeout(()=>{
                            //       item.onClick()
                            //     },100)
                            //   }}
                            // >
                            //   <span className=" whitespace-normal">
                            //     {item.label}
                            //   </span>
                            //   {item.Icon && (
                            //     <item.Icon className="h-3 w-3 ml-2" />
                            //   )}
                            // </Button>
                          ))}
                        </div>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}

                {payload.buttons?.map((item, idx) => (
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

                {payload.status && (
                  <>
                    {payload.status == State.DRAFT && payload.onChangeState && (
                      <Button
                        size={"sm"}
                        onClick={() =>
                          confirmStatusChange(EventState.SUBMIT_EVENT)
                        }
                        className={cn(
                          "flex space-x-1 h-8 rounded-lg px-3 justify-center ",
                          payload.disabledSave && "disabled:opacity-50"
                        )}
                        // loading={
                        //   toolbarState.loading && toolbarState.loadingType == "SUBMIT"
                        // }
                      >
                        {t("form.submit")}
                      </Button>
                    )}

                    {payload.status != State.CANCELLED &&
                      payload.status != State.DRAFT &&
                      payload.onChangeState && (
                        <Button
                          size={"sm"}
                          onClick={() =>
                            confirmStatusChange(EventState.CANCEL_EVENT)
                          }
                          className={cn(
                            `flex space-x-1 h-8 rounded-lg px-3 justify-center `,
                            payload.disabledSave && "disabled:opacity-50"
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
                    {payload.status == State.CANCELLED &&
                      payload.onChangeState && (
                        <Button
                          size={"sm"}
                          onClick={() =>
                            confirmStatusChange(EventState.DELETED_EVENT)
                          }
                          className={cn(
                            `flex space-x-1 h-8 rounded-lg px-3 justify-center `,
                            payload.disabledSave && "disabled:opacity-50"
                          )}
                          // loading={
                          //   toolbarState.loading &&
                          //   toolbarState.loadingType == "CANCEL"
                          // }
                          variant={"outline"}
                        >
                          Eliminar
                        </Button>
                      )}
                  </>
                )}

                {/* {payload.onSave && !payload.disabledSave && (
                  <Button
                    size={"sm"}
                    onClick={() => {
                      if (payload.onSave) {
                        payload.onSave();
                      } else {
                        alert("NO ON SAVE");
                      }
                    }}
                    className={cn(
                      "flex space-x-1 h-8 rounded-lg px-3 justify-center ",
                      payload.disabledSave && "disabled:opacity-50"
                    )}
                    // loading={
                    //   toolbarState.loading && toolbarState.loadingType == "SAVE"
                    // }
                    // disabled={disabledSave}
                    variant={"outline"}
                  >
                    {t("form.save")}
                  </Button>
                )} */}
              </div>
            </div>
            {/* <ResponsiveSidebar navItems={navItems} /> */}
          </SheetHeader>
          <div className="grid gap-4 py-1 ">
            {children}
            {/* {tab == "info" && <DealInfoTab />} */}
          </div>
        </div>

        {/* {(payload.enableEdit || payload.isNew) && ( */}
        {payload.enableEdit && (
          <div
            className={cn(
              "fixed  w-full right-0  md:max-w-full md:w-[80%] xl:w-[80%]  bottom-0 border-t shadow-xl bg-background",
              className
            )}
          >
            <div className="flex justify-center items-center space-x-2 h-16 ">
              <Button
                size={"lg"}
                type="button"
                variant={"outline"}
                onClick={() => {
                  payload.onCancel?.();
                  editPayload(keyPayload, {
                    enableEdit: false,
                  });
                }}
              >
                Cancelar
              </Button>
              <Button
                type="button"
                size={"lg"}
                onClick={() => {
                  console.log("SAVE BUTTON CLICKED", payload.onSave);
                  payload.onSave?.();
                }}
              >
                {payload.loading && <Loader2 className="animate-spin" />}
                Guardar
              </Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

export type PayloadModal = {
  actions?: ButtonToolbar[];
  buttons?: ButtonToolbar[];
  enableEdit: boolean;
  isNew: boolean;
  title: string;
  loading: boolean;
  onSave: () => void;
  onCancel: () => void;
  loadData: () => void;
  disabledSave?: boolean;
  onChangeState?: (event: EventState) => void;
  view?: ButtonToolbar[];
  viewTitle?: string;
  status?: State;
};

interface ModalStore {
  payload: Record<string, Partial<PayloadModal>>;
  getState: (key: string) => Partial<PayloadModal>;
  setPayload: (key: string, e: Partial<PayloadModal>) => void;
  resetPayload: (key: string) => void;
  editPayload: (key: string, e: Partial<PayloadModal>) => void;
}

export const useModalStore = create<ModalStore>((set, get) => ({
  payload: {},
  getState: (key) => {
    return get().payload[key] || {};
  },
  setPayload: (key, payload) =>
    set((state) => ({
      payload: {
        ...state.payload,
        [key]: { ...state.payload[key], ...payload },
      },
    })),
  resetPayload: (key) =>
    set((state) => ({
      payload: key
        ? Object.fromEntries(
            Object.entries(state.payload).filter(([k]) => k !== key)
          )
        : {},
    })),
  editPayload: (key, payload) =>
    set((state) => ({
      payload: {
        ...state.payload,
        [key]: {
          ...state.payload[key],
          ...payload,
        },
      },
    })),
}));

export const setUpModalPayload = (
  key: string,
  opts: () => Partial<PayloadModal>,
  dependencies: DependencyList = []
) => {
  const { editPayload, setPayload, resetPayload } = useModalStore();
  useEffect(() => {
    const newOpts = opts();

    // Merge new options with register options
    editPayload(key, {
      ...newOpts,
    });

    return () => {
      console.log("RESET TOOLBAR REGISTER...");
      // resetPayload(key);
    };
  }, [...dependencies]);

  // Return the store actions for external use if needed
};

export const setUpModalTabPage = (
  key: string,
  opts: () => Partial<PayloadModal>,
  dependencies: DependencyList = []
) => {
  const { editPayload } = useModalStore();

  useEffect(() => {
    editPayload(key, opts());
  }, [...dependencies]); // Include key/opts in deps [[10]]
};
