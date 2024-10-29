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
    COMPANY_ENTITY_ID = 1,
    ITEM_ENTITY_ID = 2,
    ITEM_PRICE_ENTITY_ID = 3,
    ITEM_GROUP_ENTITY_ID = 4,
    ITEM_STOCK_ENTITY_ID = 5,
    ITEM_ATTRIBUTES_ENTITY_ID = 6,
    ITEM_WAREHOUSE_ENTITY_ID = 7,
    TAX_ENTITY_ID = 8,
    PRICE_LIST_ENTITY_ID = 9,
    ROLE_ENTITY_ID = 10,
    USERS_ENTITY_ID = 11,
    SUPPLIER_ENTITY_ID = 12,
    PURCHASE_ORDER_ENTITY_ID = 14,
    CUSTOMER = 15,
    ADDRESS = 16,
    CONTACT = 17,
    PURCHASE_INVOICE_ENTITY_ID = 18,
    PAYMENT_ENTITY_ID = 19,
    LEDGER_ENTITY_ID = 20,
    PURCHASE_RECEIPT_ENTITY_ID = 21,
    COURT_ENTITY_ID = 22, // Regate
    BOOKING_ENTITY_ID = 23, // Regate
    EVENTBOOKING_ENTITY_ID = 24, // Regate
    SALE_ORDER_ENTITY_ID = 25, 
    SALE_INVOICE_ENTITY_ID = 26,
    PIANO_FORMS_ENTITY_ID = 27,
    REGATE_CHART_ENTITY_ID = 28,
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