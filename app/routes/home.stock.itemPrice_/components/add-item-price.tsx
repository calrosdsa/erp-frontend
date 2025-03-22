import CustomForm from "@/components/custom/form/CustomForm";
import FormAutocomplete from "@/components/custom/select/FormAutocomplete";
import { MultiSelect } from "@/components/custom/select/MultiSelect";
import { DrawerLayout } from "@/components/layout/drawer/DrawerLayout";
import Typography, {
  subtitle,
  title,
} from "@/components/typography/Typography";
import { useToast } from "@/components/ui/use-toast";
import { useFetcher, useOutletContext } from "@remix-run/react";
import { SquareCheckIcon, SquareIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDebounceFetcher } from "remix-utils/use-debounce-fetcher";
import { z } from "zod";
import { GlobalState } from "~/types/app-types";
import { createItemPriceSchema } from "~/util/data/schemas/stock/item-price-schema";
import { useCreateTax } from "~/routes/home.accounting.taxes_/components/add-tax";
import { create } from "zustand";
import { route } from "~/util/route";
import { DEFAULT_DEBOUNCE_TIME } from "~/constant";
import { components } from "~/sdk";
import { useItemDebounceFetcher } from "~/util/hooks/fetchers/useItemDebounceFetcher";
import { useTaxDebounceFetcher } from "~/util/hooks/fetchers/useTaxDebounceFetcher";
import { usePriceListDebounceFetcher } from "~/util/hooks/fetchers/usePriceListDebounceFetcher";
import { action } from "../route";
import { useCreatePriceList } from "~/routes/home.stock.priceList_/components/add-price-list";

export default function AddItemPrice({
  open,
  onOpenChange,
  itemUuid,
}: {
  open: boolean;
  onOpenChange: (e: boolean) => void; 
  itemUuid: string | undefined;
}) {
  const { t } = useTranslation("common");
  const globalState = useOutletContext<GlobalState>();
  const fetcher = useFetcher<typeof action>();
  const createTax = useCreateTax();
  const createPriceList = useCreatePriceList();
  const r = route;

  const [itemsDebounceFetcher, onItemNameChange] = useItemDebounceFetcher();

  const [taxesDebounceFetcher, onTaxNameChange] = useTaxDebounceFetcher();
  const [priceListDebounceFetcher, onPriceListNameChange] =
    usePriceListDebounceFetcher();
  const [selectedPriceList, setSelectedPriceList] = useState<
    components["schemas"]["PriceListDto"] | undefined
  >();

  const { toast } = useToast();

  useEffect(() => {
    if (fetcher.data?.error) {
      toast({
        title: fetcher.data.error,
      });
    }
    if (fetcher.data?.message) {
      toast({
        title: fetcher.data.message,
      });
      //close form dialog
      onOpenChange(false);
    }
  }, [fetcher.data]);

  return (
    <DrawerLayout
      open={open}
      onOpenChange={onOpenChange}
      className="md:max-w-5xl"
      title={t("_stock.addItemPrice")}
    >
      <CustomForm
        schema={createItemPriceSchema}
        className="create-grid "
        defaultValues={
          {
            itemUuid: itemUuid,
            item:"",
          } as z.infer<typeof createItemPriceSchema>
        }
        formItemsData={[
          {
            name: "rate",
            type: "number",
            typeForm: "input",
            label: t("form.rate"),
          },
          {
            name: "itemQuantity",
            type: "number",
            typeForm: "input",
            label: t("form.itemQuantity"),
          },
        ]}
        fetcher={fetcher}
        onSubmit={(values: z.infer<typeof createItemPriceSchema>) => {
          fetcher.submit(
            {
              action: "add-item-price",
              createItemPrice: values,
            },
            {
              method: "POST",
              action: r.itemPrices,
              encType: "application/json",
            }
          );
        }}
        renderCustomInputs={(form) => {
          return (
            <>
              {itemUuid == undefined && (
                <FormAutocomplete
                  form={form}
                  data={itemsDebounceFetcher.data?.items || []}
                  label={t("items")}
                  nameK={"name"}
                  // addNew={()=>{
                  //   createTax.onOpenChange(true)
                  // }}
                  onSelect={(v) => {
                    form.setValue("itemUuid", v.uuid);
                  }}
                  onValueChange={onItemNameChange}
                  name="itemName"
                />
              )}

              <FormAutocomplete
                form={form}
                data={taxesDebounceFetcher.data?.taxes || []}
                label={t("taxes")}
                nameK={"name"}
                // addNew={()=>{
                //   createTax.onOpenChange(true)
                // }}
                onSelect={(v) => {
                  form.setValue("taxUuid", v.uuid);
                }}
                onValueChange={onTaxNameChange}
                name="taxName"
              />

              <FormAutocomplete
                form={form}
                data={priceListDebounceFetcher.data?.priceLists || []}
                label={t("price-list")}
                nameK={"name"}
                // addNew={()=>{
                //   createTax.onOpenChange(true)
                // }}
                onSelect={(v) => {
                  setSelectedPriceList(v)
                  form.setValue("priceListUuid", v.uuid);
                }}
                onValueChange={onPriceListNameChange}
                name="priceListName"
              />

              {selectedPriceList != undefined && (
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
              )}
            </>
          );
        }}
      />
    </DrawerLayout>
  );
}

interface AddItemPriceStore {
  itemUuid: string | undefined;
  open: boolean;
  onOpenChange: (e: boolean) => void;
  onOpenDialog: (opts: { itemUuid?:string }) => void;
}
export const useAddItemPrice = create<AddItemPriceStore>((set) => ({
  itemUuid: undefined,
  open: false,
  onOpenChange: (e: boolean) => set((state) => ({ open: e })),
  onOpenDialog: (opts) => set((state) => ({ itemUuid: opts.itemUuid, open: true })),
}));
