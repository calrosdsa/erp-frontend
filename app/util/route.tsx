import {
  ChartType,
  chartTypeToJSON,
  PartyType,
  partyTypeFromJSON,
  partyTypeToJSON,
} from "~/gen/common";
import { party } from "./party";

class Routes {
  p = party;
  signin = "/signin";
  api = "/api";
  apiData = this.api + "/data";
  apiCore = this.api + "/core";
  apiDocument = this.api + "/document";
  apiExporter = this.api + "/exporter";
  apiItemLine = this.api + "/itemline";
  apiTaxAndChargeLine = this.api + "/taxAndChargeLine";
  base = "/home";
  app = "app";
  party = this.base + "/party";

  address = "address";
  activity = "activity";
  contact = "contact";
  group = "group";
  groups = this.base + "/group";
  companies = this.base + "/companies";
  company = "companies";
  companiesM = "companies";

  invoice = "invoice";
  invoiceM = "invoice";
  order = "order";
  orderM = "order";
  receipt = "receipt";
  receiptM = "receipt";

  buying = this.base + "/buying";
  buyingM = "buying";
  supplierGroups = this.buying + "/supplier-groups";
  supplier = "supplier";
  suppliers = this.base + "/supplier";
  purchaseOrders = this.order + `/${PartyType[PartyType.purchaseOrder]}`;
  purchaseInvoices = this.invoice + `/${PartyType[PartyType.purchaseInvoice]}`;

  selling = this.base + "/selling";
  sellingM = "selling";
  sellingStock = this.selling + "/stock";
  customerGroups = this.selling + "/customer-groups";
  customers = this.base + "/customer";

  customer = "customer";

  priceList = "priceList";

  accounting = this.base + "/accounting";
  accountingM = "accounting";
  taxes = this.accounting + "/taxes";
  chartOfAccount = this.accounting + "/account";
  accountLedger = "account"
  payment = "payment";

  stockM = "stock";
  itemM = "item";

  stock = this.base + "/stock";
  items = this.stock + "/item";
  item = "item";
  itemPrices = this.stock + "/item-prices";
  itemPrice = "stock/itemPrice";
  itemGroups = this.stock + "/item-groups";
  itemAttributes = "stock/item-attributes";
  warehouses = this.stock + "/warehouse";
  warehouse = "stock/warehouse";

  manage = this.base + "/manage";
  manageM = "manage";
  user = "user";
  role = "manage/roles";

  purchases = this.base + "/purchases";
  purchaseorders = this.purchases + "/orders";

  settings = this.base + "/settings";
  uom = this.settings + "/uom";
  profile = this.settings + "/profile";
  account = this.settings + "/account";

  generalLedger = "accounting/generalLedger";
  accountPayable = "accountPayable";
  accountPayableSumary = "accountPayableSumary";
  accountReceivable = "accountReceivable";
  accountReceivableSumary = "accountReceivableSumary";

  stockLedger = "stock/stockLedger";
  stockBalance = "stock/stockBalance";

  profitAndLoss = "profitAndLoss";
  cashFlow = "cashFlow";
  balanceSheet = "balanceSheet";

  treeView = "treeView";
  accountM = "account";
  serialNoResume = "serialNoResume";
  quotation = "quotation";
  salesQuotation = "salesQuotation";

  stage = "stage";
  notification = "notification";

  //Party
  purchaseReceipt = "purchaseReceipt";
  deliveryNote = "deliveryNote";
  journalEntry = "journalEntry";
  costCenter = "costCenter";
  chargesTemplate = "chargesTemplate";
  currencyExchange = "currencyExchange";
  salesRecord = "salesRecord";
  ledger = "account";
  purchaseRecord = "purchaseRecord";
  stockEntry = "stock/stockEntry";
  project = "project";
  pricing = "pricing";
  serialNo = "stock/serialNo";
  batchBundle = "stock/batchBundle";
  saleInvoice = "saleInvoice";
  invoicing = "invoicing";
  purchaseInvoice = "purchaseInvoice";
  purchaseOrder = "purchaseOrder";
  saleOrder = "saleOrder";
  supplierQuotation = "supplierQuotation";
  itemGroup = "itemGroup";
  customerGroup = "customerGroup";
  supplierGroup = "supplierGroup";

  termsAndConditions = "terms-and-conditions";
  paymentTerms = "payment-terms";
  paymentTermsTemplate = "payment-terms-template";
  bank = "bank";
  cashOutflow = "cash-outflow";
  bankAccount = "bank-account";
  deal = "deal";
  chat = "chat";
  workspace = "workspace";
  module = "module";

  defaultTab = {
    tab: "info",
  };

  to(href: string, q?: Record<string, any>): string {
    return `${this.base}/${this.baseRoute(href, q)}`;
    // return href;
  }

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
  // toParty(
  //   partyType: string,
  //   q?: {
  //     [x: string]: string | undefined;
  //   }
  // ): string {
  //   let url = `${this.base}/${encodeURIComponent(partyType)}`;
  //   return this.baseRoute(url, q);
  // }
  toRouteDetail(main: string, id: any, q?: Record<string, any>): string {
    let url = `${this.base}/${main}/${id}`;

    return this.baseRoute(url, q);
  }
  toRoute(opts: {
    main?: string;
    routePrefix?: string[];
    routeSufix?: string[];
    q?: Record<string, any>;
  }): string {
    let url = `${this.base}/`;
    if (opts.routePrefix) {
      url += opts.routePrefix.join("/") + "/";
    }
    if (opts.main) {
      url += opts.main;
    }
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

  toParty(
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

  toRoleDetail(name: string, id: string): string {
    return `${this.role}/${encodeURIComponent(name)}?v=${id}`;
  }

  toPartyDetailPage(name: string, id: string, partyType: string): string {
    switch (partyType) {
      case PartyType[PartyType.customer]:
        return `${this.base}/${this.sellingM}/${
          this.customer
        }/${encodeURIComponent(name)}?id=${id}&tab=info`;
      case PartyType[PartyType.supplier]:
        return `${this.base}/${this.buyingM}/${
          this.supplier
        }/${encodeURIComponent(name)}?id=${id}&tab=info`;
      default:
        return this.base;
    }
  }

  toVoucher(voucherType: string, voucherCode: string): string {
    switch (voucherType) {
      case this.purchaseReceipt:
        return this.toRoute({
          main: this.purchaseReceipt,
          routePrefix: [this.receiptM],
          routeSufix: [voucherCode],
          q: {
            tab: "info",
          },
        });
      case this.deliveryNote:
        return this.toRoute({
          main: this.deliveryNote,
          routePrefix: [this.receiptM],
          routeSufix: [voucherCode],
          q: {
            tab: "info",
          },
        });
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
      case this.payment:
        return this.toRouteDetail(this.payment, voucherCode, {
          q: {
            tab: "info",
          },
        });
      default:
        return "";
    }
  }

  //Regate
  // court = this.base + "/court";
  court = "court";
  booking = "booking";
  bookingM = "booking";
  event = "event";
  rDashboard = this.base + "/bookingDashboard";

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

export const route = new Routes();
