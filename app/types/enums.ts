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
}

export enum PartyType {
	PARTY_SUPPLIER_GROUP = "supplierGroup",
	PARTY_ITEM_GROUP = "itemGroup",
	PARTY_CUSTOMER_GROUP = "customerGroup",

	PARTY_PURCHASE_ORDER = "purchaseOrder"
    
}