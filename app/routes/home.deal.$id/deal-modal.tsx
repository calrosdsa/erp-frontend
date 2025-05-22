import { Button } from "@/components/ui/button";

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
import ModalLayout, {
  setUpModalPayload,
} from "@/components/ui/custom/modal-layout";
import { GlobalState } from "~/types/app-types";
import { LoadingSpinner } from "@/components/custom/loaders/loading-spinner";
import TabNavigation from "@/components/ui/custom/tab-navigation";
import { DEFAULT_ID, LOADING_MESSAGE } from "~/constant";
import { SerializeFrom } from "@remix-run/node";
import { toast } from "sonner";
import DealItemsTab from "./tab/deal-items";
import { useEntityPermission } from "~/util/hooks/useActions";
import { ButtonToolbar } from "~/types/actions";
import { Entity } from "~/types/enums";
import { party } from "~/util/party";
import { usePricingStore } from "../home.pricing.new/pricing-store";

export default function DealModal({ appContext }: { appContext: GlobalState }) {
  // const [open, setOpen] = useState(true);
  const key = route.deal;
  const [data, setData] = useState<SerializeFrom<typeof loader>>();
  const [loading, setLoading] = useState(false);
  const deal = data?.deal;
  const [searchParams, setSearchParams] = useSearchParams();
  const tab = searchParams.get("tab") || "info";
  const { t } = useTranslation("common");
  const fetcherStage = useFetcher<typeof action>();
  const { payload, editPayload } = useDealStore();
  const [open, setOpen] = useState(true);
  const stages = data?.stages;
  const id = searchParams.get(route.deal) || "";
  const [toastID, setToastID] = useState<string | number>("");
  const entityPermission = useEntityPermission({
    entities: data?.entityActions,
    roleActions: appContext.roleActions,
  });
  const pricingStore = usePricingStore()

  const dealTransition = (
    destinationStage: components["schemas"]["StageDto"]
  ) => {
    if (!deal?.id) return;
    const id = toast.loading(LOADING_MESSAGE);
    setToastID(id);
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

  const load = async () => {
    try {
      setLoading(true);
      const res = await fetch(route.toRouteDetail(route.deal, id));
      if (res.ok) {
        const body = (await res.json()) as SerializeFrom<typeof loader>;
        setData(body);
      }
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      load();
    }
  }, [id]);

  useDisplayMessage(
    {
      toastID: toastID,
      success: fetcherStage.data?.message,
      error: fetcherStage.data?.error,
      onSuccessMessage: () => {
        load();
      },
    },
    [fetcherStage.data]
  );

  useEffect(() => {
    if (!open) {
      searchParams.delete(route.deal);
      setSearchParams(searchParams, {
        preventScrollReset: true,
      });
    }
  }, [open]);

  setUpModalPayload(
    key,
    () => {
      let actions: ButtonToolbar[] = [];
      const isNew = DEFAULT_ID == id;
      const pricingPerm = entityPermission[Entity.PRICING];
      const quotationPerm = entityPermission[Entity.QUOTATION];
      const supplierQuotationPerm = entityPermission[Entity.SUPPLIER_QUOTATION];
      if (pricingPerm?.create) {
        actions.push({
          onClick: () => {
              pricingStore.onPayload({
                customer:{
                  id:deal?.customer_id,
                  name:deal?.customer
                }
              })
          },
          label: "Crear Pricing",
        });
      }
      if (quotationPerm?.create) {
        actions.push({
          onClick: () => {},
          label: t("f.add-new", { o: t(party.salesQuotation) }),
        });
      }
      if (supplierQuotationPerm?.create) {
        actions.push({
          onClick: () => {},
          label: t("f.add-new", { o: t(party.supplierQuotation) }),
        });
      }

      console.log("MOUNT DEAL...", deal);

      return {
        title: isNew ? "Nuevo trato" : deal?.name,
        enableEdit: isNew,
        actions: actions,
        isNew: isNew,
        onCancel: isNew
          ? () => {
              setOpen(false);
            }
          : undefined,
      };
    },
    [data]
  );

  return (
    <div>
      <ModalLayout
        keyPayload={key}
        open={open}
        onOpenChange={(e) => {
          setOpen(e);
        }}
      >
        <StagesHeader
          stages={stages || []}
          selectedStageID={deal?.stage_id || payload.stage?.id}
          transition={dealTransition}
        />
        {loading && !data ? (
          <LoadingSpinner />
        ) : (
          <>
            {data && (
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
                    children: (
                      <DealInfoTab
                        appContext={appContext}
                        data={data}
                        keyPayload={key}
                        load={load}
                      />
                    ),
                  },
                  {
                    label: "Productos",
                    value: "products",
                    children: (
                      <DealItemsTab
                        appContext={appContext}
                        data={data}
                        keyPayload={key}
                      />
                    ),
                  },
                ]}
              />
            )}
          </>
        )}
      </ModalLayout>
    </div>
  );
}
