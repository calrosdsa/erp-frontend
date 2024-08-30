import { create } from "zustand";
import { components } from "~/sdk";
import { action } from "../route";
import { DrawerLayout } from "@/components/layout/drawer/DrawerLayout";
import CustomForm from "@/components/custom/form/CustomForm";
import { itemStockSchemaForm } from "~/util/data/schemas/stock/item-stock-schema";
import { z } from "zod";
import { useFetcher, useParams } from "@remix-run/react";
import { toast, useToast } from "@/components/ui/use-toast";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDebounceFetcher } from "remix-utils/use-debounce-fetcher";
import FormAutocomplete from "@/components/custom/select/FormAutocomplete";
import { routes } from "~/util/route";
import { useCreateWareHouse } from "~/routes/home.stock.warehouses_/components/add-warehouse";

export const UpsertItemStockLevel = ({
  open,
  onOpenChange,
  item,
  warehouse,
  stockLevel,
}: {
  open: boolean;
  onOpenChange: (e: boolean) => void;
  item: components["schemas"]["Item"] | undefined;
  warehouse?: components["schemas"]["WareHouse"] | undefined;
  stockLevel?: components["schemas"]["StockLevel"] | undefined;
}) => {
  const fetcher = useFetcher<typeof action>();
  const { toast } = useToast();
  const { t } = useTranslation("common");
  const createWareHouse = useCreateWareHouse()
  const warehousesDebounceFetcher = useDebounceFetcher<{
    warehouses: components["schemas"]["WareHouse"][];
  }>();
  const itemsDebounceFetcher = useDebounceFetcher<{
    items: components["schemas"]["Item"][];
  }>();
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
        schema={itemStockSchemaForm}
        fetcher={fetcher}
        defaultValues={
          {
            itemId: item?.ID || stockLevel?.ItemID,
            warehouseId: warehouse?.ID || stockLevel?.WareHouseID,
            stock: stockLevel?.Stock.toString() as any,
            outOfStockThreshold:
              stockLevel?.OutOfStockThreshold.toString() as any,
            enabled: stockLevel?.Enabled,
          } as z.infer<typeof itemStockSchemaForm>
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
        onSubmit={(values: z.infer<typeof itemStockSchemaForm>) => {
          fetcher.submit(
            {
              action: stockLevel
                ? "edit-item-stock-level"
                : "add-item-stock-level",
              addItemStockLevel: values,
            },
            {
              method: "POST",
              action: r.toItemDetailStock(params.code || ""),
              encType: "application/json",
            }
          );
        }}
        renderCustomInputs={(form) => {
          return (
            <>
              {(warehouse == undefined && stockLevel== undefined) && (
                  <FormAutocomplete
                    form={form}
                    data={warehousesDebounceFetcher.data?.warehouses || []}
                    label={t("warehouses")}
                    value={"Name"}
                    nameK={"Name"}
                    name="warehouseName"
                    addNew={()=>{
                      createWareHouse.openDialog({})
                    }}
                    onSelect={(e) => {
                      form.setValue("warehouseId", e.ID);
                    }}
                    onValueChange={(e) => {
                      warehousesDebounceFetcher.submit(
                        { query: e, action: "get" },
                        {
                          debounceTimeout: 600,
                          method: "POST",
                          action: r.warehouses,
                          encType: "application/json",
                        }
                      );
                    }}
                    onOpen={() => {
                      warehousesDebounceFetcher.submit(
                        { query: "", action: "get" },
                        {
                          method: "POST",
                          action: r.warehouses,
                          encType: "application/json",
                        }
                      );
                    }}
                  />
                )}
              {(item == undefined && stockLevel == undefined) && (
                  <FormAutocomplete
                    form={form}
                    data={itemsDebounceFetcher.data?.items || []}
                    label={t("items")}
                    value={"Name"}
                    nameK={"Name"}
                    name="itemName"
                    onSelect={(e) => {
                      form.setValue("itemId", e.ID);
                    }}
                    onValueChange={(e) => {
                      itemsDebounceFetcher.submit(
                        { query: e, action: "get" },
                        {
                          debounceTimeout: 600,
                          method: "POST",
                          action: r.items,
                          encType: "application/json",
                        }
                      );
                    }}
                    onOpen={() => {
                      itemsDebounceFetcher.submit(
                        { query: "", action: "get" },
                        {
                          method: "POST",
                          action: r.items,
                          encType: "application/json",
                        }
                      );
                    }}
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
  item: components["schemas"]["Item"] | undefined;
  warehouse: components["schemas"]["WareHouse"] | undefined;
  stockLevel: components["schemas"]["StockLevel"] | undefined;
  isOpen: boolean;
  onOpenDialog: (opts: {
    open: boolean;
    item?: components["schemas"]["Item"];
    warehouse?: components["schemas"]["WareHouse"];
  }) => void;
  onOpenChange: (e: boolean) => void;
  editStockLevel: (stockLevel: components["schemas"]["StockLevel"]) => void;
};

export const useUpsertItemStockLevel = create<AddItemStocklevel>((set) => ({
  isOpen: false,
  item: undefined,
  warehouse: undefined,
  stockLevel: undefined,
  onOpenChange: (open) => set((state) => ({ isOpen: open })),
  onOpenDialog: (opts) =>
    set((state) => ({
      isOpen: opts.open,
      item: opts.item,
      warehouse: opts.warehouse,
    })),
  editStockLevel: (stockL) =>
    set((state) => ({
      stockLevel: stockL,
      isOpen: stockL != undefined,
    })),
}));
