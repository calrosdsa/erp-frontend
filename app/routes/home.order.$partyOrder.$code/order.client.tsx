import {
  Outlet,
  useFetcher,
  useLoaderData,
  useLocation,
  useMatches,
  useNavigate,
  useOutletContext,
  useParams,
  useRevalidator,
} from "@remix-run/react";
import { action, loader } from "./route";
import Typography, { subtitle } from "@/components/typography/Typography";
import { useTranslation } from "react-i18next";
import DisplayTextValue from "@/components/custom/display/DisplayTextValue";
import { DataTable } from "@/components/custom/table/CustomTable";
import {
  displayItemLineColumns,
  orderLineColumns,
} from "@/components/custom/table/columns/order/order-line-column";
import OrderSumary from "@/components/custom/display/order-sumary";
import { DEFAULT_CURRENCY } from "~/constant";
import { sumTotal } from "~/util/format/formatCurrency";
import { usePermission } from "~/util/hooks/useActions";
import { GlobalState, OrderGlobalState } from "~/types/app";
import {
  ItemLineType,
  itemLineTypeFromJSON,
  PartyType,
  partyTypeToJSON,
  State,
  stateFromJSON,
  stateToJSON,
} from "~/gen/common";
import { useEffect } from "react";
import { useToolbar } from "~/util/hooks/ui/useToolbar";
import { ActionToolbar } from "~/types/actions";
import { PlusIcon } from "lucide-react";
import { routes } from "~/util/route";
import { useCreatePurchaseInvoice } from "../home.invoice.$partyInvoice.create/use-purchase-invoice";
import { formatLongDate, formatMediumDate } from "~/util/format/formatDate";
import { z } from "zod";
import {
  lineItemSchema,
  mapToLineItem,
} from "~/util/data/schemas/stock/item-line-schema";
import { useCreateReceipt } from "../home.receipt.$partyReceipt.new/use-create-receipt";
import { useToast } from "@/components/ui/use-toast";
import { updateStateWithEventSchema } from "~/util/data/schemas/base/base-schema";
import { partyTypeFromJSON } from "common";
import HorizontalNavTabs from "@/components/layout/nav/horizontal-nav-tabs";
import DetailLayout from "@/components/layout/detail-layout";

export default function PurchaseOrderClient() {
  const { order, actions, associatedActions } = useLoaderData<typeof loader>();
  const fetcher = useFetcher<typeof action>()
  const {toast} = useToast()
  const globalState = useOutletContext<GlobalState>();
  const [purchaseOrderPermission] = usePermission({
    actions: actions,
    roleActions: globalState.roleActions,
  });
  const [purchaseInvoicePermission] = usePermission({
    actions:
      associatedActions &&
      associatedActions[PartyType[PartyType.purchaseInvoice]],
    roleActions: globalState.roleActions,
  });
  const [paymentPermission] = usePermission({
    actions:
      associatedActions && associatedActions[PartyType[PartyType.payment]],
    roleActions: globalState.roleActions,
  });
  const [receiptPermission] = usePermission({
    actions:
      associatedActions &&
      associatedActions[PartyType[PartyType.purchaseReceipt]],
    roleActions: globalState.roleActions,
  });
  const { t, i18n } = useTranslation("common");
  const toolbar = useToolbar();
  const createPurchaseInvoice = useCreatePurchaseInvoice();
  const createReceipt = useCreateReceipt();
  const r = routes;
  const navigate = useNavigate();
  const params = useParams()
  const location = useLocation();

  const tabNavItems = [
    {
      title: t("info"),
      href: r.toOrderDetailInfo(params.partyOrder || "",order?.code || ""),
    },
    {
      title: t("connections"),
      href: r.toOrderDetail(params.partyOrder || "",order?.code || "")+"/connections",
    },
  ];

  const getPartyType = (partyType:any)=>{
    switch(partyType){
      case partyTypeToJSON(PartyType.purchaseOrder):
        return partyTypeToJSON(PartyType.supplier)
    }
    return partyTypeToJSON(PartyType.UNRECOGNIZED)
  }

  const setUpToolBar = () => {
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
    if (purchaseInvoicePermission?.create ) {
      actions.push({
        label: t("f.purchase", { o: t("_invoice.base") }),
        onClick: () => {
          createPurchaseInvoice.setData({
            payload: {
              party_name: order?.party_name,
              party_uuid: order?.party_uuid,
              party_type: getPartyType(params.partyOrder),
              currency: order?.currency,
              referenceID: order?.id,
              lines:
                order?.order_lines.map((line) =>
                  mapToLineItem(line, ItemLineType.ITEM_LINE_INVOICE)
                ) || [],
            },
          });
          navigate(r.toPurchaseInvoiceCreate());
        },
        Icon: PlusIcon,
      });
    }
    if (receiptPermission?.create) {
      if (order?.status != stateToJSON(State.TO_BILL)) {
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
            navigate(r.toCreateReceipt(PartyType[PartyType.purchaseReceipt]));
          },
          Icon: PlusIcon,
        });
      }
    }
    toolbar.setToolbar({
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
    });
  };

  useEffect(() => {
    if (fetcher.state == "submitting") {
      toolbar.setLoading(true);
    } else {
      toolbar.setLoading(false);
    }
  }, [fetcher.state]);
  useEffect(() => {
    if (fetcher.data?.error) {
      toast({
        title: fetcher.data.error,
      });
    }
    if (fetcher.data?.message) {
      toast({
        title: fetcher.data.message,
      });
    }
  }, [fetcher.data]);

  useEffect(() => {
    console.log("TOOLBAR...")
    setUpToolBar();
  }, [purchaseInvoicePermission,location.pathname]);

  return (
    <DetailLayout
    navItems={tabNavItems}>
        <Outlet
          context={
            {
              order: order,
              globalState: globalState,
            } as OrderGlobalState
          }
        />
    </DetailLayout>
      
  );
}
