import {
  useFetcher,
  useNavigate,
  useOutletContext,
  useParams,
} from "@remix-run/react";
import { useTranslation } from "react-i18next";
import { orderDataSchema } from "~/util/data/schemas/buying/order-schema";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { route } from "~/util/route";
import { action } from "./route";
import { GlobalState } from "~/types/app-types";
import { useDisplayMessage } from "~/util/hooks/ui/useDisplayMessage";
import { setUpToolbar } from "~/util/hooks/ui/useSetUpToolbar";
import { useEffect, useRef } from "react";
import { useLineItems } from "@/components/custom/shared/item/use-line-items";
import { useTaxAndCharges } from "@/components/custom/shared/accounting/tax/use-tax-charges";
import { format, formatRFC3339 } from "date-fns";
import { useDocumentStore } from "@/components/custom/shared/document/use-document-store";
import { Card } from "@/components/ui/card";
import { OrderData } from "./order-data";

export default function CreatePurchaseOrdersClient() {
  const fetcher = useFetcher<typeof action>();
  const { roleActions, companyDefaults } = useOutletContext<GlobalState>();
  const params = useParams();
  const partyOrder = params.partyOrder || "";
  const { t, i18n } = useTranslation("common");
  const inputRef = useRef<HTMLInputElement | null>(null);
  const navigate = useNavigate();
  const r = route;
  const lineItemsStore = useLineItems();
  const taxLinesStore = useTaxAndCharges();
  const { payload } = useDocumentStore();

  const form = useForm<z.infer<typeof orderDataSchema>>({
    resolver: zodResolver(orderDataSchema),
    defaultValues: {
      currency: payload?.currency || companyDefaults?.currency,
      postingTime: format(new Date(), "HH:mm:ss"),
      postingDate: new Date(),
      tz: Intl.DateTimeFormat().resolvedOptions().timeZone,

      party:{
        id:payload?.partyID,
        name:payload?.partyName,
      },
      priceList:{
        id:payload?.priceListID,
        name:payload?.priceListName,
      },
      costCenter:{
        name:payload?.costCenterName,
        id:payload?.costCenterID,
      },
      project: {
        name:payload?.projectName,
        id:payload?.projectID,
      },

      lines: lineItemsStore.lines,
      taxLines: taxLinesStore.lines,
    },
  });
  const formValues = form.getValues();

  const onSubmit = (values: z.infer<typeof orderDataSchema>) => {
    fetcher.submit(
      {
        action: "create-order",
        orderData: values,
      } as any,
      {
        method: "POST",
        encType: "application/json",
      }
    );
  };

  setUpToolbar(() => {
    return {
      titleToolbar: t("f.add-new", { o: t("_order.base") }),
      onSave: () => {
        inputRef.current?.click();
      },
    };
  }, []);

  useDisplayMessage(
    {
      error: fetcher.data?.error,
      success: fetcher.data?.message,
      onSuccessMessage: () => {
        navigate(
          r.toRoute({
            main: partyOrder,
            routePrefix: [r.orderM],
            routeSufix: [fetcher.data?.order?.code || ""],
            q: {
              tab: "info",
            },
          })
        );
      },
    },
    [fetcher.data]
  );
  useEffect(() => {
    taxLinesStore.onLines(formValues.taxLines);
    taxLinesStore.updateFromItems(formValues.lines);
  }, [formValues.taxLines]);

  useEffect(() => {
    lineItemsStore.onLines(formValues.lines);
    taxLinesStore.updateFromItems(formValues.lines);
  }, [formValues.lines]);

  return (
    <div>
      <Card>
        <OrderData
        form={form}
        fetcher={fetcher}
        onSubmit={onSubmit}
        inputRef={inputRef}
        allowEdit={true}
        allowCreate={true}
        />
      </Card>
    </div>
  );
}
