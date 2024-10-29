import { AddLineOrder, useAddLineOrder } from "@/components/custom/shared/item/add-item-line"
import ItemLine, { useItemLine } from "@/components/custom/shared/item/item-line"
import { ExporterData, useExporterData } from "~/routes/api.exporter/components/use-exporter-data"
import { CreateEvent, useCreateEvent } from "~/routes/home._regate.event_/components/use-create-event"
import { AddTax, useCreateTax } from "~/routes/home.accounting.taxes_/components/add-tax"
import { CreateCompany, useCreateCompany } from "~/routes/home.companies_/components/create-company"
import { CreateCustomer, useCreateCustomer } from "~/routes/home.customer_/components/create-customer"
import { CreateGroup, useCreateGroup } from "~/routes/home.groups.$party_/components/create-group"
import { CreateUser, useCreateUser } from "~/routes/home.manage.users_/components/create-user"
import { AddPriceList, useCreatePriceList } from "~/routes/home.selling.stock.price-list_/components/add-price-list"
import AddItemPrice, { useAddItemPrice } from "~/routes/home.stock.item-prices_/components/add-item-price"
import { UpsertItemStockLevel, useUpsertItemStockLevel } from "~/routes/home.stock.items.$code.stock_/components/upsert-item-stock-level"
import CreateItemVariant, { useCreateItemVariant } from "~/routes/home.stock.items.$code.variants_/components/create-item-variant"
import { CreateWareHouse, useCreateWareHouse } from "~/routes/home.stock.warehouses_/components/add-warehouse"
import { CreateSupplier, useCreateSupplier } from "~/routes/home.supplier_/components/create-supplier"
import { GlobalState } from "~/types/app"


export default function GlobalDialogs({globalState}:{
    globalState:GlobalState
}){
    const createGroup = useCreateGroup()

    const createSupplier = useCreateSupplier()

    const addItemStockLevel = useUpsertItemStockLevel()
    const createTax = useCreateTax()
    const createPriceList = useCreatePriceList()
    const addItemPrice = useAddItemPrice()
    const createItemVariant = useCreateItemVariant()
    const createWareHouse = useCreateWareHouse()

    const createCompany = useCreateCompany()

    const createCustomer = useCreateCustomer()

    const createUser = useCreateUser()
    const addLineOrder = useAddLineOrder()

    const itemLine = useItemLine()

    const exporterData = useExporterData()

    //Regate
    const createEvent = useCreateEvent()
    return (
        <>
        {exporterData.open && 
        <ExporterData
        open={exporterData.open}
        onOpenChange={exporterData.onOpenChange}
        />
        }

        {itemLine.open && 
        <ItemLine
        open={itemLine.open}
        onOpenChange={itemLine.onOpenChange}
        globalState={globalState}
        />
        }
        {createCustomer.open &&
        <CreateCustomer
        open={createCustomer.open}
        onOpenChange={createCustomer.onOpenChange}
        globalState={globalState}
        />
        }
        {(addLineOrder.open && addLineOrder.currency)&& 
        <AddLineOrder
        open={addLineOrder.open}
        currency={addLineOrder.currency}
        onOpenChange={addLineOrder.onOpenChange}
        setOrderLine={(e)=>addLineOrder.setOrderLine(e)}
        itemLineType={addLineOrder.itemLineType}
        />
        }
        {createSupplier.open &&
        <CreateSupplier
        open={createSupplier.open}
        onOpenChange={createSupplier.onOpenChange}
        globalState={globalState}
        />
        }
        {createGroup.open &&
        <CreateGroup
        open={createGroup.open}
        onOpenChange={createGroup.onOpenChange}
        />
        }
        {createUser.open && 
        <CreateUser
        open={createUser.open}
        onOpenChange={createUser.onOpenChange}
        permission={createUser.permission}
        globalState={globalState}
        />
        }
        {createWareHouse.open && 
        <CreateWareHouse
        open={createWareHouse.open}
        onOpenChange={createWareHouse.onOpenChange}
        />
        }
        {createItemVariant.open && 
        <CreateItemVariant
        open={createItemVariant.open}
        onOpenChange={createItemVariant.onOpenChange}
        item={createItemVariant.item}
        />
        }
        {createCompany.open && 
        <CreateCompany
        open={createCompany.open}
        onOpenChange={createCompany.onOpenChange}
        />
        }
        {addItemPrice.open && 
        <AddItemPrice
        open={addItemPrice.open}
        itemUuid={addItemPrice.itemUuid}
        onOpenChange={addItemPrice.onOpenChange}
        />
        }
        {createPriceList.open &&
        <AddPriceList
        open={createPriceList.open}
        onOpenChange={createPriceList.onOpenChange}
        />
        }
        {createTax.isOpen && 
        <AddTax
        open={createTax.isOpen}
        onOpenChange={createTax.onOpenChange}
        />
        }
        {addItemStockLevel.isOpen && 
        <UpsertItemStockLevel
        itemUuid={addItemStockLevel.itemUuid}
        open={addItemStockLevel.isOpen}
        onOpenChange={addItemStockLevel.onOpenChange}
        warehouseUuid={addItemStockLevel.warehouseUuid}
        stockLevel={addItemStockLevel.stockLevel}
        />
        }


        {/* REGATE */}
        {createEvent.open &&
        <CreateEvent
        open={createEvent.open}
        onOpenChange={createEvent.onOpenChange}
        />
        }
        </>
    )
}