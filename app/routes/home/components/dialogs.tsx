// import { AddLineOrder, useAddLineOrder } from "@/components/custom/shared/item/add-item-line"
import ItemLine, {
  useItemLine,
} from "@/components/custom/shared/item/item-line";
import {
  ExporterData,
  useExporterData,
} from "~/routes/api.exporter/components/use-exporter-data";
import {
  CreateEvent,
  useCreateEvent,
} from "~/routes/home._regate.event_/components/use-create-event";
import {
  AddTax,
  useCreateTax,
} from "~/routes/home.accounting.taxes_/components/add-tax";
import {
  CreateCompany,
  useCreateCompany,
} from "~/routes/home.companies_/components/create-company";
import {
  CreateGroup,
  useCreateGroup,
} from "~/routes/home.groups.$party_/components/create-group";
import {
  CreateUser,
  useCreateUser,
} from "~/routes/home.manage.users_/components/create-user";
import AddItemPrice, {
  useAddItemPrice,
} from "~/routes/home.stock.itemPrice_/components/add-item-price";
import {
  UpsertItemStockLevel,
  useUpsertItemStockLevel,
} from "~/routes/home.stock.item.$code.stock_/components/upsert-item-stock-level";
import CreateItemVariant, {
  useCreateItemVariant,
} from "~/routes/home.stock.item.$code.variants_/components/create-item-variant";
import { GlobalState } from "~/types/app";
import {
  NewItemPriceDialog,
  useNewItemPrice,
} from "~/routes/home.stock.itemPrice.new/components/new-item-price-dialog";
import {
  CreateSupplier,
  useCreateSupplier,
} from "~/routes/home.buying.supplier_/components/create-supplier";
import {
  CreateWareHouse,
  useCreateWareHouse,
} from "~/routes/home.stock.warehouse_/components/add-warehouse";
import {
  CreateCustomer,
  useCreateCustomer,
} from "~/routes/home.selling.customer_/components/create-customer";
import {
  AddPriceList,
  useCreatePriceList,
} from "~/routes/home.stock.priceList_/components/add-price-list";
import { SessionDefaultDrawer, useSessionDefaults } from "./SessionDefaults";
import TaxAndChargeLine, {
  useTaxAndCharge,
} from "@/components/custom/shared/accounting/tax-and-charge-line";

export default function GlobalDialogs({
  globalState,
}: {
  globalState: GlobalState;
}) {
  const sessionDefaults = useSessionDefaults();
  const createGroup = useCreateGroup();

  const createSupplier = useCreateSupplier();

  const addItemStockLevel = useUpsertItemStockLevel();
  const createTax = useCreateTax();
  const createPriceList = useCreatePriceList();
  const newItemPrice = useNewItemPrice();
  const addItemPrice = useAddItemPrice();
  const createItemVariant = useCreateItemVariant();
  const createWareHouse = useCreateWareHouse();

  const createCompany = useCreateCompany();

  const createCustomer = useCreateCustomer();

  const createUser = useCreateUser();
  // const addLineOrder = useAddLineOrder()

  const itemLine = useItemLine();
  const taxAndCharges = useTaxAndCharge();

  const exporterData = useExporterData();

  //Regate
  const createEvent = useCreateEvent();
  return (
    <>
      {sessionDefaults.open && (
        <SessionDefaultDrawer
          open={sessionDefaults.open}
          onOpenChange={sessionDefaults.onOpenChange}
          session={globalState.session}
        />
      )}
      {newItemPrice.open && (
        <NewItemPriceDialog
          open={newItemPrice.open}
          onOpenChange={newItemPrice.onOpenChange}
          globalState={globalState}
        />
      )}

      {exporterData.open && (
        <ExporterData
          open={exporterData.open}
          onOpenChange={exporterData.onOpenChange}
        />
      )}
      {taxAndCharges.open && (
        <TaxAndChargeLine
          open={taxAndCharges.open}
          onOpenChange={taxAndCharges.onOpenChange}
        />
      )}
      {itemLine.open && (
        <ItemLine
          open={itemLine.open}
          onOpenChange={itemLine.onOpenChange}
          globalState={globalState}
        />
      )}
      {createCustomer.open && (
        <CreateCustomer
          open={createCustomer.open}
          onOpenChange={createCustomer.onOpenChange}
          globalState={globalState}
        />
      )}
      {/* {(addLineOrder.open && addLineOrder.currency)&& 
        <AddLineOrder
        open={addLineOrder.open}
        currency={addLineOrder.currency}
        onOpenChange={addLineOrder.onOpenChange}
        setOrderLine={(e)=>addLineOrder.setOrderLine(e)}
        itemLineType={addLineOrder.itemLineType}
        />
        } */}
      {createSupplier.open && (
        <CreateSupplier
          open={createSupplier.open}
          onOpenChange={createSupplier.onOpenChange}
          globalState={globalState}
        />
      )}
      {createGroup.open && (
        <CreateGroup
          open={createGroup.open}
          onOpenChange={createGroup.onOpenChange}
        />
      )}
      {createUser.open && (
        <CreateUser
          open={createUser.open}
          onOpenChange={createUser.onOpenChange}
          permission={createUser.permission}
          globalState={globalState}
        />
      )}
      {createWareHouse.open && (
        <CreateWareHouse
          open={createWareHouse.open}
          onOpenChange={createWareHouse.onOpenChange}
        />
      )}
      {createItemVariant.open && (
        <CreateItemVariant
          open={createItemVariant.open}
          onOpenChange={createItemVariant.onOpenChange}
          item={createItemVariant.item}
        />
      )}
      {createCompany.open && (
        <CreateCompany
          open={createCompany.open}
          onOpenChange={createCompany.onOpenChange}
        />
      )}
      {addItemPrice.open && (
        <AddItemPrice
          open={addItemPrice.open}
          itemUuid={addItemPrice.itemUuid}
          onOpenChange={addItemPrice.onOpenChange}
        />
      )}
      {createPriceList.open && (
        <AddPriceList
          open={createPriceList.open}
          onOpenChange={createPriceList.onOpenChange}
        />
      )}
      {createTax.isOpen && (
        <AddTax open={createTax.isOpen} onOpenChange={createTax.onOpenChange} />
      )}
      {addItemStockLevel.isOpen && (
        <UpsertItemStockLevel
          itemUuid={addItemStockLevel.itemUuid}
          open={addItemStockLevel.isOpen}
          onOpenChange={addItemStockLevel.onOpenChange}
          warehouseUuid={addItemStockLevel.warehouseUuid}
          stockLevel={addItemStockLevel.stockLevel}
        />
      )}

      {/* REGATE */}
      {createEvent.open && (
        <CreateEvent
          open={createEvent.open}
          onOpenChange={createEvent.onOpenChange}
        />
      )}
    </>
  );
}
