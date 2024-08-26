
class Routes  {
    base = "/home"
    selling = this.base + "/selling"

    accounting = this.base + "/accounting"
    taxes =  this.accounting + "/taxes"

    stock = this.base + "/stock"
    item = this.stock + "/items"
    itemGroups = this.stock + "/item-groups"
    itemAttribute = this.stock + "/item-attributes"

    purchases = this.base + "/purchases"
    purchaseorders = this.purchases + "/orders"

    settings = this.base + "/settings"
    profile = this.settings + "/profile"
    account = this.settings + "/account"


    priceListDetail(id:string):string {
        return `${this.selling}/stock/price-list/${encodeURIComponent(id)}`
    }

    taxDetailRoute(id:string):string {
        return `${this.accounting}/taxes/${encodeURIComponent(id)}`
    }

    createItemAttributeRoute= `${this.itemAttribute}/create`

    toItemAttributeDetail(id:string):string {
        return `${this.itemAttribute}/${encodeURIComponent(id)}`
    }

    //Item
    toItemDetail(id:string):string{
        return `${this.item}/${encodeURIComponent(id)}`
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