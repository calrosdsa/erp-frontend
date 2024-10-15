import { PartyType } from "~/gen/common";

class Routes {
  api = "/api";
  apiData = this.api + "/data";
  apiCore = this.api + "/core";
  apiItemLine = this.api + "/itemline";
  base = "/home";
  party = this.base + "/party";

  address = this.base + "/address";
  contact = this.base + "/contact";
  createAddress = this.address + "/create";

  groups = this.base + "/groups";
  companies = this.base + "/companies";

  invoice = this.base + "/invoice";
  order = this.base + "/order";
  receipt = this.base + "/receipt";

  buying = this.base + "/buying";
  supplierGroups = this.buying + "/supplier-groups";
  suppliers = this.buying + "/suppliers";
  purchaseOrders = this.order + `/${PartyType[PartyType.purchaseOrder]}`;
  purchaseInvoices = this.invoice + `/${PartyType[PartyType.purchaseInvoice]}`;

  selling = this.base + "/selling";
  sellingStock = this.selling + "/stock";
  customerGroups = this.selling + "/customer-groups";
  customers = this.selling + "/customers";

  priceList = this.sellingStock + "/price-list";

  accounting = this.base + "/accounting";
  taxes = this.accounting + "/taxes";
  chartOfAccount = this.accounting + "/account";
  payment = this.accounting + "/payment";

  stock = this.base + "/stock";
  items = this.stock + "/items";
  itemPrices = this.stock + "/item-prices";
  itemGroups = this.stock + "/item-groups";
  itemAttributes = this.stock + "/item-attributes";
  warehouses = this.stock + "/warehouses";

  manage = this.base + "/manage";
  users = this.manage + "/users";
  roles = this.manage + "/roles";

  purchases = this.base + "/purchases";
  purchaseorders = this.purchases + "/orders";

  settings = this.base + "/settings";
  uom = this.settings + "/uom";
  profile = this.settings + "/profile";
  account = this.settings + "/account";

  toReferenceDetail(partyType: string, name: string, id: string): string {
    switch (partyType) {
      case PartyType[PartyType.customer]:
        return this.toCustomerDetail(name, id);
      case PartyType[PartyType.supplier]:
        return this.toSupplierDetail(name, id);
      case PartyType[PartyType.warehouse]:
        return this.toWarehouseInfo(name, id);
      default:
        return this.base;
    }
  }

  toCreateAddress(id?: number) {
    if (id) {
      return `${this.createAddress}?referenceId=${id}`;
    }
    return this.createAddress;
  }

  toAddressDetail(name: string, id: string): string {
    return `${this.address}/${encodeURIComponent(name)}?id=${id}`;
  }
  toContactDetail(name: string, id: string): string {
    return `${this.contact}/${encodeURIComponent(name)}?id=${id}`;
  }

  toCreateContact(id?: number) {
    if (id) {
      return `${this.contact}/create?referenceId=${id}`;
    }
    return `${this.contact}/create`;
  }

  toCompanyDetail(name: string, id: string): string {
    return `${this.companies}/${encodeURIComponent(name)}?id=${id}`;
  }

  toGroupsByParty(party: PartyType): string {
    return `${this.groups}/${encodeURIComponent(PartyType[party])}`;
  }

  toGroupDetail(party: string, name: string, id: string): string {
    return `${this.groups}/${encodeURIComponent(party)}/${encodeURIComponent(
      name
    )}?id=${id}`;
  }

  //Selling
  toCustomerDetail(name?: string, id?: string): string {
    if (!name) return "N/A";
    return `${this.customers}/${encodeURIComponent(name)}?id=${id}`;
  }
  priceListDetail(name?: string, id?: string): string {
    if (!name) return "N/A";
    return `${this.priceList}/${encodeURIComponent(name)}?id=${id}`;
  }

  toPaymentCreate() {
    return `${this.payment}/create`;
  }
  toPaymentDetail(code?: string) {
    return `${this.payment}/${encodeURIComponent(code || "")}`;
  }

  taxDetailRoute(name?: string, id?: string): string {
    if (!name) return "N/A";
    return `${this.accounting}/taxes/${encodeURIComponent(name)}?id=${id}`;
  }
  toCreateAccountLedger(): string {
    return `${this.chartOfAccount}/new`;
  }

  createItemAttributeRoute = `${this.itemAttributes}/create`;

  toItemAttributeDetail(name: string, id: string): string {
    return `${this.itemAttributes}/${encodeURIComponent(name)}?id=${id}`;
  }

  //STOCK
  toCreateItem(): string {
    return this.items + "/create_item";
  }
  toItem(id: string): string {
    return `${this.items}/${encodeURIComponent(id)}`;
  }
  toItemDetail(name: string, id: string): string {
    return `${this.items}/${encodeURIComponent(name)}?id=${id}`;
  }
  toItemDetailPrices(name: string, id: string): string {
    return `${this.items}/${encodeURIComponent(name)}/item-prices?id=${id}`;
  }
  toItemDetailVariants(name: string, id: string): string {
    return `${this.items}/${encodeURIComponent(name)}/variants?id=${id}`;
  }
  toItemDetailStock(name: string, id: string): string {
    return `${this.items}/${encodeURIComponent(name)}/stock?id=${id}`;
  }
  toWarehouseInfo(name: string, id: string): string {
    return `${this.warehouses}/${encodeURIComponent(name)}/info?id=${id}`;
  }
  toWarehouseItems(name: string, id: string): string {
    return `${this.warehouses}/${encodeURIComponent(name)}/items?id=${id}`;
  }

  //Item group
  toItemGroupDetail(id: string): string {
    return `${this.itemGroups}/${encodeURIComponent(id)}`;
  }

  //Acouting
  toTaxDetail(name: string, id: string): string {
    return `${this.taxes}/${encodeURIComponent(name)}?id=${id}`;
  }
  toAccountLedgerDetail(name?: string, id?: string): string {
    return `${this.chartOfAccount}/${encodeURIComponent(name || "")}?id=${id}`;
  }
  //Buyinh
  toSupplierGroup(name?: string, id?: string): string {
    return `${this.supplierGroups}/${encodeURIComponent(
      name || "N/A"
    )}?id=${id}`;
  }
  toSupplierDetail(name: string, id: string): string {
    return `${this.suppliers}/${encodeURIComponent(name)}?id=${id}`;
  }
  toPurchaseOrderDetail(name: string, id: string): string {
    return `${this.purchaseOrders}/${encodeURIComponent(name)}?id=${id}`;
  }
  toOrderDetail(partyType: string, code: string): string {
    return `${this.order}/${encodeURIComponent(partyType)}/${encodeURIComponent(
      code
    )}`;
  }
  toOrderDetailInfo(partyType: string, code: string): string {
    return `${this.order}/${encodeURIComponent(partyType)}/${encodeURIComponent(
      code
    )}/info`;
  }

  toPurchaseOrderCreate(): string {
    return `${this.purchaseOrders}/create`;
  }
  toPurchaseInvoiceDetail(code: string, id: string): string {
    return `${this.purchaseInvoices}/${code}?id=${id}`;
  }
  toPurchaseInvoiceCreate(): string {
    return `${this.purchaseInvoices}/create`;
  }

  toReceipt(partyType: string): string {
    return `${this.receipt}/${encodeURIComponent(partyType)}`;
  }
  toReceiptDetail(partyType: string, code: string): string {
    return `${this.receipt}/${encodeURIComponent(
      partyType
    )}/${encodeURIComponent(code)}`;
  }
  toCreateReceipt(partyType?: string): string {
    return `${this.receipt}/${encodeURIComponent(partyType || "nan")}/new`;
  }

  //Manage
  toUserProfileDetail(name: string, id: string): string {
    return `${this.users}/${encodeURIComponent(name)}?v=${id}`;
  }
  toRoleDetail(name: string, id: string): string {
    return `${this.roles}/${encodeURIComponent(name)}?v=${id}`;
  }

  toPartyDetailPage(name: string, id: string, partyType: string): string {
    switch (partyType) {
      case PartyType[PartyType.customer]:
        return `${this.customers}/${encodeURIComponent(name)}?id=${id}`;
      case PartyType[PartyType.supplier]:
        return `${this.suppliers}/${encodeURIComponent(name)}?id=${id}`;
      default:
        return this.base;
    }
  }

  //Regate
  court = this.base + "/court";
  booking = this.base + "/booking";

  toCreateBooking():string {
    return `${this.booking}/new`
  }
  toBookingDetail(code:string,tab?:string):string {
    let url = this.booking + `/${encodeURIComponent(code)}`
    if(tab){
      url += `?tab=${tab}`
    }else { url += `?tab=info`}
    return url 
  }

  toCreateCourt():string {
    return `${this.court}/new`
  }
  toCourtDetail(name:string,id:string,tab?:string):string{
    let url = this.court + `/${encodeURIComponent(name)}?id=${id}`
    if(tab){
      url += `&tab=${tab}`
    }else { url += `&tab=info`}
    return url 
  }
  toCourtSchedule(name:string,id:string):string{
    return this.court + `/${encodeURIComponent(name)}/schedule?id=${id}`
  }
}

export const routes = new Routes();
