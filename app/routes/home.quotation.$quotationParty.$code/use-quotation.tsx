import { components } from "~/sdk";



interface QuotationStore {
    lineItems:components["schemas"]["LineItemDto"][]
    taxLines:components["schemas"]["TaxAndChargeLineDto"][]
}
