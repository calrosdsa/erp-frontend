import CustomFormFieldInput from "@/components/custom/form/CustomFormInput";
import FormLayout from "@/components/custom/form/FormLayout";
import { Card } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { useFetcher, useNavigate, useOutletContext } from "@remix-run/react";
import { useEffect, useRef } from "react";
import { action } from "./route";
import { useTranslation } from "react-i18next";
import { route } from "~/util/route";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { setUpToolbar, useLoadingTypeToolbar } from "~/util/hooks/ui/useSetUpToolbar";
import { useDisplayMessage } from "~/util/hooks/ui/useDisplayMessage";
import { GlobalState } from "~/types/app-types";
import { salesRecordDataSchema } from "~/util/data/schemas/invoicing/sales-record-schema";
import CustomFormDate from "@/components/custom/form/CustomFormDate";
import { useNewSalesRecord } from "./use-new-sales-record";
import { Separator } from "@/components/ui/separator";
import { InvoiceAutocompleteForm } from "~/util/hooks/fetchers/docs/use-invoice-fetcher";
import SalesRecordData from "./sales-record-data";
import CreateLayout from "@/components/layout/create-layout";

export default function NewSalesRecord() {
  const fetcher = useFetcher<typeof action>();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { t, i18n } = useTranslation("common");
  const navigate = useNavigate();
  const r = route;
  const {payload} = useNewSalesRecord()
  // Default values for the form
  const form = useForm<z.infer<typeof salesRecordDataSchema>>({
    resolver: zodResolver(salesRecordDataSchema),
    defaultValues:{
    customer:{
      name:payload?.party,
      id:payload?.partyID,
    },
    invoice:{
      name:payload?.invoiceCode,
      id:payload?.invoiceID,
    },
    
    invoiceDate:new Date(),
    supplement: "",
    iceAmount: 0,
    iehdAmount: 0,
    ipjAmount: 0,
    taxRates: 0,
    otherNotSubjectToVat: 0,
    exportsAndExemptOperations: 0,
    zeroRateTaxableSales: 0,
    subtotal: 0,
    discountsBonusAndRebatesSubjectToVat: 0,
    giftCardAmount: 0,
    baseAmountForTaxDebit: 0,
    taxDebit: 0,
    state: "",
    controlCode: "",
    saleType: "",
    withTaxCreditRight: true,
    consolidationStatus: "",
    },
  });

  const onSubmit = (values: z.infer<typeof salesRecordDataSchema>) => {
    console.log(values);
    fetcher.submit(
      {
        action: "create-sales-record",
        salesRecordData: values,
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
        o: t("salesRecord"),
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
        if (fetcher.data?.salesRecord) {
          navigate(
            r.toRoute({
              main: r.salesRecord,
              routePrefix:[r.invoicing],
              routeSufix: [fetcher.data.salesRecord.invoice_no],
              q: {
                tab: "info",
                id:fetcher.data.salesRecord.id.toString(),
              },
            })
          );
        }
      },
    },
    [fetcher.data]
  );

  return (
    <div>
      <CreateLayout>
      <SalesRecordData
      form={form}
      onSubmit={onSubmit}
      fetcher={fetcher}
      inputRef={inputRef}
      isNew={true}
      />
      </CreateLayout>
    </div>
  );
}
