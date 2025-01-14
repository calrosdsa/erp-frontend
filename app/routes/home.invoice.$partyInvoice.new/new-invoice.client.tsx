import {
  useFetcher,
  useNavigate,
  useOutletContext,
  useParams,
} from "@remix-run/react";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import CustomFormDate from "@/components/custom/form/CustomFormDate";
import { useEffect, useRef } from "react";
import { route } from "~/util/route";
import FormLayout from "@/components/custom/form/FormLayout";
import { GlobalState } from "~/types/app";
import { action } from "./route";
import { invoiceDataSchema } from "~/util/data/schemas/invoice/invoice-schema";
import { useCreatePurchaseInvoice } from "./use-purchase-invoice";
import { ItemLineType, itemLineTypeToJSON } from "~/gen/common";
import { useToolbar } from "~/util/hooks/ui/useToolbar";
import { useDisplayMessage } from "~/util/hooks/ui/useDisplayMessage";
import PartyAutocomplete from "../home.order.$partyOrder.new/components/party-autocomplete";
import { useLineItems } from "@/components/custom/shared/item/use-line-items";
import { useTaxAndCharges } from "@/components/custom/shared/accounting/tax/use-tax-charges";
import { format } from "date-fns";
import LineItems from "@/components/custom/shared/item/line-items";
import TaxAndChargesLines from "@/components/custom/shared/accounting/tax/tax-and-charge-lines";
import GrandTotal from "@/components/custom/shared/item/grand-total";
import { TaxBreakup } from "@/components/custom/shared/accounting/tax/tax-breakup";
import { CustomFormTime } from "@/components/custom/form/CustomFormTime";
import { useDocumentStore } from "@/components/custom/shared/document/use-document-store";
import AccountingDimensionForm from "@/components/custom/shared/accounting/accounting-dimension-form";
import UpdateStock from "@/components/custom/shared/document/update-stock";
import CurrencyAndPriceList from "@/components/custom/shared/document/currency-and-price-list";
import { Card } from "@/components/ui/card";
import {
  setUpToolbar,
  useLoadingTypeToolbar,
} from "~/util/hooks/ui/useSetUpToolbar";
import CustomFormFieldInput from "@/components/custom/form/CustomFormInput";
import { InvoiceData } from "./invoice-data";

export default function CreatePurchaseInvoiceClient() {
  const fetcher = useFetcher<typeof action>();
  const { roleActions, companyDefaults } = useOutletContext<GlobalState>();
  const createPurchaseInvoice = useCreatePurchaseInvoice();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { t, i18n } = useTranslation("common");
  const toolbar = useToolbar();
  const navigate = useNavigate();
  const r = route;
  const lineItemsStore = useLineItems();
  const taxLinesStore = useTaxAndCharges();
  const { payload } = useDocumentStore();
  const params = useParams();
  const partyInvoice = params.partyInvoice || "";
  const form = useForm<z.infer<typeof invoiceDataSchema>>({
    resolver: zodResolver(invoiceDataSchema),
    defaultValues: {
      invoicePartyType: partyInvoice,
      docReferenceID: payload?.documentRefernceID,
      currency: payload?.currency || companyDefaults?.currency,
      lines: lineItemsStore.lines.map((t) => {
        t.lineType = itemLineTypeToJSON(ItemLineType.ITEM_LINE_INVOICE);
        t.itemLineReferenceID = t.itemLineID
        return t;
      }),

      taxLines: taxLinesStore.lines,
      postingDate: new Date(),
      postingTime: format(new Date(), "HH:mm:ss"),
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
    },
  });
  const formValues = form.getValues();

  const onSubmit = (values: z.infer<typeof invoiceDataSchema>) => {
    console.log(values);
    fetcher.submit(
      {
        action: "create-invoice",
        invoiceData: values,
      } as any,
      {
        method: "POST",
        encType: "application/json",
      }
    );
  };

  useLoadingTypeToolbar(
    {
      loading: fetcher.state == "submitting",
      loadingType: "SAVE",
    },
    [fetcher.state]
  );

  setUpToolbar(() => {
    return {
      titleToolbar: t("f.add-new", {
        o: t(partyInvoice),
      }),
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
        if (fetcher.data?.invoice) {
          navigate(
            r.toRoute({
              main: partyInvoice,
              routeSufix: [fetcher.data.invoice.code],
              routePrefix: ["invoice"],
              q: {
                tab: "info",
              },
            })
          );
        }
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
          <InvoiceData
          form={form}
          onSubmit={onSubmit}
          fetcher={fetcher}
          inputRef={inputRef}
          />
      </Card>
    </div>
  );
}
