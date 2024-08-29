
class Routes  {
    base = "/home"
    selling = this.base + "/selling"
    sellingStock = this.selling + "/stock"
    priceList = this.sellingStock + "/price-list"

    accounting = this.base + "/accounting"
    taxes =  this.accounting + "/taxes"

    stock = this.base + "/stock"
    item = this.stock + "/items"
    itemGroups = this.stock + "/item-groups"
    itemAttribute = this.stock + "/item-attributes"
    warehouses =  this.stock + "/warehouses"

    purchases = this.base + "/purchases"
    purchaseorders = this.purchases + "/orders"

    settings = this.base + "/settings"
    profile = this.settings + "/profile"
    account = this.settings + "/account"


    

    priceListDetail(id:string):string {
        return `${this.priceList}/${encodeURIComponent(id)}`
    }

    taxDetailRoute(id:string):string {
        return `${this.accounting}/taxes/${encodeURIComponent(id)}`
    }

    createItemAttributeRoute= `${this.itemAttribute}/create`

    toItemAttributeDetail(id:string):string {
        return `${this.itemAttribute}/${encodeURIComponent(id)}`
    }

    //STOCK
    toCreateItem():string {
        return this.item + "/create_item"
    }
    toItemDetail(id:string):string{
        return `${this.item}/${encodeURIComponent(id)}`
    }
    toItemDetailPrices(id:string):string {
        return `${this.item}/${encodeURIComponent(id)}/item-prices`
    }
    toItemDetailVariants(id:string):string {
        return `${this.item}/${encodeURIComponent(id)}/variants`
    }
    toItemDetailStock(id:string):string {
        return `${this.item}/${encodeURIComponent(id)}/stock`
    }
    toDetailWarehouse(id:string):string{
        return `${this.warehouses}/${encodeURIComponent(id)}`
    }

    //Item group
    toItemGroupDetail(id:string):string{
        return `${this.itemGroups}/${encodeURIComponent(id)}`
    }

    //Acouting
    toTaxDetail(id:string):string{
        return `${this.taxes}/${encodeURIComponent(id)}`
    }

}

export const routes = new Routes()