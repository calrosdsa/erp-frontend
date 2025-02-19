import { DealType, dealTypeToJSON } from "~/gen/common";

export const dueDateBaseOnOptions: SelectItem[] = [
  {
    name: "Días después de la fecha de factura",
    value: "DAYS_AFTER_INVOICE_DATE",
  },
  {
    name: "Meses después de la fecha de factura",
    value: "MONTHS_AFTER_INVOICE_DATE",
  },
];

export const dealTypes: SelectItem[] = [
  {
    name: "Ventas",
    value: dealTypeToJSON(DealType.Sales),
  },
  {
    name: "Servicios",
    value: dealTypeToJSON(DealType.Services),
  },
  {
    name: "Ventas Integradas",
    value: dealTypeToJSON(DealType.IntegratedSales),
  },
  {
    name: "Ventas de Mercancías",
    value: dealTypeToJSON(DealType.MerchadiseSales),
  },
  {
    name: "Postventa",
    value: dealTypeToJSON(DealType.AfterSales),
  },
];
