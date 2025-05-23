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
import { GlobalState } from "~/types/app-types";
import { action } from "./route";
import { ItemLineType, itemLineTypeToJSON } from "~/gen/common";
import { useDisplayMessage } from "~/util/hooks/ui/useDisplayMessage";
import { useLineItems } from "@/components/custom/shared/item/use-line-items";
import { useTaxAndCharges } from "@/components/custom/shared/accounting/tax/use-tax-charges";
import { format } from "date-fns";

import { useDocumentStore } from "@/components/custom/shared/document/use-document-store";

import {
  setUpToolbar,
  useLoadingTypeToolbar,
} from "~/util/hooks/ui/useSetUpToolbar";
import { receiptDataSchema } from "~/util/data/schemas/receipt/receipt-schema";
import { CurrencyAutocompleteForm } from "~/util/hooks/fetchers/useCurrencyDebounceFetcher";
import { ReceiptData } from "./receipt-data";
import CreateLayout from "@/components/layout/create-layout";

export default function NewReceiptClient() {
  const fetcher = useFetcher<typeof action>();
  const { roleActions, companyDefaults } = useOutletContext<GlobalState>();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { t, i18n } = useTranslation("common");
  const navigate = useNavigate();
  const r = route;
  const lineItemsStore = useLineItems();
  const taxLinesStore = useTaxAndCharges();
  const { payload } = useDocumentStore();
  const params = useParams();
  const partyReceipt = params.partyReceipt || "";
  const form = useForm<z.infer<typeof receiptDataSchema>>({
    resolver: zodResolver(receiptDataSchema),
    defaultValues: {
      receiptPartyType: partyReceipt,
      docReferenceID: payload?.documentRefernceID,
      currency: payload?.currency || companyDefaults?.currency,
      lines: lineItemsStore.lines.map((t) => {
        t.lineItemReceipt = {
          acceptedQuantity: t.quantity || 0,
          rejectedQuantity: 0,
        };
        if (partyReceipt == r.purchaseReceipt) {
          t.lineType = itemLineTypeToJSON(ItemLineType.ITEM_LINE_RECEIPT);
        }
        if (partyReceipt == r.deliveryNote) {
          t.lineType = itemLineTypeToJSON(ItemLineType.DELIVERY_LINE_ITEM);
        }
        t.itemLineReferenceID = t.itemLineID;
        return t;
      }),
      taxLines: taxLinesStore.lines,
      postingTime: format(new Date(), "HH:mm:ss"),
      postingDate: new Date(),
      tz: Intl.DateTimeFormat().resolvedOptions().timeZone,

      party: {
        id: payload?.partyID,
        name: payload?.partyName,
      },
      priceList: {
        id: payload?.priceListID,
        name: payload?.priceListName,
      },
      costCenter: {
        name: payload?.costCenterName,
        id: payload?.costCenterID,
      },
      project: {
        name: payload?.projectName,
        id: payload?.projectID,
      },
      warehouse: {},
    },
  });
  const formValues = form.getValues();

  const onSubmit = (values: z.infer<typeof receiptDataSchema>) => {
    console.log(values);
    fetcher.submit(
      {
        action: "create-receipt",
        receiptData: values,
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
        o: t(partyReceipt),
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
        if (fetcher.data?.receipt) {
          navigate(
            r.toRoute({
              main: partyReceipt,
              routeSufix: [fetcher.data.receipt.code],
              routePrefix: ["receipt"],
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
  }, [formValues.taxLines]);

  useEffect(() => {
    lineItemsStore.onLines(formValues.lines);
    taxLinesStore.updateFromItems(formValues.lines);
  }, [formValues.lines]);

  return (
    <CreateLayout>
      <ReceiptData
        form={form}
        inputRef={inputRef}
        onSubmit={onSubmit}
        fetcher={fetcher}
        // isNew={true}
      />
    </CreateLayout>
  );
}

