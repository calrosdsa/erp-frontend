export enum Role  {
    ROLE_CLIENT = "client",
    ROLE_ADMIN = "admin"
}

export enum PluginApp {
    SQUARE = "square"
}

export enum SalesOrderType {
    ORDER_TYPE_SERVICE = "SERVICE", 
    ORDER_TYPE_PURCHASE = "PURCHASE"
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