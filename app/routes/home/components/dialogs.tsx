import { AddTax, useCreateTax } from "~/routes/home.accounting.taxes_/components/add-tax"
import { CreateCompany, useCreateCompany } from "~/routes/home.companies_/components/create-company"
import { CreateUser, useCreateUser } from "~/routes/home.manage.users_/components/create-user"
import { AddPriceList, useCreatePriceList } from "~/routes/home.selling_.stock_.price-list/components/add-price-list"
import { AddItemGroupItem, useCreateItemGroup } from "~/routes/home.stock.item-groups_/components/add-item-group"
import AddItemPrice, { useAddItemPrice } from "~/routes/home.stock.item-prices_/components/add-item-price"
import { UpsertItemStockLevel, useUpsertItemStockLevel } from "~/routes/home.stock.items.$code.stock_/components/upsert-item-stock-level"
import CreateItemVariant, { useCreateItemVariant } from "~/routes/home.stock.items.$code.variants_/components/create-item-variant"
import { CreateWareHouse, useCreateWareHouse } from "~/routes/home.stock.warehouses_/components/add-warehouse"


export default function GlobalDialogs(){
    const createItemGroup = useCreateItemGroup()
    const addItemStockLevel = useUpsertItemStockLevel()
    const createTax = useCreateTax()
    const createPriceList = useCreatePriceList()
    const addItemPrice = useAddItemPrice()
    const createItemVariant = useCreateItemVariant()
    const createWareHouse = useCreateWareHouse()

    const createCompany = useCreateCompany()

    const createUser = useCreateUser()
    return (
        <>
        {createUser.open && 
        <CreateUser
        open={createUser.open}
        onOpenChange={createUser.onOpenChange}
        permission={createUser.permission}
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
        item={addItemPrice.item}
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
        {createItemGroup.isOpen &&
        <AddItemGroupItem
        open={createItemGroup.isOpen}
        onOpenChange={createItemGroup.onOpenChage}
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