import { DrawerLayout } from "@/components/layout/drawer/DrawerLayout";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFetcher } from "@remix-run/react";
import { TrashIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { create } from "zustand";
import { DEFAULT_CURRENCY } from "~/constant";
import {
  lineItemSchema,
  lineItemReceipt,
} from "~/util/data/schemas/stock/line-item-schema";
import { useItemPriceForOrders } from "~/util/hooks/fetchers/useItemPriceForOrder";
import FormAutocomplete from "../../select/FormAutocomplete";
import {
  formatAmount,
  formatCurrency,
} from "~/util/format/formatCurrency";
import CustomFormField from "../../form/CustomFormField";
import { Input } from "@/components/ui/input";
import { action } from "~/routes/api.itemline/route";
import { routes } from "~/util/route";
import AmountInput from "../../input/AmountInput";
import { useDisplayMessage } from "~/util/hooks/ui/useDisplayMessage";
import { ItemLineType, PartyType, partyTypeToJSON } from "~/gen/common";
import { useWarehouseDebounceFetcher } from "~/util/hooks/fetchers/useWarehouseDebounceFetcher";
import { usePermission } from "~/util/hooks/useActions";
import { GlobalState } from "~/types/app";
import { useCreateWareHouse } from "~/routes/home.stock.warehouse_/components/add-warehouse";
import { Typography } from "@/components/typography";
import CustomFormFieldInput from "../../form/CustomFormInput";

export default function ItemLine({
  open,
  onOpenChange,
  globalState,
}: {
  open: boolean;
  onOpenChange: (e: boolean) => void;
  globalState: GlobalState;
}) {
  const itemLine = useItemLine();
  const { line } = itemLine;
  const { t, i18n } = useTranslation("common");
  const fetcher = useFetcher<typeof action>();
  const r = routes;
  const form = useForm<z.infer<typeof lineItemSchema>>({
    resolver: zodResolver(lineItemSchema),
    defaultValues: {
      itemLineID: line?.itemLineID,
      quantity: line?.quantity,
      rate: line?.rate,
      lineType: itemLine.itemLineType,

      item_code: line?.item_code,
      item_name: line?.item_name,
      uom: line?.uom,
      // uom: line?.uom,
      party_type: itemLine.partyType,
      item_price_id: line?.item_price_id,

      // lineItemReceipt: lineItemReceipt,
      // itemLineReference:line.refe
    },
  });
  const [itemPriceDebounceFetcher, onItemPriceChange] = useItemPriceForOrders({
    isBuying:
      itemLine.partyType == partyTypeToJSON(PartyType.purchaseOrder) ||
      itemLine.partyType == partyTypeToJSON(PartyType.purchaseReceipt) ||
      itemLine.partyType == partyTypeToJSON(PartyType.purchaseInvoice),
    isSelling:
      itemLine.partyType == partyTypeToJSON(PartyType.saleOrder) ||
      itemLine.partyType == partyTypeToJSON(PartyType.saleInvoice) ||
      itemLine.partyType == partyTypeToJSON(PartyType.deliveryNote),
    currency: itemLine.currency || DEFAULT_CURRENCY,
  });

  const [warehouseFetcher, onWarehouseChange] = useWarehouseDebounceFetcher({
    isGroup: false,
  });
  const [permissionWarehouse] = usePermission({
    roleActions: globalState.roleActions,
    actions: warehouseFetcher.data?.actions,
  });
  const createWareHouse = useCreateWareHouse();

  const onSubmit = (values: z.infer<typeof lineItemSchema>) => {
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
      if (itemLine.onEditItemForm) {
        itemLine.onEditItemForm(values);
        onOpenChange(false);
      }
      console.log("VALUES", values);
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
      <Form {...form}>
        {JSON.stringify(form.formState.errors)}
        <fetcher.Form
          onSubmit={form.handleSubmit(onSubmit)}
          className="px-2 pb-2"
        >
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
              allowEdit={itemLine.allowEdit}
              form={form}
              onValueChange={onItemPriceChange}
              onSelect={(e) => {
                form.setValue("item_code", e.item_code);
                form.setValue("uom", e.uom);
                form.setValue("item_price_id", e.id);
                form.setValue("rate", formatAmount(e.rate));
              }}
              onCustomDisplay={(e)=>{
                return (
                  <div className="flex flex-col">
                    <div className="flex font-medium space-x-1">
                      <span>{e.item_name}</span>
                      <span className=" uppercase">{" "}{e.uuid.slice(0,5)}</span>
                    </div>
                    <div className="flexspace-x-1">
                      {e.price_list_name}: {formatCurrency(e.rate,e.price_list_currency,i18n.language)}
                    </div>
                  </div>
                )
              }}
            />

            <CustomFormFieldInput
              label={t("_item.code")}
              control={form.control}
              allowEdit={false}
              inputType="input"
              name={"item_code"}
            />

            <Typography className=" col-span-full" variant="subtitle2">
              {t("f.and", { o: t("form.quantity"), p: t("form.rate") })}
            </Typography>

            {itemLine.itemLineType != ItemLineType.ITEM_LINE_RECEIPT && (
              <CustomFormFieldInput
                label={t("form.quantity")}
                control={form.control}
                required={true}
                allowEdit={itemLine.allowEdit}
                inputType="input"
                name={"quantity"}
              />
            )}

            {itemLine.itemLineType == ItemLineType.ITEM_LINE_RECEIPT && (
              <>
                <CustomFormFieldInput
                  required={true}
                  name="lineItemReceipt.acceptedQuantity"
                  label={t("f.accepted", { o: t("form.quantity") })}
                  control={form.control}
                  allowEdit={itemLine.allowEdit}
                  inputType="input"
                />
                <CustomFormFieldInput
                  name="lineItemReceipt.rejectedQuantity"
                  label={t("f.rejected", { o: t("form.quantity") })}
                  control={form.control}
                  allowEdit={itemLine.allowEdit}
                  inputType="input"
                />
              </>
            )}

            <CustomFormFieldInput
              label={t("form.rate")}
              control={form.control}
              required={true}
              name={"rate"}
              allowEdit={itemLine.allowEdit}
              inputType="input"
            />

            <CustomFormFieldInput
              label={t("form.uom")}
              control={form.control}
              name={"uom"}
              allowEdit={false}
              inputType="input"
            />

            {itemLine.itemLineType == ItemLineType.ITEM_LINE_RECEIPT && (
              <>
                <Typography variant="subtitle2" className=" col-span-full">
                  {t("_warehouse.base")}
                </Typography>
                <FormAutocomplete
                  data={warehouseFetcher.data?.warehouses || []}
                  nameK={"name"}
                  label={t("f.accepted", { o: t("_warehouse.base") })}
                  name="lineItemReceipt.acceptedWarehouseName"
                  form={form}
                  allowEdit={itemLine.allowEdit}
                  onValueChange={onWarehouseChange}
                  onSelect={(e) => {
                    form.setValue("lineItemReceipt.acceptedWarehouse", e.id);
                  }}
                  {...(permissionWarehouse?.create && {
                    addNew: () => {
                      createWareHouse.openDialog({});
                    },
                  })}
                />

                <FormAutocomplete
                  data={warehouseFetcher.data?.warehouses || []}
                  nameK={"name"}
                  label={t("f.rejected", { o: t("_warehouse.base") })}
                  name="lineItemReceipt.rejectedWarehouseName"
                  form={form}
                  allowEdit={itemLine.allowEdit}
                  onValueChange={onWarehouseChange}
                  onSelect={(e) => {
                    form.setValue("lineItemReceipt.rejectedWarehouse", e.id);
                  }}
                  {...(permissionWarehouse?.create && {
                    addNew: () => {
                      createWareHouse.openDialog({});
                    },
                  })}
                />
              </>
            )}
          </div>
        </fetcher.Form>
      </Form>
    </DrawerLayout>
  );
}

interface ItemLineEditStore {
  open: boolean;
  title?: string;
  allowEdit?: boolean;
  currency?: string;
  partyType?: string;
  itemLineType?: ItemLineType;

  // lineItemReceipt?: z.infer<typeof lineItemReceipt>;
  onEditItemForm?: (e: z.infer<typeof lineItemSchema>) => void;
  onOpenChange: (e: boolean) => void;
  onOpenDialog: (opts: {
    title?: string;
    allowEdit?: boolean;
    line?: z.infer<typeof lineItemSchema>;

    // lineItemReceipt?: z.infer<typeof lineItemReceipt>;
    currency?: string;
    partyType: string;
    itemLineType: ItemLineType;
    onEditItemForm?: (e: z.infer<typeof lineItemSchema>) => void;
  }) => void;
  line?: z.infer<typeof lineItemSchema>;
}
export const useItemLine = create<ItemLineEditStore>((set) => ({
  open: false,
  onOpenDialog: (opts) =>
    set((state) => ({
      open: true,
      title: opts.title,
      allowEdit: opts.allowEdit,
      line: opts.line,
      currency: opts.currency,
      partyType: opts.partyType,
      itemLineType: opts.itemLineType,
      // lineItemReceipt: opts.lineItemReceipt,
      onEditItemForm: opts.onEditItemForm,
    })),
  onOpenChange: (e) =>
    set((state) => ({
      open: e,
    })),
}));
