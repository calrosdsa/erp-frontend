
class Routes  {
    api = "/api"
    apiData = this.api + "/data"
    base = "/home"
    groups = this.base + "/groups"
    companies = this.base + "/companies"

    buying = this.base +"/buying"
    supplierGroups = this.buying +"/supplier-groups"
    suppliers = this.buying +"/suppliers"
    purchaseOrders = this.buying + "/purchase-orders"

    selling = this.base + "/selling"
    sellingStock = this.selling + "/stock"
    priceList = this.sellingStock + "/price-list"

    accounting = this.base + "/accounting"
    taxes =  this.accounting + "/taxes"

    stock = this.base + "/stock"
    items = this.stock + "/items"
    itemPrices = this.stock + "/item-prices"
    itemGroups = this.stock + "/item-groups"
    itemAttributes = this.stock + "/item-attributes"
    warehouses =  this.stock + "/warehouses"

    manage = this.base + "/manage"
    users = this.manage + "/users"
    roles = this.manage + "/roles"



    purchases = this.base + "/purchases"
    purchaseorders = this.purchases + "/orders"

    settings = this.base + "/settings"
    uom = this.settings + "/uom"
    profile = this.settings + "/profile"
    account = this.settings + "/account"




    toCompanyDetail(name:string,id:string):string {
        return `${this.companies}/${encodeURIComponent(name)}?id=${id}`
    }
    

    priceListDetail(name:string,id:string):string {
        return `${this.priceList}/${encodeURIComponent(name)}?id=${id}`
    }

    taxDetailRoute(name:string,id:string):string {
        return `${this.accounting}/taxes/${encodeURIComponent(id)}`
    }

    createItemAttributeRoute= `${this.itemAttributes}/create`

    toItemAttributeDetail(name:string,id:string):string {
        return `${this.itemAttributes}/${encodeURIComponent(name)}?id=${id}`
    }

    //STOCK
    toCreateItem():string {
        return this.items + "/create_item"
    }
    toItem(id:string):string {
        return `${this.items}/${encodeURIComponent(id)}`
    }
    toItemDetail(name:string,id:string):string{
        return `${this.items}/${encodeURIComponent(name)}?id=${id}`
    }
    toItemDetailPrices(name:string,id:string):string {
        return `${this.items}/${encodeURIComponent(name)}/item-prices?id=${id}`
    }
    toItemDetailVariants(id:string):string {
        return `${this.items}/${encodeURIComponent(id)}/variants`
    }
    toItemDetailStock(id:string):string {
        return `${this.items}/${encodeURIComponent(id)}/stock`
    }
    toWarehouseInfo(name:string,id:string):string{
        return `${this.warehouses}/${encodeURIComponent(name)}/info?id=${id}`
    }
    toWarehouseItems(name:string,id:string):string{
        return `${this.warehouses}/${encodeURIComponent(name)}/items?id=${id}`
    }

    //Item group                                                                            
    toItemGroupDetail(id:string):string{
        return `${this.itemGroups}/${encodeURIComponent(id)}`
    }

    //Acouting
    toTaxDetail(name:string,id:string):string{
        return `${this.taxes}/${encodeURIComponent(name)}?id=${id}`
    }
    //Buyinh
    toSupplierGroup(name:string,id:string):string{
        return `${this.supplierGroups}/${encodeURIComponent(name)}?id=${id}`
    }
    toSupplierDetail(name:string,id:string):string{
        return `${this.suppliers}/${encodeURIComponent(name)}?id=${id}`
    }
    toPurchaseOrderDetail(name:string,id:string):string {
        return `${this.purchaseOrders}/${encodeURIComponent(name)}?id=${id}`
    }
    toPurchaseOrderCreate():string {
        return `${this.purchaseOrders}/create`
    }

    //Manage
    toUserProfileDetail(name:string,id:string):string {
        return `${this.users}/${encodeURIComponent(name)}?v=${id}`
    }
    toRoleDetail(name:string,id:string):string {
        return `${this.roles}/${encodeURIComponent(name)}?v=${id}`
    }

}

export const routes = new Routes()