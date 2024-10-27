
export const formatQuantity = (quantity:number |undefined,uom?:string) =>{
    if (quantity == undefined) return ""
    if (uom == undefined) return ""
    return `${quantity} ${uom}`
}

export const formatPercentage = (value:number | undefined) =>{
    if(value== undefined) return ""
    return `${value}%`
}