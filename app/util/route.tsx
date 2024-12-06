import {
  ChartType,
  chartTypeToJSON,
  PartyType,
  partyTypeFromJSON,
  partyTypeToJSON,
} from "~/gen/common";

class Routes {
  signin = "/signin";
  api = "/api";
  apiData = this.api + "/data";
  apiCore = this.api + "/core";
  apiExporter = this.api + "/exporter";
  apiItemLine = this.api + "/itemline";
  apiTaxAndChargeLine = this.api + "/taxAndChargeLine";
  base = "/home";
  party = this.base + "/party";

  address = this.base + "/address";
  contact = this.base + "/contact";
  createAddress = this.address + "/new";
  group = "groups";
  groups = this.base + "/groups";
  companies = this.base + "/companies";
  companiesM = "companies";

  invoice = this.base + "/invoice";
  invoiceM = "invoice";
  order = this.base + "/order";
  orderM = "order";
  receipt = this.base + "/receipt";
  receiptM = "receipt";

  buying = this.base + "/buying";
  buyingM = "buying";
  supplierGroups = this.buying + "/supplier-groups";
  suppliers = this.base + "/supplier";
  purchaseOrders = this.order + `/${PartyType[PartyType.purchaseOrder]}`;
  purchaseInvoices = this.invoice + `/${PartyType[PartyType.purchaseInvoice]}`;

  selling = this.base + "/selling";
  sellingM = "selling";
  sellingStock = this.selling + "/stock";
  customerGroups = this.selling + "/customer-groups";
  customers = this.base + "/customer";
  customerM = "customer";

  priceList = "priceList";

  accounting = this.base + "/accounting";
  accountingM = "accounting";
  taxes = this.accounting + "/taxes";
  chartOfAccount = this.accounting + "/account";
  payment = this.accounting + "/payment";

  stockM = "stock";
  itemM = "item";

  stock = this.base + "/stock";
  items = this.stock + "/item";
  itemPrices = this.stock + "/item-prices";
  itemPriceM = "itemPrice";
  itemGroups = this.stock + "/item-groups";
  itemAttributes = this.stock + "/item-attributes";
  warehouses = this.stock + "/warehouse";
  warehouseM = "warehouse";

  manage = this.base + "/manage";
  manageM = "manage";
  users = this.manage + "/users";
  userM = "users";
  roles = this.manage + "/roles";

  purchases = this.base + "/purchases";
  purchaseorders = this.purchases + "/orders";

  settings = this.base + "/settings";
  uom = this.settings + "/uom";
  profile = this.settings + "/profile";
  account = this.settings + "/account";

  generalLedger = "generalLedger";
  accountPayable = "accountPayable";
  accountPayableSumary = "accountPayableSumary";
  accountReceivable = "accountReceivable";
  accountReceivableSumary = "accountReceivableSumary";

  stockLedger = "stockLedger";
  stockBalance = "stockBalance";

  profitAndLoss = "profitAndLoss";
  cashFlow = "cashFlow";
  balanceSheet = "balanceSheet";

  treeView = "treeView";
  accountM = "account";
  serialNoResume = "serialNoResume";
  quotation = "quotation";
  salesQuotation = "salesQuotation";

  //Party
  journalEntry = "journalEntry";
  costCenter = "costCenter";
  chargesTemplate = "chargesTemplate";
  stockEntry = "stockEntry";
  project = "project";
  serialNo = "serialNo";
  batchBundle = "batchBundle";
  saleInvoice = "saleInvoice";
  purchaseInvoice = "purchaseInvoice";
  purchaseOrder = "purchaseOrder";
  supplierQuotation = "supplierQuotation";

  defaultTab = {
    tab: "info",
  };

  toModuleParty(
    module: string,
    partyType: string,
    q?: {
      [x: string]: string | undefined;
    }
  ): string {
    let url = `${this.base}/${module}/${encodeURIComponent(partyType)}`;
    return this.baseRoute(url, q);
  }
  toModulePartyDetail(
    module: string,
    partyType: string,
    name: string,
    q?: {
      [x: string]: string | undefined;
    }
  ): string {
    let url = `${this.base}/${module}/${encodeURIComponent(
      partyType
    )}/${encodeURIComponent(name)}`;
    return this.baseRoute(url, q);
  }
  toCreateParty(
    partyType: string,
    q?: {
      [x: string]: string | undefined;
    }
  ): string {
    let url = `${this.base}/${encodeURIComponent(partyType)}/new-${partyType}`;
    return this.baseRoute(url, q);
  }
  toParty(
    partyType: string,
    q?: {
      [x: string]: string | undefined;
    }
  ): string {
    let url = `${this.base}/${encodeURIComponent(partyType)}`;
    return this.baseRoute(url, q);
  }
  toRoute(opts: {
    main: string;
    routePrefix?: string[];
    routeSufix?: string[];
    q?: Record<string, string | undefined>;
  }): string {
    let url = `${this.base}/`;
    if (opts.routePrefix) {
      url += opts.routePrefix.join("/") + "/";
    }
    url += opts.main;
    if (opts.routeSufix) {
      url += "/" + opts.routeSufix.join("/");
    }
    return this.baseRoute(url, opts.q);
  }
  toPartyDetail(
    partyType: string,
    name: string,
    q?: {
      [x: string]: string | undefined;
    }
  ): string {
    let url = `${this.base}/${encodeURIComponent(
      partyType
    )}/${encodeURIComponent(name)}`;
    return this.baseRoute(url, q);
  }

  baseRoute(
    url: string,
    q?: {
      [x: string]: string | undefined;
    }
  ): string {
    if (q) {
      url += "?";
      const queryParams = Object.entries(q)
        .filter(([_, value]) => value !== undefined) // Filter out undefined values
        .map(
          ([key, value]) =>
            `${encodeURIComponent(key)}=${encodeURIComponent(value || "")}`
        ) // Encode each key-value pair
        .join("&"); // Join them with '&'

      if (queryParams) {
        url += queryParams;
      }
    }
    return url;
  }

  toGroupByParty(partyType: string): string {
    return `${this.groups}/${partyType}`;
  }

  toPartyReference(
    partyType: string,
    name: string,
    q?: Record<string, string | undefined>
  ): string {
    switch (partyType) {
      case PartyType[PartyType.customer]:
        return this.toRoute({
          main: partyType,
          routePrefix: [this.sellingM],
          routeSufix: [name],
          q: q,
        });
      case PartyType[PartyType.supplier]:
        return this.toRoute({
          main: partyType,
          routePrefix: [this.buyingM],
          routeSufix: [name],
          q: q,
        });
      case PartyType[PartyType.warehouse]:
        return this.toRoute({
          main: partyType,
          routePrefix: [this.stockM],
          routeSufix: [name],
          q: q,
        });
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
      return `${this.contact}/new?referenceId=${id}`;
    }
    return `${this.contact}/new`;
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

  toItemPrice(id: string, tab?: string): string {
    let url = this.itemPrices + `/${encodeURIComponent(id)}`;
    if (tab) {
      url += `?tab=${tab}`;
    } else {
      url += `?tab=info`;
    }
    return url;
  }
  toCreateItemPrice(): string {
    return `${this.itemPrices}/new`;
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

  toCreateOrder(partyType: PartyType): string {
    return `${this.order}/${encodeURIComponent(
      partyTypeToJSON(partyType)
    )}/create`;
  }

  toReceiptDetail(partyType: string, code: string, tab?: string): string {
    let url =
      this.receipt +
      `/${encodeURIComponent(partyType)}/${encodeURIComponent(code)}`;
    if (tab) {
      url += `?tab=${tab}`;
    } else {
      url += `?tab=info`;
    }
    return url;
  }
  toCreateReceipt(partyType: PartyType): string {
    return `${this.receipt}/${encodeURIComponent(
      partyTypeToJSON(partyType)
    )}/new`;
  }
  toReceipts(
    partyType: PartyType,
    q?: {
      [x: string]: string | undefined;
    }
  ): string {
    let url = `${this.receipt}/${encodeURIComponent(
      partyTypeToJSON(partyType)
    )}`;
    if (q) {
      url += "?";
      const queryParams = Object.entries(q)
        .filter(([_, value]) => value !== undefined) // Filter out undefined values
        .map(
          ([key, value]) =>
            `${encodeURIComponent(key)}=${encodeURIComponent(value || "")}`
        ) // Encode each key-value pair
        .join("&"); // Join them with '&'

      if (queryParams) {
        url += queryParams;
      }
    }
    return url;
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

  toVoucher(voucherType: string, voucherCode: string): string {
    switch (voucherType) {
      case this.saleInvoice:
        return this.toRoute({
          main: this.saleInvoice,
          routePrefix: [this.invoiceM],
          routeSufix: [voucherCode],
          q: {
            tab: "info",
          },
        });
      case this.purchaseInvoice:
        return this.toRoute({
          main: this.purchaseInvoice,
          routePrefix: [this.invoiceM],
          routeSufix: [voucherCode],
          q: {
            tab: "info",
          },
        });
      case this.stockEntry:
        return this.toRoute({
          main: this.stockEntry,
          routePrefix: [this.stockM],
          routeSufix: [voucherCode],
          q: {
            tab: "info",
          },
        });
        case this.bookingM:
        return this.toRoute({
          main: this.bookingM,
          routeSufix: [voucherCode],
          q: {
            tab: "info",
          },
        });
      default:
        return "";
    }
  }

  //Regate
  court = this.base + "/court";
  courtM = "court";
  booking = this.base + "/booking";
  bookingM = "booking";
  event = this.base + "/event";
  eventM = "event";
  rDashboard = this.base + "/rdashboard";

  toBookings(q?: { [x: string]: string | undefined }): string {
    let url = this.booking;
    if (q) {
      url += "?";
      const queryParams = Object.entries(q)
        .filter(([_, value]) => value !== undefined) // Filter out undefined values
        .map(
          ([key, value]) =>
            `${encodeURIComponent(key)}=${encodeURIComponent(value || "")}`
        ) // Encode each key-value pair
        .join("&"); // Join them with '&'

      if (queryParams) {
        url += queryParams;
      }
    }
    return url;
  }

  torChart(chartType: ChartType) {
    return `${this.rDashboard}/${encodeURIComponent(
      chartTypeToJSON(chartType)
    )}`;
  }

  toEventDetail(name: string, id: string, tab?: string): string {
    let url = this.event + `/${encodeURIComponent(name)}?id=${id}`;
    if (tab) {
      url += `&tab=${tab}`;
    } else {
      url += `&tab=info`;
    }
    return url;
  }

  toCreateBooking(): string {
    return `${this.booking}/new`;
  }
  toBookingDetail(code: string, tab?: string): string {
    let url = this.booking + `/${encodeURIComponent(code)}`;
    if (tab) {
      url += `?tab=${tab}`;
    } else {
      url += `?tab=info`;
    }
    return url;
  }

  toCreateCourt(): string {
    return `${this.court}/new`;
  }
  toCourtDetail(name: string, id: string, tab?: string): string {
    let url = this.court + `/${encodeURIComponent(name)}?id=${id}`;
    if (tab) {
      url += `&tab=${tab}`;
    } else {
      url += `&tab=info`;
    }
    return url;
  }
  toCourtSchedule(name: string, id: string): string {
    return this.court + `/${encodeURIComponent(name)}/schedule?id=${id}`;
  }
}

export const routes = new Routes();
