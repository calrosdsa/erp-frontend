import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  useFetcher,
  useLoaderData,
  useNavigate,
  useSearchParams,
} from "@remix-run/react";
import { useEffect, useState } from "react";
import { loader } from "./route";
import StagesHeader from "../home.stage/components/stages-header";
import DealInfoTab from "./tab/deal-info";
import { route } from "~/util/route";
import { useTranslation } from "react-i18next";
import ResponsiveSidebar from "@/components/layout/nav/responsive-sidebar";
import { XIcon } from "lucide-react";
import { components } from "~/sdk";
import { useDealStore } from "./deal-store";

export default function NewDealClient() {
  // const [open, setOpen] = useState(true);
  const navigate = useNavigate();
  const { deal, stages } = useLoaderData<typeof loader>();
  const [searchParams] = useSearchParams();
  const tab = searchParams.get("tab") || "info";
  const { t } = useTranslation("common");
  const fetcherStage = useFetcher();
  const { payload, setPayload,editPayload } = useDealStore();

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

  const dealTransition = (
    destinationStage: components["schemas"]["StageDto"]
  ) => {
    if (!deal?.id) return;
    const body: components["schemas"]["DealTransitionData"] = {
      deal_id: deal?.id,
      destination_index: destinationStage.index,
      destination_stage_id: destinationStage.id,
      source_index: deal?.index,
      source_stage_id: 0,
    };
    fetcherStage.submit(
      {
        action: "deal-transition",
        dealTransition: body,
      },
      {
        method: "POST",
        encType: "application/json",
      }
    );
  };

  const navItems = [
    {
      title: t("info"),
      href: toRoute("info"),
    },
  ];

  

  useEffect(() => {
    if (!open) {
      navigate(
        route.toRoute({
          main: route.deal,
        })
      );
    }
  }, [open]);
  return (
    <div>
      <Sheet open={payload.open} onOpenChange={(e) => editPayload({open:e})}>
        <SheetContent
          onInteractOutside={(event) => event.preventDefault()}
          className="w-full md:max-w-full md:w-[80%] overflow-auto  [&>button]:hidden px-0 pb-20"
        >
          <div className="px-5">
            <SheetHeader>
              <SheetClose asChild className="  w-min ">
                <Button size={"sm"} variant="outline">
                  <XIcon />
                </Button>
              </SheetClose>
              <div className="flex justify-between">
                <SheetTitle>Nuevo trato</SheetTitle>
              </div>
              <StagesHeader
                stages={stages}
                selectedStageID={deal?.stage_id || payload.stage?.id}
                transition={(destinationID) => {}}
              />
              <ResponsiveSidebar navItems={navItems} />
            </SheetHeader>
            <div className="grid gap-4 py-4">
              {tab == "info" && <DealInfoTab />}
            </div>
          </div>
          {payload.isEditable && (
            <div className="fixed bottom-0 border-t md:max-w-full md:w-[80%] shadow-xl bg-background ">
              <div className="flex justify-center items-center space-x-2 h-20 ">
                <Button
                  onClick={payload.onCancel}
                  size={"lg"}
                  variant={"outline"}
                >
                  Cancelar
                </Button>
                <Button onClick={payload.onSave} size={"lg"}>
                  Guardar
                </Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
