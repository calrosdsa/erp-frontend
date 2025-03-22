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
  schemaToLineItemData,
} from "~/util/data/schemas/stock/line-item-schema";
import { PriceAutocompleteForm, useItemPriceForOrders } from "~/util/hooks/fetchers/use-item-price-for-order";
import FormAutocomplete from "../../select/FormAutocomplete";
import { formatAmount, formatCurrency } from "~/util/format/formatCurrency";
import { action } from "~/routes/api.itemline/route";
import { route } from "~/util/route";
import { useDisplayMessage } from "~/util/hooks/ui/useDisplayMessage";
import {
  ItemLineType,
  itemLineTypeToJSON,
  PartyType,
  partyTypeToJSON,
} from "~/gen/common";
import {
  useWarehouseDebounceFetcher,
  WarehouseAutocompleteForm,
} from "~/util/hooks/fetchers/useWarehouseDebounceFetcher";
import { usePermission } from "~/util/hooks/useActions";
import { GlobalState } from "~/types/app-types";
import { useCreateWareHouse } from "~/routes/home.stock.warehouse_/components/add-warehouse";
import { Typography } from "@/components/typography";
import CustomFormFieldInput from "../../form/CustomFormInput";
import { useTotal } from "../document/use-total";
import { components } from "~/sdk";
import { useConfirmationDialog } from "@/components/layout/drawer/ConfirmationDialog";
import { mapToTaxAndChargeLineDto } from "~/util/data/schemas/accounting/tax-and-charge-schema";

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
  const {
    line,
    docPartyType,
    docPartyID,
    currency,
    allowEdit,
    onEdit,
    onDelete,
    title,
    updateStock,
  } = itemLine.payload as Payload;
  const { t, i18n } = useTranslation("common");
  const fetcher = useFetcher<typeof action>();
  const r = route;
  const form = useForm<z.infer<typeof lineItemSchema>>({
    resolver: zodResolver(lineItemSchema),
    defaultValues: {
      ...line,
    },
  });
  const confirmationDialog = useConfirmationDialog();
  const [itemPriceDebounceFetcher, onItemPriceChange] = useItemPriceForOrders({
    isBuying:
      docPartyType == partyTypeToJSON(PartyType.purchaseOrder) ||
      docPartyType == partyTypeToJSON(PartyType.purchaseReceipt) ||
      docPartyType == partyTypeToJSON(PartyType.purchaseInvoice),
    isSelling:
      docPartyType == partyTypeToJSON(PartyType.saleOrder) ||
      docPartyType == partyTypeToJSON(PartyType.saleInvoice) ||
      docPartyType == partyTypeToJSON(PartyType.deliveryNote),
    currency: currency || DEFAULT_CURRENCY,
  });
  const formValues = form.getValues();
  const { getTotalAndQuantity,taxLines } = useTotal();
  const submitTaxLine = (
    actionType: "edit-line-item" | "add-line-item",
    lineItem: z.infer<typeof lineItemSchema>
  ) => {
    const lineItemData = schemaToLineItemData(lineItem, {
      updateStock: updateStock,
    });
    const [totalAmount, totalQuantity, totalAmountItems] = getTotalAndQuantity(
      actionType,
      lineItem
    );
    const baseBody = {
      doc_party_id: docPartyID ?? 0,
      doc_party_type: docPartyType ?? "",
      update_stock: updateStock || false,
      total_amount: totalAmount,
      total_items: totalQuantity,
      total_amount_items: totalAmountItems,
      line_item_data: lineItemData,
      charges:taxLines.map(t=> mapToTaxAndChargeLineDto(t)),
    };

    const submitData =
      actionType === "edit-line-item"
        ? {
            id: lineItem.itemLineID ?? 0,
            ...baseBody,
          }
        : {
            ...baseBody,
          };

    fetcher.submit(
      {
        action: actionType,
        [actionType === "edit-line-item" ? "editData" : "addData"]: submitData,
      },
      {
        encType: "application/json",
        action: r.apiItemLine,
        method: "POST",
      }
    );
  };

  const onSubmit = (data: z.infer<typeof lineItemSchema>) => {
    if (data.itemLineID) {
      submitTaxLine("edit-line-item", data);
    } else if (docPartyID) {
      submitTaxLine("add-line-item", data);
    } else if (onEdit) {
      onEdit(data);
      onOpenChange(false);
    }
  };

  const deleteTaxLine = () => {
    if (formValues.itemLineID) {
      const [totalAmount, totalQuantity, totalAmountItems] =
        getTotalAndQuantity("delete-line-item", formValues);
      const body: components["schemas"]["DeleteLineItemRequestBody"] = {
        id: formValues.itemLineID,
        doc_party_id: docPartyID ?? 0,
        doc_party_type: docPartyType ?? "",
        total_amount_items: totalAmountItems,
        total_amount: totalAmount,
        total_items: totalQuantity,
        charges:taxLines.map(t=> mapToTaxAndChargeLineDto(t)),
      };
      confirmationDialog.onOpenDialog({
        onConfirm: () => {
          fetcher.submit(
            { action: "delete-line-item", deleteData: body },
            {
              encType: "application/json",
              action: r.apiItemLine,
              method: "POST",
            }
          );
        },
        title: "Eliminar línea de artículos",
      });
    } else if (onDelete) {
      onDelete();
      onOpenChange(false);
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
      title={title}
      className=" max-w-2xl "
    >
      <Form {...form}>
        {/* {JSON.stringify(form.formState.errors)} */}
        {/* {JSON.stringify(formValues)} */}
        <fetcher.Form
          onSubmit={form.handleSubmit(onSubmit)}
          className="px-2 pb-2"
        >
          <div className="flex flex-col ">
            {allowEdit && (
              <div className=" flex flex-wrap gap-x-3 ">
                {onDelete && (
                  <Button size="xs" type="button" onClick={deleteTaxLine}>
                    <TrashIcon size={15} />
                  </Button>
                )}
                {/* <Button size={"xs"}>
                  <TrashIcon size={15} />
                </Button> */}
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
          <PriceAutocompleteForm
           allowEdit={allowEdit}
           control={form.control}
           currency={currency}
           label={t("item")}
           onSelect={(e)=>{
            form.setValue("item_code", e.item_code);
            form.setValue("uom", e.uom);
            form.setValue("item_price_id", e.id);
            form.setValue("rate", formatAmount(e.rate));
           }}
           lang={i18n.language}
           docPartyType={docPartyType || ""}
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

            {/* {formValues.lineType !=
              itemLineTypeToJSON(ItemLineType.ITEM_LINE_RECEIPT) &&
              !updateStock && ( */}
                <CustomFormFieldInput
                  label={t("form.quantity")}
                  control={form.control}
                  required={true}
                  allowEdit={allowEdit}
                  inputType="input"
                  name={"quantity"}
                />
              {/* )} */}

            {/* {(formValues.lineType ==
              itemLineTypeToJSON(ItemLineType.ITEM_LINE_RECEIPT) ||
              updateStock) && (
              <>
                <CustomFormFieldInput
                  required={true}
                  name="lineItemReceipt.acceptedQuantity"
                  label={"Cantidad Aceptada"}
                  control={form.control}
                  allowEdit={allowEdit}
                  inputType="input"
                />
                <CustomFormFieldInput
                  name="lineItemReceipt.rejectedQuantity"
                  label={"Cantidad Rechazada"}
                  control={form.control}
                  allowEdit={allowEdit}
                  inputType="input"
                />
              </>
            )} */}

            <CustomFormFieldInput
              label={t("form.rate")}
              control={form.control}
              required={true}
              name={"rate"}
              allowEdit={allowEdit}
              inputType="input"
            />

            <CustomFormFieldInput
              label={t("form.uom")}
              control={form.control}
              name={"uom"}
              allowEdit={false}
              inputType="input"
            />
            {(formValues.lineType ==
              itemLineTypeToJSON(ItemLineType.DELIVERY_LINE_ITEM) ||
              updateStock) && (
              <>
                <Typography variant="subtitle2" className=" col-span-full">
                  {t("warehouse")}
                </Typography>
                <WarehouseAutocompleteForm
                  allowEdit={allowEdit}
                  control={form.control}
                  label={t("warehouse")}
                  name="deliveryLineItem.sourceWarehouse"
                  onSelect={(e) => {
                    form.setValue("deliveryLineItem.sourceWarehouseID", e.id);
                  }}
                  isGroup={false}
                />
                {/* <WarehouseAutocompleteForm
                  allowEdit={allowEdit}
                  name="lineItemReceipt.rejectedWarehouse"
                  label={"Almacén Rechazado"}
                  control={form.control}
                  onSelect={(e) => {
                    form.setValue("lineItemReceipt.rejectedWarehouseID", e.id);
                  }}
                  isGroup={false}
                /> */}
              </>
            )}

            {(formValues.lineType ==
              itemLineTypeToJSON(ItemLineType.ITEM_LINE_RECEIPT) ||
              updateStock) && (
              <>
                <Typography variant="subtitle2" className=" col-span-full">
                  {t("_warehouse.base")}
                </Typography>
                <WarehouseAutocompleteForm
                  allowEdit={allowEdit}
                  control={form.control}
                  label={t("warehouse")}
                  name="lineItemReceipt.acceptedWarehouse"
                  onSelect={(e) => {
                    form.setValue("lineItemReceipt.acceptedWarehouseID", e.id);
                  }}
                  isGroup={false}
                />
                {/* <WarehouseAutocompleteForm
                  allowEdit={allowEdit}
                  name="lineItemReceipt.rejectedWarehouse"
                  label={"Almacén Rechazado"}
                  control={form.control}
                  onSelect={(e) => {
                    form.setValue("lineItemReceipt.rejectedWarehouseID", e.id);
                  }}
                  isGroup={false}
                /> */}
              </>
            )}
          </div>
        </fetcher.Form>
      </Form>
    </DrawerLayout>
  );
}

interface Payload {
  title?: string;
  allowEdit: boolean;
  currency: string;
  docPartyType?: string;
  docPartyID?: number;
  updateStock?: boolean;
  line: z.infer<typeof lineItemSchema>;
  onEdit?: (e: z.infer<typeof lineItemSchema>) => void;
  onDelete?: () => void;
}

interface ItemLineEditStore {
  open: boolean;
  payload?: Payload;
  // lineItemReceipt?: z.infer<typeof lineItemReceipt>;
  onOpenChange: (e: boolean) => void;
  onOpenDialog: (opts: Payload) => void;
}
export const useItemLine = create<ItemLineEditStore>((set) => ({
  open: false,
  onOpenDialog: (opts) =>
    set((state) => ({
      open: true,
      payload: opts,
    })),
  onOpenChange: (e) =>
    set((state) => ({
      open: e,
    })),
}));
