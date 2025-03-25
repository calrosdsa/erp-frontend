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
import { useDisplayMessage } from "~/util/hooks/ui/useDisplayMessage";
import { action } from "../home.stage/route";
import { TimePicker } from "@/components/custom/datetime/time-picker";
import ModalLayout from "@/components/ui/custom/modal-layout";
import { GlobalState } from "~/types/app-types";
import { LoadingSpinner } from "@/components/custom/loaders/loading-spinner";
import TabNavigation from "@/components/ui/custom/tab-navigation";

export default function DealModal({ appContext }: { appContext: GlobalState }) {
  // const [open, setOpen] = useState(true);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const tab = searchParams.get("tab") || "info";
  const { t } = useTranslation("common");
  const fetcherStage = useFetcher<typeof action>();
  const { payload, setPayload, editPayload } = useDealStore();
  const [open, setOpen] = useState(true);
  const fetcher = useFetcher<typeof loader>({
    key: "deal-modal",
  });
  const deal = fetcher.data?.deal;
  const stages = fetcher.data?.stages;
  const id = searchParams.get(route.deal) || "";
  const toRoute = (tab: string) => {
    return route.toRoute({
      q: {
        [route.deal]: id,
        tab: tab,
      },
    });
  };

  const dealTransition = (
    destinationStage: components["schemas"]["StageDto"]
  ) => {
    if (!deal?.id) return;
    const body: components["schemas"]["EntityTransitionData"] = {
      id: deal?.id,
      destination_index: destinationStage.index,
      destination_stage_id: destinationStage.id,
      source_index: deal?.index,
      source_stage_id: deal.stage_id,
      source_name: deal.stage,
      destination_name: destinationStage.name,
    };
    fetcherStage.submit(
      {
        action: "deal-transition",
        dealTransition: body,
      },
      {
        method: "POST",
        encType: "application/json",
        action: route.toRoute({
          main: route.deal,
        }),
      }
    );
  };

  const initData = () => {
    fetcher.submit(
      {},
      {
        action: route.toRoute({
          main: route.deal,
          routeSufix: [id],
        }),
      }
    );
  };

  useDisplayMessage(
    {
      success: fetcherStage.data?.message,
      error: fetcherStage.data?.error,
    },
    [fetcherStage.data]
  );

  const navItems = [
    {
      title: t("info"),
      href: toRoute("info"),
    },
  ];

  useEffect(() => {
    initData();
    editPayload({
      open: true,
    });
  }, []);

  useEffect(() => {
    if (!open) {
      searchParams.delete(route.deal);
      setSearchParams(searchParams, {
        preventScrollReset: true,
      });
    }
  }, [open]);

  return (
    <div>
      <ModalLayout
        open={open}
        onOpenChange={(e) => {
          setOpen(e);
        }}
        title={id == "0" ? "Nuevo trato" : deal?.name || ""}
      >
        <StagesHeader
          stages={stages || []}
          selectedStageID={deal?.stage_id || payload.stage?.id}
          transition={dealTransition}
        />

        {/* <ResponsiveSidebar navItems={navItems} /> */}
        {fetcher.state == "loading" ? (
          <LoadingSpinner />
        ) : (
          <>
            <TabNavigation
              defaultValue={tab}
              onValueChange={(value) => {
                searchParams.set("tab", value);
                setSearchParams(searchParams, {
                  preventScrollReset: true,
                });
              }}
              items={[
                {
                  label: "Info",
                  value: "info",
                  children: <DealInfoTab appContext={appContext} />,
                },
              ]}
            />

            {payload.enableEdit && (
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
          </>
        )}
      </ModalLayout>
    </div>
  );
}
