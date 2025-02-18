export enum Role {
  ROLE_CLIENT = "client",
  ROLE_ADMIN = "admin",
}

export enum PluginApp {
  SQUARE = "square",
}

export enum SalesOrderType {
  ORDER_TYPE_SERVICE = "SERVICE",
  ORDER_TYPE_PURCHASE = "PURCHASE",
}

export enum Order {
  DESC = "desc",
  ASC = "asc",
}

export enum Entity {
  COMPANY = 1,
  ITEM = 2,
  ITEM_PRICE = 3,
  ITEM_GROUP = 4,
  ITEM_STOCK = 5,
  ITEM_ATTRIBUTES = 6,
  ITEM_WAREHOUSE = 7,
  TAX_ENTITY = 8,
  PRICE_LIST = 9,
  ROLE = 10,
  USERS = 11,
  SUPPLIER = 12,
  PURCHASE_ORDER = 13,
  CUSTOMER = 14,
  ADDRESS = 15,
  CONTACT = 16,
  PURCHASE_INVOICE = 17,
  PAYMENT = 18,
  LEDGER = 19,
  PURCHASE_RECEIPT = 20,
  COURT = 21, // Regate
  BOOKING = 22, // Regate
  EVENTBOOKING = 23, // Regate
  SALE_ORDER = 24,
  SALE_INVOICE = 25,
  PIANO_FORS = 26,
  REGATE_CHART = 27,
  DELIVERY_NOTE = 28,
  JOURNAL_ENTRY = 29,
  COST_CENTER = 30,
  PROJECT = 31,
  STOCK_ENTRY = 32,
  GENERAL_LEDGER = 33,
  ACCOUNT_RECEIVABLE = 34,
  ACCOUNT_PAYABLE = 35,
  FINANCIAL_STATEMENTS = 36,
  STOCK_SETTING = 37,
  SERIAL_NO = 38,
  BATCH_BUNDLE = 39,
  SUPPLIER_QUOTATION = 40,
  QUOTATION = 41,
  CHARGES_TEMPLATE = 42,
  CURRENCY_EXCHANGE = 43,
  PURCHASE_RECORD = 44,
  SALES_RECORD = 45,
  STOCK_LEDGER = 46,
  MODULE = 47,
  STOCK_BALANCE = 48,
  SERIALNO_RESUME = 49,
  INCOME_STATEMENT = 50,
  CASH_FLOW = 51,
  BALANCE_SHEET = 52,
  ACCOUNT_RECEIVABLE_SUMARY = 53,
  ACCOUNT_PAYABLE_SUMARY = 54,
  SUPPLIER_GROUP = 55,
  CUSTOMER_GROUP = 56,
  PRICING = 57,
  TERMS_AND_CONDITIONS      =  58,
	PAYMENT_TERMS             = 59,
	PAYMENT_TERMS_TEMPLATE    =  60,
	BANK    = 61,
	BANK_ACCOUNT    = 62,
  CASH_OUTFLOW = 63,
  DEAL = 64,
  STAGE = 65,
}

export enum PartyType {
  PARTY_SUPPLIER_GROUP = "supplierGroup",
  PARTY_ITEM_GROUP = "itemGroup",
  PARTY_CUSTOMER_GROUP = "customerGroup",

  PARTY_PURCHASE_ORDER = "purchaseOrder",

  PARTY_SUPPLIER = "supplier",
  PARTY_CUSTOMER = "customer",
  PARTY_WAREHOUSE = "warehouse",
}
