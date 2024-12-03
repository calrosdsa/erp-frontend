import FormLayout from "@/components/custom/form/FormLayout";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Navigate,
  useFetcher,
  useNavigate,
  useOutletContext,
  useParams,
} from "@remix-run/react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { routes } from "~/util/route";
import { action } from "./route";
import { Form } from "@/components/ui/form";
import { useDisplayMessage } from "~/util/hooks/ui/useDisplayMessage";
import CustomFormDate from "@/components/custom/form/CustomFormDate";
import SelectForm from "@/components/custom/select/SelectForm";
import { ItemLineType } from "~/gen/common";
import { Separator } from "@/components/ui/separator";
import { GlobalState } from "~/types/app";
import {
  setUpToolbar,
  useLoadingTypeToolbar,
} from "~/util/hooks/ui/useSetUpToolbar";
import { useEffect, useMemo, useRef } from "react";
import { createQuotationSchema } from "~/util/data/schemas/quotation/quotation-schema";
import { addMonths, format, formatRFC3339 } from "date-fns";
import PartyAutocomplete from "../home.order.$partyOrder.new/components/party-autocomplete";
import AccountingDimensionForm from "@/components/custom/shared/accounting/accounting-dimension-form";
import TaxAndChargesLines from "@/components/custom/shared/accounting/tax/tax-and-charge-lines";
import LineItems from "@/components/custom/shared/item/line-items";
import { useLineItems } from "@/components/custom/shared/item/use-line-items";
import { useTaxAndCharges } from "@/components/custom/shared/accounting/tax/use-tax-charges";
import GrandTotal from "@/components/custom/shared/item/grand-total";
import { TaxBreakup } from "@/components/custom/shared/accounting/tax/tax-breakup";
import CurrencyAndPriceList from "@/components/custom/shared/document/currency-and-price-list";
import { CustomFormTime } from "@/components/custom/form/CustomFormTime";
import { useDocumentStore } from "@/components/custom/shared/document/use-document-store";
import { Card } from "@/components/ui/card";

export default function NewQuotationClient() {
  const { t } = useTranslation("common");
  const fetcher = useFetcher<typeof action>();
  const { companyDefaults } = useOutletContext<GlobalState>();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const navigate = useNavigate();
  const r = routes;
  const params = useParams();
  const quotationParty = params.quotationParty || "";
  const { roleActions } = useOutletContext<GlobalState>();
  const lineItemsStore = useLineItems();
  const taxLinesStore = useTaxAndCharges();
  const { payload } = useDocumentStore();
  const form = useForm<z.infer<typeof createQuotationSchema>>({
    resolver: zodResolver(createQuotationSchema),
    defaultValues: {
      validTill: addMonths(new Date(), 1),
      postingTime: format(new Date(), "HH:mm:ss"),
      postingDate: new Date(),
      tz: Intl.DateTimeFormat().resolvedOptions().timeZone,

      lines: lineItemsStore.lines,
      taxLines: taxLinesStore.lines,

      currency: payload?.currency || companyDefaults?.currency,
      costCenterID: payload?.costCenterID,
      costCenterName: payload?.costCenterName,
      projectID: payload?.projectID,
      projectName: payload?.projectName,
    },
  });
  const formValues = form.getValues();

  const onSubmit = (e: z.infer<typeof createQuotationSchema>) => {
    fetcher.submit(
      {
        createQuotation: e as any,
        action: "create-quotation",
      },
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
      titleToolbar: t("f.add-new", { o: t(quotationParty) }),
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
        if (fetcher.data) {
          navigate(
            r.toRoute({
              main: quotationParty,
              routePrefix: [r.quotation],
              routeSufix: [fetcher.data.quotation?.code || ""],
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
  }, [formValues.lines]);
  return (
    <div>

    <Card>
      <FormLayout>
        <Form {...form}>
          <fetcher.Form onSubmit={form.handleSubmit(onSubmit)}
            className={"gap-y-3 grid p-3"}

          >
            <div className="create-grid">
              <PartyAutocomplete
                party={quotationParty}
                roleActions={roleActions}
                form={form}
              />
              <CustomFormDate
                control={form.control}
                name="postingDate"
                label={t("form.postingDate")}
              />
              <CustomFormTime
                control={form.control}
                name="postingTime"
                label={t("form.postingTime")}
                description={formValues.tz}
              />

              <CustomFormDate
                control={form.control}
                name="validTill"
                label={t("form.validTill")}
              />

              <Separator className=" col-span-full" />

              <CurrencyAndPriceList form={form} />

              <AccountingDimensionForm form={form} />
              <LineItems
                onChange={(e) => {
                  form.setValue("lines", e);
                  form.trigger("lines");
                }}
                allowEdit={true}
                itemLineType={ItemLineType.QUOTATION_LINE_ITEM}
                partyType={quotationParty}
                currency={formValues.currency}
              />
              <TaxAndChargesLines
                onChange={(e) => {
                  form.setValue("taxLines", e);
                  form.trigger("taxLines");
                }}
                currency={formValues.currency}
              />
              <GrandTotal currency={formValues.currency} />
              <TaxBreakup currency={formValues.currency} />
            </div>
            <input ref={inputRef} type="submit" className="hidden" />
          </fetcher.Form>
        </Form>
      </FormLayout>
    </Card>
    </div>
  );
}
