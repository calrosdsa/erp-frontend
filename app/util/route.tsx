
class Routes  {
    base = "/home"
    selling = this.base + "/selling"
    accounting = this.base + "/accounting"
    stock = this.base + "/stock"
    itemAttribute = this.stock + "/item-attributes"

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

}

export const routes = new Routes()