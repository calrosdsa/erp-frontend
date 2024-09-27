

import DisplayTextValue from "@/components/custom/display/DisplayTextValue";
import CustomForm from "@/components/custom/form/CustomForm";
import FormAutocomplete from "@/components/custom/select/FormAutocomplete";
import { DrawerLayout } from "@/components/layout/drawer/DrawerLayout";
import { CommandItem } from "@/components/ui/command";
import { useFetcher, useRevalidator } from "@remix-run/react";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { create } from "zustand";
import { orderLineSchema } from "~/util/data/schemas/buying/purchase-schema";
import { formatCurrency } from "~/util/format/formatCurrency";
import { useItemPriceForOrders } from "~/util/hooks/fetchers/useItemPriceForOrder";

export const AddLineOrder = ({
  open,
  onOpenChange,
  currency,
  setOrderLine,
}: {
  open: boolean;
  onOpenChange: (e: boolean) => void;
  setOrderLine:(orderLine:z.infer<typeof orderLineSchema>)=>void
  currency: string;
}) => {
  const fetcher = useFetcher();
  const { t, i18n } = useTranslation("common");
  const [itemPriceDebounceFetcher, onItemPriceChange] = useItemPriceForOrders({
    isBuying: true,
    currency: currency,
  });
  const revalidator = useRevalidator();
  return (
    <DrawerLayout
      open={open}
      onOpenChange={onOpenChange}
      className="md:max-w-2xl"
    >
      <CustomForm
        schema={orderLineSchema}
        className="md:grid md:grid-cols-2 gap-4"
        onSubmit={(values: z.infer<typeof orderLineSchema>) => {
            const orderLine:z.infer<typeof orderLineSchema> = {
                item_price:values.item_price,
                quantity:values.quantity.toString(),
                amount:values.item_price.rate * values.quantity
            } as any
            setOrderLine(orderLine)

        }}
        fetcher={fetcher}
        formItemsData={[
          {
            name: "quantity",
            label: t("form.quantity"),
            type: "string",
            typeForm: "input",
          },
        ]}
        renderCustomInputs={(form) => {
          const formData: z.infer<typeof orderLineSchema> = form.getValues();
          const itemPrice = formData.item_price;
          return (
            <>
              <FormAutocomplete
                data={itemPriceDebounceFetcher.data?.itemPriceForOrders || []}
                nameK={"item_name"}
                label={t("_item.base")}
                name="item_name"
                form={form}
                onValueChange={onItemPriceChange}
                onSelect={(e) => {
                  revalidator.revalidate();
                  form.setValue("item_price", e);
                }}
                onCustomDisplay={(item, idx) => {
                  return (
                    <div className="w-full">
                      {item.item_name} ({item.item_code}){" "}
                      {formatCurrency(item.rate, currency, i18n.language)}
                    </div>
                  );
                }}
              />
              {itemPrice && (
                <>
                  <DisplayTextValue
                    title={t("form.name")}
                    value={itemPrice.item_name}
                  />
                  <DisplayTextValue
                    title={t("form.code")}
                    value={itemPrice.item_code}
                  />
                  <DisplayTextValue
                    title={t("form.rate")}
                    value={formatCurrency(
                      itemPrice.rate,
                      currency,
                      i18n.language
                    )}
                  />
                  <DisplayTextValue
                    title={t("form.uom")}
                    value={itemPrice.uom}
                  />
                </>
              )}
            </>
          );
        }}
      />
    </DrawerLayout>
  );
};

interface AddLineOrderStore {
  open: boolean;
  currency?: string;
  clearOrderLine:()=>void,
  onOpenChange: (e: boolean) => void;
  openDialog: (opts: { currency: string }) => void;
  orderLine?:z.infer<typeof orderLineSchema>;
  setOrderLine:(orderLine:z.infer<typeof orderLineSchema>)=>void
}

export const useAddLineOrder = create<AddLineOrderStore>((set) => ({
  clearOrderLine:()=>set((state)=>({orderLine:undefined})),
  open: false,
  onOpenChange: (e) => set((state) => ({ open: e })),
  orderLine:undefined,
  setOrderLine:(orderLine)=>set((state)=>({orderLine:orderLine})),
  openDialog: (opts) =>
    set((state) => ({ open: true, currency: opts.currency,orderLine:undefined })),
  currency: undefined,
}));
