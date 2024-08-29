import { AddTax, useCreateTax } from "~/routes/home.accounting.taxes_/components/add-tax"
import { AddPriceList, useCreatePriceList } from "~/routes/home.selling_.stock_.price-list/components/add-price-list"
import { AddItemGroupItem, useCreateItemGroup } from "~/routes/home.stock.item-groups_/components/add-item-group"
import { UpsertItemStockLevel, useUpsertItemStockLevel } from "~/routes/home.stock.items.$code.stock_/components/add-item-stock-level"


export default function GlobalDialogs(){
    const createItemGroup = useCreateItemGroup()
    const addItemStockLevel = useUpsertItemStockLevel()
    const createTax = useCreateTax()
    const createPriceList = useCreatePriceList()
    return (
        <>
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