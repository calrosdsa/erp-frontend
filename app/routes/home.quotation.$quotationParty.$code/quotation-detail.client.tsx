import {
  useFetcher,
  useLoaderData,
  useNavigate,
  useOutletContext,
  useParams,
  useSearchParams,
} from "@remix-run/react";
import { action, loader } from "./route";
import { GlobalState } from "~/types/app-types";
import QuotationInfoTab from "./components/tab/quotation-info";
import { useTranslation } from "react-i18next";
import { useToolbar } from "~/util/hooks/ui/use-toolbar";
import { stateFromJSON } from "~/gen/common";
import { updateStatusWithEventSchema } from "~/util/data/schemas/base/base-schema";
import { z } from "zod";
import { useEffect } from "react";
import DetailLayout from "@/components/layout/detail-layout";
import { useDisplayMessage } from "~/util/hooks/ui/useDisplayMessage";
import {
  setUpToolbar,
  setUpToolbarDetailPage,
  setUpToolbarRegister,
  useLoadingTypeToolbar,
} from "~/util/hooks/ui/useSetUpToolbar";
import { route } from "~/util/route";
import QuotationConnections from "./components/tab/quotation-connections";
import { format } from "date-fns";
import { ButtonToolbar } from "~/types/actions";
import { usePermission } from "~/util/hooks/useActions";
import { Entity } from "~/types/enums";
import { useStatus } from "~/util/hooks/data/useStatus";
import { OrderSchema } from "~/util/data/schemas/buying/order-schema";
import { toLineItemSchema } from "~/util/data/schemas/stock/line-item-schema";
import { toTaxAndChargeLineSchema } from "~/util/data/schemas/accounting/tax-and-charge-schema";
import { party } from "~/util/party";

export default function QuotationDetailClient() {
  const { quotation, actions, activities, assocActions, lineItems, taxLines } =
    useLoaderData<typeof loader>();
  const { roleActions } = useOutletContext<GlobalState>();
  const [poPermission] = usePermission({
    actions: assocActions && assocActions[Entity.PURCHASE_ORDER],
    roleActions,
  });
  const [soPermission] = usePermission({
    actions: assocActions && assocActions[Entity.SALE_ORDER],
    roleActions,
  });
  const [qPermission] = usePermission({
    actions: assocActions && assocActions[Entity.QUOTATION],
    roleActions,
  });
  const { t, i18n } = useTranslation("common");

  const [searchParams] = useSearchParams();
  const tab = searchParams.get("tab");
  const fetcher = useFetcher<typeof action>();
  const params = useParams();
  const quotationParty = params.quotationParty || "";
  const navigate = useNavigate();
  const r = route;
  const { allowActions } = useStatus({
    status: stateFromJSON(quotation?.status),
  });
  const toRoute = (tab: string) => {
    return r.toRoute({
      main: r.supplierQuotation,
      routePrefix: [r.quotation],
      routeSufix: [quotation?.code || ""],
      q: {
        tab: tab,
      },
    });
  };

  const navItems = [
    {
      title: t("info"),
      href: toRoute("info"),
    },
    {
      title: t("connections"),
      href: toRoute("connections"),
    },
  ];

  const toCreateOrder = (p: string) => {
    // const payload: Partial<OrderSchema> = {
    //   party: {
    //     id: quotation?.party_id,
    //     name: quotation?.party_name,
    //   },
    //   currency: quotation?.currency,
    //   project: {
    //     id: quotation?.project_id,
    //     name: quotation?.project,
    //   },
    //   costCenter: {
    //     id: quotation?.cost_center_id,
    //     name: quotation?.cost_center,
    //   },
    //   priceList: {
    //     id: quotation?.price_list_id,
    //     name: quotation?.price_list,
    //   },
    //   lines: lineItems?.map((t) => toLineItemSchema(t)),
    //   taxLines: taxLines?.map((t) => toTaxAndChargeLineSchema(t)),
    // };
    navigate(route.toRouteDetail(route.order, `${p}/new`));
  };

  setUpToolbarRegister(() => {
    let actions: ButtonToolbar[] = [];
    if (poPermission?.create && allowActions) {
      actions.push({
        label: "Crear Orden de Compra",
        onClick: () => {
          toCreateOrder(party.purchaseOrder);
        },
      });
    }
    if (soPermission?.create && allowActions) {
      actions.push({
        label: "Crear Orden de Venta",
        onClick: () => {
          toCreateOrder(party.saleOrder);
        },
      });
    }
    if (qPermission?.create && allowActions) {
      actions.push({
        label: "Crear  Cotización",
        onClick: () => {
          navigate(
            r.toRoute({
              main: r.salesQuotation,
              routePrefix: [r.quotation],
              routeSufix: ["new"],
            })
          );
        },
      });
    }
    return {
      // ...opts,
      titleToolbar: `${t(quotationParty)}(${quotation?.code})`,
      status: stateFromJSON(quotation?.status),
      actions: actions,
      onChangeState: (e) => {
        const body: z.infer<typeof updateStatusWithEventSchema> = {
          current_state: quotation?.status || "",
          party_type: quotationParty || "",
          party_id: quotation?.code || "",
          events: [e],
        };
        fetcher.submit(
          {
            action: "update-state-with-event",
            updateStateWithEvent: body,
          },
          {
            method: "POST",
            encType: "application/json",
          }
        );
      },
    };
  }, [quotation, poPermission, soPermission, qPermission]);

  useLoadingTypeToolbar(
    {
      loading: fetcher.state == "submitting",
      loadingType: "STATE",
    },
    [fetcher.state]
  );

  useDisplayMessage(
    {
      error: fetcher.data?.error,
      success: fetcher.data?.message,
    },
    [fetcher.data]
  );

  // useEffect(() => {
  //   setUpToolBar();
  // }, [quotation]);

  return (
    <DetailLayout
      activities={activities}
      partyID={quotation?.id}
      navItems={navItems}
      fullWidth={true}
      entityID={Entity.QUOTATION}
      partyName={quotation?.code}
    >
      {tab == "info" && <QuotationInfoTab />}
      {tab == "connections" && <QuotationConnections />}
    </DetailLayout>
  );
}
