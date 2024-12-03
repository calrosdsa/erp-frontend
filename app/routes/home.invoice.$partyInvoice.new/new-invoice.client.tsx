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
import FormAutocomplete from "@/components/custom/select/FormAutocomplete";
import { useCurrencyDebounceFetcher } from "~/util/hooks/fetchers/useCurrencyDebounceFetcher";
import CustomFormDate from "@/components/custom/form/CustomFormDate";
import { useEffect, useRef } from "react";
import { routes } from "~/util/route";
import FormLayout from "@/components/custom/form/FormLayout";
import { usePermission } from "~/util/hooks/useActions";
import { GlobalState } from "~/types/app";
import ItemLineForm from "@/components/custom/shared/item/item-line-form";
import { action } from "./route";
import { createInvoiceSchema } from "~/util/data/schemas/invoice/invoice-schema";
import { useCreatePurchaseInvoice } from "./use-purchase-invoice";
import { ItemLineType } from "~/gen/common";
import { useToolbar } from "~/util/hooks/ui/useToolbar";
import { useDisplayMessage } from "~/util/hooks/ui/useDisplayMessage";
import Typography, { subtitle } from "@/components/typography/Typography";
import PartyAutocomplete from "../home.order.$partyOrder.new/components/party-autocomplete";
import { useLineItems } from "@/components/custom/shared/item/use-line-items";
import { useTaxAndCharges } from "@/components/custom/shared/accounting/tax/use-tax-charges";
import { formatRFC3339 } from "date-fns";
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

export default function CreatePurchaseInvoiceClient() {
  const fetcher = useFetcher<typeof action>();
  const { roleActions, companyDefaults } = useOutletContext<GlobalState>();
  const createPurchaseInvoice = useCreatePurchaseInvoice();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { t, i18n } = useTranslation("common");
  const toolbar = useToolbar();
  const navigate = useNavigate();
  const r = routes;
  const documentStore = useDocumentStore();
  const lineItemsStore = useLineItems();
  const taxLinesStore = useTaxAndCharges();
  const { payload } = useDocumentStore();
  const params = useParams();
  const partyInvoice = params.partyInvoice || "";
  const form = useForm<z.infer<typeof createInvoiceSchema>>({
    resolver: zodResolver(createInvoiceSchema),
    defaultValues: {
      referenceID: payload?.documentRefernceID,
      currency: payload?.currency || companyDefaults?.currency,
      lines: lineItemsStore.lines,
      taxLines: taxLinesStore.lines,
      postingTime: formatRFC3339(new Date()),
      postingDate: new Date(),
      tz: Intl.DateTimeFormat().resolvedOptions().timeZone,
      
      costCenterID: payload?.costCenterID,
      costCenterName: payload?.costCenterName,
      projectID: payload?.projectID,
      projectName: payload?.projectName,
      partyID: payload?.partyID,
      partyName: payload?.partyName,
    },
  });
  const formValues = form.getValues();

  const onSubmit = (values: z.infer<typeof createInvoiceSchema>) => {
    console.log(values);
    fetcher.submit(
      {
        action: "create-invoice",
        createPurchaseInvoice: values,
      } as any,
      {
        method: "POST",
        encType: "application/json",
      }
    );
  };

  const setUpToolbar = () => {
    toolbar.setToolbar({
      titleToolbar: t("f.add-new", {
        o: t("_invoice.base").toLocaleLowerCase(),
      }),
      onSave: () => {
        inputRef.current?.click();
      },
    });
  };

  useEffect(() => {
    setUpToolbar();
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
  }, [formValues.taxLines]);

  useEffect(() => {
    lineItemsStore.onLines(formValues.lines);
  }, [formValues.lines]);

  return (
    <div>
      <Card>

      <FormLayout>
        <Form {...form}>
          <fetcher.Form
            method="post"
            onSubmit={form.handleSubmit(onSubmit)}
            className={cn("", "gap-y-3 grid p-3")}
          >
            <div className="create-grid">
              <PartyAutocomplete
                party={partyInvoice}
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

              <CurrencyAndPriceList form={form} />

              <AccountingDimensionForm form={form} />
              
              <LineItems
                onChange={(e) => {
                  form.setValue("lines", e);
                  form.trigger("lines");
                }}
                itemLineType={ItemLineType.ITEM_LINE_INVOICE}
                partyType={partyInvoice}
                currency={formValues.currency}
                complement={
                  <UpdateStock
                    form={form}
                    updateStock={formValues.updateStock}
                    partyType={partyInvoice}
                  />
                }
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
