import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetOverlay,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  useFetcher,
  useLoaderData,
  useNavigate,
  useOutletContext,
  useSearchParams,
} from "@remix-run/react";
import { useEffect, useRef, useState } from "react";
import { action, loader } from "./route";
import StagesHeader from "../home.stage/components/stages-header";
import DealInfoTab from "./tab/deal-info";
import { route } from "~/util/route";
import { useTranslation } from "react-i18next";
import ResponsiveSidebar from "@/components/layout/nav/responsive-sidebar";
import { Separator } from "@/components/ui/separator";
import { XIcon } from "lucide-react";

export default function NewDealClient() {
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();
  const { deal, stages } = useLoaderData<typeof loader>();
  const [searchParams] = useSearchParams();
  const tab = searchParams.get("tab") || "info";
  const { t } = useTranslation("common");

  const toRoute = (tab: string) => {
    return route.toRoute({
      main: route.deal,
      routeSufix: [""],
      q: {
        tab: tab,
        id: deal?.uuid || "",
      },
    });
  };

  const navItems = [
    {
      title: t("info"),
      href: toRoute("info"),
    },
  ];

  useEffect(() => {
    if (!open) {
      navigate(-1);
    }
  }, [open]);
  return (
    <div>
       <Sheet open={open} onOpenChange={(e) => setOpen(e)} >
        <SheetContent 
        onInteractOutside={event => event.preventDefault()}
        className="md:max-w-full md:w-[80%] overflow-auto [&>button]:hidden">
          <SheetHeader>
              <SheetClose  asChild className="  w-min ">
                <Button size={"sm"} variant="outline">
                <XIcon/>
                </Button>
              </SheetClose>
            <div className="flex justify-between">
            <SheetTitle>Nuevo trato</SheetTitle>
            </div>
            <StagesHeader
            stages={stages}
            selectedStageID={deal?.stage_id}
            />
            <ResponsiveSidebar
            navItems={navItems}
            />
          </SheetHeader>
          <div className="grid gap-4 py-4">
            {tab == "info" && <DealInfoTab />}
          </div>
          </SheetContent>
      </Sheet>
    </div>
  );
}
