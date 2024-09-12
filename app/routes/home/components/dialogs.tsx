import { AddTax, useCreateTax } from "~/routes/home.accounting.taxes_/components/add-tax"
import { AddLineOrder, useAddLineOrder } from "~/routes/home.buying.purchase-orders.create/components/add-line-order"
import { CreateSupplier, useCreateSupplier } from "~/routes/home.buying.suppliers_/components/create-supplier"
import { CreateCompany, useCreateCompany } from "~/routes/home.companies_/components/create-company"
import { CreateGroup, useCreateGroup } from "~/routes/home.groups/components/create-group"
import { CreateUser, useCreateUser } from "~/routes/home.manage.users_/components/create-user"
import { AddPriceList, useCreatePriceList } from "~/routes/home.selling_.stock_.price-list/components/add-price-list"
import AddItemPrice, { useAddItemPrice } from "~/routes/home.stock.item-prices_/components/add-item-price"
import { UpsertItemStockLevel, useUpsertItemStockLevel } from "~/routes/home.stock.items.$code.stock_/components/upsert-item-stock-level"
import CreateItemVariant, { useCreateItemVariant } from "~/routes/home.stock.items.$code.variants_/components/create-item-variant"
import { CreateWareHouse, useCreateWareHouse } from "~/routes/home.stock.warehouses_/components/add-warehouse"
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

    const createUser = useCreateUser()
    const addLineOrder = useAddLineOrder()
    return (
        <>
        {(addLineOrder.open && addLineOrder.currency)&& 
        <AddLineOrder
        open={addLineOrder.open}
        currency={addLineOrder.currency}
        onOpenChange={addLineOrder.onOpenChange}
        setOrderLine={(e)=>addLineOrder.setOrderLine(e)}
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
        partyType={createGroup.partyType}
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
        item={addItemStockLevel.item}
        open={addItemStockLevel.isOpen}
        onOpenChange={addItemStockLevel.onOpenChange}
        warehouse={addItemStockLevel.warehouse}
        stockLevel={addItemStockLevel.stockLevel}
        />
        }
        </>
    )
}