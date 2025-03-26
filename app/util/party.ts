class Parties {

  customer = "customer";
  supplier = "supplier";
  purchaseInvoice = "purchaseInvoice";
  saleInvoice = "saleInvoice";
  payment = "payment";
  ledger = "ledger";
  module = "module"
  
  accountLedger = "account";

  purchaseReceipt = "purchaseReceipt";
  deliveryNote = "deliveryNote";
  journalEntry = "journalEntry";
  costCenter = "costCenter";
  chargesTemplate = "chargesTemplate";
  currencyExchange = "currencyExchange";
  salesRecord = "salesRecord";
  purchaseRecord = "purchaseRecord";
  stockEntry = "stockEntry";
  project = "project";
  pricing = "pricing";
  serialNo = "serialNo";
  batchBundle = "batchBundle";
  invoicing = "invoicing";
  purchaseOrder = "purchaseOrder";
  saleOrder = "saleOrder";
  supplierQuotation = "supplierQuotation";
  salesQuotation = "salesQuotation"

  termsAndConditions = "termsAndConditions"
  paymentTerms="paymentTerms"
  paymentTermsTemplate="paymentTermsTemplate"
  cashOutflow = "cashOutflow"

  itemGroup = "itemGroup";
  customerGroup = "customerGroup";
  supplierGroup = "supplierGroup";

  accounting = "accounting"

  //Regate
  booking = "booking";
  invoicePaties = {
    [this.customer]: this.saleInvoice,
    [this.supplier]: this.purchaseInvoice,
  };

  paymentParties = {
    ...this.invoicePaties,
  };

  customerOption: SelectItem = { value: this.customer, name: "Cliente" };
  supplierOption: SelectItem = { value: this.supplier, name: "Proveedor" };

  paymentOptions: SelectItem[] = [this.customerOption, this.supplierOption];

  cashOutflowOptions: SelectItem[] = [this.supplierOption];
}

export const party = new Parties();
