import {
  useFetcher,
  useNavigate,
  useOutletContext,
  useParams,
} from "@remix-run/react";
import { useTranslation } from "react-i18next";
import { orderDataSchema } from "~/util/data/schemas/buying/order-schema";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import FormAutocomplete from "@/components/custom/select/FormAutocomplete";
import { CurrencyAutocompleteForm, useCurrencyDebounceFetcher } from "~/util/hooks/fetchers/useCurrencyDebounceFetcher";
import CustomFormDate from "@/components/custom/form/CustomFormDate";
import { routes } from "~/util/route";
import FormLayout from "@/components/custom/form/FormLayout";
import { action } from "./route";
import { GlobalState } from "~/types/app";
import {
  ItemLineType,
  itemLineTypeToJSON,
} from "~/gen/common";
import { useDisplayMessage } from "~/util/hooks/ui/useDisplayMessage";
import { setUpToolbar } from "~/util/hooks/ui/useSetUpToolbar";
import { useEffect, useRef } from "react";
import AccordationLayout from "@/components/layout/accordation-layout";
import { TaxBreakup } from "@/components/custom/shared/accounting/tax/tax-breakup";
import TaxAndChargesLines from "@/components/custom/shared/accounting/tax/tax-and-charge-lines";
import GrandTotal from "@/components/custom/shared/item/grand-total";
import { useLineItems } from "@/components/custom/shared/item/use-line-items";
import { useTaxAndCharges } from "@/components/custom/shared/accounting/tax/use-tax-charges";
import LineItems from "@/components/custom/shared/item/line-items";
import { CustomFormTime } from "@/components/custom/form/CustomFormTime";
import PartyAutocomplete from "./components/party-autocomplete";
import { format, formatRFC3339 } from "date-fns";
import { useDocumentStore } from "@/components/custom/shared/document/use-document-store";
import CurrencyAndPriceList from "@/components/custom/shared/document/currency-and-price-list";
import AccountingDimensionForm from "@/components/custom/shared/accounting/accounting-dimension-form";
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
  const r = routes;
  const lineItemsStore = useLineItems();
  const taxLinesStore = useTaxAndCharges();
  const { payload } = useDocumentStore();

  const form = useForm<z.infer<typeof orderDataSchema>>({
    resolver: zodResolver(orderDataSchema),
    defaultValues: {
      currency: companyDefaults?.currency,
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
        />
      </Card>
    </div>
  );
}
