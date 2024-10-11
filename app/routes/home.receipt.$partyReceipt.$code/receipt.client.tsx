import {
  useFetcher,
  useLoaderData,
  useOutletContext,
  useParams,
} from "@remix-run/react";
import { action, loader } from "./route";
import { GlobalState } from "~/types/app";
import { usePermission } from "~/util/hooks/useActions";
import ReceiptInfo from "./components/receipt-info";
import Typography, { subtitle } from "@/components/typography/Typography";
import { useTranslation } from "react-i18next";
import { DataTable } from "@/components/custom/table/CustomTable";
import { displayItemLineColumns } from "@/components/custom/table/columns/order/order-line-column";
import { DEFAULT_CURRENCY } from "~/constant";
import OrderSumary from "@/components/custom/display/order-sumary";
import { sumTotal } from "~/util/format/formatCurrency";
import { useToolbar } from "~/util/hooks/ui/useToolbar";
import { stateFromJSON } from "~/gen/common";
import { updateStateWithEventSchema } from "~/util/data/schemas/base/base-schema";
import { z } from "zod";
import { useToast } from "@/components/ui/use-toast";
import { useEffect } from "react";

export default function ReceiptDetailClient() {
  const { receiptDetail, actions } = useLoaderData<typeof loader>();
  const globalState = useOutletContext<GlobalState>();
  const { t, i18n } = useTranslation("common");
  const { toast } = useToast();
  const [permission] = usePermission({
    actions: actions,
    roleActions: globalState.roleActions,
  });
  const toolbar = useToolbar();
  const fetcher = useFetcher<typeof action>();
  const params = useParams();
  const setUpToolBar = () => {
    toolbar.setToolbar({
      title: `${t("_receipt.base")}(${receiptDetail?.receipt.code})`,
      status: stateFromJSON(receiptDetail?.receipt.status),
      onChangeState: (e) => {
        const body: z.infer<typeof updateStateWithEventSchema> = {
          current_state: receiptDetail?.receipt.status || "",
          party_type: params.partyReceipt || "",
          party_id: receiptDetail?.receipt.code || "",
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
    setUpToolBar();
  }, [receiptDetail]);

  return (
    <div>
      <ReceiptInfo receipt={receiptDetail?.receipt} />
      <div className=" col-span-full pt-3">
        <Typography fontSize={subtitle}>{t("items")}</Typography>
        <DataTable
          data={receiptDetail?.item_lines || []}
          columns={displayItemLineColumns({
            currency: receiptDetail?.receipt?.currency || DEFAULT_CURRENCY,
          })}
        />

        {receiptDetail && receiptDetail?.item_lines.length > 0 && (
          <OrderSumary
            orderTotal={sumTotal(
              receiptDetail?.item_lines.map((t) => t.rate * t.quantity)
            )}
            orderTax={100}
            i18n={i18n}
            currency={receiptDetail.receipt?.currency || DEFAULT_CURRENCY}
          />
        )}
      </div>
    </div>
  );
}
