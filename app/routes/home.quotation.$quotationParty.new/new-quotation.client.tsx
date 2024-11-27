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
import {
  ItemLineType,
  PartyType,
  partyTypeToJSON,
  StockEntryType,
} from "~/gen/common";
import { Separator } from "@/components/ui/separator";
import AccordationLayout from "@/components/layout/accordation-layout";
import FormAutocomplete from "@/components/custom/select/FormAutocomplete";
import { useWarehouseDebounceFetcher } from "~/util/hooks/fetchers/useWarehouseDebounceFetcher";
import ItemLineForm from "@/components/custom/shared/item/item-line-form";
import { useCurrencyDebounceFetcher } from "~/util/hooks/fetchers/useCurrencyDebounceFetcher";
import { GlobalState } from "~/types/app";
import { setUpToolbar } from "~/util/hooks/ui/useSetUpToolbar";
import { useRef } from "react";
import { createQuotationSchema } from "~/util/data/schemas/quotation/quotation-schema";
import { CustomFormTime } from "@/components/custom/form/CustomFormTime";
import { format, formatRFC3339 } from "date-fns";
import PartyAutocomplete from "../home.order.$partyOrder.new/components/party-autocomplete";
import AccountingDimensionForm from "@/components/custom/shared/accounting/accounting-dimension-form";
import TaxAndChargesLines from "@/components/custom/shared/accounting/tax-and-charge-lines";

export default function NewQuotationClient() {
  const { t } = useTranslation("common");
  const fetcher = useFetcher<typeof action>();
  const { companyDefaults } = useOutletContext<GlobalState>();
  const inputRef = useRef<HTMLInputElement | null>(null);
  // const [priceListFetcher, onPriceListChange] = usePriceListDebounceFetcher();
  const [currencyDebounceFetcher, onCurrencyChange] =
    useCurrencyDebounceFetcher();
  const navigate = useNavigate();
  const r = routes;
  const params = useParams();
  const quotationParty = params.quotationParty || "";
  const { roleActions } = useOutletContext<GlobalState>();
  const form = useForm<z.infer<typeof createQuotationSchema>>({
    resolver: zodResolver(createQuotationSchema),
    defaultValues: {
      lines: [],
      taxLines:[],
      currency: companyDefaults?.currency,
      postingTime: formatRFC3339(new Date()),
      postingDate:new Date(),
      tz: Intl.DateTimeFormat().resolvedOptions().timeZone,
    },
  });
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

  setUpToolbar(() => {
    return {
      titleToolbar: t("f.add-new", { o: t("stockEntry") }),
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
              main: r.supplierQuotation,
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
  return (
    <FormLayout>
      <Form {...form}>
        {/* {JSON.stringify(format(form.getValues().postingTime, "HH:mm:SS"))} */}
        <fetcher.Form onSubmit={form.handleSubmit(onSubmit)}>
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
              description={form.getValues().tz}
            />

            <CustomFormDate
              control={form.control}
              name="validTill"
              label={t("form.validTill")}
            />

            <Separator className=" col-span-full" />

            <AccordationLayout
              title={t("form.currency")}
              containerClassName=" col-span-full"
              className="create-grid"
            >
              <FormAutocomplete
                data={currencyDebounceFetcher.data?.currencies || []}
                form={form}
                name="currency"
                required={true}
                nameK={"code"}
                onValueChange={onCurrencyChange}
                label={t("form.currency")}
                onSelect={(v) => {
                  form.setValue("currency", v.code);
                  form.trigger("currency");
                }}
              />
            </AccordationLayout>

            <AccountingDimensionForm
            form={form}/>

            <ItemLineForm
              form={form}
              partyType={quotationParty || ""}
              itemLineType={ItemLineType.QUOTATION_LINE_ITEM}
            />
            <TaxAndChargesLines
            taxLines={form.getValues().taxLines}
            onChange={(e)=>{
              form.setValue("taxLines",e)
            }}
            />
          </div>
          <input ref={inputRef} type="submit" className="hidden" />
        </fetcher.Form>
      </Form>
    </FormLayout>
  );
}
