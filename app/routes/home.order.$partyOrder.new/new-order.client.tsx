import {
  useFetcher,
  useNavigate,
  useOutletContext,
  useParams,
} from "@remix-run/react";
import { useTranslation } from "react-i18next";
import { createPurchaseSchema } from "~/util/data/schemas/buying/purchase-schema";
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
import { usePermission } from "~/util/hooks/useActions";
import { GlobalState } from "~/types/app";
import { ItemLineType, PartyType, partyTypeFromJSON } from "~/gen/common";
import { useDisplayMessage } from "~/util/hooks/ui/useDisplayMessage";
import Typography, { subtitle } from "@/components/typography/Typography";
import { setUpToolbar } from "~/util/hooks/ui/useSetUpToolbar";
import { useRef } from "react";
import PartyAutocomplete from "./components/party-autocomplete";
import ItemLineForm from "@/components/custom/shared/item/item-line-form";
import { usePriceListDebounceFetcher } from "~/util/hooks/fetchers/usePriceListDebounceFetcher";
import AccordationLayout from "@/components/layout/accordation-layout";

export default function CreatePurchaseOrdersClient() {
  const fetcher = useFetcher<typeof action>();
  const [currencyDebounceFetcher, onCurrencyChange] =
    useCurrencyDebounceFetcher();
  const globalState = useOutletContext<GlobalState>();
  const params = useParams();
  const partyOrder = params.partyOrder || "";
  const { t, i18n } = useTranslation("common");
  const inputRef = useRef<HTMLInputElement | null>(null);
  const navigate = useNavigate();
  const r = routes;
  const [priceListFetcher, onPriceListChange] = usePriceListDebounceFetcher();
  const form = useForm<z.infer<typeof createPurchaseSchema>>({
    resolver: zodResolver(createPurchaseSchema),
    defaultValues: {
      lines: [],
      date: new Date(),
    },
  });

  const onSubmit = (values: z.infer<typeof createPurchaseSchema>) => {
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
      title: t("f.add-new", { o: t("_order.base") }),
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

  return (
    <div>
      <FormLayout>
        <Form {...form}>
          <fetcher.Form
            method="post"
            onSubmit={form.handleSubmit(onSubmit)}
            className={cn("", "gap-y-3 grid p-3")}
          >
            <div className="create-grid">
              <PartyAutocomplete
                party={partyOrder || ""}
                globalState={globalState}
                form={form}
              />

              <CustomFormDate
                form={form}
                name="date"
                label={t("form.date")}
                required={true}
              />

              <CustomFormDate
                form={form}
                name="delivery_date"
                isDatetime={true}
                label={t("form.deliveryDate")}
              />

              <AccordationLayout
                title={t("priceList")}
                containerClassName=" col-span-full"
                className="create-grid"
              >
                <FormAutocomplete
                  onValueChange={onPriceListChange}
                  form={form}
                  name="priceListName"
                  nameK={"name"}
                  label={t("priceList")}
                  data={priceListFetcher.data?.priceLists || []}
                  onSelect={(e) => {
                    form.setValue("priceListID", e.id);
                    form.setValue("currency", e.currency);
                    form.trigger("currency");
                  }}
                />
              </AccordationLayout>
              {/* <Typography className=" col-span-full" fontSize={subtitle}>
                {t("form.currencyAndPriceList")}
              </Typography>
              <FormAutocomplete
                data={currencyDebounceFetcher.data?.currencies || []}
                form={form}
                name="currencyName"
                required={true}
                nameK={"code"}
                onValueChange={onCurrencyChange}
                label={t("form.currency")}
                onSelect={(v) => {
                  form.setValue("currency", v);
                  form.trigger("currency");
                }}
              /> */}
            </div>
            {/* {JSON.stringify(form.getValues().lines)} */}
            <ItemLineForm
              form={form}
              partyType={params.partyOrder || ""}
              itemLineType={ItemLineType.ITEM_LINE_ORDER}
            />

            <input ref={inputRef} type="submit" className="hidden" />
          </fetcher.Form>
        </Form>
      </FormLayout>
    </div>
  );
}
