import {
  useFetcher,
  useNavigate,
  useOutletContext,
  useParams,
} from "@remix-run/react";
import { useTranslation } from "react-i18next";
import { createOrderSchema } from "~/util/data/schemas/buying/purchase-schema";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import FormAutocomplete from "@/components/custom/select/FormAutocomplete";
import { useCurrencyDebounceFetcher } from "~/util/hooks/fetchers/useCurrencyDebounceFetcher";
import CustomFormDate from "@/components/custom/form/CustomFormDate";
import { routes } from "~/util/route";
import FormLayout from "@/components/custom/form/FormLayout";
import { action } from "./route";
import { GlobalState } from "~/types/app";
import { ItemLineType, PartyType, partyTypeFromJSON } from "~/gen/common";
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

export default function CreatePurchaseOrdersClient() {
  const fetcher = useFetcher<typeof action>();
  const [currencyDebounceFetcher, onCurrencyChange] =
    useCurrencyDebounceFetcher();
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

  const form = useForm<z.infer<typeof createOrderSchema>>({
    resolver: zodResolver(createOrderSchema),
    defaultValues: {
      currency: companyDefaults?.currency,
      postingTime: format(new Date(), "HH:mm:ss"),
      postingDate: new Date(),
      tz: Intl.DateTimeFormat().resolvedOptions().timeZone,

      lines: lineItemsStore.lines,
      taxLines: taxLinesStore.lines,

      costCenterID: payload?.costCenterID,
      costCenterName: payload?.costCenterName,
      projectID: payload?.projectID,
      projectName: payload?.projectName,
      partyID: payload?.partyID,
      partyName: payload?.partyName,
    },
  });
  const formValues = form.getValues();

  const onSubmit = (values: z.infer<typeof createOrderSchema>) => {
    fetcher.submit(
      {
        action: "create-order",
        createPurchaseOrder: values,
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
                  party={partyOrder}
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
                  name="deliveryDate"
                  label={t("form.deliveryDate")}
                />

                <CurrencyAndPriceList form={form} />

                <AccountingDimensionForm form={form} />

                <LineItems
                  onChange={(e) => {
                    form.setValue("lines", e);
                    form.trigger("lines");
                  }}
                  allowEdit={true}
                  itemLineType={ItemLineType.ITEM_LINE_ORDER}
                  partyType={partyOrder}
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
