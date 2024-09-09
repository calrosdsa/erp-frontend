
class Routes  {
    api = "/api"
    base = "/home"
    groups = this.base + "/groups"
    companies = this.base + "/companies"

    buying = this.base +"/buying"
    supplierGroups = this.buying +"/supplier-groups"
    suppliers = this.buying +"/suppliers"

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
    profile = this.settings + "/profile"
    account = this.settings + "/account"


    toCompanyDetail(name:string,id:string):string {
        return `${this.companies}/${encodeURIComponent(name)}?id=${id}`
    }
    

    priceListDetail(id:string):string {
        return `${this.priceList}/${encodeURIComponent(id)}`
    }

    taxDetailRoute(id:string):string {
        return `${this.accounting}/taxes/${encodeURIComponent(id)}`
    }

    createItemAttributeRoute= `${this.itemAttributes}/create`

    toItemAttributeDetail(id:string):string {
        return `${this.itemAttributes}/${encodeURIComponent(id)}`
    }

    //STOCK
    toCreateItem():string {
        return this.items + "/create_item"
    }
    toItem(id:string):string {
        return `${this.items}/${encodeURIComponent(id)}`
    }
    toItemDetail(id:string):string{
        return `${this.items}/${encodeURIComponent(id)}/item-prices`
    }
    toItemDetailPrices(id:string):string {
        return `${this.items}/${encodeURIComponent(id)}/item-prices`
    }
    toItemDetailVariants(id:string):string {
        return `${this.items}/${encodeURIComponent(id)}/variants`
    }
    toItemDetailStock(id:string):string {
        return `${this.items}/${encodeURIComponent(id)}/stock`
    }
    toWarehouseInfo(id:string):string{
        return `${this.warehouses}/${encodeURIComponent(id)}/info`
    }
    toWarehouseItems(id:string):string{
        return `${this.warehouses}/${encodeURIComponent(id)}/items`
    }

    //Item group
    toItemGroupDetail(id:string):string{
        return `${this.itemGroups}/${encodeURIComponent(id)}`
    }

    //Acouting
    toTaxDetail(id:string):string{
        return `${this.taxes}/${encodeURIComponent(id)}`
    }
    //Buyinh
    toSupplierGroup(name:string,id:string):string{
        return `${this.supplierGroups}/${encodeURIComponent(name)}?id=${id}`
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