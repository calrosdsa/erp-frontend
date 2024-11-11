import {
  useFetcher,
  useLoaderData,
  useNavigate,
  useOutletContext,
  useParams,
  useSearchParams,
} from "@remix-run/react";
import { action, loader } from "./route";
import { useTranslation } from "react-i18next";
import { usePermission } from "~/util/hooks/useActions";
import { GlobalState, OrderGlobalState } from "~/types/app";
import {
  ItemLineType,
  PartyType,
  partyTypeFromJSON,
  partyTypeToJSON,
  stateFromJSON,
} from "~/gen/common";
import { useEffect } from "react";
import { useToolbar } from "~/util/hooks/ui/useToolbar";
import { ActionToolbar } from "~/types/actions";
import { PlusIcon } from "lucide-react";
import { routes } from "~/util/route";
import { formatLongDate, formatMediumDate } from "~/util/format/formatDate";
import { z } from "zod";
import {
  lineItemSchema,
  mapToLineItem,
} from "~/util/data/schemas/stock/item-line-schema";
import { useCreateReceipt } from "../home.receipt.$partyReceipt.new/use-create-receipt";
import { useToast } from "@/components/ui/use-toast";
import { updateStateWithEventSchema } from "~/util/data/schemas/base/base-schema";
import DetailLayout from "@/components/layout/detail-layout";
import OrderInfoTab from "./components/tab/order-info";
import OrderConnectionsTab from "./components/tab/order-connections";
import { setUpToolbar } from "~/util/hooks/ui/useSetUpToolbar";
import { useDisplayMessage } from "~/util/hooks/ui/useDisplayMessage";
import { useStatus } from "~/util/hooks/data/useStatus";
import { useCreatePurchaseInvoice } from "../home.invoice.$partyInvoice.new/use-purchase-invoice";

export default function PurchaseOrderClient() {
  const { order, actions, associatedActions, activities } =
    useLoaderData<typeof loader>();
  const fetcher = useFetcher<typeof action>();
  const globalState = useOutletContext<GlobalState>();
  const [searchParams] = useSearchParams();
  const tab = searchParams.get("tab");
  const [purchaseInvoicePermission] = usePermission({
    actions: associatedActions && associatedActions[PartyType.purchaseInvoice],
    roleActions: globalState.roleActions,
  });
  const [paymentPermission] = usePermission({
    actions: associatedActions && associatedActions[PartyType.payment],
    roleActions: globalState.roleActions,
  });
  const [receiptPermission] = usePermission({
    actions: associatedActions && associatedActions[PartyType.purchaseReceipt],
    roleActions: globalState.roleActions,
  });
  const [saleInvoicePermission] = usePermission({
    actions: associatedActions && associatedActions[PartyType.saleInvoice],
    roleActions:globalState.roleActions,
  })
  const { t, i18n } = useTranslation("common");
  const toolbar = useToolbar();
  const createPurchaseInvoice = useCreatePurchaseInvoice();
  const createReceipt = useCreateReceipt();
  const r = routes;
  const navigate = useNavigate();
  const params = useParams();
  const partyOrder = params.partyOrder || "";
  const { enabledOrder, toBill } = useStatus({
    status: stateFromJSON(order?.status),
  });

  const navItems = [
    {
      title: t("info"),
      href: r.toRoute({
        main: partyOrder,
        routePrefix: [r.orderM],
        routeSufix: [order?.code || ""],
        q: {
          tab: "info",
        },
      }),
    },
    {
      title: t("connections"),
      href: r.toRoute({
        main: partyOrder,
        routePrefix: [r.orderM],
        routeSufix: [order?.code || ""],
        q: {
          tab: "connections",
        },
      }),
    },
  ];

  const getPartyType = (partyType: string) => {
    switch (partyTypeFromJSON(partyType)) {
      case PartyType.purchaseOrder:
        return partyTypeToJSON(PartyType.supplier);
      case PartyType.saleOrder:
        return partyTypeToJSON(PartyType.customer);
    }
    return partyTypeToJSON(PartyType.UNRECOGNIZED);
  };
  const getInvoicePartyType = (partyOrder: string) => {
    switch (partyTypeFromJSON(partyOrder)) {
      case PartyType.purchaseOrder:
        return partyTypeToJSON(PartyType.purchaseInvoice);
      case PartyType.saleOrder:
        return partyTypeToJSON(PartyType.saleInvoice);
      default:
        return "";
    }
  };
  setUpToolbar(() => {
    const actions: ActionToolbar[] = [];

    if (paymentPermission?.create) {
      actions.push({
        label: t("_payment.base"),
        onClick: () => {
          navigate(r.toPaymentCreate());
        },
        Icon: PlusIcon,
      });
    }
    if (saleInvoicePermission?.create && enabledOrder) {
      actions.push({
        label: t("f.sale", { o: t("_invoice.base") }),
        onClick: () => {
          createPurchaseInvoice.setData({
            payload: {
              party_name: order?.party_name,
              party_uuid: order?.party_uuid,
              party_type: getPartyType(partyOrder),
              currency: order?.currency,
              referenceID: order?.id,
              lines:
                order?.order_lines.map((line) =>
                  mapToLineItem(line, ItemLineType.ITEM_LINE_INVOICE)
                ) || [],
            },
          });
          navigate(
            r.toRoute({
              main: getInvoicePartyType(partyOrder),
              routePrefix: [r.invoiceM],
              routeSufix: ["new"],
            })
          );
        },
        Icon: PlusIcon,
      });
    }
    if (purchaseInvoicePermission?.create && enabledOrder) {
      actions.push({
        label: t("f.purchase", { o: t("_invoice.base") }),
        onClick: () => {
          createPurchaseInvoice.setData({
            payload: {
              party_name: order?.party_name,
              party_uuid: order?.party_uuid,
              party_type: getPartyType(partyOrder),
              currency: order?.currency,
              referenceID: order?.id,
              lines:
                order?.order_lines.map((line) =>
                  mapToLineItem(line, ItemLineType.ITEM_LINE_INVOICE)
                ) || [],
            },
          });
          navigate(
            r.toRoute({
              main: getInvoicePartyType(partyOrder),
              routePrefix: [r.invoiceM],
              routeSufix: ["new"],
            })
          );
        },
        Icon: PlusIcon,
      });
    }
    if (receiptPermission?.create && enabledOrder && !toBill) {
      actions.push({
        label: t("f.purchase", { o: t("_receipt.base") }),
        onClick: () => {
          createReceipt.setData({
            payload: {
              party_name: order?.party_name,
              party_uuid: order?.party_uuid,
              party_type: PartyType[PartyType.supplier],
              currency: order?.currency,
              reference: order?.id,
              lines:
                order?.order_lines.map((line) =>
                  mapToLineItem(line, ItemLineType.ITEM_LINE_RECEIPT)
                ) || [],
            },
          });
          navigate(
            r.toRoute({
              main: partyTypeToJSON(PartyType.purchaseReceipt),
              routePrefix: [r.receiptM],
              routeSufix: ["new"],
            })
          );
        },
        Icon: PlusIcon,
      });
    }

    return {
      actions: actions,
      title: `${t("_order.base")}(${order?.code})`,
      status: stateFromJSON(order?.status),
      onChangeState: (e) => {
        const body: z.infer<typeof updateStateWithEventSchema> = {
          current_state: order?.status || "",
          party_type: params.partyOrder || "",
          party_id: order?.code || "",
          events: [e],
        };
        fetcher.submit(
          {
            action: "update-status-with-event",
            updateStatusWithEvent: body,
          },
          {
            method: "POST",
            encType: "application/json",
          }
        );
      },
    };
  }, [purchaseInvoicePermission, receiptPermission, order]);

  useEffect(() => {
    if (fetcher.state == "submitting") {
      toolbar.setLoading(true);
    } else {
      toolbar.setLoading(false);
    }
  }, [fetcher.state]);

  useDisplayMessage(
    {
      error: fetcher.data?.error,
      success: fetcher.data?.message,
    },
    [fetcher.data]
  );

  return (
    <DetailLayout
      partyID={order?.id}
      activities={activities}
      navItems={navItems}
    >
      {tab == "info" && <OrderInfoTab />}
      {tab == "connections" && <OrderConnectionsTab />}
    </DetailLayout>
  );
}
