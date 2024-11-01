import FormAutocomplete from "@/components/custom/select/FormAutocomplete";
import { MultiSelect } from "@/components/custom/select/MultiSelect";
import {
  FetcherWithComponents,
  useFetcher,
  useLoaderData,
  useNavigate,
  useOutletContext,
} from "@remix-run/react";
import { SquareCheckIcon, SquareIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDebounceFetcher } from "remix-utils/use-debounce-fetcher";
import { z } from "zod";
import { GlobalState } from "~/types/app";
import { createItemPriceSchema } from "~/util/data/schemas/stock/item-price-schema";
import { useCreateTax } from "~/routes/home.accounting.taxes_/components/add-tax";
import { create } from "zustand";
import { routes } from "~/util/route";
import { DEFAULT_DEBOUNCE_TIME } from "~/constant";
import { components } from "~/sdk";
import { useItemDebounceFetcher } from "~/util/hooks/fetchers/useItemDebounceFetcher";
import { useTaxDebounceFetcher } from "~/util/hooks/fetchers/useTaxDebounceFetcher";
import { usePriceListDebounceFetcher } from "~/util/hooks/fetchers/usePriceListDebounceFetcher";
import { useCreatePriceList } from "~/routes/home.selling.stock.price-list_/components/add-price-list";
import { useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import FormLayout from "@/components/custom/form/FormLayout";
import { Form } from "@/components/ui/form";
import { usePermission } from "~/util/hooks/useActions";
import { PartyType, partyTypeToJSON } from "~/gen/common";
import CustomFormField from "@/components/custom/form/CustomFormField";
import AmountInput from "@/components/custom/input/AmountInput";
import { Input } from "@/components/ui/input";
import { setUpToolbar } from "~/util/hooks/ui/useSetUpToolbar";
import { useDisplayMessage } from "~/util/hooks/ui/useDisplayMessage";
import { Typography } from "@/components/typography";
import { Separator } from "@/components/ui/separator";
import { useUomDebounceFetcher } from "~/util/hooks/fetchers/useUomDebounceFetcher";
import { action, loader } from "../route";
import { SerializeFrom } from "@remix-run/node";
import { cn } from "@/lib/utils";

export default function ItemPriceForm({
  form,
  globalState,
  className,
}: {
  form: UseFormReturn<z.infer<typeof createItemPriceSchema>>;
  globalState: GlobalState;
  className?: string;
}) {
  const { t } = useTranslation("common");
  const data = useLoaderData<typeof loader>();

  const r = routes;
  const navigate = useNavigate();
  const [itemsDebounceFetcher, onItemNameChange] = useItemDebounceFetcher();

  const [taxesDebounceFetcher, onTaxNameChange] = useTaxDebounceFetcher();
  const [priceListDebounceFetcher, onPriceListNameChange] =
    usePriceListDebounceFetcher();
  const loaderFetcher = useFetcher<typeof loader>();
  const associatedActions =
    data.associatedActions || loaderFetcher.data?.associatedActions;

  const [taxesPermission] = usePermission({
    actions: associatedActions && associatedActions[PartyType.tax],
    roleActions: globalState.roleActions,
  });
  const [priceListPermission] = usePermission({
    actions: associatedActions && associatedActions[PartyType.priceList],
    roleActions: globalState.roleActions,
  });
  const [uomsDebounceFetcher, onUomNameChange] = useUomDebounceFetcher();

  const createTax = useCreateTax();
  const createPriceList = useCreatePriceList();
  const [selectedPriceList, setSelectedPriceList] = useState<
    components["schemas"]["PriceListDto"] | undefined
  >();
  const inputRef = useRef<HTMLInputElement | null>(null);

  const loadData = () => {
    if (associatedActions == undefined) {
      console.log("LOAD DATA...");
      loaderFetcher.submit(
        {},
        {
          action: r.toRoute({
            main: partyTypeToJSON(PartyType.itemPrice),
            routePrefix: [r.stockM],
            routeSufix: ["new"],
          }),
        }
      );
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <>
      <Typography variant="title2" className=" col-span-full">
        {t("f.and", { o: t("form.quantity"), p: t("form.rate") })}
      </Typography>
      <CustomFormField
        name="rate"
        required={true}
        label={t("form.rate")}
        form={form}
        children={(field) => {
          return <AmountInput field={field} type="number" currency="" />;
        }}
      />

      <CustomFormField
        name="itemQuantity"
        label={t("form.itemQuantity")}
        required={true}
        form={form}
        children={(field) => {
          return <Input {...field} type="number" />;
        }}
      />

      <Separator className=" col-span-full" />
      <Typography variant="title2" className=" col-span-full">
        {t("item")}
      </Typography>

      <FormAutocomplete
        form={form}
        data={itemsDebounceFetcher.data?.items || []}
        label={t("items")}
        required={true}
        nameK={"name"}
        // addNew={()=>{
        //   createTax.onOpenChange(true)
        // }}
        onSelect={(v) => {
          form.setValue("itemUuid", v.uuid);
          form.setValue("itemID", v.id);
        }}
        onValueChange={onItemNameChange}
        name="itemName"
      />

      <FormAutocomplete
        form={form}
        data={uomsDebounceFetcher.data?.uoms || []}
        label={t("form.uom")}
        nameK={"name"}
        onValueChange={onUomNameChange}
        onSelect={(v) => {
          form.setValue("uomID", v.id);
        }}
        name="uomName"
      />

      {priceListPermission?.view && priceListPermission.create && (
        <>
          <Separator className=" col-span-full" />
          <Typography variant="title2" className=" col-span-full">
            {t("priceList")}
          </Typography>
          <FormAutocomplete
            form={form}
            data={priceListDebounceFetcher.data?.priceLists || []}
            required={true}
            label={t("priceList")}
            nameK={"name"}
            addNew={() => {
              createPriceList.onOpenChange(true);
            }}
            onSelect={(v) => {
              setSelectedPriceList(v);
              form.setValue("priceListUuid", v.uuid);
              form.setValue("priceListID", v.id);
            }}
            onValueChange={onPriceListNameChange}
            name="priceListName"
          />
        </>
      )}

      {taxesPermission?.view && taxesPermission.create && (
        <FormAutocomplete
          form={form}
          data={taxesDebounceFetcher.data?.taxes || []}
          label={t("taxes")}
          nameK={"name"}
          addNew={() => {
            createTax.onOpenChange(true);
          }}
          onSelect={(v) => {
            form.setValue("taxUuid", v.uuid);
            form.setValue("taxID", v.id);
          }}
          onValueChange={onTaxNameChange}
          name="taxName"
        />
      )}

      {/* {selectedPriceList != undefined && (
              <div className="col-span-full">
                <div className="flex flex-wrap gap-3">
                  <h3 className="font-semibold">
                    {t("form.currency")}: {selectedPriceList.currency}
                  </h3>
                  <div className="flex items-center gap-1">
                    {selectedPriceList.is_buying ? (
                      <SquareCheckIcon />
                    ) : (
                      <SquareIcon />
                    )}
                    <h3 className="font-medium">{t("form.buying")}</h3>
                  </div>
                  <div className="flex items-center gap-1">
                    {selectedPriceList.is_selling ? (
                      <SquareCheckIcon />
                    ) : (
                      <SquareIcon />
                    )}
                    <h3 className="font-medium">{t("form.selling")}</h3>
                  </div>
                </div>
              </div>
            )} */}
    </>
  );
}
