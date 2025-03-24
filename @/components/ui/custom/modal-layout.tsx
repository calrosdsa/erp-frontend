import { XIcon } from "lucide-react";
import { ReactNode } from "react";
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle } from "../sheet";
import { Button } from "../button";

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
  onOpenChange: (e:boolean) => void;
  headerSection?: () => JSX.Element;
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        // onInteractOutside={(event) => event.preventDefault()}
        className="w-full  sm:max-w-full md:w-[80%] xl:w-[70%] overflow-auto  [&>button]:hidden px-0 pb-20"
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
                <SheetTitle>{title}</SheetTitle>
              </div>
              {headerSection && headerSection()}
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
