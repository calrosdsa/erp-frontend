import IconButton from "@/components/custom-ui/icon-button";
import { DrawerLayout } from "@/components/layout/drawer/DrawerLayout";
import Typography, { subtitle } from "@/components/typography/Typography";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFetcher } from "@remix-run/react";
import { DeleteIcon, TrashIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { create } from "zustand";
import { DEFAULT_CURRENCY } from "~/constant";
import { components } from "~/sdk";
import { editLineItemSchema } from "~/util/data/schemas/stock/item-line-schema";
import { useItemPriceForOrders } from "~/util/hooks/fetchers/useItemPriceForOrder";
import FormAutocomplete from "../../select/FormAutocomplete";
import {
  formatAmounFromInt,
  formatCurrency,
} from "~/util/format/formatCurrency";
import CustomFormField from "../../form/CustomFormField";
import { Input } from "@/components/ui/input";
import { action } from "~/routes/api.itemline/route";
import { routes } from "~/util/route";
import { useEffect } from "react";
import AmountInput from "../../input/AmountInput";
import { useDisplayMessage } from "~/util/hooks/ui/useDisplayMessage";
import { ItemLineType } from "~/gen/common";

export default function ItemLine({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (e: boolean) => void;
}) {
  const itemLine = useItemLine();
  const { line } = itemLine;
  const { t, i18n } = useTranslation("common");
  const fetcher = useFetcher<typeof action>();
  const r = routes;
  const form = useForm<z.infer<typeof editLineItemSchema>>({
    resolver: zodResolver(editLineItemSchema),
    defaultValues: {
      itemLineID: line?.id,
      quantity: line?.quantity,
      rate:formatAmounFromInt(line?.rate),
      lineType:itemLine.itemLineType,

      item_code: line?.item_code,
      item_name: line?.item_name,
      item_uuid:line?.item_uuid,

      uom: line?.uom,
      party_type: itemLine.partyType,
      item_price_uuid: line?.item_price_uuid,
      // itemLineReference:line.refe
    },
  });
  const [itemPriceDebounceFetcher, onItemPriceChange] = useItemPriceForOrders({
    isBuying: true,
    currency: itemLine.currency || DEFAULT_CURRENCY,
  });
  const onSubmit = (values: z.infer<typeof editLineItemSchema>) => {
    if (values.itemLineID) {
      fetcher.submit(
        {
          action: "edit-line-item",
          editLineItem: values,
        },
        {
          method: "POST",
          action: r.apiItemLine,
          encType: "application/json",
        }
      );
    } else {
        if(itemLine.onEditItemForm){
          itemLine.onEditItemForm(values)
        }
      onOpenChange(false);
      console.log("VALUES",values)
    }
  };

  useDisplayMessage(
    {
      error: fetcher.data?.error,
      success: fetcher.data?.message,
      onSuccessMessage: () => {
        onOpenChange(false);
      },
    },
    [fetcher.data]
  );

  return (
    <DrawerLayout
      open={open}
      onOpenChange={onOpenChange}
      title={itemLine.title}
      className=" max-w-2xl "
    >
      {JSON.stringify(form.formState.errors)}
      <Form {...form}>
        <fetcher.Form onSubmit={form.handleSubmit(onSubmit)} className="px-2">
          <div className="flex flex-col ">
            {itemLine.allowEdit && (
              <div className=" flex flex-wrap gap-x-3 ">
                <Button size={"xs"}>
                  <TrashIcon size={15} />
                </Button>
                <Button
                  type="submit"
                  size={"xs"}
                  loading={fetcher.state == "submitting"}
                >
                  {t("form.save")}
                </Button>
              </div>
            )}
          </div>

          <div className="grid sm:grid-cols-2 gap-3 pt-2">
            <FormAutocomplete
              data={itemPriceDebounceFetcher.data?.itemPriceForOrders || []}
              nameK={"item_name"}
              label={t("_item.base")}
              name="item_name"
              form={form}
              onValueChange={onItemPriceChange}
              onSelect={(e) => {
                //   revalidator.revalidate();
                form.setValue("item_code", e.item_code);
                form.setValue("item_uuid", e.item_uuid);
                form.setValue("uom", e.uom);
                form.setValue("item_price_uuid", e.uuid);
                form.setValue("rate", e.rate);
              }}
              onCustomDisplay={(item, idx) => {
                return (
                  <div className="w-full">
                    {item.item_name} ({item.item_code}){" "}
                    {formatCurrency(
                      item.rate,
                      itemLine.currency,
                      i18n.language
                    )}
                  </div>
                );
              }}
            />

            <CustomFormField
              label={t("_item.code")}
              form={form}
              children={(field) => {
                return <Input disabled={true} {...field} readOnly={true} />;
              }}
              name={"item_code"}
            />

            <Typography fontSize={subtitle} className=" col-span-full">
              {t("f.and", { o: t("form.quantity"), p: t("form.rate") })}
            </Typography>

            <CustomFormField
              label={t("form.quantity")}
              form={form}
              required={true}
              children={(field) => {
                return <Input {...field} type="number" required={true} />;
              }}
              name={"quantity"}
            />
            <CustomFormField
              label={t("form.rate")}
              form={form}
              required={true}
              children={(field) => {
                return (
                  <AmountInput currency={itemLine.currency} field={field} />
                );
              }}
              name={"rate"}
            />

            <CustomFormField
              label={t("form.uom")}
              form={form}
              children={(field) => {
                return <Input disabled={true} {...field} readOnly={true} />;
              }}
              name={"uom"}
            />
          </div>
        </fetcher.Form>
      </Form>
    </DrawerLayout>
  );
}

interface ItemLineEditStore {
  open: boolean;
  isEdit: boolean;
  title?: string;
  allowEdit?: boolean;
  currency?: string;
  partyType?: string;
  itemLineType?:ItemLineType;
  lineReference?:number
  onEditItemForm?:(e:z.infer<typeof editLineItemSchema>)=>void
  onOpenChange: (e: boolean) => void;
  onOpenDialog: (opts: {
    title?: string;
    allowEdit: boolean;
    line?: components["schemas"]["ItemLineDto"];
    currency?: string;
    partyType: string;
    itemLineType:ItemLineType;
    lineReference?:number
    onEditItemForm?:(e:z.infer<typeof editLineItemSchema>)=>void
  }) => void;
  line?: components["schemas"]["ItemLineDto"];
}
export const useItemLine = create<ItemLineEditStore>((set) => ({
  open: false,
  isEdit: false,
  onOpenDialog: (opts) =>
    set((state) => ({
      open: true,
      title: opts.title,
      allowEdit: opts.allowEdit,
      line: opts.line,
      currency: opts.currency,
      partyType: opts.partyType,
      itemLineType:opts.itemLineType,
      lineReference:opts.lineReference,
      onEditItemForm:opts.onEditItemForm
    })),
  onOpenChange: (e) =>
    set((state) => ({
      open: e,
    })),
}));
