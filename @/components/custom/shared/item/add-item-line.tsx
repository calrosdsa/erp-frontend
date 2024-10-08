import DisplayTextValue from "@/components/custom/display/DisplayTextValue";
import CustomForm from "@/components/custom/form/CustomForm";
import FormAutocomplete from "@/components/custom/select/FormAutocomplete";
import { DrawerLayout } from "@/components/layout/drawer/DrawerLayout";
import { CommandItem } from "@/components/ui/command";
import { useFetcher, useRevalidator } from "@remix-run/react";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { create } from "zustand";
import { ItemLineType } from "~/gen/common";
import {
  lineItemReceipt,
  lineItemSchema,
} from "~/util/data/schemas/stock/item-line-schema";
import { formatCurrency } from "~/util/format/formatCurrency";
import { useItemPriceForOrders } from "~/util/hooks/fetchers/useItemPriceForOrder";
import FormLayout from "../../form/FormLayout";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import CustomFormField from "../../form/CustomFormField";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const AddLineOrder = ({
  open,
  onOpenChange,
  currency,
  setOrderLine,
  itemLineType,
}: {
  open: boolean;
  onOpenChange: (e: boolean) => void;
  setOrderLine: (orderLine: z.infer<typeof lineItemSchema>) => void;
  currency: string;
  itemLineType: ItemLineType;
}) => {
  const fetcher = useFetcher();
  const { t, i18n } = useTranslation("common");
  const [itemPriceDebounceFetcher, onItemPriceChange] = useItemPriceForOrders({
    isBuying: true,
    currency: currency,
  });
  const revalidator = useRevalidator();
  const form = useForm<z.infer<typeof lineItemSchema>>({
    resolver: zodResolver(lineItemSchema),
    defaultValues: {
      lineType:ItemLineType.ITEM_LINE_ORDER
    },
  });
  const { item_price } = form.getValues();

  const onSubmit = (values: z.infer<typeof lineItemSchema>) => {
    const orderLine: z.infer<typeof lineItemSchema> = {
      ...values,
      amount: values.item_price.rate * Number(values.quantity),

    } as any;
    setOrderLine(orderLine);
  };

  return (
    <DrawerLayout
      open={open}
      onOpenChange={onOpenChange}
      className="md:max-w-2xl"
    >
      <FormLayout>
        <Form {...form}>
          {JSON.stringify(form.formState.errors)}
          <fetcher.Form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid md:grid-cols-2 gap-3">
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

              <CustomFormField
                name="quantity"
                required={true}
                label={t("form.quantity")}
                form={form}
                children={(field) => {
                  return (
                    <Input
                      {...field}
                      type="number"
                    />
                  );
                }}
              />

              {itemLineType == ItemLineType.ITEM_LINE_RECEIPT && (
                <>
                  <CustomFormField
                    required={true}
                    name="lineItemReceipt.acceptedQuantity"
                    label={t("f.accepted", { o: t("form.quantity") })}
                    form={form}
                    children={(field) => {
                      return <Input {...field} type="number" />;
                    }}
                  />
                  <CustomFormField
                    name="lineItemReceipt.rejectedQuantity"
                    label={t("f.rejected", { o: t("form.quantity") })}
                    form={form}
                    children={(field) => {
                      return <Input {...field} type="number" />;
                    }}
                  />
                </>
              )}

              {item_price && (
                <>
                  <div className=" col-span-full" />
                  <DisplayTextValue
                    title={t("form.name")}
                    value={item_price.item_name}
                  />
                  <DisplayTextValue
                    title={t("form.code")}
                    value={item_price.item_code}
                  />
                  <DisplayTextValue
                    title={t("form.rate")}
                    value={formatCurrency(
                      item_price.rate,
                      currency,
                      i18n.language
                    )}
                  />
                  <DisplayTextValue
                    title={t("form.uom")}
                    value={item_price.uom}
                  />
                </>
              )}
            </div>
            <div className=" pt-2 w-full px-4  md:px-0 flex justify-end items-end">
              <Button type="submit" className="w-full md:w-min">
                {t("form.save")}
              </Button>
            </div>
          </fetcher.Form>
        </Form>
      </FormLayout>
      {/* <CustomForm
        schema={lineItemSchema}
        className="md:grid md:grid-cols-2 gap-4"
        onSubmit={(values: z.infer<typeof lineItemSchema>) => {
          const orderLine: z.infer<typeof lineItemSchema> = {
            item_price: values.item_price,
            quantity: values.quantity.toString(),
            amount: values.item_price.rate * values.quantity,
          } as any;
          setOrderLine(orderLine);
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
          const formData: z.infer<typeof lineItemSchema> = form.getValues();
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
      /> */}
    </DrawerLayout>
  );
};

interface AddLineOrderStore {
  open: boolean;
  currency?: string;
  itemLineType: ItemLineType;
  clearOrderLine: () => void;
  onOpenChange: (e: boolean) => void;
  openDialog: (opts: { currency: string; itemLineType: ItemLineType }) => void;
  orderLine?: z.infer<typeof lineItemSchema>;
  setOrderLine: (orderLine: z.infer<typeof lineItemSchema>) => void;
}

export const useAddLineOrder = create<AddLineOrderStore>((set) => ({
  clearOrderLine: () => set((state) => ({ orderLine: undefined })),
  open: false,
  onOpenChange: (e) => set((state) => ({ open: e })),
  orderLine: undefined,
  setOrderLine: (orderLine) => set((state) => ({ orderLine: orderLine })),
  openDialog: (opts) =>
    set((state) => ({
      open: true,
      currency: opts.currency,
      orderLine: undefined,
      itemLineType: opts.itemLineType,
    })),
  currency: undefined,
  itemLineType: ItemLineType.ITEM_LINE_ORDER,
}));
