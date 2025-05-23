import { route } from "~/util/route";
import { loader } from "./route";
import { SerializeFrom } from "@remix-run/node";
import { useEffect, useState } from "react";
import { GlobalState } from "~/types/app-types";
import { useFetcher, useNavigate, useSearchParams } from "@remix-run/react";
import { useTranslation } from "react-i18next";
import { action } from "../home.stage/route";
import { useDealStore } from "./deal-store";
import { useEntityPermission } from "~/util/hooks/useActions";
import { useQuotationStore } from "../home.quotation.$quotationParty.new/quotation-store";
import { components } from "~/sdk";
import { toast } from "sonner";
import { DEFAULT_ID, LOADING_MESSAGE } from "~/constant";
import { useDisplayMessage } from "~/util/hooks/ui/useDisplayMessage";
import { setUpModalPayload } from "@/components/ui/custom/modal-layout";
import { ButtonToolbar } from "~/types/actions";
import { Entity } from "~/types/enums";
import { party } from "~/util/party";
import { QuotationSchema } from "~/util/data/schemas/quotation/quotation-schema";
import { mapToItemPriceLine } from "~/util/data/schemas/stock/item-schemas";
import { toLineItemSchema } from "~/util/data/schemas/stock/line-item-schema";

export const DealViewModel = ({ appContext }: { appContext: GlobalState }) => {
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
  const quotationStore = useQuotationStore();
  const navigate = useNavigate();

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

  const toCreateQuotation = (p: string) => {
    let quotationPayload: Partial<QuotationSchema> = {
      currency: deal?.currency,
    };
    if (p == party.salesQuotation && deal?.customer_id) {
      quotationPayload.party = {
        id: deal?.customer_id,
        name: deal?.customer || "",
      };
    }
    quotationPayload.lines = data?.lineItems.map((t) => toLineItemSchema(t));
    quotationStore.onPayload(quotationPayload);
    navigate(route.toRouteDetail(route.quotation, `${p}/new`));
  };

  setUpModalPayload(
    key,
    () => {
      let actions: ButtonToolbar[] = [];
      const isNew = DEFAULT_ID == id;
      const quotationPerm = entityPermission[Entity.QUOTATION];
      const supplierQuotationPerm = entityPermission[Entity.SUPPLIER_QUOTATION];

      if (quotationPerm?.create) {
        actions.push({
          onClick: () => toCreateQuotation(party.salesQuotation),
          label: t("f.add-new", { o: t(party.salesQuotation) }),
        });
      }
      if (supplierQuotationPerm?.create) {
        actions.push({
          onClick: () => toCreateQuotation(party.supplierQuotation),
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
  return {
    key,
    data,
    setOpen,
    stages,
    deal,
    loading,
    load,
    open,
    dealTransition,
    payload,
    tab,
    searchParams,
    setSearchParams,
  };
};
