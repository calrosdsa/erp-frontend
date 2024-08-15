import { components } from "~/sdk";

export const formatQuantity = (quantity:number |undefined,uom:components["schemas"]["UnitOfMeasure"]) =>{
    if (quantity == undefined) return ""
    return `${quantity} ${uom.Code}`
}