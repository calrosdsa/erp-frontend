

export default  class Routes  {
    base = "/home"
    selling = this.base + "/selling"
    accounting = this.base + "/accounting"

    priceListDetail(id:string):string {
        return `${this.selling}/stock/price-list/${encodeURIComponent(id)}`
    }

    taxDetailRoute(id:string):string {
        return `${this.accounting}/taxes/${encodeURIComponent(id)}`
    }

}