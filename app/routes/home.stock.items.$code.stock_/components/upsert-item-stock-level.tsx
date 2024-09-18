import { create } from "zustand";
import { action } from "../route";
import { DrawerLayout } from "@/components/layout/drawer/DrawerLayout";
import CustomForm from "@/components/custom/form/CustomForm";
import { addStockLevelSchema } from "~/util/data/schemas/stock/item-stock-schema";
import { z } from "zod";
import { useFetcher, useParams } from "@remix-run/react";
import { toast, useToast } from "@/components/ui/use-toast";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDebounceFetcher } from "remix-utils/use-debounce-fetcher";
import FormAutocomplete from "@/components/custom/select/FormAutocomplete";
import { routes } from "~/util/route";
import { useCreateWareHouse } from "~/routes/home.stock.warehouses_/components/add-warehouse";
import { useWarehouseDebounceFetcher } from "~/util/hooks/fetchers/useWarehouseDebounceFetcher";
import { useItemDebounceFetcher } from "~/util/hooks/fetchers/useItemDebounceFetcher";
import { components } from "~/sdk";

export const UpsertItemStockLevel = ({
  open,
  onOpenChange,
  itemUuid,
  warehouseUuid,
  stockLevel,
}: {
  open: boolean;
  onOpenChange: (e: boolean) => void;
  itemUuid?: string;
  warehouseUuid?: string;
  stockLevel?: components["schemas"]["StockLevelDto"] | undefined;
}) => {
  const fetcher = useFetcher<typeof action>();
  const { toast } = useToast();
  const { t } = useTranslation("common");
  const createWareHouse = useCreateWareHouse();
  const [warehousesDebounceFetcher, onWarehouseNameChange] =
    useWarehouseDebounceFetcher();
  const [itemsDebounceFetcher, onItemNameChange] = useItemDebounceFetcher();
  const params = useParams();
  const r = routes;

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
      onOpenChange(false);
    }
  }, [fetcher.data]);
  return (
    <DrawerLayout
      open={open}
      onOpenChange={onOpenChange}
      title={t("_stock.addItemStockLevel")}
    >
      <CustomForm
        schema={addStockLevelSchema}
        fetcher={fetcher}
        defaultValues={
          {
            itemUuid: itemUuid || stockLevel?.item_uuid,
            warehouseUuid: warehouseUuid || stockLevel?.warehouse_uuid,
            stock: stockLevel?.stock.toString() as any,
            outOfStockThreshold:
              stockLevel?.out_of_stock_threshold.toString() as any,
            enabled: stockLevel?.enabled,
          } as z.infer<typeof addStockLevelSchema>
        }
        formItemsData={[
          {
            name: "stock",
            label: t("form.itemQuantity"),
            type: "number",
            typeForm: "input",
          },
          {
            name: "outOfStockThreshold",
            label: t("form.outOfStockThreshold"),
            type: "number",
            typeForm: "input",
          },
          {
            name: "enabled",
            label: t("form.enabled"),
            type: "boolean",
            typeForm: "check",
            description: "",
          },
        ]}
        onSubmit={(values: z.infer<typeof addStockLevelSchema>) => {
          fetcher.submit(
            {
              action: stockLevel
                ? "edit-item-stock-level"
                : "add-item-stock-level",
              addItemStockLevel: values,
            },
            {
              method: "POST",
              action: r.toItemDetailStock("Item",values.itemUuid),
              encType: "application/json",
            }
          );
        }}
        renderCustomInputs={(form) => {
          return (
            <>
              {warehouseUuid == undefined && stockLevel == undefined && (
                <FormAutocomplete
                  form={form}
                  data={warehousesDebounceFetcher.data?.warehouses || []}
                  label={t("warehouses")}
                  nameK={"name"}
                  name="warehouseName"
                  // addNew={() => {
                  //   createWareHouse.openDialog({});
                  // }}
                  onSelect={(e) => {
                    form.setValue("warehouseUuid", e.uuid);
                  }}
                  onValueChange={onWarehouseNameChange}
                />
              )}
              {itemUuid == undefined && stockLevel == undefined && (
                <FormAutocomplete
                  form={form}
                  data={itemsDebounceFetcher.data?.items || []}
                  label={t("items")}
                  nameK={"name"}
                  name="itemName"
                  onSelect={(e) => {
                    form.setValue("itemUuid", e.name);
                  }}
                  onValueChange={onItemNameChange}
                />
              )}
            </>
          );
        }}
      />
    </DrawerLayout>
  );
};

type AddItemStocklevel = {
  itemUuid: string | undefined;
  warehouseUuid: string | undefined;
  stockLevel: components["schemas"]["StockLevelDto"] | undefined;
  isOpen: boolean;
  onOpenDialog: (opts: {
    open: boolean;
    itemUuid?: string;
    warehouseUuid?: string;
  }) => void;
  onOpenChange: (e: boolean) => void;
  editStockLevel: (stockLevel: components["schemas"]["StockLevelDto"]) => void;
};

export const useUpsertItemStockLevel = create<AddItemStocklevel>((set) => ({
  isOpen: false,
  itemUuid: undefined,
  warehouseUuid: undefined,
  stockLevel: undefined,
  onOpenChange: (open) => set((state) => {
    if(open){
      return ({
        isOpen: open 
      })
    }else {
      return ({
        isOpen: open,
        itemUuid:undefined,
        warehouseUuid:undefined,
        stockLevel:undefined,
      })
    }
    }),
  onOpenDialog: (opts) =>
    set((state) => ({
      isOpen: opts.open,
      itemUuid: opts.itemUuid,
      warehouseUuid: opts.warehouseUuid,
    })),
  editStockLevel: (stockL) =>
    set((state) => ({
      stockLevel: stockL,
      isOpen: stockL != undefined,
    })),
}));
